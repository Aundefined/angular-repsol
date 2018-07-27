import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../../_config/configuration.service';
import { ResponseClasificacion } from '../../../_models';


@Injectable()

export class ClasificacionService {


    private get url() {
        return this.configurationService.isLocal ? this.configurationService.baseUrlLocal + this.configurationService.port51057 + this.configurationService.clasificacionUrl :
            this.configurationService.baseUrlRemoto + this.configurationService.MSMaest + this.configurationService.clasificacionUrl;
    }

    token: any;

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }


    get() {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        return this.http.get<ResponseClasificacion>(this.url, { headers: header });

    }
}
