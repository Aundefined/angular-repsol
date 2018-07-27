import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../_config/configuration.service'; 
import { NivelSurtido } from '../_models/nivel-surtido';

@Injectable()
export class NivelSurtidoService {
// revisar esta parte
    private get url(){return this.configurationService.isLocal? this.configurationService.baseUrlLocal + this.configurationService.port51057 + this.configurationService.nivelSurtidoUrl:
    this.configurationService.baseUrlRemoto + this.configurationService.MSMaest + this.configurationService.nivelSurtidoUrl;        
    }       
    token:any;

    constructor(private http: HttpClient, private configurationService:ConfigurationService) { }

    getAll() {   
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
        'Authorization': this.token,
        'Content-Type': 'application/json'
        });     
        return this.http.get<any>(this.url, {headers:header});
        }
}