import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GruposOfertas, ArticulosGruposOfertas, GruposOfertasFiltro, Familias, Paginacion } from '../../../_models/index';
import { GruposOfertasService, CommonService } from '../../../_services/index';
import { empty } from 'rxjs/observable/empty';
import { isUndefined } from 'util';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PaginacionHelper } from '../../../_helpers/index';

@Component({
  selector: 'app-buscar-grupo',
  templateUrl: './buscar-grupo.component.html',
  styleUrls: ['./buscar-grupo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BuscarGrupoComponent implements OnInit, OnDestroy {

  allGruposOfertas: GruposOfertas[];
  mGrupoOferta = new GruposOfertas();
  mGrupoOfertaFiltro = new GruposOfertasFiltro();
  statusCode: number;
  public loading = false;
  public showModal: boolean;
  public showModalConfimacion: boolean = false;
  public textoModal: string;
  public action: string = "";  
  public idGrupoOfertaSeleccionado = 0;
  resul: string;
  ocultarBtn: boolean;
  nameBtn: string;
  closeResult: string;


  constructor(private grupoOfertasService: GruposOfertasService,
    private commonService: CommonService,
    private _routeParams: ActivatedRoute, private modalService: NgbModal,
    private _paginacionHelper: PaginacionHelper) {
    this._routeParams.queryParams.subscribe(params => {
      if (params['action']) {
        this.action = (params['action']);
      }
    });
    if (this.action == "1") {
      this.mGrupoOfertaFiltro.codigoFiltro = commonService.getValueGrupoOfertasFiltro().codigoFiltro;
      this.mGrupoOfertaFiltro.descripcionFiltro = commonService.getValueGrupoOfertasFiltro().descripcionFiltro;
      this.mGrupoOfertaFiltro.orderByGO = commonService.getValueGrupoOfertasFiltro().orderByGO;
      this.mGrupoOfertaFiltro.orderDirectionGO = commonService.getValueGrupoOfertasFiltro().orderDirectionGO;
      this.mGrupoOfertaFiltro.p.paginaActual = commonService.getValueGrupoOfertasFiltro().p.paginaActual;
      this.mGrupoOfertaFiltro.p.filasPorPagina = commonService.getValueGrupoOfertasFiltro().p.filasPorPagina;
      this.mGrupoOfertaFiltro.p.listPaginas = commonService.getValueGrupoOfertasFiltro().p.listPaginas;
      this.mGrupoOfertaFiltro.p.numeroPaginas = commonService.getValueGrupoOfertasFiltro().p.numeroPaginas;
      this.mGrupoOfertaFiltro.p.totalItems = commonService.getValueGrupoOfertasFiltro().p.totalItems;
    }

    this.resul = "";
    this.ocultarBtn = true;
    this.nameBtn = "";
    this.closeResult = "";

  }

  ngOnInit() {
    if (this.action == "1") {
      this.getAllGruposOfertas();
    }
  }

  getAllGruposOfertas() {

    this.loading = true;
    this.grupoOfertasService.getAll(this.mGrupoOfertaFiltro)
      .subscribe(
        result => {
          this.allGruposOfertas = result;
          this.calcularPaginacionGO(result);
          this.commonService.setValueGrupoOfertasFiltro(this.mGrupoOfertaFiltro);
          this.loading = false;
        },
        error => {
          console.log(error);

        }
      );
  }

  calcularPaginacionGO(data: GruposOfertas[]) {
    if (this.action != "1") {
      var p = new Paginacion();
      p.filasPorPagina = this.mGrupoOfertaFiltro.p.filasPorPagina;
      p.listPaginas = this.mGrupoOfertaFiltro.p.listPaginas;
      p.numeroPaginas = this.mGrupoOfertaFiltro.p.numeroPaginas;
      p.paginaActual = this.mGrupoOfertaFiltro.p.paginaActual;
      p.totalItems = data.length > 0 ? data[0].totalFilas : 0;

      this.mGrupoOfertaFiltro.p = this._paginacionHelper.calcularPaginacion(p);
    }
    else {
      this.action = "";
    }

  }


  limpiarFiltros() {
    this.mGrupoOfertaFiltro.codigoFiltro = "";
    this.mGrupoOfertaFiltro.descripcionFiltro = "";
    this.commonService.setValueGrupoOfertasFiltro(this.mGrupoOfertaFiltro);
    this.allGruposOfertas = [];
    this.mGrupoOfertaFiltro.p.numeroPaginas = 0;
  }

  cancelarConfirmacion() {
    this.showModalConfimacion = false;
  }

  cerrarModal() {
    this.showModal = false;
    this.getAllGruposOfertas();
  }

  cargarGruposOfertasFisrtTime() {
    this.inicializarPaginado();
    this.getAllGruposOfertas();
  }

  inicializarPaginado() {
    this.mGrupoOfertaFiltro.p.paginaActual = 1;
    this.mGrupoOfertaFiltro.p.numeroPaginas = 0;
    this.mGrupoOfertaFiltro.p.filasPorPagina = 10;
    this.mGrupoOfertaFiltro.p.totalItems = 10;
    this.mGrupoOfertaFiltro.p.listPaginas = [];
    this.mGrupoOfertaFiltro.p.totalItems = 0;
  }
  paginacionClick(pagina: number) {
    let invoke = false;
    switch (pagina) {
      case -1:
        if (this.mGrupoOfertaFiltro.p.paginaActual > 1) {
          this.mGrupoOfertaFiltro.p.paginaActual = this.mGrupoOfertaFiltro.p.paginaActual - 1;
          invoke = true;
        }
        break;
      case 0:
        if (this.mGrupoOfertaFiltro.p.paginaActual < this.mGrupoOfertaFiltro.p.numeroPaginas) {
          this.mGrupoOfertaFiltro.p.paginaActual = this.mGrupoOfertaFiltro.p.paginaActual + 1;
          invoke = true;
        }
        break;
      default:
        this.mGrupoOfertaFiltro.p.paginaActual = pagina;
        invoke = true;
        break;
    }
    if (invoke)
      this.getAllGruposOfertas();
  }

  setClassActive(pagina: number) {
    let clase = "";
    if (pagina == this.mGrupoOfertaFiltro.p.paginaActual)
      clase = "page-item active";

    return clase;
  }

  headerClickGO(ordenadoPor: string) {
    this.mGrupoOfertaFiltro.orderByGO = ordenadoPor;
    this.mGrupoOfertaFiltro.orderDirectionGO = this.mGrupoOfertaFiltro.orderDirectionGO == 1 ? 0 : 1;
    this.cargarGruposOfertasFisrtTime();
  }

  setClassHeaderOrder() {
    let clase = "";
    if (this.mGrupoOfertaFiltro.orderDirectionGO == 1)
      clase = "assets/arrow-up.jpg";
    else
      clase = "assets/arrow-down.jpg";
    return clase;
  }

  ngOnDestroy() {
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  mostrarMensajeEliminar(content, id: number) {


    this.loading = true;
    this.idGrupoOfertaSeleccionado = id;

    this.grupoOfertasService.validarGrupoOferta(this.idGrupoOfertaSeleccionado)
      .subscribe(
        respuesta => {
          this.loading = false;
          if (respuesta == true) {
            this.resul = "El grupo de oferta no puede ser eliminado ya que forma parte de una promoción.";
            this.ocultarBtn = false;
            this.nameBtn = "Aceptar";
            this.modalService.open(content, { centered: true, size: 'sm' });
          }
          else {
            this.resul = "Se va a eliminar el grupo de oferta seleccionado, ¿está seguro?";
            this.nameBtn = "Cancelar";
            this.ocultarBtn = true;
            this.modalService.open(content, { centered: true, size: 'sm' });
          }
          console.log(respuesta);
        },
        errorCode => {
          this.statusCode = errorCode;
        }
      );

  }


  eliminarGrupoOferta(id: number) {
    this.showModalConfimacion = false;
    this.loading = true;
    this.grupoOfertasService.delete(id)
      .subscribe(
        grupoOferta => {
          this.loading = false;
          if (grupoOferta == 1) {
            this.resul = "El grupo de oferta se ha eliminado correctamente.";
            this.ocultarBtn = false;
            this.nameBtn = "Aceptar";
            this.getAllGruposOfertas();
          }
          else if (grupoOferta == 2) {
            this.resul = "El grupo de oferta no puede ser eliminado ya que forma parte de una promoción.";
            this.ocultarBtn = false;
            this.nameBtn = "Aceptar";
          }
          else if (grupoOferta == 0) {
            this.resul = "Ocurrió un error al eliminar el grupo de ofertas.";
            this.ocultarBtn = false;
            this.nameBtn = "Aceptar";
          }
        },
        errorCode => {
          this.statusCode = errorCode;
        }
      );
  }


}
