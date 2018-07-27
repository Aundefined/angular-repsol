import { Accion } from './index';

export interface Menu {
    DESCRIPCION:string;
    ID:number;
    ID_EMPRESA:number;
    LEYENDA:string;
    listAccion:Accion[];
    listSubmenu:Menu[];
    MENU_PADRE:number;
    NOMBRE_ICONO:string;
    ORDEN_MENU:string;
    URL:string;
}