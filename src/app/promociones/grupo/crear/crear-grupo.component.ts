import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GruposOfertas, ArticulosGruposOfertasFiltro, ArticulosGruposOfertas,
  Categorias, FamiliasPadre, Familias, Proveedores,
  GruposOfertasByIdFiltro, Paginacion
} from '../../../_models/index';
import {
  GruposOfertasService, PromotionsArticuloService,
  FamiliasService, FamiliasPadreService,
  CategoriasService, ProveedoresPromoService, CommonService
} from '../../../_services/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { isUndefined } from 'util';
import { PaginacionHelper } from '../../../_helpers/index';

@Component({
  selector: 'app-crear-grupo',
  templateUrl: './crear-grupo.component.html',
  styleUrls: ['./crear-grupo.component.css']
})
export class CrearGrupoComponent implements OnInit, OnDestroy {
  mGrupoOferta = new GruposOfertas();
  mGrupoOfertaById = new GruposOfertasByIdFiltro();
  articulosDisponibles: ArticulosGruposOfertas[];
  filtroArticulosGrupoOferta = new ArticulosGruposOfertasFiltro();
  mCategorias: Categorias[];
  mFamiliasPadre: FamiliasPadre[];
  mFamilias: Familias[];
  mProveedores: Proveedores[];
  statusCode: number;
  public loading = false;
  public showModal: boolean;
  public textoModal: string;
  public action: string = "";
  proveedorFiltroNombre: string;

  public paginaActualGO: number = 0;
  public totalItemsGO: number = 0;
  public filasPorPaginaGO: number = 10;
  public numeroPaginasGO: number = 0;
  public listPaginasGO: number[] = [];

  public orderByGO: string = "Referencia";
  public orderDirectionGO: number = 0;


  constructor(private grupoOfertasService: GruposOfertasService,
    private commonService: CommonService,
    private promotionsArticuloService: PromotionsArticuloService,
    private categoriasService: CategoriasService,
    private familiasPadreService: FamiliasPadreService,
    private familiasService: FamiliasService,
    private proveedoresService: ProveedoresPromoService,
    private _routeParams: ActivatedRoute,
    private router: Router,
    private _paginacionHelper: PaginacionHelper) {
    this._routeParams.queryParams.subscribe(params => {
      if (params['id']) {
        this.mGrupoOferta.id_Grupos_Oferta = (params['id']);
        this.mGrupoOfertaById.id_grupos_ofertas = this.mGrupoOferta.id_Grupos_Oferta;
      }
      if (params['action']) {
        this.action = (params['action']);
      }
    });
  }

  ngOnInit() {
    this.inicializarComponenteServices();
  }

  inicializarComponenteServices() {
    this.loading = true;
    if (this.mGrupoOferta.id_Grupos_Oferta > 0) {
      this.mGrupoOfertaById.p.numeroPaginas = 1;
      this.mGrupoOfertaById.p.filasPorPagina = 100;
      const allrequests = Observable.forkJoin(
        this.categoriasService.getAll(),
        this.proveedoresService.getAll(),
        this.grupoOfertasService.getById(this.mGrupoOfertaById)//,

      );
      allrequests.subscribe(latestResults => {
        this.mCategorias = latestResults[0];
        this.filtroArticulosGrupoOferta.categoriaFiltro = latestResults[0].map(c => c.id_Categoria);
        this.mProveedores = latestResults[1];
        this.mGrupoOferta = latestResults[2];
        this.commonService.setValueListaArticulosAnadidosGO(latestResults[2].detalle);
        this.mGrupoOfertaById.p.totalItems = latestResults[2].detalle.length;
        this.getArticulosAnadidosPaginadoyOrdenado();
        this.obtenerFamiliasEnCascada();
      });
    }
    else {
      const allrequests = Observable.forkJoin(
        this.categoriasService.getAll(),
        this.proveedoresService.getAll()//,
      );
      allrequests.subscribe(latestResults => {
        this.mCategorias = latestResults[0];
        this.filtroArticulosGrupoOferta.categoriaFiltro = latestResults[0].map(c => c.id_Categoria);
        this.mProveedores = latestResults[1];
        this.obtenerFamiliasEnCascada();
      });
    }

  }

  //Quitar ya no se usa
  getCategorias() {
    this.loading = true;
    this.categoriasService.getAll()
      .subscribe(
        result => {
          this.mCategorias = result;
          this.filtroArticulosGrupoOferta.categoriaFiltro = result.map(c => c.id_Categoria);
          this.obtenerFamiliasEnCascada();
          //this.loading = false;
        },
        error => {
          console.log(error);

        }
      );
  }

