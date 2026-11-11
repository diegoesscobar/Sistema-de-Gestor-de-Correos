// Patrón State: cada estado de lectura es un objeto que sabe a qué estado pasar.
// Así el Correo no se llena de ifs, delega en el estado que tiene (polimorfismo).
export interface IEstadoCorreo {
    estaLeido(): boolean;
    marcarLeido(): IEstadoCorreo;
    marcarNoLeido(): IEstadoCorreo;
}
