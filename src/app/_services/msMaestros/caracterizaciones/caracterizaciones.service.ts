import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../../_config/configuration.service';
import { ResponseCaracterizacion, RequestCaracterizacionByIdTipo } from '../../../_models';



@Injectable()

export class CaracterizacionesService {


    private get url() {
        return this.configurationService.isLocal ? this.configurationService.baseUrlLocal + this.configurationService.port51057 + this.configurationService.caracterizacionUrl :
            this.configurationService.baseUrlRemoto + this.configurationService.MSMaest + this.configurationService.caracterizacionUrl;
    }

    token: any;

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }


    get(req:RequestCaracterizacionByIdTipo) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        let parametersUrl = "/?idtipo="+ req.IdTipo + "&id_Empresa=" + req.Id_Empresa;
        return this.http.get<ResponseCaracterizacion>(this.url+parametersUrl, { headers: header });

    }
}
