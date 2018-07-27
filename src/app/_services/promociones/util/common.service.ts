import {Injectable} from "@angular/core";
import { PromotionsArticle,ArticulosGruposOfertas,
        PromotionsFiltro,GruposOfertasFiltro,PromotionsGrupo, ArticulosPromotionsGrupo } from "../../../_models/index";
import { isNullOrUndefined } from "util";

@Injectable()
export class CommonService {
    private filtroGruposOfertas:GruposOfertasFiltro;
    private filtroPromotions:PromotionsFiltro;
    private listaArticulosAnadidosGO:ArticulosGruposOfertas[];
    private listaArticulosAnadidosPRO:PromotionsArticle[];
    private listaGruposAnadidosPRO:PromotionsGrupo[];
    private listaGruposAnadidosPROMasterDetail:PromotionsGrupo[];

    constructor() {
        this.filtroGruposOfertas = new GruposOfertasFiltro();
        this.filtroPromotions = new PromotionsFiltro();
        this.listaArticulosAnadidosGO = [];
        this.listaArticulosAnadidosPRO = [];
        this.listaGruposAnadidosPRO = [];
        this.listaGruposAnadidosPROMasterDetail = [];
    }

    setValueGrupoOfertasFiltro(val : GruposOfertasFiltro) {
        this.filtroGruposOfertas.codigoFiltro = val.codigoFiltro;
        this.filtroGruposOfertas.descripcionFiltro = val.descripcionFiltro;
        this.filtroGruposOfertas.orderByGO = val.orderByGO;
        this.filtroGruposOfertas.orderDirectionGO = val.orderDirectionGO;
        this.filtroGruposOfertas.p.paginaActual = val.p.paginaActual;
        this.filtroGruposOfertas.p.filasPorPagina = val.p.filasPorPagina;
        this.filtroGruposOfertas.p.listPaginas = val.p.listPaginas;
        this.filtroGruposOfertas.p.numeroPaginas = val.p.numeroPaginas;
        this.filtroGruposOfertas.p.totalItems = val.p.totalItems;
    }

    getValueGrupoOfertasFiltro():GruposOfertasFiltro {
        return this.filtroGruposOfertas;
    }

    setValuePromotionsFiltro(val : PromotionsFiltro) {
        this.filtroPromotions.codigo = val.codigo;
        this.filtroPromotions.descripcion = val.descripcion;
        this.filtroPromotions.fecha_desde = val.fecha_desde;
        this.filtroPromotions.fecha_hasta = val.fecha_hasta;

        this.filtroPromotions.paginaActualGO = val.paginaActualGO;
        this.filtroPromotions.filasPorPaginaGO = val.filasPorPaginaGO;
        this.filtroPromotions.orderByGO = val.orderByGO;
        this.filtroPromotions.orderDirectionGO = val.orderDirectionGO;
        this.filtroPromotions.listPaginasGO = val.listPaginasGO;
        this.filtroPromotions.numeroPaginasGO = val.numeroPaginasGO;
    }

    getValuePromotionsFiltro():PromotionsFiltro {
        return this.filtroPromotions;
    }

    setValueListaArticulosAnadidosGO(val : ArticulosGruposOfertas[]) {
        this.listaArticulosAnadidosGO = [];
        this.listaArticulosAnadidosGO = val;
    }

    addValueListaArticulosAnadidosGO(val : ArticulosGruposOfertas) {
        this.listaArticulosAnadidosGO.push(val);
    }

    getListaArticulosAnadidosGO() : ArticulosGruposOfertas[] {
        return this.listaArticulosAnadidosGO;
    }

