import { Input, ViewChild, ElementRef, Component, OnInit, HostListener } from '@angular/core';
import { ArticulosService } from '../_services/articulos.service';
import { ReturnArticulo } from '../_models/index';
import { timeout } from 'rxjs/operator/timeout';
import { FiltrosArticulo } from '../_models/filtrosArticulo';
import { LoadingService } from '../_services/loading.service';
declare var jQuery: any;

/* import * as FriendCard from './../pages/FriendCard'; */
/* import { timer} */

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css']
})

export class ArticulosComponent implements OnInit {

  timer: any =
  {
    search:
    {
      id: null,
      ms: 200
    },
    result:
    {
      id: null,
      ms: 200
    }
  };
  articulosFijos: ReturnArticulo[] = [];
  articulos: ReturnArticulo[] = [];
  sugerencias: ReturnArticulo[] = [];
  filtros = new FiltrosArticulo();
  hideSugerencias = true;

  filtrosCatalogacion = [];
  filtrosFamilia = [];
  filtrosAlmacenaje = [];
  filtrosCaracterizacion = [];
  filtrosEstados = [];

  strFiltrosCatalogacion = "";
  strFiltrosFamilias = "";
  strFiltrosAlmacenaje = "";
  strFiltrosCaracterizacion = "";
  strFiltrosEstados = "";  

  strFiltroFechaInicio= "";
  strFiltroFechaFin= "";

  filtroOculto = false;
  hayFiltros = false;
  modoFila = false;
  modoCuadricula = true;

  listaEstados = [];

  /* hola: any = 'IN'; */
 /*  timer:var; */
  loading = false;
  total = 0;
  page = 1;
  limit = 8;

  constructor(private articulosService: ArticulosService, private loadingService: LoadingService) {
    /* this.search(this.hola); */
    this.loadingService.showLoading(false);
  }

  ngOnInit() {
    this.loadingService.showLoading(false);
    this.articulosService.getFiltros()
      .subscribe(
        data => {
          this.filtros = data;

          let primero = '0';
          let newFiltros = [];

          for (let i in this.filtros.listaCategorias){
            if (this.filtros.listaCategorias[i].ID_CATEGORIA != primero) {
                newFiltros.push(this.filtros.listaCategorias[i]);
            }
            primero = this.filtros.listaCategorias[i].ID_CATEGORIA;
          }
          this.filtros.listaCategorias = newFiltros;
          console.log(newFiltros);
        });
        
        this.getArticulos();

        this.listaEstados = [
          // {valor: 'alta', nombre: 'Alta'},
          {valor: 'bloqCompra', nombre: 'Bloqueado a la compra'},
          {valor: 'bloqVenta', nombre: 'Bloqueado a la venta'},
          {valor: 'baja', nombre: 'Baja'}];

        this.documentReadyDatePicker();
  }

  documentReadyDatePicker() {
    let funs = this;
    jQuery(document).ready(function () {
      jQuery(".rps-datepicker .rps-calendar").datepicker("destroy");
      jQuery(".rps-datepicker .rps-calendar").datepicker({
          changeMonth: true,
          changeYear: true,
          showOtherMonths: true,
          selectOtherMonths: true,
          showOn: "button",
          buttonText: "",
          dateFormat: 'dd/mm/yy',
          monthNamesShort: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio", "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
          onSelect: function () {
            funs.search({value: jQuery('#txtBusqueda').val()}, 'ARTICULOS');
          }
      });
    });
  }

  listarArticulos() {
    this.articulosService.getAll()
    .subscribe(
      data => {
        this.articulos = data.Result;
        this.articulosFijos = this.articulos;
        this.loadingService.showLoading(false);
    });
    
    this.getArticulos();
    console.log(document.documentElement.clientWidth);
    console.log(document.getElementsByTagName('body')[0].clientWidth);
  }

  getArticulos(){
    this.loading = true;
    this.articulosService.getAll()
    .subscribe(
      data => {
        this.articulosFijos = data.Result;
        this.articulos = this.articulosFijos;
        this.total = this.articulos.length - 1;
        this.loading = false;
        this.loadingService.showLoading(false);
        this.getArticulosPagina(this.page);
      });
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    event.target.innerWidth;
    this.getArticulosPagina(this.page);
  }
  
