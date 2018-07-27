import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../../_config/configuration.service'; 
import { FamiliasPadre, ArticulosGruposOfertasFiltro } from '../../../_models/index';

@Injectable()
export class FamiliasPadreService {

    private get url() { return this.configurationService.isLocal? this.configurationService.baseUrlLocal + this.configurationService.port51056 + this.configurationService.promotionsUrl + '/FamiliasPadre/':
                        this.configurationService.baseUrlRemoto + this.configurationService.MSPromo + this.configurationService.promotionsUrl + '/FamiliasPadre/';
    }
    token:any;

    constructor(private http: HttpClient, private configurationService: ConfigurationService ) { }

    getAll(filtro:ArticulosGruposOfertasFiltro) {  
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });      
        
        let body = (filtro.categoriaFiltro.length>0 && filtro.categoriaFiltro.filter(x=>x == 0).length==1)?
                    []:filtro.categoriaFiltro;
        var request = JSON.stringify(body);
        //let parametersUrl = "?idcategoria="+filtro.categoriaFiltro[filtro.categoriaFiltro.length-1].toString();
        return this.http.post<FamiliasPadre[]>(this.url, request,{headers:header});
    }
}