    getValueListaArticulosAnadidosGO(numeroPagina:number,filasPorPagina:number,orderBy:string,orderDirection:number):ArticulosGruposOfertas[] {
        var listaRetonada : ArticulosGruposOfertas[] = [];
        var numeroDePaginas : number = 0;
        var indiceInicial : number = 0;
        var indiceFinal : number  = 0;
        let listaSinEliminados : ArticulosGruposOfertas[]=[];
        listaSinEliminados = this.listaArticulosAnadidosGO.filter(x=>x.accion!="D");

        switch (orderBy) {
            case "referencia":
                if(orderDirection==0)
                    listaSinEliminados = listaSinEliminados.sort((left,right) => (Number.parseFloat(right.referencia) - Number.parseFloat(left.referencia)));
                else
                    listaSinEliminados = listaSinEliminados.sort((left,right) => (Number.parseFloat(left.referencia) - Number.parseFloat(right.referencia)));
                break;
            case "pvp":
                if(orderDirection==0)
                    listaSinEliminados = listaSinEliminados.sort((left,right) => right.pvp - left.pvp);
                else
                    listaSinEliminados = listaSinEliminados.sort((left,right) => left.pvp - right.pvp);
                break;
                case "descripcion":
                if(orderDirection==0)
                {
                    listaSinEliminados = listaSinEliminados.sort((left,right) : number => {
                            left.nombre = isNullOrUndefined(left.nombre)?"":left.nombre;
                            if(left.nombre.toUpperCase() > right.nombre.toUpperCase()) return -1;
                            if(left.nombre.toUpperCase() < right.nombre.toUpperCase()) return 1;
                            return 0;    
                        
                        }
                    );
                }
                else
                {
                    listaSinEliminados = listaSinEliminados.sort((left,right) : number => {
                            left.nombre = isNullOrUndefined(left.nombre)?"":left.nombre;
                            if(left.nombre.toUpperCase() < right.nombre.toUpperCase()) return -1;
                            if(left.nombre.toUpperCase() > right.nombre.toUpperCase()) return 1;
                            return 0;
                        }
                    );
                }
                break;
                case "grupo":
                if(orderDirection==0)
                {
                    listaSinEliminados = listaSinEliminados.sort((left,right) : number => {
                            left.grupo = isNullOrUndefined(left.grupo)?"":left.grupo;
                            if(left.grupo.toUpperCase() > right.grupo.toUpperCase()) return -1;
                            if(left.grupo.toUpperCase() < right.grupo.toUpperCase()) return 1;
                            return 0;
                        }
                    );
                }
                else
                {
                    listaSinEliminados = listaSinEliminados.sort((left,right) : number => { 
                            left.grupo = isNullOrUndefined(left.grupo)?"":left.grupo;
                            if(left.grupo.toUpperCase() < right.grupo.toUpperCase()) return -1;
                            if(left.grupo.toUpperCase() > right.grupo.toUpperCase()) return 1;
                            return 0;
                        }
                    );
                }
                break;
            default:
                break;
        }

        if(listaSinEliminados.length > 0)
        {
            if (listaSinEliminados.length % filasPorPagina == 0) {
                numeroDePaginas = parseInt((listaSinEliminados.length / filasPorPagina).toString());
                indiceInicial = (filasPorPagina) * (numeroPagina-1); 
                indiceFinal = (filasPorPagina) * (numeroPagina) - 1;  
              }
            else {
                numeroDePaginas = parseInt((listaSinEliminados.length / filasPorPagina).toString()) + 1;
                indiceInicial = (filasPorPagina) * (numeroPagina-1); 
                if(numeroDePaginas == numeroPagina)
                    indiceFinal = listaSinEliminados.length-1;
                    // if(this.listaArticulosAnadidosGO.length < filasPorPagina)
                    //     indiceFinal = this.listaArticulosAnadidosGO.length % filasPorPagina;
                    // else
                    //     indiceFinal = this.listaArticulosAnadidosGO.length;  
                else
                    indiceFinal = (filasPorPagina*numeroPagina)-1;  
            }
            //indiceInicial = (filasPorPagina) * (numeroPagina-1); 
            //indiceFinal = (filasPorPagina) * (numeroPagina)-1;  
            for (let index = indiceInicial; index <= indiceFinal; index++) {
                var element = listaSinEliminados[index];
                listaRetonada.push(element);
            }
        }
        return listaRetonada;
    }

    setValueListaArticulosAnadidosPRO(val : PromotionsArticle[]) {
        this.listaArticulosAnadidosPRO = [];
        this.listaArticulosAnadidosPRO = val;
    }

    addValueListaArticulosAnadidosPRO(val : PromotionsArticle) {
        this.listaArticulosAnadidosPRO.push(val);
    }

