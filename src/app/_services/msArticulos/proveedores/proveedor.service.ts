import { Injectable } from '@angular/core';
 
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../../_config/configuration.service';
import { RequestProveedor, ResponseProveedor, Proveedor, RequestProveedorById, ResponseFacturador, RequestValidarCodigoSap, ResponseListaCodigosProveedor, RequestFacturador, ResponseValidacionGenerico, RequestHacienda, ResponseHacienda } from '../../../_models/index';



 
@Injectable()
 
export class ProveedorService { 

 
    private get url(){return this.configurationService.isLocal? this.configurationService.baseUrlLocal + this.configurationService.port51058 + this.configurationService.proveedoresUrl: 
                        this.configurationService.baseUrlRemoto + this.configurationService.MSArtic + this.configurationService.proveedoresUrl;        
 
    }  
 
    token:any; 

 
    constructor(private http: HttpClient, private configurationService:ConfigurationService) { }
 
    getById(request : RequestProveedorById) {     
 
        this.token = sessionStorage.getItem('token'); 
        let header = new HttpHeaders({ 
            'Authorization': this.token, 
            'Content-Type': 'application/json' 
        });
 
        return this.http.post<ResponseProveedor>(this.url, request,{headers:header});
 
    }
 
    create(request : RequestProveedor) {     
 
        this.token = sessionStorage.getItem('token'); 
        let header = new HttpHeaders({ 
            'Authorization': this.token, 
            'Content-Type': 'application/json' 
        });
 
        return this.http.post<ResponseProveedor>(this.url, request,{headers:header});
 
    }

    getFacturador(request:RequestFacturador) {
 
        this.token = sessionStorage.getItem('token'); 
        let header = new HttpHeaders({ 
            'Authorization': this.token, 
            'Content-Type': 'application/json' 
        });
 
        let parametersUrl = "/facturador/?id_Empresa=" + request.Id_Empresa; 
        return this.http.get<ResponseFacturador>(this.url + parametersUrl,{headers:header});
 
    }    
 
    update(request : RequestProveedor) {      
 
        this.token = sessionStorage.getItem('token'); 
        let header = new HttpHeaders({ 
            'Authorization': this.token, 
            'Content-Type': 'application/json' 
        });
 
        return this.http.put<ResponseProveedor>(this.url, request,{headers:header});
 
    }

    getByIdProveedor(request : RequestProveedor) {
 
        this.token = sessionStorage.getItem('token'); 
        let header = new HttpHeaders({ 
            'Authorization': this.token, 
            'Content-Type': 'application/json' 
        });
 
        let parametersUrl = "/ObtenerProveedor/?id_Proveedor=+" + request.Proveedor.Id_Proveedores + "&id_Empresa=" + request.Proveedor.Id_Empresa; 
        return this.http.get<ResponseProveedor>(this.url + parametersUrl,{headers:header});
 
    }

    codigoSapSugerencias(request : RequestValidarCodigoSap) {
 
        this.token = sessionStorage.getItem('token');
 
        let header = new HttpHeaders({
 
            'Authorization': this.token,
 
            'Content-Type': 'application/json'
 
        });
 
        let parametersUrl = "/CodigoSapSugerencias"; 
        return this.http.post<ResponseListaCodigosProveedor>(this.url + parametersUrl,request,{headers:header});
 
    }

    ValidarCodigoSap(request : RequestValidarCodigoSap) {
 
        this.token = sessionStorage.getItem('token');
 
        let header = new HttpHeaders({
 
            'Authorization': this.token,
 
            'Content-Type': 'application/json'
 
        });
 
        let parametersUrl = "/ValidarCodigoSap"; 
        return this.http.post<ResponseValidacionGenerico>(this.url + parametersUrl,request,{headers:header});
 
    }

    validarHacienda(request : RequestHacienda) {
 
        this.token = sessionStorage.getItem('token'); 
        let header = new HttpHeaders({ 
            'Authorization': this.token, 
            'Content-Type': 'application/json' 
        });
 
        let parametersUrl = "/validarHacienda/?nif=+" + request.nif + "&nombre=" + request.nombre; 
        return this.http.get<ResponseHacienda>(this.url + parametersUrl,{headers:header});
 
    }
 
 
 

 
}
