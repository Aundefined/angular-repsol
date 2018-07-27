import { ResponseBase } from "../../../../baseResponseDto/responseBase";
import { Caracterizaciones } from "../../../..";


export class ResponseCaracterizacion extends ResponseBase {
    ListaCaracterizaciones: Caracterizaciones[];
    Selected: boolean;

    public ResponseCaracterizacion() {
        this.ListaCaracterizaciones = [];
        this.Selected = false;
    }
}