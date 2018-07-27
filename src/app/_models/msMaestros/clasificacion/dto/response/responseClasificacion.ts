import { ResponseBase } from "../../../../baseResponseDto/responseBase";
import { Clasificacion } from "../../../..";

export class ResponseClasificacion extends ResponseBase {

    ListaClasificacion: Clasificacion[];

    constructor() {
        super();
        this.ListaClasificacion = [];
    }
}