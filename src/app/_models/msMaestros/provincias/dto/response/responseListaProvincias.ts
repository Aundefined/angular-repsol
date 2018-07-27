import { ResponseBase } from "../../../../baseResponseDto/responseBase";
import { Provincias } from "../../../..";

export class ResponseListaProvincias extends ResponseBase {

    ListaProvincias: Provincias[];
    SelectedAll: boolean;

    constructor() {

        super();

        this.ListaProvincias = [];

    }
}