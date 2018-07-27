import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../../_config/configuration.service'; 
import { PromotionsArticle, PromotionsGrupo, GruposOfertasFiltro } from '../../../_models/index';

@Injectable()
export class PromotionsGrupoService {

    private get url(){return this.configurationService.isLocal? this.configurationService.baseUrlLocal + this.configurationService.port51056 + this.configurationService.promotionsUrl:
        this.configurationService.baseUrlRemoto + this.configurationService.MSPromo + this.configurationService.promotionsUrl;
    }       
    token:any;

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }

  

    getAll(gruposOfertasFiltro:GruposOfertasFiltro) {   
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });    
        //gruposOfertasFiltro.paginacionBd = true;
        let parametersUrl = "?codigo=" + gruposOfertasFiltro.codigoFiltro + "&nombre=" + gruposOfertasFiltro.descripcionFiltro + 
        "&filas="+gruposOfertasFiltro.filasPorPaginaGO+"&pagina=" + gruposOfertasFiltro.paginaActualGO + "&orderBy="+gruposOfertasFiltro.orderByGO+"&orderDirection="+gruposOfertasFiltro.orderDirectionGO+"&id_Promotion="+ gruposOfertasFiltro.id_Promotion+"&paginacionBd="+ gruposOfertasFiltro.paginacionBd;
        
        return this.http.get<PromotionsGrupo[]>(this.url + '/PromotionsGrupos/List' + parametersUrl,{headers:header});


    }

    

}