    getListaArticulosAnadidosPRO() : PromotionsArticle[] {
        return this.listaArticulosAnadidosPRO;
    }

    getValueListaArticulosAnadidosPRO(numeroPagina:number,filasPorPagina:number,orderBy:string,orderDirection:number):PromotionsArticle[] {
        var listaRetonada : PromotionsArticle[] = [];
        var numeroDePaginas : number = 0;
        var indiceInicial : number = 0;
        var indiceFinal : number  = 0;
        let listaSinEliminados : PromotionsArticle[]=[];
        listaSinEliminados = this.listaArticulosAnadidosPRO.filter(x=>x.accion!="D");

        switch (orderBy) {
            case "referencia":
                if(orderDirection==0)
                    listaSinEliminados = listaSinEliminados.sort((left,right) => (Number.parseFloat(right.referencia) - Number.parseFloat(left.referencia)));
                else
                    listaSinEliminados = listaSinEliminados.sort((left,right) => (Number.parseFloat(left.referencia) - Number.parseFloat(right.referencia)));
                break;
            case "pvp":
                if(orderDirection==0)
                    listaSinEliminados = listaSinEliminados.sort((left,right) => right.pvp - left.pvp);
                else
                    listaSinEliminados = listaSinEliminados.sort((left,right) => left.pvp - right.pvp);
                break;
            case "importe":
                if(orderDirection==0)
                    listaSinEliminados = listaSinEliminados.sort((left,right) => right.importe - left.importe);
                else
                    listaSinEliminados = listaSinEliminados.sort((left,right) => left.importe - right.importe);
                break;
            case "pvpPromocional":
                if(orderDirection==0)
                    listaSinEliminados = listaSinEliminados.sort((left,right) => right.pvp_Promocional - left.pvp_Promocional);
                else
                    listaSinEliminados = listaSinEliminados.sort((left,right) => left.pvp_Promocional - right.pvp_Promocional);
                break;
            case "dto":
                if(orderDirection==0)
                    listaSinEliminados = listaSinEliminados.sort((left,right) => right.dto - left.dto);
                else
                    listaSinEliminados = listaSinEliminados.sort((left,right) => left.dto - right.dto);
                break;
            case "descripcion":
                if(orderDirection==0)
                {
                    listaSinEliminados = listaSinEliminados.sort((left,right) : number => {
                            left.nombre = isNullOrUndefined(left.nombre)?"":left.nombre;
                            if(left.nombre.toUpperCase() > right.nombre.toUpperCase()) return -1;
                            if(left.nombre.toUpperCase() < right.nombre.toUpperCase()) return 1;
                            return 0;    
                        }
                    );
                }
                else
                {
                    listaSinEliminados = listaSinEliminados.sort((left,right) : number => {
                            left.nombre = isNullOrUndefined(left.nombre)?"":left.nombre;
                            if(left.nombre.toUpperCase() < right.nombre.toUpperCase()) return -1;
                            if(left.nombre.toUpperCase() > right.nombre.toUpperCase()) return 1;
                            return 0;
                        }
                    );
                }
                break;
            case "grupo":
                if(orderDirection==0)
                {
                    listaSinEliminados = listaSinEliminados.sort((left,right) : number => {
                            left.grupo = isNullOrUndefined(left.grupo)?"":left.grupo;
                            if(left.grupo.toUpperCase() > right.grupo.toUpperCase()) return -1;
                            if(left.grupo.toUpperCase() < right.grupo.toUpperCase()) return 1;
                            return 0;    
                        
                        }
                    );
                }
                else
                {
                    listaSinEliminados = listaSinEliminados.sort((left,right) : number => {
                            left.grupo = isNullOrUndefined(left.grupo)?"":left.grupo;
                            if(left.grupo.toUpperCase() < right.grupo.toUpperCase()) return -1;
                            if(left.grupo.toUpperCase() > right.grupo.toUpperCase()) return 1;
                            return 0;
                        }
                    );
                }
                break;
            default:
                break;
        }

        if(listaSinEliminados.length > 0)
        {
            if (listaSinEliminados.length % filasPorPagina == 0) {
                numeroDePaginas = parseInt((listaSinEliminados.length / filasPorPagina).toString());
                indiceInicial = (filasPorPagina) * (numeroPagina-1); 
                indiceFinal = (filasPorPagina) * (numeroPagina) - 1;  
              }
            else {
                numeroDePaginas = parseInt((listaSinEliminados.length / filasPorPagina).toString()) + 1;
                indiceInicial = (filasPorPagina) * (numeroPagina-1); 
                if(numeroDePaginas == numeroPagina)
                    indiceFinal = listaSinEliminados.length-1;
                    // if(this.listaArticulosAnadidosGO.length < filasPorPagina)
                    //     indiceFinal = this.listaArticulosAnadidosGO.length % filasPorPagina;
                    // else
                    //     indiceFinal = this.listaArticulosAnadidosGO.length;  
                else
                    indiceFinal = (filasPorPagina*numeroPagina)-1;  
            }
            //indiceInicial = (filasPorPagina) * (numeroPagina-1); 
            //indiceFinal = (filasPorPagina) * (numeroPagina)-1;  
            for (let index = indiceInicial; index <= indiceFinal; index++) {
                var element = listaSinEliminados[index];
                listaRetonada.push(element);
            }
        }
        return listaRetonada;
    }

