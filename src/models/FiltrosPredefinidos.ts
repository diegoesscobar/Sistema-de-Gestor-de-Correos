import { Filtro } from './Filtro';
import { y } from './Predicado';
import { delDominio, asuntoContiene, contenidoContiene, noLeido } from './PredicadosCorreo';

// Los filtros del enunciado: se arman reutilizando predicados, ninguno escribe la condición de cero
const esDeLaUCP = delDominio('@ucp.edu.ar');

export const correosDeLaUCP = (): Filtro =>
    new Filtro('Correos de la UCP', esDeLaUCP);

export const academicosImportantes = (): Filtro =>
    new Filtro('Correos académicos importantes', y(esDeLaUCP, asuntoContiene('Examen')));

export const pendientesDeRevision = (): Filtro =>
    new Filtro('Pendientes de revisión', y(noLeido, contenidoContiene('Entrega')));
