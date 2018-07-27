import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { PromotionsFiltro, Promotions, PromotionsByIdFiltro, PromotionsArticle } from '../../../_models/index';
import { ConfigurationService } from '../../../_config/configuration.service'; 



@Injectable()
export class PromotionsService {
    
    private get url(){return this.configurationService.isLocal? this.configurationService.baseUrlLocal + this.configurationService.port51056 + this.configurationService.promotionsUrl:
        this.configurationService.baseUrlRemoto + this.configurationService.MSPromo + this.configurationService.promotionsUrl;
    }       
    token:any;

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }

    getAll(filtroPromotions:PromotionsFiltro){
        this.token = sessionStorage.getItem('token');        
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });      
        let parametersUrl = "/buscar/?code=" + filtroPromotions.codigo + "&descr=" + filtroPromotions.descripcion + "&fechadesde=" + filtroPromotions.fecha_desde + "&fechahasta=" + filtroPromotions.fecha_hasta +  "&filas=" + filtroPromotions.filasPorPaginaGO  + "&pagina=" + filtroPromotions.paginaActualGO + "&orderBy="+filtroPromotions.orderByGO+"&orderDirection="+filtroPromotions.orderDirectionGO+"&paginacionBd="+filtroPromotions.paginacionBd;
        return this.http.get<Promotions[]>(this.url + parametersUrl,{headers:header});

    }   

    getById(data : PromotionsByIdFiltro) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        let parametersUrl = "/LisPromotionsArt?id="+data.id_Promotions+"&filas="+data.p.filasPorPagina+"&pagina=" + data.p.paginaActual + "&orderBy="+data.orderBy+"&orderDirection="+data.orderDirection+"&paginacionBd="+data.paginacionBd;
        return this.http.get<Promotions>(this.url+parametersUrl,{headers:header});
    }

    create(promotions: Promotions, detalle:PromotionsArticle[]) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        let body : Promotions;
        body = new Promotions();
        body = promotions;
        body.paginacionBd = false;
        body.detalleArticulos = [];
        body.detalleArticulos = detalle;
        return this.http.put<Promotions>(this.url + "/PromotionsArticulo/insert", body,{headers:header});
    }

    createPromotionsGrupo(promotions: Promotions) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        return this.http.put<Promotions>(this.url + "/PromotionGrupos/insert", promotions,{headers:header});
    }
    darBaja(promotions: Promotions) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });        
        return this.http.post(this.url + "/darBajaPromotion", promotions,{headers:header});
    }

    update(promotions: Promotions, detalle:PromotionsArticle[]) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        let body : Promotions;
        body = new Promotions();
        body = promotions;
        body.paginacionBd = false;
        body.detalleArticulos = [];
        body.detalleArticulos = detalle;
        return this.http.put<Promotions>(this.url + "/", body,{headers:header});
    }
    
    updatePromotionsGrupo(promotions: Promotions) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        return this.http.put<Promotions>(this.url, promotions,{headers:header});
    }
}