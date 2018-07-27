import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { AuthGuardAdmin } from './auth-guard-admin';




import { LoginComponent } from "./login/login.component";
import { RecordarPasswordComponent } from "./login/recordar-password/recordar-password.component";
import { NuevoPasswordComponent } from "./login/nuevo-password/nuevo-password.component";
import { HomeComponent } from './home/home.component';
import { Menu1Component } from './home/menu1/menu1.component';
import { Menu2Component } from './home/menu2/menu2.component';
import { Menu4Component } from './home/menu4/menu4.component';
import { Menu5Component } from './home/menu5/menu5.component';
import { Menu6Component } from './home/menu6/menu6.component';
import { Menu7Component } from './home/menu7/menu7.component';
import { Menu8Component } from './home/menu8/menu8.component';
import { PromocionGrupoComponent } from './promociones/promocion/promocion-grupo/promocion-grupo.component';
import { PromocionArticuloComponent } from './promociones/promocion/promocion-articulo/promocion-articulo.component';
import { CrearPromocionComponent } from './promociones/promocion/crear/crear-promocion.component';
import { BuscarPromocionComponent } from './promociones/promocion/buscar/buscar-promocion.component';
import { CrearGrupoComponent } from './promociones/grupo/crear/crear-grupo.component';
import { BuscarGrupoComponent } from './promociones/grupo/buscar/buscar-grupo.component';
import { PromocionesComponent } from './promociones/promociones.component';
import { SearchComponent } from './search/search.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { AltaArticulosComponent } from "./home/alta-articulos/alta-articulos.component";
import { CrearEstacionComponent } from './estaciones/crear/crear-estacion.component';
import { EstacionesComponent } from './estaciones/estaciones.component';
import { CrearProveedorComponent } from './proveedores/crear/crear-proveedor.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { SubidaFtpComponent } from './subida-ftp/subida-ftp.component';
import {PaginaBaseComponent} from './paginaBase/PaginaBaseComponent';
import { NgModule } from '@angular/core';
import { PaginationComponent } from './pagination/pagination.component';


const routes: Routes = [
    {
        path: '', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: PromocionesComponent, canActivate: [AuthGuard] }
        ]

    },
    {
        path: 'menu-uno', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: Menu1Component, canActivate: [AuthGuard] }
        ]

    },
    {
        path: 'menu-dos', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: Menu2Component, canActivate: [AuthGuard] }
        ]

    },
    {
        path: 'menu-cuatro', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: Menu4Component, canActivate: [AuthGuard] }
        ]

    },
    {
        path: 'menu-cinco', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: Menu5Component, canActivate: [AuthGuard] }
        ]

    },
    {
        path: 'menu-seis', component: HomeComponent, canActivate: [AuthGuardAdmin],
        children: [
            { path: '', component: Menu6Component, canActivate: [AuthGuardAdmin] }
        ]

    },
    {
        path: 'menu-siete', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: Menu7Component, canActivate: [AuthGuard] }
        ]

    },
    {
        path: 'menu-ocho', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: Menu8Component, canActivate: [AuthGuard] }
        ]

    },
    // {
    //     path: 'promociones', component: HomeComponent, canActivate: [AuthGuard],
    //     children: [
    //         { path: '', component: PromocionesComponent, canActivate: [AuthGuard] }
    //     ]

    // }, 
    {
        path: 'grupos', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: BuscarGrupoComponent, canActivate: [AuthGuard] }
        ]

    }, 
    {
        path: 'alta-grupos', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: CrearGrupoComponent, canActivate: [AuthGuard] }
        ]

    }, 
    {
        path: 'promociones', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: BuscarPromocionComponent, canActivate: [AuthGuard] }
        ]

    }, 
    {
        path: 'alta-promociones', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: CrearPromocionComponent, canActivate: [AuthGuard] }
        ]

    }, 
    {
        path: 'promociones/promocion/promocion-articulo', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: PromocionArticuloComponent, canActivate: [AuthGuard] }
        ]

    },  
    {
        path: 'promociones/promocion/promocion-grupo', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: PromocionGrupoComponent, canActivate: [AuthGuard] }
        ]

    },
    {
        path: 'detalle-articulos/:id', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: AltaArticulosComponent, canActivate: [AuthGuard] }
        ]

    },
    {path: 'alta-articulos', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: AltaArticulosComponent, canActivate: [AuthGuard] }
        ]
    },

    { path: 'articulos', component: HomeComponent, canActivate: [AuthGuard], 
        children: [
            { path: '', component: ArticulosComponent, canActivate: [AuthGuard] },
        ],
    },

    { path: 'search', component: HomeComponent/* , canActivate: [AuthGuard]*/, 
        children: [
            { path: '', component: SearchComponent/* , canActivate: [AuthGuard]  */}
        ]
    },

    {
        path: 'alta-estaciones', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: CrearEstacionComponent, canActivate: [AuthGuard] }
        ]

    }, 
    {
        path: 'estaciones', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: EstacionesComponent, canActivate: [AuthGuard] }
        ]

    },
    {
        path: 'alta-proveedores', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: CrearProveedorComponent, canActivate: [AuthGuard] }
        ]

    }, 
   
    { path: 'login', component: LoginComponent },    

    {
        path: 'proveedores', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: ProveedoresComponent, canActivate: [AuthGuard] }
        ]

    },
    {
        path: 'paginaBase', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: PaginaBaseComponent, canActivate: [AuthGuard] }
        ]

    },
    {
        path: 'subida-ftp', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: SubidaFtpComponent, canActivate: [AuthGuard] }
        ]

    },
    { path: 'recordar', component: RecordarPasswordComponent },
    { path: 'nuevo', component: NuevoPasswordComponent },
    { path: '**', pathMatch:'full', redirectTo:'' }/* ,
    {
        path: 'paginacion', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: PaginationComponent, canActivate: [AuthGuard] }
        ]

    } */
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
export const appRouting = RouterModule.forRoot(routes);