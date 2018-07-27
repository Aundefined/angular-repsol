import { ResponseBase } from "../../../../baseResponseDto/responseBase";
import { Paises } from "../../../..";

export class ResponseListaPaises extends ResponseBase {

    ListaPaises: Paises[];

    constructor() {

        super();

        this.ListaPaises = [];

    }
}