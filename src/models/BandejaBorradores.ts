import { Borrador } from './Borrador';

// Va aparte de Bandeja porque guarda borradores (pueden estar incompletos) y no correos
export class BandejaBorradores {
    private borradores: Borrador[] = [];

    public agregarBorrador(borrador: Borrador): void {
        if (!this.borradores.some(b => b.id === borrador.id)) {
            this.borradores.push(borrador);
        }
    }

    public obtenerBorrador(idBorrador: string): Borrador | undefined {
        return this.borradores.find(b => b.id === idBorrador);
    }

    public removerBorrador(idBorrador: string): Borrador | undefined {
        const index = this.borradores.findIndex(b => b.id === idBorrador);
        if (index !== -1) {
            return this.borradores.splice(index, 1)[0];
        }
        return undefined;
    }

    public obtenerBorradores(): Borrador[] {
        return [...this.borradores];
    }
}
