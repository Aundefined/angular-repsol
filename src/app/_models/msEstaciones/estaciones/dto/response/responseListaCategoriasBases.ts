import { ResponseBase } from "../../../../baseResponseDto/responseBase";
import { EstacionCategoriaBase } from "../../estacionCategoriaBase";
import { Base } from "../../base";

export class ResponseListaCategoriasBases extends ResponseBase
{
    ListaCategorias : EstacionCategoriaBase[];
    ListaBases : Base[];

    constructor()
    {
        super();
        this.ListaCategorias = [];
        this.ListaBases = [];
    }
}