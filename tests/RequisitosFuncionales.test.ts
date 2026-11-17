// Resumen de la suite: los tests más importantes de cada requisito juntos en un solo archivo,
// para mostrar el TP de punta a punta. Cada test indica de qué archivo sale el original.
import { describe, it, expect, beforeEach } from 'vitest';
import { GestorCorreos } from '../src/models/GestorCorreos';
import { Buzon } from '../src/models/Buzon';
import { Contacto } from '../src/models/Contacto';
import { Correo } from '../src/models/Correo';
import { Borrador } from '../src/models/Borrador';
import { Agenda } from '../src/models/Agenda';
import { Filtro } from '../src/models/Filtro';
import { RegistroFiltros } from '../src/models/RegistroFiltros';
import { EstadisticasCorreos } from '../src/models/EstadisticasCorreos';
import { GeneradorIdSecuencial } from '../src/models/GeneradorIdSecuencial';
import { Bandeja } from '../src/models/Bandeja';
import { IIdentificable } from '../src/models/IIdentificable';
import { BandejaEntrada } from '../src/models/BandejaEntrada';
import { BandejaEnviados } from '../src/models/BandejaEnviados';
import { BandejaEliminados } from '../src/models/BandejaEliminados';
import { BandejaBorradores } from '../src/models/BandejaBorradores';
import { EstadoLeido } from '../src/models/EstadoLeido';
import { EstadoNoLeido } from '../src/models/EstadoNoLeido';
import { y, o, no } from '../src/models/Predicado';
import { delDominio, asuntoContiene, noLeido } from '../src/models/PredicadosCorreo';
import { pendientesDeRevision } from '../src/models/FiltrosPredefinidos';

// Los mismos tres usuarios en todo el archivo
const ana = new Contacto('Ana', 'ana@ucp.edu.ar');
const beto = new Contacto('Beto', 'beto@gmail.com');
const carla = new Contacto('Carla', 'carla@ucp.edu.ar');

// 100 correos que dependen solo del índice: cada tercero es de la UCP y cada quinto tiene "Examen" en el asunto
const crearCorreos = (cantidad: number): Correo[] => {
    const correos: Correo[] = [];
    for (let i = 0; i < cantidad; i++) {
        const remitente = i % 3 === 0 ? ana : beto;
        const asunto = i % 5 === 0 ? `Examen ${i}` : `Asunto ${i}`;
        correos.push(new Correo(String(i), asunto, 'Texto', remitente, [carla]));
    }
    return correos;
};

// Cada test arranca de cero: un gestor nuevo con los tres usuarios registrados
let gestor: GestorCorreos;
let buzonAna: Buzon;
let buzonBeto: Buzon;
let buzonCarla: Buzon;

beforeEach(() => {
    gestor = new GestorCorreos();
    buzonAna = gestor.registrarUsuario(ana);
    buzonBeto = gestor.registrarUsuario(beto);
    buzonCarla = gestor.registrarUsuario(carla);
});

// Atajo para los tests que necesitan un correo ya enviado: Ana redacta y el gestor lo reparte
const enviarDeAna = (asunto: string, contenido: string, destinatarios: Contacto[]): Correo => {
    const borrador = buzonAna.crearBorrador();
    buzonAna.editarBorrador(borrador.id, asunto, contenido, ana, destinatarios);
    return gestor.enviar(ana.email, borrador.id);
};

