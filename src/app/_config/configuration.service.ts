import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ConfigurationService {

  isLocal: boolean = environment.isLocal;
  baseUrlLocal: string = 'http://localhost:';
  baseUrlRemoto: string = ''; 

  port51055:string = '51055';
  port51056:string = '51056';
  port51057:string = '51057';
  port51058:string = '51058';
  port51059:string = '51059';
  port51060:string = '51060';

  MSAdmin:string = environment.MSAdmin;
  MSPromo:string = environment.MSPromo;
  MSMaest:string = environment.MSMaest;
  MSArtic:string = environment.MSArtic;
  MSEstac:string = environment.MSEstac;
  MSXMLSAP:string = environment.MSXMLSAP;

  authUrl:string = '/auth';
  loginUrl:string = '/usuario';
  perfilUrl:string = '/usuario/datosperfil';
  promotionsUrl:string = '/promotions';
  proveedoresUrl:string = '/proveedores';
  buscadorUrl:string = '/buscador';
  articulosUrl:string = '/articulos';
  detalleArticuloUrl = '/articulos/detalle/';
  provinciasUrl:string = '/provincias';
  paisesUrl:string = '/paises';
  nivelSurtidoUrl:string = '/surtidonivel';
  imagenUrl:string = '/imagen';
  delegacionAreaUrl:string = '/delegacionarea';
  estacionesUrl:string = '/estaciones';
  tiposCaracterizacionUrl:string = '/tiposCaracterizacion';
  clasificacionUrl:string = '/clasificacion';
  caracterizacionUrl:string = '/caracterizacion';
  filtrosUrl:string = '/filtrosarticulo';
  uploadUrl:string = '/file/upload';
  uploadStringsUrl:string = '/file/uploadStrings';
  xmlSAPUrl:string = '/xmlsap';

  constructor() { }



}