  categoriaClick() {
    this.loading = true;

    this.filtroArticulosGrupoOferta.familiaFiltro = [];
    this.filtroArticulosGrupoOferta.subFamiliaFiltro = [];
    this.mFamiliasPadre = [];
    this.mFamilias = [];
    this.obtenerFamiliasEnCascada();
  }

  familiaClick() {
    this.loading = true;

    this.filtroArticulosGrupoOferta.subFamiliaFiltro = [];
    this.mFamilias = [];

    this.familiasService.getAll(this.filtroArticulosGrupoOferta)
      .subscribe(
        result => {
          this.mFamilias = result;
          this.filtroArticulosGrupoOferta.subFamiliaFiltro = result.map(s => s.id_Familias);
          this.obtenerPadresByHijo(true);
          this.loading = false;
        },
        error => {
          console.log(error);

        }
      );
  }

  subFamiliaClick() {
    this.filtroArticulosGrupoOferta.categoriaFiltro = [];
    this.filtroArticulosGrupoOferta.familiaFiltro = [];
    this.obtenerPadresByHijo(false);
  }

  obtenerPadresByHijo(soloCategorias: boolean) {
    this.loading = true;
    if (!soloCategorias) {
      let indicesFam = [];
      let indicesArrayFam = [];
      let indAuxFam = 0;
      this.filtroArticulosGrupoOferta.subFamiliaFiltro.forEach(element => {
        var famPadre = this.mFamilias.filter(x => x.id_Familias == element)[0].padre;
        indicesArrayFam.push(famPadre);
      });
      var sortedArrayFam: number[] = indicesArrayFam.sort((n1, n2) => n1 - n2);
      sortedArrayFam.forEach(element => {
        if (indAuxFam != element) {
          indicesFam.push(element);
          indAuxFam = element;
        }
      });
      this.filtroArticulosGrupoOferta.familiaFiltro = indicesFam;
    }

    let indicesCat = [];
    let indicesArrayCat = [];
    let indAuxCat = 0;
    this.filtroArticulosGrupoOferta.familiaFiltro.forEach(element => {
      var cat = this.mFamiliasPadre.filter(x => x.id_Familias_Padre == element)[0].categoria;
      indicesArrayCat.push(cat);
    });
    var sortedArrayCat: number[] = indicesArrayCat.sort((n1, n2) => n1 - n2);
    sortedArrayCat.forEach(element => {
      if (indAuxCat != element) {
        indicesCat.push(element);
        indAuxCat = element;
      }
    });
    this.filtroArticulosGrupoOferta.categoriaFiltro = indicesCat;
    //this.scrollToPrimerSeleccionado();
    this.loading = false;
  }

  getArticulosDisponibles() {
    this.loading = true;
    this.promotionsArticuloService.getAll(this.filtroArticulosGrupoOferta, this.paginaActualGO, this.filasPorPaginaGO, this.orderDirectionGO, this.orderByGO)

      .subscribe(
        result => {
          this.articulosDisponibles = result;
          this.calcularPaginacionGO(result);
          this.loading = false;
        },
        error => {
          console.log(error);

        }
      );
  }

  existenArticulosYaAñadidos(): boolean {
    let rpta = false;
    let pvpAux = this.articulosDisponibles.filter(x => x.selected)[0].pvp;
    this.articulosDisponibles.forEach((element, i) => {
      if (element.selected &&
        this.commonService.getListaArticulosAnadidosGO().filter(item => item.id_Articulo == element.id_Articulo && item.accion != "D").length > 0) {
        rpta = true;
      }
    });
    return rpta;
  }