    // setValueListaGruposAnadidosPRO() {
    //     this.listaGruposAnadidosPRO = this.convertToModel(this.listaGruposAnadidosPROMasterDetail);
    // }

    clearListaGruposAnadidosPRO() {
        this.listaGruposAnadidosPRO = [];
    }

    addValueListaGruposAnadidosPRO(val : PromotionsGrupo) {
        this.listaGruposAnadidosPRO.push(val);
    }

    getListaGruposAnadidosPRO() : PromotionsGrupo[] {
        return this.listaGruposAnadidosPRO;
    }

    getValueListaGruposAnadidosPRO(numeroPagina:number,filasPorPagina:number,orderBy:string,orderDirection:number):PromotionsGrupo[] {
        var model : PromotionsGrupo[] = [];
        var listaOrdenadaYPaginada : PromotionsGrupo[] = [];
        var numeroDePaginas : number = 0;
        var indiceInicial : number = 0;
        var indiceFinal : number  = 0;
        let listaSinEliminados : PromotionsGrupo[]=[];
        listaSinEliminados = this.listaGruposAnadidosPROMasterDetail.filter(x=>x.accion!="D");

        switch (orderBy) {
            case "codigo":
                if(orderDirection==0)
                {
                    listaSinEliminados = listaSinEliminados.sort((left,right) : number => {
                            left.codigo = isNullOrUndefined(left.codigo)?"":left.codigo;
                            if(left.codigo.toUpperCase() > right.codigo.toUpperCase()) return -1;
                            if(left.codigo.toUpperCase() < right.codigo.toUpperCase()) return 1;
                            return 0;    
                        }
                    );
                }
                else
                {
                    listaSinEliminados = listaSinEliminados.sort((left,right) : number => {
                            left.codigo = isNullOrUndefined(left.codigo)?"":left.codigo;
                            if(left.codigo.toUpperCase() < right.codigo.toUpperCase()) return -1;
                            if(left.codigo.toUpperCase() > right.codigo.toUpperCase()) return 1;
                            return 0;
                        }
                    );
                }
                break;
            case "descripcion":
                if(orderDirection==0)
                {
                    listaSinEliminados = listaSinEliminados.sort((left,right) : number => {
                            left.nombre = isNullOrUndefined(left.nombre)?"":left.nombre;
                            if(left.nombre.toUpperCase() > right.nombre.toUpperCase()) return -1;
                            if(left.nombre.toUpperCase() < right.nombre.toUpperCase()) return 1;
                            return 0;    
                        }
                    );
                }
                else
                {
                    listaSinEliminados = listaSinEliminados.sort((left,right) : number => {
                            left.nombre = isNullOrUndefined(left.nombre)?"":left.nombre;
                            if(left.nombre.toUpperCase() < right.nombre.toUpperCase()) return -1;
                            if(left.nombre.toUpperCase() > right.nombre.toUpperCase()) return 1;
                            return 0;
                        }
                    );
                }
                break;
            case "cantMin":
                if(orderDirection==0)
                    listaSinEliminados = listaSinEliminados.sort((left,right) => right.cant_Min - left.cant_Min);
                else
                    listaSinEliminados = listaSinEliminados.sort((left,right) => left.cant_Min - right.cant_Min);
                break;
            default:
                break;
        }

        if(listaSinEliminados.length > 0)
        {
            if (listaSinEliminados.length % filasPorPagina == 0) {
                numeroDePaginas = parseInt((listaSinEliminados.length / filasPorPagina).toString());
                indiceInicial = (filasPorPagina) * (numeroPagina-1); 
                indiceFinal = (filasPorPagina) * (numeroPagina) - 1;  
              }
            else {
                numeroDePaginas = parseInt((listaSinEliminados.length / filasPorPagina).toString()) + 1;
                indiceInicial = (filasPorPagina) * (numeroPagina-1); 
                if(numeroDePaginas == numeroPagina)
                    indiceFinal = listaSinEliminados.length-1;
                    // if(this.listaArticulosAnadidosGO.length < filasPorPagina)
                    //     indiceFinal = this.listaArticulosAnadidosGO.length % filasPorPagina;
                    // else
                    //     indiceFinal = this.listaArticulosAnadidosGO.length;  
                else
                    indiceFinal = (filasPorPagina*numeroPagina)-1;  
            }
            //indiceInicial = (filasPorPagina) * (numeroPagina-1); 
            //indiceFinal = (filasPorPagina) * (numeroPagina)-1;  
            for (let index = indiceInicial; index <= indiceFinal; index++) {
                var element = listaSinEliminados[index];
                listaOrdenadaYPaginada.push(element);
            }
        }
        
        model = this.convertToModel(listaOrdenadaYPaginada);
        //this.setValueListaGruposAnadidosPRO(this.convertToModel(this.listaGruposAnadidosPROMasterDetail));
        return model;
    }

