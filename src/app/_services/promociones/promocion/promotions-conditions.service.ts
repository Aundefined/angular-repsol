import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PromotionsConditions } from '../../../_models/index';
import { ConfigurationService } from '../../../_config/configuration.service';


@Injectable()
export class PromotionsConditionsService {

    private get url() {
        return this.configurationService.isLocal ? this.configurationService.baseUrlLocal + this.configurationService.port51056 + this.configurationService.promotionsUrl :
            this.configurationService.baseUrlRemoto + this.configurationService.MSPromo + this.configurationService.promotionsUrl;
    }
    token: any;

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }

    getAll() {

        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': 'application/json'
        });

        return this.http.get<PromotionsConditions[]>(this.url + "/articulos/condiciones", { headers: header });

    }


}