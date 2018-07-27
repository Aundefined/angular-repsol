import { Empresa } from "../../environments/environment";
export class UserLogin {
    CODIGO_USUARIO: string;
    PASSWORD: any;
    ID_EMPRESA: string;

    constructor(codigoUsuario?: string, password?: any) {
        this.CODIGO_USUARIO = codigoUsuario;
        this.PASSWORD = password;
        this.ID_EMPRESA = Empresa;
    }
}