  getArticulosPagina(page){
    this.loading = true;
    if(document.documentElement.clientWidth < 992){
      this.limit = 4;
    }
    else if(document.documentElement.clientWidth < 1200){
      this.limit = 6;
    }
    else if(document.documentElement.clientWidth < 1556){
      this.limit = 8;
    }
    else if(document.documentElement.clientWidth < 2560){
      this.limit = 10;
    }
    var limit = this.limit * page;
    var inicio = limit - this.limit;
    if (page == 1){
        this.articulos = this.articulosFijos.slice(0,limit);
        this.loading = false;
    } else {
        this.articulos = this.articulosFijos.slice(inicio,limit);
        this.loading = false;
    }
  }

  goToPage(n: number): void {
    this.page = n;
    this.getArticulosPagina(this.page);
  }

  onNext(): void {
    this.page++;
    this.getArticulosPagina(this.page);
  }

  onPrev(): void {
    this.page--;
    this.getArticulosPagina(this.page);
  } 

  catalogoCuadricula() {
    this.modoFila = false;
    this.modoCuadricula = true;
  }

  catalogoFila() {
    this.modoFila = true;
    this.modoCuadricula = false;
  }

  limpiarFiltros() {
    this.filtrosCatalogacion = [];
    this.filtrosFamilia = [];
    this.filtrosAlmacenaje = [];
    this.filtrosCaracterizacion = [];
    this.filtrosEstados = [];

    this.strFiltrosCatalogacion = "";
    this.strFiltrosFamilias = "";
    this.strFiltrosAlmacenaje = "";
    this.strFiltrosCaracterizacion = "";
    this.strFiltrosEstados = "";

    this.loadingService.showLoading(true);
    jQuery('.filtro').prop('checked', false);
    this.listarArticulos();
  }

  ocultarFiltros() {
    this.filtroOculto = true;
    jQuery('.filtros').css(
      {
        'left': '-20%',
      }
    );
    
    jQuery('.pestana-filtros').css(
      {
        'visibility': 'visible',
        'opacity': '1',
      }
    );
  }

  mostrarFiltros() {
    this.filtroOculto = false;
    jQuery('.pestana-filtros').css(
      {
        'visibility': 'hidden',
        'opacity': '0',
      }
    );
    jQuery('.filtros').css(
      {
        'left': '0',
      }
    );
    
  }

  searchSugerencia(e){
    this.hideSugerencias = false;
    var buscarSugerencia: any = e.target.value;
    console.log(buscarSugerencia);
    clearTimeout(this.timer.search.id);
    this.timer.search.id = setTimeout(() => {

      this.sugerencias = this.filtrarPorNombre(buscarSugerencia).splice(0,8);
      console.log(this.sugerencias);

    },this.timer.search.ms);
  };

  filtrarPorNombre(obj){
    console.log(obj);
    return this.sugerencias = this.articulosFijos.filter((el) => {
      if (el.NOMBRE_ARTICULO != null && el.NOMBRE_ARTICULO != undefined) {
        el.NOMBRE_ARTICULO = el.NOMBRE_ARTICULO.toLocaleUpperCase();
        return el.NOMBRE_ARTICULO.includes(obj.toLocaleUpperCase());
      }
    });
  }

  search(buscar, buscaren) {
    this.loadingService.showLoading(true);
    if (this.hayFiltros) {
      this.setFiltros(buscaren, 'tipoBusqueda');
    } else {
      var buscar: any = buscar.value;

      if (buscaren == undefined) {
        buscaren = "ARTICULOS";
        console.log(buscaren);
      }
      clearTimeout(this.timer.search.id);
      this.timer.search.id = setTimeout(() => {
        this.articulosService.getBySearch(buscar, buscaren, '')
        .subscribe(
          data => {
            /*Puede que haya que vaciar primero el array si no se sobreescribe*/
            this.articulos = data.Result;
            this.loadingService.showLoading(false);
          },
          error => {
            this.loadingService.showLoading(false);
            console.log(error);
          }
        );
      }, this.timer.search.ms);
    }
  }

  hideResults(buscar) {
    clearTimeout(this.timer.result.id);
    this.timer.result.id = setTimeout(() => {
      this.hideSugerencias = true;
    }, this.timer.result.ms);
  }

