export class User {
    id:number;
    codigoUsuario:string;
    nombre:string;
    password:string;
    email:string;
    idEmpresa:number;
    estado:boolean;

    constructor(id?:number, codigoUsuario?:string, nombre?:string, password?:string, email?:string, idEmpresa?:number, estado?:boolean){
        this.id = id;
        this.codigoUsuario = codigoUsuario;
        this.nombre = nombre;
        this.password = password;
        this.email = email;
        this.idEmpresa = idEmpresa;
        this.estado = estado;
    }
}
