import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import { ConfigurationService } from '../_config/configuration.service'; 

import { Proveedores, ListProveedor, ProveedoresFiltros } from '../_models/index';
import { BehaviorSubject, Observable } from 'rxjs/Rx';


@Injectable()
export class ProveedoresService {
    
 
    private get url(){return this.configurationService.isLocal? this.configurationService.baseUrlLocal + this.configurationService.port51058 + this.configurationService.proveedoresUrl:
        this.configurationService.baseUrlRemoto + this.configurationService.MSArtic + this.configurationService.proveedoresUrl;
    }   
    token:any;

    constructor(private http: HttpClient, private configurationService:ConfigurationService) { }

    getAll() {  
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });      
        //let parametersUrl = "";
        return this.http.get<Proveedores[]>(this.url,{headers:header});
    }

    getAllProveedores() {  
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        return this.http.get<ListProveedor[]>(this.url, {headers:header});
    }

    enviarFiltros(proveedoresFiltros: ProveedoresFiltros) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        // console.log(proveedoresFiltros);
        return this.http.post<ListProveedor[]>(this.url+"/filtros", proveedoresFiltros, {headers:header});
    }
}