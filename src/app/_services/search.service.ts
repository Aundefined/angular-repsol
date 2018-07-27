import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../_config/configuration.service'; 
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';


@Injectable()
export class SearchService {
    
    private get url(){return this.configurationService.isLocal? this.configurationService.baseUrlLocal + this.configurationService.port51057 + this.configurationService.buscadorUrl:
        this.configurationService.baseUrlRemoto + this.configurationService.MSMaest + this.configurationService.buscadorUrl;
    }       
    token:any;
    listaTabla2:any[];


    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }

    getAll() {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
          'Authorization': this.token,
          'Content-Type': 'application/json'
        })
        
        let body = "";
        return this.http.get<any>(this.url, { headers: header })
          /* .map(resp => {
            this.listaTabla2 = resp;
            /* var JsonMostrar = [], j = 1;
            console.log(this.listaTabla2.length);
            for(var _i = 0; _i <= listaTabla.length; _i++ )
            {
               /* JsonMostrar.push( resp.response.registro[_i].materia + j );
              console.log(listaTabla[_i]['materia' + j]); 
            } */
            
            /* 
            this.listaTabla = resp.listMenu;
            console.log(this.listMenus);
            sessionStorage.setItem('listaMenu', JSON.stringify(this.listMenus)); 
          }) */
      }
}