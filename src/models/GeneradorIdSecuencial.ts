import { IGeneradorId } from './IGeneradorId';

// Genera b1, b2, b3... Si varios buzones comparten el mismo, nunca repiten id
export class GeneradorIdSecuencial implements IGeneradorId {
    private contador: number = 0;

    constructor(private readonly prefijo: string = 'b') { }

    public siguiente(): string {
        this.contador++;
        return this.prefijo + this.contador;
    }
}
