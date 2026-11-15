import { Correo } from './Correo';
import { Contacto } from './Contacto';
import { Predicado, o, no } from './Predicado';

// Cada función recibe el dato a buscar y devuelve la lambda que evalúa el correo (no guarda correos)
const incluye = (texto: string, buscado: string): boolean =>
    texto.toLowerCase().includes(buscado.toLowerCase().trim());

export const delDominio = (dominio: string): Predicado<Correo> =>
    correo => correo.remitente.email.endsWith(dominio.toLowerCase());

export const asuntoContiene = (texto: string): Predicado<Correo> =>
    correo => incluye(correo.asunto, texto);

export const contenidoContiene = (texto: string): Predicado<Correo> =>
    correo => incluye(correo.contenido, texto);

// Los de estado no reciben dato: leen el estado actual del correo cada vez que se evalúan
export const esLeido: Predicado<Correo> = correo => correo.leido;

export const noLeido: Predicado<Correo> = no(esLeido); // se reutiliza negándolo

export const esFavorito: Predicado<Correo> = correo => correo.favorito;

export const enviadoPor = (contacto: Contacto): Predicado<Correo> =>
    correo => correo.remitente.email === contacto.email;

const contactoContiene = (texto: string): Predicado<Contacto> =>
    o(contacto => incluye(contacto.nombre, texto), contacto => incluye(contacto.email, texto));

// RF-04: alcanza con que coincida un campo. Como es un predicado, filter devuelve cada correo una sola vez
export const coincideTexto = (texto: string): Predicado<Correo> => o(
    asuntoContiene(texto),
    contenidoContiene(texto),
    correo => contactoContiene(texto)(correo.remitente),
    correo => correo.destinatarios.some(contactoContiene(texto))
);
