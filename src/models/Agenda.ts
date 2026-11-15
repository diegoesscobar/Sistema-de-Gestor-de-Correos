import { Contacto } from './Contacto';

// RF-03: la agenda de contactos. El criterio para no duplicar es el email
export class Agenda {
    private readonly _contactos = new Map<string, Contacto>(); // email -> contacto

    public agregar(contacto: Contacto): void {
        if (this._contactos.has(contacto.email)) {
            throw new Error('Ya existe un contacto con ese email');
        }
        this._contactos.set(contacto.email, contacto);
    }

    // El email se guarda en minúsculas, asi que se busca igual
    public buscarPorEmail(email: string): Contacto | undefined {
        return this._contactos.get(email.toLowerCase().trim());
    }

    public obtenerContactos(): Contacto[] {
        return [...this._contactos.values()];
    }
}
