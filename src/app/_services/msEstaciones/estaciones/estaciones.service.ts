import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../../_config/configuration.service';
import { RequestEstacion, ResponseEstacion, ResponseListaCategoriasBases,RequestEstacionById, 
        RequestCodigoRepsol, ResponseSugerenciasCodigoRepsol, ResponseValidarCodigoRepsol, 
        RequestListaEstacionFiltros, ResponseListaEstacionFiltros } from '../../../_models/index';


@Injectable()

export class EstacionesService {


    private get url() {
        return this.configurationService.isLocal ? this.configurationService.baseUrlLocal + this.configurationService.port51059 + this.configurationService.estacionesUrl :
            this.configurationService.baseUrlRemoto + this.configurationService.MSEstac + this.configurationService.estacionesUrl;
    }

    token: any;

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }


    getById(request : RequestEstacionById) {     
        this.token = sessionStorage.getItem('token'); 
        let header = new HttpHeaders({ 
            'Authorization': this.token, 
            'Content-Type': 'application/json' 
        });
        let parameters = "/?id="+request.Id+"&id_Empresa="+request.Id_Empresa;
        return this.http.get<ResponseEstacion>(this.url+parameters,{headers:header});
    }
 
    create(request : RequestEstacion) {     
 
        this.token = sessionStorage.getItem('token'); 
        let header = new HttpHeaders({ 
            'Authorization': this.token, 
            'Content-Type': 'application/json' 
        });
 
        return this.http.post<ResponseEstacion>(this.url, request,{headers:header});
 
    }

    update(request : RequestEstacion) {     
 
        this.token = sessionStorage.getItem('token'); 
        let header = new HttpHeaders({ 
            'Authorization': this.token, 
            'Content-Type': 'application/json' 
        });
 
        return this.http.put<ResponseEstacion>(this.url, request,{headers:header});
 
    }

    getCategoriasBase() {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        return this.http.get<ResponseListaCategoriasBases>(this.url + '/categoriasbase', { headers: header });
    }

    getSugerenciasCodigoRepsol(request : RequestCodigoRepsol) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        let parameters = "/?id_Empresa="+request.Id_Empresa;
        return this.http.get<ResponseSugerenciasCodigoRepsol>(this.url + '/codigorepsol' + parameters, { headers: header });
    }

    validarCodigoRepsol(request : RequestCodigoRepsol) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        let parameters = "/?id_Empresa="+request.Id_Empresa+"&margen="+request.Margen+"&codigo_repsol="+request.Codigo_Repsol+"&id="+request.Id;
        return this.http.get<ResponseValidarCodigoRepsol>(this.url + '/existcodigorepsol' + parameters, { headers: header });

    }

    GetAllByFiltros(request : RequestListaEstacionFiltros) {     
 
        this.token = sessionStorage.getItem('token'); 
        let header = new HttpHeaders({ 
            'Authorization': this.token, 
            'Content-Type': 'application/json' 
        });
 
        return this.http.post<ResponseListaEstacionFiltros>(this.url + "/estacionesfiltros", request,{headers:header});
 
    }

}