  agregarArticuloGrupoOferta() {

    if (this.articulosDisponibles.filter(x => x.selected == true).length > 0) {
      if (!this.existenArticulosYaAñadidos()) {
        this.articulosDisponibles.forEach((element, i) => {
          if (element.selected) {
            let rpta = false;
            this.commonService.getListaArticulosAnadidosGO().forEach((item) => {
              if (item.id_Articulo == element.id_Articulo) {
                rpta = true;
                if (item.accion == "D")
                  item.accion = "U";
              }
            });

            if (!rpta) {
              let detalleAdd = new ArticulosGruposOfertas();
              detalleAdd.id_Grupos_Oferta = element.id_Grupos_Oferta;
              detalleAdd.id_Articulo = element.id_Articulo;
              detalleAdd.accion = "I";
              detalleAdd.nombre = element.nombre;
              detalleAdd.pvp = element.pvp;
              detalleAdd.grupo = element.grupo;
              detalleAdd.referencia = element.referencia;
              this.commonService.addValueListaArticulosAnadidosGO(detalleAdd);
            }
            element.selected = false;
          }
        });
        this.mGrupoOfertaById.p.totalItems = this.commonService.getListaArticulosAnadidosGO().filter(x => x.accion != "D").length;
        if (this.mGrupoOfertaById.p.totalItems % this.mGrupoOfertaById.p.filasPorPagina == 0)
          this.mGrupoOfertaById.p.numeroPaginas = parseInt((this.mGrupoOfertaById.p.totalItems / this.mGrupoOfertaById.p.filasPorPagina).toString());
        else
          this.mGrupoOfertaById.p.numeroPaginas = parseInt((this.mGrupoOfertaById.p.totalItems / this.mGrupoOfertaById.p.filasPorPagina).toString()) + 1;
        this.mGrupoOfertaById.p.paginaActual = this.mGrupoOfertaById.p.numeroPaginas;
        this.getArticulosAnadidosPaginadoyOrdenado();
      }
      else {
        this.textoModal = "Uno ó más articulos ya se añadieron al grupo. Favor de revisar.";
        this.showModal = true;
      }
    }
    else {
      this.textoModal = "No se seleccionaron artículos.";
      this.showModal = true;
    }


  }

  quitarArticuloGrupoOferta() {
    let arrayIndices = [];
    if (this.commonService.getListaArticulosAnadidosGO().filter(x => x.selected == true).length > 0) {
      this.commonService.getListaArticulosAnadidosGO().forEach((element, i) => {
        if (element.selected) {
          if (element.id_Articulos_Grupos_Oferta > 0) {
            element.accion = "D";
          }
          else {
            arrayIndices.push(i);
          }
          element.selected = false;
        }
      });
      let newIndex = 0;
      arrayIndices.forEach((dato, j) => {
        this.commonService.getListaArticulosAnadidosGO().splice(dato - newIndex, 1);
        newIndex = newIndex + 1;
      });

      this.mGrupoOfertaById.p.totalItems = this.commonService.getListaArticulosAnadidosGO().filter(x => x.accion != "D").length;//this.mGrupoOfertaById.p.totalItems - 1;
      if (this.mGrupoOfertaById.p.totalItems % this.mGrupoOfertaById.p.filasPorPagina == 0)
        this.mGrupoOfertaById.p.numeroPaginas = parseInt((this.mGrupoOfertaById.p.totalItems / this.mGrupoOfertaById.p.filasPorPagina).toString());
      else
        this.mGrupoOfertaById.p.numeroPaginas = parseInt((this.mGrupoOfertaById.p.totalItems / this.mGrupoOfertaById.p.filasPorPagina).toString()) + 1;
      this.mGrupoOfertaById.p.paginaActual = this.mGrupoOfertaById.p.numeroPaginas;
      this.getArticulosAnadidosPaginadoyOrdenado();
    }
    else {
      this.textoModal = "No se seleccionaron artículos.";
      this.showModal = true;
    }
  }

