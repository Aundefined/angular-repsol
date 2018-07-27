import { ResponseError } from "./responseError";

export class ResponseBase {

    CodigoServicio: string;
    DescripcionServicio: string;
    ListaErrores: ResponseError[];

    constructor() {
        
        this.CodigoServicio = "";
        this.DescripcionServicio = "";
        this.ListaErrores = [];

    }

}