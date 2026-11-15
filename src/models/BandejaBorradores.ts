import { Bandeja } from './Bandeja';
import { Borrador } from './Borrador';

// Guarda borradores (pueden estar incompletos), por eso hereda de Bandeja<Borrador> y no de BandejaCorreos
export class BandejaBorradores extends Bandeja<Borrador> {
}
