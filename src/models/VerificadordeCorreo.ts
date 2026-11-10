export class VerificadorDeCorreo {
    public static validar(email: string): boolean {
        if (!email || typeof email !== 'string') {
            return false;
        }
        
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email.trim());
    }
}