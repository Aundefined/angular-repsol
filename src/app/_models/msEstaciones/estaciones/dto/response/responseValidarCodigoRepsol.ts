import { ResponseBase } from "../../../../baseResponseDto/responseBase";

export class ResponseValidarCodigoRepsol extends ResponseBase
{
    ExistCodigoRepsol :  Number;

    constructor()
    {
        super();
        this.ExistCodigoRepsol = 0;
    }
}