  guardarGrupoOferta() {
    if (isUndefined(this.mGrupoOferta.nombre) || this.mGrupoOferta.nombre == "") {
      this.textoModal = "El campo Descripción es obligatorio.";
      this.showModal = true;
    }
    else {
      this.loading = true;
      if (this.mGrupoOferta.id_Grupos_Oferta > 0 || (this.mGrupoOferta.codigo && this.mGrupoOferta.codigo.toString().length > 0)) {
        this.grupoOfertasService.update(this.mGrupoOferta, this.commonService.getListaArticulosAnadidosGO())
          .subscribe(
            grupoOferta => {
              this.loading = false;
              if (grupoOferta.id_Grupos_Oferta > 0) {
                this.commonService.setValueListaArticulosAnadidosGO(grupoOferta.detalle);
                this.mGrupoOfertaById.p.totalItems = grupoOferta.detalle.length;
                this.mGrupoOferta = grupoOferta;
                this.getArticulosAnadidosPaginadoyOrdenado();
                this.textoModal = "Los datos se han actualizado correctamente.";
              }
              else {
                this.textoModal = "Ocurrió un error al actualizar los datos.";
              }
              this.showModal = true;
              console.log(grupoOferta);
            },
            errorCode => {
              this.textoModal = "Ocurrió un error. Por favor intente mas tarde.";
              this.loading = false;
              this.showModal = true;
            }

          );
      }
      else {
        this.grupoOfertasService.create(this.mGrupoOferta, this.commonService.getListaArticulosAnadidosGO())
          .subscribe(
            grupoOferta => {
              this.loading = false;
              if (grupoOferta.id_Grupos_Oferta > 0) {
                this.commonService.setValueListaArticulosAnadidosGO(grupoOferta.detalle);
                this.mGrupoOfertaById.p.totalItems = grupoOferta.detalle.length;
                this.mGrupoOferta = grupoOferta;
                this.getArticulosAnadidosPaginadoyOrdenado();
                this.textoModal = "Los datos se han guardado correctamente.";
              }
              else {
                this.textoModal = "Ocurrió un error al grabar los datos.";
              }
              this.showModal = true;
              console.log(grupoOferta);
            },
            errorCode => {
              this.textoModal = "Ocurrió un error. Por favor intente mas tarde.";
              this.loading = false;
              this.showModal = true;
            }

          );
      }
    }
  }

  cerrarModal() {
    this.showModal = false;
  }

  habilitarControles(): boolean {
    if (this.action == "" || this.action == "1") {
      return true;
    }
    else {
      return false;
    }
  }

  calcularPaginacionGO(data: ArticulosGruposOfertas[]) {
    let paginaInicialNueva = 0;
    if (this.paginaActualGO == 1 || this.numeroPaginasGO < 6)
      paginaInicialNueva = 1;
    else if (this.paginaActualGO == this.numeroPaginasGO)
      paginaInicialNueva = this.numeroPaginasGO - 4;
    else
      paginaInicialNueva = this.listPaginasGO.length > 0 ? this.listPaginasGO[0] : 1;

    let indiceSeleccionado = 0;
    if (this.paginaActualGO > 1 && this.paginaActualGO != this.numeroPaginasGO) {
      this.listPaginasGO.forEach((element, i) => {
        if (element == this.paginaActualGO)
          indiceSeleccionado = i;
      });
      switch (indiceSeleccionado) {
        case 0:
          if (this.paginaActualGO == 1 || this.paginaActualGO == 2)
            paginaInicialNueva = 1;
          else
            paginaInicialNueva = paginaInicialNueva - 2;
          break;
        case 1:
          if (this.paginaActualGO == 2)
            paginaInicialNueva = 1;
          else
            paginaInicialNueva = paginaInicialNueva - 1;
          break;
        case 2:
          if (this.paginaActualGO == 3)
            paginaInicialNueva = 1;
          else
            paginaInicialNueva = paginaInicialNueva;
          break;
        case 3:
          if (this.paginaActualGO == this.numeroPaginasGO - 1)
            paginaInicialNueva = this.numeroPaginasGO - 4;
          else
            paginaInicialNueva = paginaInicialNueva + 1;
          break;
        case 4:
          if (this.paginaActualGO == this.numeroPaginasGO)
            paginaInicialNueva = this.numeroPaginasGO - 4;
          else
            paginaInicialNueva = paginaInicialNueva + 2;
          break;
        default:
          break;
      }
    }

    this.listPaginasGO = [];
    this.totalItemsGO = data.length > 0 ? data[0].totalFilas : 0;
    if (this.totalItemsGO % this.filasPorPaginaGO == 0) {
      this.numeroPaginasGO = parseInt((this.totalItemsGO / this.filasPorPaginaGO).toString());
    }
    else {
      this.numeroPaginasGO = parseInt((this.totalItemsGO / this.filasPorPaginaGO).toString()) + 1;
    }
    if (this.numeroPaginasGO >= 5) {
      for (let index = 0; index < 5; index++) {
        this.listPaginasGO.push(paginaInicialNueva + index);
      }
    }
    else {
      for (let index = 0; index < this.numeroPaginasGO; index++) {
        this.listPaginasGO.push(paginaInicialNueva + index);
      }
    }
  }

