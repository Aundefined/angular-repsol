import { ResponseBase } from "../../../../baseResponseDto/responseBase";
import { Estaciones } from "../../estaciones";
import { CaracterizacionEstaciones } from "../../caracterizacionEstaciones";
import { EstacionCategoriaBase } from "../../estacionCategoriaBase";

export class ResponseEstacion extends ResponseBase
{
    Estaciones : Estaciones;
    CaracterizacionEstaciones : CaracterizacionEstaciones[];
    EstacionCategoriaBase : EstacionCategoriaBase[];

        constructor()
        {
            super();
            this.Estaciones = new Estaciones();
            this.CaracterizacionEstaciones = [];
            this.EstacionCategoriaBase = [];
        }
    
}