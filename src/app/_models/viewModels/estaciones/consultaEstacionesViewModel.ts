import { FiltroEstaciones } from "../../filtroEstaciones";
import { ResponseListaProvincias, ResponseListaPaises, ResponseListaEstacionDelegacionArea, 
     ResponseTiposCaracterizacion, ResponseListaSegmento, 
     ResponseCaracterizacion } from "../../index";
import { ResponseListaEstacionFiltros } from "../../msEstaciones/estaciones/dto/response/responseListaEstacionFiltros";

export class ConsultaEstacionesViewModel{

    filtro: FiltroEstaciones;
    rspProvincias:ResponseListaProvincias;
    rspDelegacionArea:ResponseListaEstacionDelegacionArea;
    verMasDelegacionesArea:boolean;
    rspSegmento:ResponseListaSegmento;
    rspEstacionFiltros:ResponseListaEstacionFiltros;
    cantidadDelegacionesAreaShow:number;
    cantidadProvinciasSeleccionadas : number;
    cantidadSegmentosSeleccionadas : number;
    loading : boolean;

    constructor()
    {
        this.filtro = new FiltroEstaciones();
        this.rspProvincias= new ResponseListaProvincias();
        this.rspDelegacionArea = new ResponseListaEstacionDelegacionArea();
        this.rspSegmento = new ResponseListaSegmento();
        this.verMasDelegacionesArea = false;
        this.rspEstacionFiltros = new ResponseListaEstacionFiltros();
        this.loading = false;
        this.cantidadDelegacionesAreaShow = 2;
        this.cantidadProvinciasSeleccionadas = 0;
        this.cantidadSegmentosSeleccionadas = 0;
    }
}