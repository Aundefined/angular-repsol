import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../../_config/configuration.service'; 
import { Familias, ArticulosGruposOfertasFiltro } from '../../../_models/index';

@Injectable()
export class FamiliasService {
 
    private get url(){return this.configurationService.isLocal? this.configurationService.baseUrlLocal + this.configurationService.port51056 + this.configurationService.promotionsUrl + '/Familias/': 
                        this.configurationService.baseUrlRemoto + this.configurationService.MSPromo + this.configurationService.promotionsUrl + '/Familias/';
    }
    token:any;

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }

    getAll(filtro:ArticulosGruposOfertasFiltro) {  
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });  
       
        
        let body = (filtro.familiaFiltro.length>0 && filtro.familiaFiltro.filter(x=>x == 0).length==1)?
                    []:filtro.familiaFiltro;
          var request = JSON.stringify(body)
        return this.http.post<Familias[]>(this.url,request,{headers:header});
    }
}