  confirmSearch(inputBusqueda, busqueda) {
    inputBusqueda.value = busqueda;
    this.search(inputBusqueda, undefined);
  }

  logger(text) {
    console.log(text);
  }

  setFiltroParent(categorias, tipoFiltro) {
    // Se establece un filtro por cada familia que existe en la categoria seleccionada
    for (let i=0;i<categorias.length;i++) {
      $('#'+categorias[i].CODIGO_REPSOL).prop('checked', true);
      for (let j=0;j<categorias[i].familias.length;j++) {
        //this.logger("ID FAMILIA: "+categorias[i].familias[j].ID_FAMILIAS);
        this.setFiltros(categorias[i].familias[j].ID_FAMILIAS, tipoFiltro);
        $('#fam'+categorias[i].familias[j].ID_FAMILIAS).prop('checked', true);
      }
    }
    this.listarArticulos();
  }

  checkChilds(cod_padre, id, tipoFiltro) {
    // Se comprueba si estan seleccionados todos los hijos o no
    let todosHijosChecked = true;
    let arrayVariable:boolean[] = [];
    $("input[data-id-padre='"+cod_padre+"']").each(function (i) {arrayVariable[i]=$(this).prop("checked");});
    for (let i=0; i<arrayVariable.length;i++) if (arrayVariable[i] == false) todosHijosChecked = false;
    //console.log(arrayVariable);

    if (todosHijosChecked) {  // Si estan todos los hijos marcados se marca el padre tambien
      $('#'+cod_padre).prop('checked', true);
    }
    else {  // Si no estan todos marcados se desmarca el padre
      $('#'+cod_padre).prop('checked', false);
    }
    this.setFiltros(id, tipoFiltro);  // Se aplica el filtro
  }

  checkFamilias(cod_padre, id, tipoFiltro){
    debugger;
    if ($("#"+id).is(":checked")){
      $("input[data-id-padre='"+id+"']").prop("checked", true);
      $("input[data-id-padre='"+id+"']").trigger('change');
      let  todosHermanosChecked  = true;
      let arrayVariable:boolean[] = [];
      $("input[data-id-padre='"+cod_padre+"']").each(function (i) {arrayVariable[i]=$(this).prop("checked");});
      for (let i=0; i<arrayVariable.length;i++) if (arrayVariable[i] == false) todosHermanosChecked = false; 
  
      if (arrayVariable.length > 0) {
        if(todosHermanosChecked){
          $("#"+cod_padre+"").prop("checked", true);
          $("#"+cod_padre+"").trigger('change');
        }
        else {
          $("#"+cod_padre+"").prop("checked", false);
          $("#"+cod_padre+"").trigger('change');
        }
      }
    }
    else {
      $("input[data-id-padre='"+id+"']").prop("checked", false);
      $("input[data-id-padre='"+id+"']").trigger('change');
      let  todosHermanosChecked  = true;
      let arrayVariable:boolean[] = [];
      $("input[data-id-padre='"+cod_padre+"']").each(function (i) {arrayVariable[i]=$(this).prop("checked");});
      for (let i=0; i<arrayVariable.length;i++) if (arrayVariable[i] == false) todosHermanosChecked = false; 

      if(!todosHermanosChecked){
        $("#"+cod_padre+"").prop("checked", false);
        $("#"+cod_padre+"").trigger('change');
      }
      else {
        $("#"+cod_padre+"").prop("checked", true);
        $("#"+cod_padre+"").trigger('change');
      }
    }
    this.setFiltros(id, tipoFiltro);  // Se aplica el filtro
  }

  setFiltroChild(familiaPadre, tipoFiltro) {
    for (let i=0;i<familiaPadre.familias.length;i++) {
      this.setFiltros(familiaPadre.familias[i].ID_FAMILIAS, tipoFiltro);
      //$('#fam'+familiaPadre.familias[i].ID_FAMILIAS).prop('checked', true);
    }
    this.listarArticulos();
  }

