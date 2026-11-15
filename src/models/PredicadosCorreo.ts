import { Correo } from './Correo';
import { Contacto } from './Contacto';
import { Predicado } from './Predicado';

// Cada función recibe el dato a buscar y devuelve la lambda que evalúa el correo (no guarda correos)
const incluye = (texto: string, buscado: string): boolean =>
    texto.toLowerCase().includes(buscado.toLowerCase().trim());

export const delDominio = (dominio: string): Predicado<Correo> =>
    correo => correo.remitente.email.endsWith(dominio.toLowerCase());

export const asuntoContiene = (texto: string): Predicado<Correo> =>
    correo => incluye(correo.asunto, texto);

export const contenidoContiene = (texto: string): Predicado<Correo> =>
    correo => incluye(correo.contenido, texto);

// Estos no necesitan dato: son predicados directos que leen el estado del correo
export const noLeido: Predicado<Correo> = correo => !correo.leido;

export const esFavorito: Predicado<Correo> = correo => correo.favorito;

export const enviadoPor = (contacto: Contacto): Predicado<Correo> =>
    correo => correo.remitente.email === contacto.email;
