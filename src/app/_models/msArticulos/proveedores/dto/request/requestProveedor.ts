import { Proveedor } from "../../proveedor";
import { CaracterizacionProveedores, ArticuloProveedor } from "../../../..";

export class RequestProveedor
{
    Proveedor:Proveedor;
    ListaArticuloProveedor: ArticuloProveedor[];
    ListaCaracterizacionProveedores : CaracterizacionProveedores[];

    public RequestProveedor()
    {
        this.Proveedor = new Proveedor();
        this.ListaArticuloProveedor = [];
        this.ListaCaracterizacionProveedores = [];
        
    }
}