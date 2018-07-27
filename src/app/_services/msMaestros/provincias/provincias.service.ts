import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../../_config/configuration.service';
import { RequestProvinciasByIdEmpresa, ResponseListaProvincias } from '../../../_models';


@Injectable()

export class ProvinciasService {


    private get url() {
        return this.configurationService.isLocal ? this.configurationService.baseUrlLocal + this.configurationService.port51057 + this.configurationService.provinciasUrl :
            this.configurationService.baseUrlRemoto + this.configurationService.MSMaest + this.configurationService.provinciasUrl;
    }

    token: any;

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }


    getByIdEmpresa(req:RequestProvinciasByIdEmpresa) {

        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        let parametersUrl = "/?id_Empresa="+ req.Id_Empresa;
        return this.http.get<ResponseListaProvincias>(this.url + parametersUrl, { headers: header });

    }
}
