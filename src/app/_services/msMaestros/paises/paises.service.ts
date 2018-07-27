import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../../_config/configuration.service';
import { RequestPaisesByIdEmpresa, ResponseListaPaises } from '../../../_models';


@Injectable()

export class PaisesService {


    private get url() {
        return this.configurationService.isLocal ? this.configurationService.baseUrlLocal + this.configurationService.port51057 + this.configurationService.paisesUrl :
            this.configurationService.baseUrlRemoto + this.configurationService.MSMaest + this.configurationService.paisesUrl;
    }

    token: any;

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }


    getByIdEmpresa(req:RequestPaisesByIdEmpresa) {

        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        let parametersUrl = "/?id_Empresa="+ req.Id_Empresa;
        return this.http.get<ResponseListaPaises>(this.url + parametersUrl, { headers: header });

    }
}
