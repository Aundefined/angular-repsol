import { Injectable } from '@angular/core';
import { DetalleArticulo } from "../_models/DetalleArticulo";
import { ConfigurationService } from "../_config/configuration.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FiltrosArticulo } from '../_models/filtrosArticulo';


@Injectable()
export class ArticulosService {

  private get url() {return this.configurationService.isLocal? this.configurationService.baseUrlLocal + this.configurationService.port51058 + this.configurationService.articulosUrl :
      this.configurationService.baseUrlRemoto + this.configurationService.MSArtic + this.configurationService.articulosUrl;
  }
  private get urlDetalle() {return this.configurationService.isLocal? this.configurationService.baseUrlLocal + this.configurationService.port51058 + this.configurationService.detalleArticuloUrl :
      this.configurationService.baseUrlRemoto + this.configurationService.MSArtic + this.configurationService.detalleArticuloUrl;
  }

  private get urlMaestrosFiltros(){return this.configurationService.isLocal? this.configurationService.baseUrlLocal + this.configurationService.port51057 + this.configurationService.filtrosUrl:
      this.configurationService.baseUrlRemoto + this.configurationService.MSMaest + this.configurationService.filtrosUrl;
  }

  private get xmlSAPUrl(){return this.configurationService.isLocal? this.configurationService.baseUrlLocal + this.configurationService.port51060 + this.configurationService.xmlSAPUrl:
    this.configurationService.baseUrlRemoto + this.configurationService.MSXMLSAP + this.configurationService.xmlSAPUrl;;
  }
  
  token:string;

  constructor(private configurationService: ConfigurationService, private http: HttpClient) { }

    getAll() {
        this.token = sessionStorage.getItem('token');
        let header = new HttpHeaders({
          'Authorization': this.token,
          'Content-Type': 'application/json'
        })
        return this.http.get<any>(this.url, { headers: header })
      }
    
    getBySearch(buscar:any, buscaren:any, filtros:any) {
      this.token = sessionStorage.getItem('token');
      let header = new HttpHeaders({
        'Authorization': this.token,
        'Content-Type': 'application/json'
      })

      var busqueda = {buscar:buscar, buscaren: buscaren, filtros: filtros};
      console.log(busqueda);
      return this.http.post<any>(this.url+'/buscar', busqueda, { headers: header })
    }

    getFiltros() {
      this.token = sessionStorage.getItem('token');
      let header = new HttpHeaders({
        'Authorization': this.token,
        'Content-Type': 'application/json'
      })
      return this.http.get<FiltrosArticulo>(this.urlMaestrosFiltros, { headers: header })
      
        /* .map(resp => {
        console.log("service");
        console.log(resp); 
      })
     /*  console.log(filtros);
      return filtros; */
    }

    getDetalleArticulo(id: number) {
      this.token = sessionStorage.getItem('token');
      let header = new HttpHeaders({
        'Authorization': this.token,
        'Content-Type': 'application/json'
      })
      return this.http.get<any>(this.urlDetalle + id,  { headers: header })
      .map(resp => {

        return resp.Result;
      })
    }

    importarXML() {
      this.token = sessionStorage.getItem('token');
      let header = new HttpHeaders({
        'Authorization': this.token,
        'Content-Type': 'application/json'
      })
      console.log("importarXML");
      return this.http.get(this.xmlSAPUrl+'/xmltoddbb', { headers: header })
      .map(
        resp=>{
          return resp;
        }
      )
    }



}