  inicializarPaginado() {
    this.paginaActualGO = 1;
    this.numeroPaginasGO = 0;
    this.filasPorPaginaGO = 10;
    this.totalItemsGO = 0;
    this.listPaginasGO = [];
  }
  paginacionClick(pagina: number) {
    let invoke = false;
    switch (pagina) {
      case -1:
        if (this.paginaActualGO > 1) {
          this.paginaActualGO = this.paginaActualGO - 1;
          invoke = true;
        }
        break;
      case 0:
        if (this.paginaActualGO < this.numeroPaginasGO) {
          this.paginaActualGO = this.paginaActualGO + 1;
          invoke = true;
        }
        break;
      default:
        this.paginaActualGO = pagina;
        invoke = true;
        break;
    }
    if (invoke)
      this.getArticulosDisponibles();
  }

  cargarArticulosDisponiblesFisrtTime() {
    this.inicializarPaginado();
    this.getArticulosDisponibles();
  }

  setClassActive(pagina: number) {
    let clase = "";
    if (pagina == this.paginaActualGO)
      clase = "page-item active";

    return clase;
  }

  limpiarFiltrosArticulos() {
    this.loading = true;
    this.filtroArticulosGrupoOferta.referenciaFiltro = "";
    this.filtroArticulosGrupoOferta.proveedorFiltro = 0;
    this.filtroArticulosGrupoOferta.descripcionFiltro = "";
    this.filtroArticulosGrupoOferta.categoriaFiltro = [];
    this.filtroArticulosGrupoOferta.familiaFiltro = [];
    this.filtroArticulosGrupoOferta.subFamiliaFiltro = [];

    this.articulosDisponibles = [];
    this.numeroPaginasGO = 0;

    this.categoriasService.getAll()
      .subscribe(
        result => {
          this.mCategorias = result;
          this.filtroArticulosGrupoOferta.categoriaFiltro = result.map(c => c.id_Categoria);
          this.obtenerFamiliasEnCascada();
          //this.loading = false;
        },
        error => {
          console.log(error);

        }
      );

  }

  obtenerFamiliasEnCascada() {
    this.familiasPadreService.getAll(this.filtroArticulosGrupoOferta)
      .subscribe(
        result => {
          this.mFamiliasPadre = result;
          this.filtroArticulosGrupoOferta.familiaFiltro = result.map(fp => fp.id_Familias_Padre);
          this.familiasService.getAll(this.filtroArticulosGrupoOferta)
            .subscribe(
              result => {
                this.mFamilias = result;
                this.filtroArticulosGrupoOferta.subFamiliaFiltro = result.map(s => s.id_Familias);
                this.loading = false;
              },
              error => {
                console.log(error);
                this.loading = false;
              }
            );
        },
        error => {
          console.log(error);
          this.loading = false;
        }
      );
  }

  scrollToPrimerSeleccionado(): void {
    let elemenScroll: HTMLElement;
    const elementList = document.querySelectorAll('.' + "optionFP");
    if (elementList.length > 0) {
      for (let i: number = 0; i < elementList.length; i++) {
        var elemento = elementList[i] as HTMLOptionElement;
        if (elemento.selected == true) {
          elemenScroll = elemento;
          break;
        }
      }
      if (elemenScroll) {
        elemenScroll.scrollIntoView();
      }
    }
  }

  headerClickGO(ordenadoPor: string) {
    this.orderByGO = ordenadoPor;
    this.orderDirectionGO = this.orderDirectionGO == 1 ? 0 : 1;
    this.getArticulosDisponibles()
  }

  setClassHeaderOrder() {
    let clase = "";
    if (this.orderDirectionGO == 1)
      clase = "assets/arrow-up-small.jpg";
    else
      clase = "assets/arrow-down-small.jpg";
    return clase;
  }

  selectedAllCategorias() {
    this.loading = true;
    this.filtroArticulosGrupoOferta.familiaFiltro = [];
    this.filtroArticulosGrupoOferta.subFamiliaFiltro = [];
    let array = [];
    array = this.mCategorias.map(cat => cat.id_Categoria);
    this.filtroArticulosGrupoOferta.categoriaFiltro = array;
    this.obtenerFamiliasEnCascada();
  }

  selectedAllFamilias() {
    this.loading = true;
    this.filtroArticulosGrupoOferta.subFamiliaFiltro = [];
    let array = [];
    array = this.mFamiliasPadre.map(famp => famp.id_Familias_Padre);
    this.filtroArticulosGrupoOferta.familiaFiltro = array;
    this.familiasService.getAll(this.filtroArticulosGrupoOferta)
      .subscribe(
        result => {
          this.mFamilias = result;
          this.filtroArticulosGrupoOferta.subFamiliaFiltro = result.map(s => s.id_Familias);
          this.loading = false;
        },
        error => {
          console.log(error);

        }
      );
  }


