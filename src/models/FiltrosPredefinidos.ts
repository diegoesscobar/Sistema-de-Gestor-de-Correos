import { Filtro } from './Filtro';
import { Contacto } from './Contacto';
import { y, o, no } from './Predicado';
import { delDominio, asuntoContiene, contenidoContiene, noLeido, esLeido, esFavorito, enviadoPor } from './PredicadosCorreo';

// Los filtros del enunciado: se arman reutilizando predicados, ninguno escribe la condición de cero
const esDeLaUCP = delDominio('@ucp.edu.ar');

export const correosDeLaUCP = (): Filtro =>
    new Filtro('Correos de la UCP', esDeLaUCP);

export const academicosImportantes = (): Filtro =>
    new Filtro('Correos académicos importantes', y(esDeLaUCP, asuntoContiene('Examen')));

export const pendientesDeRevision = (): Filtro =>
    new Filtro('Pendientes de revisión', y(noLeido, contenidoContiene('Entrega')));

export const personalesPrioritarios = (contacto: Contacto): Filtro =>
    new Filtro('Correos personales prioritarios', y(esFavorito, enviadoPor(contacto)));

// Asunto con "Proyecto" o "Reunión", sacando los leídos
export const paraSeguimiento = (): Filtro =>
    new Filtro('Correos para seguimiento', y(o(asuntoContiene('Proyecto'), asuntoContiene('Reunión')), no(esLeido)));