describe('Requisitos funcionales', () => {
    describe('RF-01: Correo', () => {
        // Correo.test.ts: los estados arrancan en "no leído" y "no favorito" (patrón State)
        it('Un correo nuevo arranca sin leer y sin ser favorito', () => {
            const correo = new Correo('1', 'TP', 'Cuerpo', ana, [beto]);

            expect(correo.id).toBe('1');
            expect(correo.leido).toBe(false);
            expect(correo.favorito).toBe(false);
        });

        // Correo.test.ts: el constructor valida, así no existe un Correo a medias
        it('No se puede crear un correo sin sus datos obligatorios', () => {
            expect(() => new Correo('', 'TP', 'Cuerpo', ana, [])).toThrow('Faltan datos obligatorios');
        });
    });

    describe('RF-02: Envío de correos', () => {
        // Buzon.test.ts: el borrador se convierte en Correo y cambia de bandeja
        it('El borrador válido sale de Borradores y pasa a Enviados', () => {
            const borrador = buzonAna.crearBorrador();
            buzonAna.editarBorrador(borrador.id, 'TP', 'Cuerpo', ana, [beto]);

            buzonAna.enviarBorrador(borrador.id);

            expect(buzonAna.obtenerEnviados()).toHaveLength(1);
            expect(buzonAna.obtenerBorradores()).toHaveLength(0);
        });

        // GestorCorreos.test.ts: el gestor entrega una copia a cada destinatario registrado
        it('Al enviar, el correo queda en Enviados de Ana y en la Entrada de cada destinatario', () => {
            const externo = new Contacto('Externo', 'externo@hotmail.com'); // no registrado, no se le entrega

            enviarDeAna('TP', 'Cuerpo', [beto, carla, externo]);

            expect(buzonAna.obtenerEnviados()).toHaveLength(1);
            expect(buzonBeto.obtenerEntrada()[0].asunto).toBe('TP');
            expect(buzonCarla.obtenerEntrada()[0].asunto).toBe('TP');
        });
    });

    describe('RF-03: Contactos', () => {
        // Agenda.test.ts: alta y consulta. El email se guarda en minúsculas
        it('Agrega contactos y los consulta por email sin importar mayúsculas', () => {
            const agenda = new Agenda();
            agenda.agregar(new Contacto('Ana', 'ana@ucp.edu.ar'));
            agenda.agregar(new Contacto('Beto', 'beto@gmail.com'));

            expect(agenda.obtenerContactos()).toHaveLength(2);
            expect(agenda.buscarPorEmail('ANA@ucp.edu.ar')?.nombre).toBe('Ana');
            expect(agenda.buscarPorEmail('nadie@ucp.edu.ar')).toBeUndefined();
        });

        // Agenda.test.ts: el email identifica al contacto
        it('No permite dos contactos con el mismo email', () => {
            const agenda = new Agenda();
            agenda.agregar(new Contacto('Ana', 'ana@ucp.edu.ar'));

            expect(() => agenda.agregar(new Contacto('Otra Ana', 'Ana@UCP.edu.ar'))).toThrow('Ya existe un contacto con ese email');
            expect(agenda.obtenerContactos()).toHaveLength(1);
        });

        // Agenda.test.ts: modificación, sin pisar el email de otro contacto
        it('Modifica nombre y email sin pisar el email de otro contacto', () => {
            const agenda = new Agenda();
            agenda.agregar(new Contacto('Ana', 'ana@ucp.edu.ar'));
            agenda.agregar(new Contacto('Beto', 'beto@gmail.com'));

            agenda.modificarNombre('ana@ucp.edu.ar', 'Ana López');
            agenda.modificarEmail('ana@ucp.edu.ar', 'alopez@ucp.edu.ar');

            expect(agenda.buscarPorEmail('alopez@ucp.edu.ar')?.nombre).toBe('Ana López');
            expect(() => agenda.modificarEmail('alopez@ucp.edu.ar', 'beto@gmail.com')).toThrow('Ya existe un contacto con ese email');
        });

        // Contacto.test.ts: el setter valida con el VerificadorDeCorreo
        it('Un email con formato inválido no se acepta', () => {
            expect(() => new Contacto('María', 'correo-invalido.com')).toThrow('Dirección de correo no es válido');
        });
    });

    describe('RF-04: Búsqueda', () => {
        // Busqueda.test.ts: coincideTexto es un o() de cuatro predicados
        it('Busca en asunto, contenido, remitente y destinatarios sin distinguir mayúsculas', () => {
            const examen = new Correo('c1', 'Examen', 'Temario', ana, [beto]);
            const asado = new Correo('c2', 'Asado', 'Llevar carbón', carla, [beto, ana]);
            buzonBeto.recibirCorreo(examen);
            buzonBeto.recibirCorreo(asado);

            expect(buzonBeto.buscarEnEntrada('EXAM')).toEqual([examen]);
            expect(buzonBeto.buscarEnEntrada('carbón')).toEqual([asado]);
            expect(buzonBeto.buscarEnEntrada('ana')).toEqual([examen, asado]); // remitente en uno, destinatario en el otro
        });

        // Busqueda.test.ts: filter evalúa cada correo una vez y no lo toca
        it('Un correo aparece una sola vez aunque coincida en varios campos, y no se modifica', () => {
            buzonBeto.recibirCorreo(new Correo('c1', 'Examen UCP', 'Examen en la ucp', ana, [beto]));

            const resultado = buzonBeto.buscarEnEntrada('ucp');

            expect(resultado).toHaveLength(1);
            expect(resultado[0].leido).toBe(false);
        });
    });

    describe('RF-05: Filtros', () => {
        // Filtro.test.ts: y, o, no combinan predicados que ya existen
        it('Los filtros compuestos evalúan bien y, o, no sobre 100 correos', () => {
            const correos = crearCorreos(100);
            const esDeLaUCP = delDominio('@ucp.edu.ar');
            const esExamen = asuntoContiene('Examen');

            const ambos = new Filtro('UCP y examen', y(esDeLaUCP, esExamen)).aplicar(correos);
            const alguno = new Filtro('UCP o examen', o(esDeLaUCP, esExamen)).aplicar(correos);
            const soloUCP = new Filtro('UCP sin examen', y(esDeLaUCP, no(esExamen))).aplicar(correos);

            expect(ambos).toHaveLength(7); // 0, 15, 30, 45, 60, 75, 90
            expect(alguno).toHaveLength(47); // 34 + 20 - 7 que están en los dos
            expect(soloUCP).toHaveLength(27); // 34 - 7
        });

        // RegistroFiltros.test.ts: el enunciado pide como máximo 5 filtros
        it('Registra hasta cinco filtros e impide el sexto', () => {
            const registro = new RegistroFiltros();
            [1, 2, 3, 4, 5].forEach(n => registro.registrar(new Filtro('Filtro ' + n, asuntoContiene('x'))));

            expect(registro.obtenerFiltros()).toHaveLength(5);
            expect(() => registro.registrar(new Filtro('Filtro 6', asuntoContiene('x')))).toThrow('No se pueden registrar más de 5 filtros');
        });

        // FiltrosPredefinidos.test.ts: uno de los filtros del enunciado (no leído y con "Entrega")
        it('Pendientes de revisión deja de mostrar el correo cuando se lee', () => {
            const entrega = new Correo('c1', 'TP', 'Fecha de Entrega', ana, [beto]);
            const otro = new Correo('c2', 'Hola', 'Saludos', ana, [beto]);
            const filtro = pendientesDeRevision();
            expect(filtro.aplicar([entrega, otro])).toEqual([entrega]);

            entrega.marcarComoLeido();
            expect(filtro.aplicar([entrega, otro])).toEqual([]);
        });
    });

    describe('RF-06: Bandejas', () => {
        // Bandejas.test.ts: polimorfismo, todas se usan como Bandeja y cada una responde su nombre
        it('Cada bandeja hija tiene su propio nombre aunque se usen todas como Bandeja', () => {
            const bandejas: Bandeja<IIdentificable>[] = [
                new BandejaEntrada(), new BandejaEnviados(), new BandejaEliminados(), new BandejaBorradores()
            ];

            expect(bandejas.map(b => b.nombre)).toEqual(['Entrada', 'Enviados', 'Eliminados', 'Borradores']);
        });

        // Buzon.test.ts: eliminar mueve, no copia
        it('Eliminar pasa el correo de Entrada a Eliminados sin duplicarlo', () => {
            buzonBeto.recibirCorreo(new Correo('c1', 'Hola', 'Texto', ana, [beto]));

            buzonBeto.eliminarCorreo('c1');

            expect(buzonBeto.obtenerEntrada()).toHaveLength(0);
            expect(buzonBeto.obtenerEliminados()).toHaveLength(1);
        });

        // Buzon.test.ts: BandejaEliminados recuerda de dónde vino cada correo
        it('Restaurar devuelve el correo a su bandeja de origen', () => {
            const correo = enviarDeAna('TP', 'Cuerpo', [beto]);

            buzonAna.eliminarCorreo(correo.id);
            buzonAna.restaurarCorreo(correo.id);

            expect(buzonAna.obtenerEnviados()).toHaveLength(1); // vuelve a Enviados, no a Entrada
            expect(buzonAna.obtenerEntrada()).toHaveLength(0);
            expect(buzonAna.obtenerEliminados()).toHaveLength(0);
        });
    });

    describe('RF-07: Borradores', () => {
        // Borrador.test.ts: a diferencia del Correo, el borrador puede estar incompleto
        it('Se puede crear un borrador incompleto', () => {
            const borrador = new Borrador('b1');

            expect(borrador.asunto).toBe('');
            expect(borrador.esValidoParaEnviar()).toBe(false);
        });

        // Buzon.test.ts: al empezar a redactar queda registrado
        it('Al empezar a redactar se registra un borrador vacío', () => {
            const borrador = buzonAna.crearBorrador();

            expect(buzonAna.obtenerBorradores()).toHaveLength(1);
            expect(borrador.esValidoParaEnviar()).toBe(false);
        });

        // Buzon.test.ts: cada edición se guarda (simula el guardado automático)
        it('Conserva los cambios al editar y recuperar el borrador', () => {
            const borrador = buzonAna.crearBorrador();

            buzonAna.editarBorrador(borrador.id, 'TP Final', 'Cuerpo', ana, [beto]);
            buzonAna.editarBorrador(borrador.id, 'TP Final v2'); // solo cambia el asunto

            const recuperado = buzonAna.obtenerBorrador(borrador.id);
            expect(recuperado?.asunto).toBe('TP Final v2');
            expect(recuperado?.contenido).toBe('Cuerpo');
            expect(recuperado?.esValidoParaEnviar()).toBe(true);
        });
    });

    describe('RF-08: No leídos', () => {
        // BandejaEntrada.test.ts: filter devuelve un array nuevo, la bandeja no cambia
        it('Devuelve solo los correos no leídos sin sacarlos de la bandeja', () => {
            const bandeja = new BandejaEntrada();
            const leido = new Correo('1', 'Leido', 'Texto', ana, [beto]);
            const noLeidoCorreo = new Correo('2', 'No leido', 'Texto', ana, [beto]);
            leido.marcarComoLeido();
            bandeja.agregarCorreo(leido);
            bandeja.agregarCorreo(noLeidoCorreo);

            expect(bandeja.obtenerNoLeidos()).toEqual([noLeidoCorreo]);
            expect(bandeja.obtenerCorreos()).toHaveLength(2);
        });

        // BandejaEntrada.test.ts: no se guarda una lista aparte, se calcula cada vez
        it('Refleja al instante el cambio de estado de lectura', () => {
            const bandeja = new BandejaEntrada();
            const correo = new Correo('1', 'Hola', 'Texto', ana, [beto]);
            bandeja.agregarCorreo(correo);

            correo.marcarComoLeido();
            expect(bandeja.obtenerNoLeidos()).toHaveLength(0);

            correo.marcarComoNoLeido();
            expect(bandeja.obtenerNoLeidos()).toHaveLength(1);
        });
    });

    describe('RF-09: Favoritos', () => {
        // Buzon.test.ts: es una vista, los correos no se mueven de su bandeja
        it('Junta los favoritos de Entrada y Enviados sin moverlos', () => {
            const recibido = new Correo('c1', 'Hola', 'Texto', beto, [ana]);
            buzonAna.recibirCorreo(recibido);
            buzonAna.recibirCorreo(new Correo('c2', 'Otro', 'Texto', beto, [ana]));
            const enviado = enviarDeAna('TP', 'Cuerpo', [beto]);

            recibido.alternarFavorito();
            enviado.alternarFavorito();

            expect(buzonAna.obtenerFavoritos()).toHaveLength(2);
            expect(buzonAna.obtenerEntrada()).toHaveLength(2);
            expect(buzonAna.obtenerEnviados()).toHaveLength(1);
        });

        // Buzon.test.ts: BandejaEliminados responde false en incluyeEnFavoritos()
        it('Un favorito eliminado no aparece hasta restaurarlo y conserva su indicador', () => {
            const correo = new Correo('c1', 'Hola', 'Texto', beto, [ana]);
            buzonAna.recibirCorreo(correo);
            correo.alternarFavorito();

            buzonAna.eliminarCorreo('c1');
            expect(buzonAna.obtenerFavoritos()).toHaveLength(0);
            expect(buzonAna.obtenerEliminados()[0].favorito).toBe(true);

            buzonAna.restaurarCorreo('c1');
            expect(buzonAna.obtenerFavoritos()).toHaveLength(1);
        });
    });

    describe('RF-10: Procesamiento funcional', () => {
        // EstadisticasCorreos.test.ts: map transforma cada correo en su asunto
        it('asuntos() devuelve la lista de asuntos con map', () => {
            const examen = new Correo('1', 'Examen', 'Temario', ana, [beto]);
            const tp = new Correo('2', 'TP', 'Consigna', ana, [beto]);

            expect(new EstadisticasCorreos([examen, tp]).asuntos()).toEqual(['Examen', 'TP']);
            expect(new EstadisticasCorreos([]).asuntos()).toEqual([]);
        });

        // EstadisticasCorreos.test.ts: filter con cualquier predicado
        it('filtrar() usa el predicado que le pasen', () => {
            const examen = new Correo('1', 'Examen', 'Temario', ana, [beto]);
            const tp = new Correo('2', 'TP', 'Consigna', ana, [beto]);
            tp.marcarComoLeido();

            expect(new EstadisticasCorreos([examen, tp]).filtrar(noLeido)).toEqual([examen]);
        });

        // EstadisticasCorreos.test.ts: reduce acumula un número y un Map
        it('contarNoLeidos() y contarPorRemitente() acumulan con reduce', () => {
            const examen = new Correo('1', 'Examen', 'Temario', ana, [beto]);
            const tp = new Correo('2', 'TP', 'Consigna', ana, [beto]);
            const respuesta = new Correo('3', 'Re: TP', 'Listo', beto, [ana]);
            tp.marcarComoLeido();
            const estadisticas = new EstadisticasCorreos([examen, tp, respuesta]);

            expect(estadisticas.contarNoLeidos()).toBe(2);
            expect(estadisticas.contarPorRemitente().get('ana@ucp.edu.ar')).toBe(2);
            expect(estadisticas.contarPorRemitente().get('beto@gmail.com')).toBe(1);
        });
    });
});

