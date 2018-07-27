import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AlertService } from './alert.service';
import { ConfigurationService } from '../_config/configuration.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserLogin, perfilesLogin, loginResponse, listMenu, User } from "../_models/index";
import 'rxjs/add/operator/map';
import { Md5 } from 'ts-md5/dist/md5';
import { Menu } from '../_models/menu';

@Injectable()
export class AuthenticationService {

  perfiles: any[] = [];

  private get TokenUrl() {
    return this.configurationService.isLocal ? this.configurationService.baseUrlLocal + this.configurationService.port51055 + this.configurationService.authUrl :
      this.configurationService.baseUrlRemoto + this.configurationService.MSAdmin + this.configurationService.authUrl;
  }
  private get loginUrl() {
    return this.configurationService.isLocal ? this.configurationService.baseUrlLocal + this.configurationService.port51055 + this.configurationService.loginUrl :
      this.configurationService.baseUrlRemoto + this.configurationService.MSAdmin + this.configurationService.loginUrl;
  }
  private get perfilUrl() {
    return this.configurationService.isLocal ? this.configurationService.baseUrlLocal + this.configurationService.port51055 + this.configurationService.perfilUrl :
      this.configurationService.baseUrlRemoto + this.configurationService.MSAdmin + this.configurationService.perfilUrl;
  }

  token: any;
  loginResponse: loginResponse;
  listMenus: listMenu;
  nombreUsuario: string;
  perfilNombre: string;



  constructor(private http: HttpClient, private router: Router, private alertService: AlertService, private configurationService: ConfigurationService) { }

  getToken1(codigoUsuario: string, password: string) {
    let header = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    let body = {
      username: codigoUsuario,//'usrapigestores',
      password: password//'usrapi'
    };

    return this.http.post<any>('https://esb-dev.everilion.com:8081/ilionServices/oauth/ilion/login', body, { headers: header })
  }

  getToken() {
    let header = new HttpHeaders({
      'username': 'admin',
      'password': 'Admin$Everis',
      'Content-Type': 'application/json'
    })

    return this.http.get<any>(this.TokenUrl, { headers: header })
  }

  loginUser(codigoUsuario: string, password: any) {

    this.token = sessionStorage.getItem('token');
    let hashedPass = Md5.hashStr(password);
    hashedPass = hashedPass.toString();

    let user = new UserLogin();
    user.CODIGO_USUARIO = codigoUsuario,
      user.PASSWORD = hashedPass;

    let header = new HttpHeaders({
      'Authorization': this.token,
      'Content-Type': 'application/x-www-form-urlencoded'
    })

    let params = new HttpParams()
      .append('CODIGO_USUARIO', user.CODIGO_USUARIO)
      .append('PASSWORD', user.PASSWORD)
      .append('ID_EMPRESA', user.ID_EMPRESA);

    let requestBody = params.toString();
    console.log(requestBody);

    return this.http.post<loginResponse>(this.loginUrl, requestBody, { headers: header })
      .map(resp => {
        console.log(resp);
        this.loginResponse = resp;
        console.log(this.loginResponse);
        this.nombreUsuario = this.loginResponse.NOMBRE_EMP;
        if (this.loginResponse.OK && this.loginResponse.OK_ESTADO) {
          sessionStorage.setItem('currentUser', JSON.stringify(this.loginResponse));

          sessionStorage.setItem(this.nombreUsuario, JSON.stringify(this.nombreUsuario));

          this.perfiles = this.loginResponse.listaPerfiles;
          return this.perfiles;

        }
        else if (this.loginResponse.OK && !this.loginResponse.OK_ESTADO) {

          this.alertService.error('Usuario inactivo', true);
        }
        else if (!this.loginResponse.OK) {

          this.alertService.error('Usuario o contraseña incorrecto', true);
        }

      }
      );
  }


  logout() {
    sessionStorage.clear();
  }

  sendIdPerfil(id: number) {
    this.token = sessionStorage.getItem('token');
    let header = new HttpHeaders({
      'Authorization': this.token,
      'Content-Type': 'application/x-www-form-urlencoded'
    })

    let perfil = new perfilesLogin();
    let pid = id.toString();
    perfil.ID_PERFIL = pid;

    let params = new HttpParams()
      .append('ID_PERFIL', perfil.ID_PERFIL);

    let requestBody = params.toString();

    return this.http.post<any>(this.perfilUrl, requestBody, { headers: header })
      .map(resp => {
        console.log(resp);
        this.listMenus = resp.listMenu;
        console.log(this.listMenus);
        sessionStorage.setItem('listaMenu', JSON.stringify(this.listMenus));
      })
  }

  pintarPerfil(id) {
    let idp = id;
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let perfiles = currentUser.listaPerfiles;
    console.log(perfiles);
    let perfil = perfiles.filter(perfil => perfil.ID == idp);
    console.log(perfil);
    perfil = perfil[0];
    this.perfilNombre = perfil.NOMBRE;
    console.log(this.perfilNombre);
    sessionStorage.setItem(this.perfilNombre, JSON.stringify(this.perfilNombre));
    sessionStorage.setItem('nombrePerfil', JSON.stringify(this.perfilNombre));
  }

}
