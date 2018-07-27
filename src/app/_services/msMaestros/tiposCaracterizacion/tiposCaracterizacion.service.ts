import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../../_config/configuration.service';
import { ResponseTiposCaracterizacion, RequestTiposCaracterizacionByTipo } from '../../../_models';




@Injectable()

export class TiposCaracterizacionService {


    private get url() {
        return this.configurationService.isLocal ? this.configurationService.baseUrlLocal + this.configurationService.port51057 + this.configurationService.tiposCaracterizacionUrl :
            this.configurationService.baseUrlRemoto + this.configurationService.MSMaest + this.configurationService.tiposCaracterizacionUrl;
    }

    token: any;

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }


    get(req:RequestTiposCaracterizacionByTipo) {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        let parametersUrl = "/?tipo="+ req.Tipo + "&id_Empresa=" + req.Id_Empresa;
        return this.http.get<ResponseTiposCaracterizacion>(this.url+parametersUrl, { headers: header });

    }
}
