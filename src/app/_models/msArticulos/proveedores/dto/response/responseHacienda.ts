import { ResponseBase } from "../../../../baseResponseDto/responseBase";

export class ResponseHacienda extends ResponseBase
{
    Hacienda:number;

    constructor(){
        super();
        this.Hacienda = 0;
    }
}