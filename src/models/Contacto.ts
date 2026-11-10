export class Contacto {
  private _nombre: string = '';
  private _email: string = '';

  constructor(nombre: string, email: string) {
    this.nombre = nombre;
    this.email = email;
  }

  public get nombre(): string {
    return this._nombre;
  }

  public set nombre(nuevoNombre: string) {
    if (!nuevoNombre || nuevoNombre.trim().length === 0) {
      throw new Error('El nombre no puede estar vacío');
    }
    this._nombre = nuevoNombre.trim();
  }

  public get email(): string {
    return this._email;
  }
  public set email(nuevoEmail: string) {
    this.validarEmail(nuevoEmail);
    this._email = nuevoEmail.toLowerCase().trim(); //lo pasa a minusculas y le quita los espacios
  }
  // para que el string del user tenga un usuario,@,un dominio y un .com
  private validarEmail(email: string): void {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      throw new Error('Dirección de correo no es válido');
    }
  }
}