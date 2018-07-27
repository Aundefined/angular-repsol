import { ResponseBase } from "../../../../baseResponseDto/responseBase";
import { ArticuloProveedor, CaracterizacionProveedores} from "../../../..";
import { Proveedor } from "../../proveedor";


export class ResponseProveedor extends ResponseBase {
    Proveedor: Proveedor;
    ListaArticuloProveedor: ArticuloProveedor[];
    ListaCaracterizacionProveedores : CaracterizacionProveedores[];

    constructor() {
        super();
        this.Proveedor = new Proveedor();
        this.ListaArticuloProveedor = [];
        this.ListaCaracterizacionProveedores = [];
    }
}