  setFiltros(id, tipoFiltro) {
    this.loadingService.showLoading(true);
    let filtrosTotales = [];
    let strFiltrosTotales = "";
    this.hayFiltros = false;
    let buscaren = 'FILTROS';

    switch (tipoFiltro) {
      case 'tipoCatalogacion':
        let index = this.filtrosCatalogacion.indexOf(id);
        if (index != -1) {
          this.filtrosCatalogacion.splice(index,1);
        }
        else {
          this.filtrosCatalogacion.push(id);
        }
        this.strFiltrosCatalogacion = this.filtrosCatalogacion.join(',');
        break;
      case 'tipoFamilia':
        let index2 = this.filtrosFamilia.indexOf(id);
        if (index2 != -1) {
          this.filtrosFamilia.splice(index2,1);
        }
        else {
          this.filtrosFamilia.push(id);
        }
        this.strFiltrosFamilias = this.filtrosFamilia.join(',');
        break;
      case 'tipoAlmacenaje':
        let index3 = this.filtrosAlmacenaje.indexOf(id);
        if (index3 != -1) {
          this.filtrosAlmacenaje.splice(index3,1);
        }
        else {
          this.filtrosAlmacenaje.push(id);
        }
        this.strFiltrosAlmacenaje = this.filtrosAlmacenaje.join(',');
        break;
      case 'tipoCaracterizacion':
        let index4 = this.filtrosCaracterizacion.indexOf(id);
        if (index4 != -1) {
          this.filtrosCaracterizacion.splice(index4,1);
        }
        else {
          this.filtrosCaracterizacion.push(id);
        }
        this.strFiltrosCaracterizacion = this.filtrosCaracterizacion.join(',');
        break;
      case 'tipoEstado':
        let index5 = this.filtrosEstados.indexOf(id);
        if (index5 != -1) {
          this.filtrosEstados.splice(index5,1);
        }
        else {
          this.filtrosEstados.push(id);
        }
        this.strFiltrosEstados = this.filtrosEstados.join(',');
        break;
      case 'tipoBusqueda':
        buscaren = id;
        break;
    }

    filtrosTotales.push(this.strFiltrosCatalogacion);
    filtrosTotales.push(this.strFiltrosFamilias);
    filtrosTotales.push(this.strFiltrosAlmacenaje);
    filtrosTotales.push(this.strFiltrosCaracterizacion);
    filtrosTotales.push(this.strFiltrosEstados);

    let valFechaInicio = jQuery('#calendarioInicio').val();
    let valFechaFin = jQuery('#calendarioFin').val();
    let filtroFecha = [valFechaInicio, valFechaFin];
    filtrosTotales.push(filtroFecha.join(','));

    if (this.strFiltrosCatalogacion !=""  || this.strFiltrosFamilias !=""  ||
      this.strFiltrosAlmacenaje !="" || this.strFiltrosCaracterizacion !="" ||
      this.strFiltrosEstados !="") {
      this.hayFiltros = true;
      strFiltrosTotales = filtrosTotales.join('-');

      this.articulosService.getBySearch(jQuery('#txtBusqueda').val(), buscaren, strFiltrosTotales)
      .subscribe(
        data => {
          this.articulos = data.Result;
          this.loadingService.showLoading(false);
        },
        error => {
          this.loadingService.showLoading(false);
          console.log(error);
        }
      );

    }
    else if (jQuery('#txtBusqueda').val() != "") {
        this.search({value: jQuery('#txtBusqueda').val()}, 'ARTICULOS');
    }
    else {
      this.listarArticulos();
    }

  }

  refresh(): void {
      window.location.reload();
  }

  getProveedorReferencia(item: string): Array<any> {
    return this.articulos.filter((art) => art.REFERENCIA === item );
    // return this.articulos.map(({REFERENCIA}) => REFERENCIA );
  }

  getArticulosSinProveedor(): Array<ReturnArticulo> {
    let articulosProveedor: Array<any> = [];
    let bandera:boolean = false;
    if (this.articulos != undefined) {
      for (let j = 0; j < this.articulos.length; j++) {
        if (articulosProveedor.length === 0) {
              articulosProveedor.push(this.articulos[j]);
            }
        for (let i = 0; i < articulosProveedor.length; i++) {
          if (this.articulos[j].REFERENCIA === articulosProveedor[i].REFERENCIA) {
                  bandera = true;
                } else {
                  bandera = false;
                }
        }
        if (!bandera) {
          articulosProveedor.push(this.articulos[j]);
        }
      }
    }
    return articulosProveedor;
  }
}


