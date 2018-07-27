import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { appRouting } from './app.routing';
import {
  AlertService, AuthenticationService,
  GruposOfertasService, PromotionsArticuloService,
  CategoriasService, FamiliasPadreService,
  FamiliasService, ProveedoresService, ProveedoresPromoService, PromotionsService, PromotionsConditionsService,
  PromotionsGrupoService, CommonService, ProvinciasService, PaisesService, ProveedorService, EstacionDelegacionAreaService,
  EstacionImagenService, EstacionHorarioService, SegmentoService, UploadService, ClasificacionService,TiposCaracterizacionService, 
  CaracterizacionesService, SearchService, EstacionesService, LoadingService } from './_services/index';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from "./auth-guard";
import { AuthGuardAdmin } from "./auth-guard-admin";
import { JwtInterceptor, PaginacionHelper, ValidacionHelper } from './_helpers/index';
import { ConfigurationService } from "./_config/configuration.service";
import { OnlyNumber, DecimalFormat } from './_validators/soloNumeros.directive';
import { NivelSurtidoService } from "./_services/nivel-surtido.service";

import { LoadingModule } from 'ngx-loading';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './alert/alert.component';
import { HomeComponent } from './home/home.component';
import { Menu1Component } from './home/menu1/menu1.component';
import { Menu2Component } from './home/menu2/menu2.component';
import { Menu4Component } from './home/menu4/menu4.component';
import { Menu5Component } from './home/menu5/menu5.component';
import { Menu6Component } from './home/menu6/menu6.component';
import { Menu7Component } from './home/menu7/menu7.component';
import { Menu8Component } from './home/menu8/menu8.component';

import { RecordarPasswordComponent } from './login/recordar-password/recordar-password.component';
import { NuevoPasswordComponent } from './login/nuevo-password/nuevo-password.component';
import { PromocionesComponent } from './promociones/promociones.component';
import { BuscarGrupoComponent } from './promociones/grupo/buscar/buscar-grupo.component';
import { CrearGrupoComponent } from './promociones/grupo/crear/crear-grupo.component';
import { BuscarPromocionComponent } from './promociones/promocion/buscar/buscar-promocion.component';
import { CrearPromocionComponent } from './promociones/promocion/crear/crear-promocion.component';
import { PromocionArticuloComponent } from './promociones/promocion/promocion-articulo/promocion-articulo.component';
import { PromocionGrupoComponent } from './promociones/promocion/promocion-grupo/promocion-grupo.component';
import { AltaArticulosComponent } from './home/alta-articulos/alta-articulos.component';
import { CrearProveedorComponent } from './proveedores/crear/crear-proveedor.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CrearEstacionComponent } from './estaciones/crear/crear-estacion.component';
import { EstacionesComponent } from './estaciones/estaciones.component';
import { SearchComponent } from './search/search.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { ArticulosService } from './_services/articulos.service';
import { ProveedoresComponent } from './proveedores/proveedores.component';

import { SubidaFtpComponent } from './subida-ftp/subida-ftp.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { PaginationComponent } from './pagination/pagination.component';
import { LoadingComponent } from './loading/loading.component';
import { PaginaBaseComponent } from './paginaBase/PaginaBaseComponent';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AlertComponent,
    HomeComponent,
    Menu1Component,
    Menu2Component,
    Menu4Component,
    Menu5Component,
    Menu6Component,
    Menu7Component,
    Menu8Component,
    RecordarPasswordComponent,
    NuevoPasswordComponent,
    AltaArticulosComponent,

    PromocionesComponent,
    BuscarGrupoComponent,
    CrearGrupoComponent,
    BuscarPromocionComponent,
    CrearPromocionComponent,
    PromocionArticuloComponent,
    PromocionGrupoComponent,
    CrearEstacionComponent,
    CrearProveedorComponent,
    SearchComponent,
    OnlyNumber,
    DecimalFormat,
    ArticulosComponent,
    ProveedoresComponent,
    SubidaFtpComponent,
    PaginationComponent,
    LoadingComponent,
    PaginaBaseComponent,
    EstacionesComponent
  ],

  imports: [
    BrowserModule,
    appRouting,
    LoadingModule,
    FormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    NgbModule.forRoot()
  ],
  
  providers: [
    AuthGuard,
    AuthGuardAdmin,
    GruposOfertasService,
    PromotionsArticuloService,
    CategoriasService,
    FamiliasPadreService,
    FamiliasService,
    ProveedoresService,
    ProveedoresPromoService,
    AlertService,
    AuthenticationService,
    PromotionsService,
    PromotionsConditionsService,
    ConfigurationService,
    PromotionsGrupoService,
    CommonService,
    PaginacionHelper,
    ValidacionHelper,
    ProvinciasService,
    PaisesService,
    ProveedorService,
    EstacionDelegacionAreaService,
    EstacionImagenService,
    EstacionHorarioService,
    SegmentoService,
    SearchService,
    ClasificacionService,
    TiposCaracterizacionService,
    CaracterizacionesService,
    // SearchService,
    ArticulosService,
    NivelSurtidoService,
    UploadService,
    EstacionesService,
    LoadingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http);}