    clearListaGruposAnadidosPROMasterDetail() {
        this.listaGruposAnadidosPROMasterDetail = [];
    }

    setValueListaGruposAnadidosPROMasterDetail(val : PromotionsGrupo[]) {
        this.listaGruposAnadidosPROMasterDetail = [];
        this.listaGruposAnadidosPROMasterDetail = val;
        this.listaGruposAnadidosPRO = this.convertToModel(this.listaGruposAnadidosPROMasterDetail);
    }

    addValueListaGruposAnadidosPROMasterDetail(val : PromotionsGrupo) {
        this.listaGruposAnadidosPROMasterDetail.push(val);
    }

    updateEstadoListaGruposAnadidosPROMasterDetailOculto(id_PromotionsGrupo : number, estado : string,id_Grupos_Oferta:number,
                                                    id_Articulo:number,pvp_Promocional:number,dto:number,cant_Min:number,dto_Medio_Grupo:number) {
        this.listaGruposAnadidosPROMasterDetail.forEach(element => {
            if(element.id_PromotionsGrupo == id_PromotionsGrupo)
            {
                element.accion = estado;
                element.dto_Medio_Grupo = dto_Medio_Grupo;
                element.cant_Min = cant_Min;
                element.detalle.forEach(elementDet => {
                    if( elementDet.id_GruposOferta == id_Grupos_Oferta && elementDet.id_Articulo ==id_Articulo)
                        {    
                            elementDet.pvp_Promocional = pvp_Promocional;
                            elementDet.dto = dto;
                            elementDet.cant_Min = cant_Min;
                            elementDet.dto_Medio_Grupo = dto_Medio_Grupo;
                        }
                });

            }
        });
    }

    updateEstadoListaGruposAnadidosPROMasterDetail(id_PromotionsGrupo : number, estado : string) {
        this.listaGruposAnadidosPROMasterDetail.forEach(element => {
            if(element.id_PromotionsGrupo == id_PromotionsGrupo)
            {
                element.accion = estado;
            }
        });
    }

    deleteItemListaGruposAnadidosPROMasterDetail(id_Grupos_Oferta : number) {
        let indexDetele : number = -1;
        this.listaGruposAnadidosPROMasterDetail.forEach((element,i) => {
            if(element.id_Grupos_Oferta == id_Grupos_Oferta)
            indexDetele = i;
        });

        if(indexDetele != -1)
            this.listaGruposAnadidosPROMasterDetail.splice(indexDetele,1);
    }