describe('Preguntas del profe', () => {
    // Correo.test.ts: cada destinatario recibe su propia copia (Correo.copiar())
    it('¿Si Beto lee el correo, a Ana le aparece leído? No, cada uno tiene su copia', () => {
        const enviado = enviarDeAna('TP', 'Cuerpo', [beto]);
        const recibido = buzonBeto.obtenerEntrada()[0];

        recibido.marcarComoLeido();
        recibido.alternarFavorito();

        expect(recibido).not.toBe(enviado);
        expect(recibido.asunto).toBe(enviado.asunto); // mismo mensaje
        expect(enviado.leido).toBe(false); // estado propio
        expect(enviado.favorito).toBe(false);
    });

    // GestorCorreos.test.ts: eliminar es de un solo usuario
    it('¿Si Beto elimina el correo, Carla lo pierde? No, los buzones son independientes', () => {
        const correo = enviarDeAna('Examen', 'Temario', [beto, carla]);

        gestor.eliminarCorreo(beto.email, correo.id);

        expect(buzonBeto.obtenerEntrada()).toHaveLength(0);
        expect(buzonBeto.obtenerEliminados()).toHaveLength(1);
        expect(buzonCarla.obtenerEntrada()).toHaveLength(1);
        expect(buzonAna.obtenerEnviados()).toHaveLength(1);
    });

    // Correo.test.ts: el getter devuelve una copia del array (copia defensiva)
    it('¿Se pueden tocar los destinatarios desde afuera? No, se devuelve una copia', () => {
        const correo = new Correo('1', 'TP', 'Cuerpo', ana, [beto]);

        (correo.destinatarios as Contacto[]).push(carla);

        expect(correo.destinatarios).toHaveLength(1);
    });

    // Filtro.test.ts: el filtro guarda la condición, no los correos
    it('¿El filtro guarda correos? No, evalúa cada vez y refleja los cambios', () => {
        const correos = crearCorreos(100);
        const pendientes = new Filtro('Exámenes pendientes', y(noLeido, asuntoContiene('Examen')));
        expect(pendientes.aplicar(correos)).toHaveLength(20); // todos arrancan sin leer

        const examenes = correos.filter(c => c.asunto.startsWith('Examen'));
        examenes.slice(0, 5).forEach(c => c.marcarComoLeido());

        expect(pendientes.aplicar(correos)).toHaveLength(15);
    });

    // Buzon.test.ts: inversión de dependencias, el gestor les pasa a todos el mismo IGeneradorId
    it('¿Los ids se repiten entre usuarios? No, todos comparten el mismo generador', () => {
        const generador = new GeneradorIdSecuencial();
        const buzon1 = new Buzon(generador);
        const buzon2 = new Buzon(generador);

        expect(buzon1.crearBorrador().id).not.toBe(buzon2.crearBorrador().id);
        expect(buzonAna.crearBorrador().id).not.toBe(buzonBeto.crearBorrador().id); // lo mismo a través del gestor
    });

    // EstadoCorreo.test.ts: patrón State, cada estado sabe a cuál pasar
    it('¿Cómo cambia de estado sin ifs? Cada estado devuelve el siguiente', () => {
        const leido = new EstadoNoLeido().marcarLeido();
        expect(leido).toBeInstanceOf(EstadoLeido);
        expect(leido.estaLeido()).toBe(true);

        const otraVezNoLeido = new EstadoLeido().marcarNoLeido();
        expect(otraVezNoLeido).toBeInstanceOf(EstadoNoLeido);
        expect(otraVezNoLeido.estaLeido()).toBe(false);
    });

    // Agenda.test.ts: la agenda y los correos son independientes
    it('¿Eliminar un contacto borra sus correos? No, el correo conserva al remitente', () => {
        const agenda = new Agenda();
        const anaEnAgenda = new Contacto('Ana', 'ana@ucp.edu.ar');
        agenda.agregar(anaEnAgenda);
        const correo = new Correo('1', 'TP', 'Cuerpo', anaEnAgenda, [beto]);

        agenda.eliminar('ana@ucp.edu.ar');

        expect(agenda.obtenerContactos()).toHaveLength(0);
        expect(correo.remitente.nombre).toBe('Ana');
        expect(() => agenda.eliminar('ana@ucp.edu.ar')).toThrow('No existe un contacto con ese email');
    });

    // Buzon.test.ts: BandejaEliminados solo restaura lo que recibió
    it('¿Qué pasa al restaurar algo que no está en Eliminados? Tira error', () => {
        expect(() => buzonAna.restaurarCorreo('x')).toThrow('El correo no está en Eliminados');
    });

    // Buzon.test.ts: solo se elimina desde Entrada o Enviados
    it('¿Se puede eliminar un correo que ya está en Eliminados? No', () => {
        buzonBeto.recibirCorreo(new Correo('c1', 'Hola', 'Texto', ana, [beto]));
        buzonBeto.eliminarCorreo('c1');

        expect(() => buzonBeto.eliminarCorreo('c1')).toThrow('El correo no existe');
    });

    // Buzon.test.ts (comentado allá): la validación del borrador frena el envío
    it('¿Se puede enviar un borrador incompleto? No, y queda en Borradores', () => {
        const borrador = buzonAna.crearBorrador();
        buzonAna.editarBorrador(borrador.id, 'TP', '', ana, [beto]); // sin contenido

        expect(() => buzonAna.enviarBorrador(borrador.id)).toThrow('El borrador no está completo para enviarse');
        expect(buzonAna.obtenerBorradores()).toHaveLength(1);
        expect(buzonAna.obtenerEnviados()).toHaveLength(0);
    });

    // Buzon.test.ts (comentado allá): después de enviarlo, el borrador ya no existe
    it('¿Se puede enviar el mismo borrador dos veces? No, el correo no se duplica', () => {
        const borrador = buzonAna.crearBorrador();
        buzonAna.editarBorrador(borrador.id, 'TP', 'Cuerpo', ana, [beto]);

        buzonAna.enviarBorrador(borrador.id);

        expect(() => buzonAna.enviarBorrador(borrador.id)).toThrow('El borrador no existe');
        expect(buzonAna.obtenerEnviados()).toHaveLength(1);
    });
});
