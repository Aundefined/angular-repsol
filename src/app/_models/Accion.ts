import { CampoAccion } from './index';

export interface Accion {

    ACCION_PANTALLA:string;
    DESCRIPCION:string;
    EDIT_MENU_PERFIL_ACC:boolean;
    ID:number;
    ID_EMPRESA:number;
    TIPO:number;
    listCampoAccion:CampoAccion[];
}