    getListaGruposAnadidosPROMasterDetail() : PromotionsGrupo[] {
        return this.listaGruposAnadidosPROMasterDetail;
    }


    convertToModel(masterDetail: PromotionsGrupo[]) :PromotionsGrupo[] {
        var listaForView: PromotionsGrupo[] = [];

        for (let i = 0; i < masterDetail.length; i++) {
            const element = masterDetail[i];
            for (let j = 0; j < element.detalle.length; j++) {
                const articulo = element.detalle[j];
                element.id_Grupos_Oferta = articulo.id_GruposOferta;
            }

        }

        var id_Grupos_Oferta_Temp = 0;

        for (let index = 0; index < masterDetail.length; index++) {
            const element = masterDetail[index];


            for (let index1 = 0; index1 < element.detalle.length; index1++) {
                const articulo = element.detalle[index1];

                let detalleAdd = new PromotionsGrupo();

                if (id_Grupos_Oferta_Temp != articulo.id_GruposOferta) {

                    detalleAdd.accion = "U"
                    detalleAdd.codigo = element.codigo;
                    detalleAdd.nombre = element.nombre;
                    detalleAdd.cant_Min = element.cant_Min;
                    detalleAdd.id_PromotionsGrupo = element.id_PromotionsGrupo;
                    detalleAdd.dto_Medio_Grupo = element.dto_Medio_Grupo;   

                    detalleAdd.referencia = articulo.referencia;
                    detalleAdd.nombre_Articulo = articulo.nombre;
                    detalleAdd.pvp = articulo.pvp;
                    detalleAdd.iva = articulo.iva;
                    detalleAdd.importe = articulo.importe;


                    detalleAdd.id_PromotionsGrupo = articulo.id_PromotionsGrupo;
                    detalleAdd.id_Articulo = articulo.id_Articulo;
                    detalleAdd.dto = articulo.dto;
                    detalleAdd.id_Grupos_Oferta = articulo.id_GruposOferta
                    detalleAdd.pvp_Promocional = articulo.pvp_Promocional;

                    detalleAdd.valorRowSpan = this.getCantArticuloDetalleGrupo(element.detalle, articulo.id_GruposOferta);
                    detalleAdd.ocultarFila = true;

                    listaForView.push(detalleAdd);

                }

                else {

                    detalleAdd.accion = "U"
                    detalleAdd.codigo = element.codigo;
                    detalleAdd.nombre = element.nombre;
                    detalleAdd.cant_Min = element.cant_Min;
                    detalleAdd.id_PromotionsGrupo = element.id_PromotionsGrupo;
                    detalleAdd.dto_Medio_Grupo = element.dto_Medio_Grupo;   

                    detalleAdd.referencia = articulo.referencia;
                    detalleAdd.nombre_Articulo = articulo.nombre;
                    detalleAdd.pvp = articulo.pvp;
                    detalleAdd.iva = articulo.iva;
                    detalleAdd.importe = articulo.importe;


                    detalleAdd.id_PromotionsGrupo = articulo.id_PromotionsGrupo;
                    detalleAdd.id_Articulo = articulo.id_Articulo;
                    detalleAdd.dto = articulo.dto;
                    detalleAdd.id_Grupos_Oferta = articulo.id_GruposOferta
                    detalleAdd.pvp_Promocional = articulo.pvp_Promocional;

                    detalleAdd.valorRowSpan = "0";
                    detalleAdd.ocultarFila = false;

                    listaForView.push(detalleAdd);

                }

                id_Grupos_Oferta_Temp = articulo.id_GruposOferta;


            }
        }
        return listaForView;
    }

    getCantArticuloDetalleGrupo(lista: ArticulosPromotionsGrupo[], idGrupoOferta: number) {
        var cant = 0;
        for (let index = 0; index < lista.length; index++) {
            const element = lista[index];
            if (element.id_GruposOferta == idGrupoOferta) {
                cant = cant + 1;
            }
        }
        return cant.toString();
    }
}