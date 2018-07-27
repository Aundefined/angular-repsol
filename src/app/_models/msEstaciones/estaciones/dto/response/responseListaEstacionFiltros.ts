import { ResponseBase } from "../../../../baseResponseDto/responseBase";
import { EstacionesFiltro } from "../../estacionesFiltro";


export class ResponseListaEstacionFiltros extends ResponseBase
{
    EstacionesFiltro : EstacionesFiltro[];

        constructor()
        {
            super();
            this.EstacionesFiltro = [];
        }
    
}