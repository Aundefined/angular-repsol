import { Component, OnInit } from '@angular/core';
import { loginResponse, Perfil } from "../_models/index";
import { Menu } from '../_models/menu';
import { AuthenticationService, AlertService } from '../_services/index';
import { Router } from '@angular/router';
 
// import { TranslateService } from '@ngx-translate/core';
// private translate: TranslateService
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 
  currentUser: loginResponse;
  perfiles: Perfil[];
  nombrePerfil: string;
  listaMenu: Menu[];
  selectPerfil: boolean;
  menuTs: Menu;
  submenuTs: Menu;
 
 
  constructor(private auth: AuthenticationService, private alert: AlertService,
              private router: Router) {
    this.listaMenu = JSON.parse(sessionStorage.getItem('listaMenu'));
    this.nombrePerfil = JSON.parse(sessionStorage.getItem('nombrePerfil'));
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.perfiles = JSON.parse(sessionStorage.getItem('perfiles'));
 
  }
 
  ngOnInit() {
    console.log(this.listaMenu);
    this.selectPerfil = false;
  }
 
  changeSelectPerfil() {
    if (this.selectPerfil) {
      this.selectPerfil = false;
    } else {
      this.selectPerfil = true;
    }
  }
 
  changePerfil(value) {
 
    sessionStorage.removeItem(this.nombrePerfil);
    sessionStorage.removeItem('nombrePerfil');
    sessionStorage.removeItem('listaMenu');
 
    this.auth.sendIdPerfil(value)
      .subscribe(
        data => {
          this.auth.pintarPerfil(value);
          location.reload();
        }, err => {
          this.alert.error('Fallo de conexion', true);
        }
 
      )
  }
   
  // useLanguage(language: string) {
  //   this.translate.use(language);
  // }


  cargarVista(url : string)
  { 
      //this.router.navigateByUrl('/HomeComponent', {skipLocationChange: true}).then(()=> this.router.navigate(['/alta-estaciones']));
      this.router.navigateByUrl('/HomeComponent', {skipLocationChange: true}).then(()=> this.router.navigate([url]));
  }

}
 