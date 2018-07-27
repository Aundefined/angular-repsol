import { CampoObj } from './index';

export interface CampoAccion{

    EDITABLE:boolean;
    ID:number;
    ID_CAMPO:number;
    ID_EMPRESA:number;
    ID_MENU_PERFIL_ACCION:number
    OBLIGATORIO:boolean;
    campoObj:CampoObj[];
}