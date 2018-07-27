import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService } from '../_services/index';

import { UserLogin, listMenu, loginResponse, perfilesLogin } from '../_models/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  perfilesLoad: boolean;
  perfiles: any[] = [];
  returnUrl: string;
  loading: boolean;



  constructor(private authService: AuthenticationService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.authService.logout();
    this.perfilesLoad = false;
    this.loading = false;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        this.authService.getToken()
          .subscribe(
            data => {
              console.log('getToken');
              console.log(data);
              sessionStorage.setItem('token', data);
            },
            err => {
              this.alertService.error('conexion fallida', true);
            }
          )
    
    
  }

  logUser = new UserLogin();

  login() {
    console.log('login()');
    this.loading = true;
    // console.log(this.logUser.CODIGO_USUARIO);
    // console.log(this.logUser.PASSWORD);
    //  this.authService.getToken1(this.logUser.CODIGO_USUARIO, this.logUser.PASSWORD)
    //  .subscribe(
    //    data => {
    //      console.log('getToken1');
    //      console.log(data);
    //      sessionStorage.setItem('token1', data);


        this.authService.loginUser(this.logUser.CODIGO_USUARIO, this.logUser.PASSWORD)
          .subscribe(
            data => {
              this.loading = false;
              this.perfiles = data;
              sessionStorage.setItem('perfiles',JSON.stringify(this.perfiles));
              console.log(this.perfiles);
              if (this.perfiles) {
                this.perfilesLoad = true;
              }
            },
            err => {
              this.loading = false;
              this.alertService.error('Fallo de conexion', true);
            }
          )

	// 	 },
  //    err => {
  //      this.alertService.error('conexion fallida', true);
  //    }
  // )

  }

  cargarPerfil(id) {
    this.loading = true;
    this.authService.sendIdPerfil(id)
      .subscribe(
        data => {
          this.loading = false;
          this.authService.pintarPerfil(id);
          this.router.navigate([this.returnUrl]);
        },
        err => {
          this.alertService.error('Fallo de conexion', true);
        }
      )
  }

}
