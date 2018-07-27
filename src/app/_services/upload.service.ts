import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ConfigurationService } from "../_config/configuration.service";
import { SendArchivo } from "../_models/index";

@Injectable()
export class UploadService {

  private get Url() {
    return this.configurationService.isLocal ? this.configurationService.baseUrlLocal + this.configurationService.port51057 + this.configurationService.uploadUrl :
      this.configurationService.baseUrlRemoto + this.configurationService.MSMaest + this.configurationService.uploadUrl;
  }

  private get UrlStrings() {
    return this.configurationService.isLocal ? this.configurationService.baseUrlLocal + this.configurationService.port51057 + this.configurationService.uploadStringsUrl :
      this.configurationService.baseUrlRemoto + this.configurationService.MSMaest + this.configurationService.uploadStringsUrl;
  }
  token: string;


  constructor(private http: HttpClient, private configurationService: ConfigurationService) { }

  upload(file: File, fileName:string, empleado:string): Observable<any> {

    this.token = sessionStorage.getItem('token');

    let header = new HttpHeaders({
      'Authorization': this.token,
      'Content-Type': 'application/octet-stream',
      'x-fileName': fileName,
      'x-employee' : empleado


    })

    return this.http.post(this.Url, file, { headers: header })
      .map(resp => {
        return resp;
      }, err => {
        console.log(err);
      });
  }

}
