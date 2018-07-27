import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../../_config/configuration.service';
import { ResponseListaEstacionHorario } from '../../../_models/index';


@Injectable()

export class EstacionHorarioService {


    private get url() {
        return this.configurationService.isLocal ? this.configurationService.baseUrlLocal + this.configurationService.port51059 + this.configurationService.estacionesUrl :
            this.configurationService.baseUrlRemoto + this.configurationService.MSEstac + this.configurationService.estacionesUrl;
    }

    token: any;

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }


    getAll() {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });
        return this.http.get<ResponseListaEstacionHorario>(this.url + '/horarios', { headers: header });

    }
}
