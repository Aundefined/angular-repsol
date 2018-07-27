import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../../_config/configuration.service'; 
import { GruposOfertas, GruposOfertasFiltro,GruposOfertasByIdFiltro, ArticulosGruposOfertas  } from '../../../_models/index';

@Injectable()
export class GruposOfertasService {

    private get url(){return this.configurationService.isLocal? this.configurationService.baseUrlLocal + this.configurationService.port51056 + this.configurationService.promotionsUrl + '/gruposofertas/':
                        this.configurationService.baseUrlRemoto + this.configurationService.MSPromo + this.configurationService.promotionsUrl + '/gruposofertas/';        
    }  
    token:any;

    constructor(private http: HttpClient, private configurationService:ConfigurationService) { }

    getAll(filtroGrupoOferta:GruposOfertasFiltro) {  
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });      
        let parametersUrl = "?codigo=" + filtroGrupoOferta.codigoFiltro + "&nombre=" + filtroGrupoOferta.descripcionFiltro + 
                            "&filas="+filtroGrupoOferta.p.filasPorPagina+"&pagina=" + filtroGrupoOferta.p.paginaActual + "&orderBy="+filtroGrupoOferta.orderByGO+"&orderDirection="+filtroGrupoOferta.orderDirectionGO+"&paginacionBd="+filtroGrupoOferta.paginacionBd;
        return this.http.get<GruposOfertas[]>(this.url + parametersUrl,{headers:header});
    }
 
   getById(data : GruposOfertasByIdFiltro) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        let parametersUrl = "/?filas="+data.p.filasPorPagina+"&pagina=" + data.p.paginaActual + "&orderBy="+data.orderBy+"&orderDirection="+data.orderDirection+"&paginacionBd="+data.paginacionBd;
        return this.http.get<GruposOfertas>(this.url + data.id_grupos_ofertas + parametersUrl,{headers:header});
    }

    create(grupooferta: GruposOfertas, detalle:ArticulosGruposOfertas[]) {     
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        let body = {
            id_Grupos_Oferta : grupooferta.id_Grupos_Oferta,
            codigo : grupooferta.codigo,
            nombre : grupooferta.nombre,
            totalFilas : grupooferta.totalFilas,
            numFila : grupooferta.numFila,
            paginacionBd : false,//Traer toda la data
            detalle : detalle
        }
        return this.http.post<GruposOfertas>(this.url, body,{headers:header});
    }

    update(grupooferta: GruposOfertas, detalle:ArticulosGruposOfertas[]) {      
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        let body = {
            id_Grupos_Oferta : grupooferta.id_Grupos_Oferta,
            codigo : grupooferta.codigo,
            nombre : grupooferta.nombre,
            totalFilas : grupooferta.totalFilas,
            numFila : grupooferta.numFila,
            paginacionBd : false,//Traer toda la data
            detalle : detalle
        }
        return this.http.put<GruposOfertas>(this.url, body,{headers:header});
    }

    delete(id: number) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        return this.http.delete(this.url+id,{headers:header});
    }

    validarGrupoOferta(id: number) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        return this.http.get(this.url+"Validar/"+id,{headers:header});
    }

}