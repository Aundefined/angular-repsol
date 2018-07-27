import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../../_config/configuration.service'; 
import { Categorias } from '../../../_models/index';

@Injectable()
export class CategoriasService {

    private get url() { return this.configurationService.isLocal? this.configurationService.baseUrlLocal + this.configurationService.port51056 + this.configurationService.promotionsUrl + '/Categorias/':
                                this.configurationService.baseUrlRemoto + this.configurationService.MSPromo + this.configurationService.promotionsUrl + '/Categorias/';
    }
      
    token:any;

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }

    getAll() {  
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });              
        return this.http.get<Categorias[]>(this.url,{headers:header});
    }
}