  selectedAllSubFamilias() {
    this.loading = true;
    let array = [];
    array = this.mFamilias.map(fam => fam.id_Familias);
    this.loading = false;
    this.filtroArticulosGrupoOferta.subFamiliaFiltro = array;
  }

  calcularPaginacionArticulosAnadidos(data: any[]) {
    var p = new Paginacion();
    p.filasPorPagina = this.mGrupoOfertaById.p.filasPorPagina;
    p.listPaginas = this.mGrupoOfertaById.p.listPaginas;
    p.numeroPaginas = this.mGrupoOfertaById.p.numeroPaginas;
    p.paginaActual = this.mGrupoOfertaById.p.paginaActual;

    p.totalItems = this.mGrupoOfertaById.p.totalItems == 0 ? (data.length > 0 ? data[0].totalFilas : 0) : this.mGrupoOfertaById.p.totalItems;
    this.mGrupoOfertaById.p = this._paginacionHelper.calcularPaginacion(p);
  }

  getArticulosAnadidosPaginadoyOrdenado() {
    this.mGrupoOfertaById.p.filasPorPagina = this.mGrupoOfertaById.p.filasPorPagina == 100 || this.mGrupoOfertaById.p.filasPorPagina == 0 ? 10 : this.mGrupoOfertaById.p.filasPorPagina;
    var listaPaginadaYOrdenada = this.commonService.getValueListaArticulosAnadidosGO(this.mGrupoOfertaById.p.paginaActual, this.mGrupoOfertaById.p.filasPorPagina, this.mGrupoOfertaById.orderBy, this.mGrupoOfertaById.orderDirection);
    this.mGrupoOferta.detalle = [];
    this.mGrupoOferta.detalle = listaPaginadaYOrdenada;
    this.calcularPaginacionArticulosAnadidos(listaPaginadaYOrdenada);
  }

  paginacionClickArticulosAnadidos(pagina: number) {
    let invoke = false;
    switch (pagina) {
      case -1:
        if (this.mGrupoOfertaById.p.paginaActual > 1) {
          this.mGrupoOfertaById.p.paginaActual = this.mGrupoOfertaById.p.paginaActual - 1;
          invoke = true;
        }
        break;
      case 0:
        if (this.mGrupoOfertaById.p.paginaActual < this.mGrupoOfertaById.p.numeroPaginas) {
          this.mGrupoOfertaById.p.paginaActual = this.mGrupoOfertaById.p.paginaActual + 1;
          invoke = true;
        }
        break;
      default:
        this.mGrupoOfertaById.p.paginaActual = pagina;
        invoke = true;
        break;
    }
    if (invoke)
      this.getArticulosAnadidosPaginadoyOrdenado();
  }

  setClassActiveArticulosAnadidos(pagina: number) {
    let clase = "";
    if (pagina == this.mGrupoOfertaById.p.paginaActual)
      clase = "page-item active";

    return clase;
  }

  headerClickArticulosAnadidos(ordenadoPor: string) {
    this.mGrupoOfertaById.orderBy = ordenadoPor;
    this.mGrupoOfertaById.orderDirection = this.mGrupoOfertaById.orderDirection == 1 ? 0 : 1;
    this.getArticulosAnadidosPaginadoyOrdenado();
  }

  setClassHeaderOrderArticulosAnadidos() {
    let clase = "";
    if (this.mGrupoOfertaById.orderDirection == 1)
      clase = "assets/arrow-up-small.jpg";
    else
      clase = "assets/arrow-down-small.jpg";
    return clase;
  }

  setClassRowArticulosAnadidos(art: ArticulosGruposOfertas) {
    let clase = "";
    if (art.accion == "I")
      clase = "claseArticuloNuevo";
    else if (art.accion == "D")
      clase = "claseArticuloEliminado";
    else
      clase = "claseArticuloActualizado";
    return clase;
  }

  ngOnDestroy() {
    this.commonService.setValueListaArticulosAnadidosGO([]);
  }

  asignarNombreTooltip() {

    let nombreProveedor: string;
    nombreProveedor = "";
    let id: number
    id = 0;
    id = this.filtroArticulosGrupoOferta.proveedorFiltro;

    for (let index = 0; index < this.mProveedores.length; index++) {
      const element = this.mProveedores[index];

      if (element.id_Proveedores == id) {
        this.proveedorFiltroNombre = element.razon_Social;
        break;
      }
    }

  }

}


