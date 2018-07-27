import { ResponseBase } from "../../../../baseResponseDto/responseBase";
import { ArticuloProveedor} from "../../../..";
import { Proveedor } from "../../proveedor";


export class ResponseFacturador extends ResponseBase {
    ListaProveedores: Proveedor[];    

    constructor() {
        super();
        this.ListaProveedores = [];
        
    }
}