import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../../_config/configuration.service';
import { PromotionsArticle, ArticulosGruposOfertas, ArticulosGruposOfertasFiltro, Promotions } from '../../../_models/index';

@Injectable()
export class PromotionsArticuloService {

    private get url() {
        return this.configurationService.isLocal ? this.configurationService.baseUrlLocal + this.configurationService.port51056 + this.configurationService.promotionsUrl + '/PromotionsArticulo/' :
            this.configurationService.baseUrlRemoto + this.configurationService.MSPromo + this.configurationService.promotionsUrl + '/PromotionsArticulo/';
    }
    token: any;

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }

    getAll(filtroArticulosGrupoOferta: ArticulosGruposOfertasFiltro, numeroPagina: number, tamanioPagina: number, orderDirectionGO: number, orderByGO: string) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });

        let body = {
            referenciaFiltro: filtroArticulosGrupoOferta.referenciaFiltro,
            descripcionFiltro: filtroArticulosGrupoOferta.descripcionFiltro,
            proveedorFiltro: filtroArticulosGrupoOferta.proveedorFiltro,
            categoriaFiltro: filtroArticulosGrupoOferta.categoriaFiltro.filter(x => x == 0).length == 1 ? [] : filtroArticulosGrupoOferta.categoriaFiltro,
            familiaFiltro: filtroArticulosGrupoOferta.familiaFiltro.filter(x => x == 0).length == 1 ? [] : filtroArticulosGrupoOferta.familiaFiltro,
            subFamiliaFiltro: filtroArticulosGrupoOferta.subFamiliaFiltro.filter(x => x == 0).length == 1 ? [] : filtroArticulosGrupoOferta.subFamiliaFiltro,
            filas: tamanioPagina,
            pagina: numeroPagina,
            orderBy: orderByGO,
            orderDirection: orderDirectionGO,
            paginacionBd: filtroArticulosGrupoOferta.paginacionBdGO

        }
        return this.http.post<ArticulosGruposOfertas[]>(this.url + "/search", body, { headers: header });
    }

    getAllPromoArt(filtroArticulosGrupoOferta: ArticulosGruposOfertasFiltro) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });

        let body = {
            referenciaFiltro: filtroArticulosGrupoOferta.referenciaFiltro,
            descripcionFiltro: filtroArticulosGrupoOferta.descripcionFiltro,
            proveedorFiltro: filtroArticulosGrupoOferta.proveedorFiltro,
            categoriaFiltro: filtroArticulosGrupoOferta.categoriaFiltro.filter(x => x == 0).length == 1 ? [] : filtroArticulosGrupoOferta.categoriaFiltro,
            familiaFiltro: filtroArticulosGrupoOferta.familiaFiltro.filter(x => x == 0).length == 1 ? [] : filtroArticulosGrupoOferta.familiaFiltro,
            subFamiliaFiltro: filtroArticulosGrupoOferta.subFamiliaFiltro.filter(x => x == 0).length == 1 ? [] : filtroArticulosGrupoOferta.subFamiliaFiltro,
            filas: filtroArticulosGrupoOferta.filasPorPaginaGO,
            pagina: filtroArticulosGrupoOferta.paginaActualGO,
            orderBy: filtroArticulosGrupoOferta.orderByGO,
            orderDirection: filtroArticulosGrupoOferta.orderDirectionGO,
            paginacionBd: filtroArticulosGrupoOferta.paginacionBdGO
        }
        return this.http.post<PromotionsArticle[]>(this.url + "search", body, { headers: header });

    }



}
