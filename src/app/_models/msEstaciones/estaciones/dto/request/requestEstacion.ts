import { Estaciones } from "../../estaciones";
import { CaracterizacionEstaciones } from "../../caracterizacionEstaciones";
import { EstacionCategoriaBase } from "../../estacionCategoriaBase";

export class RequestEstacion
{
    Estaciones : Estaciones;
    CaracterizacionEstaciones : CaracterizacionEstaciones[];
    EstacionCategoriaBase : EstacionCategoriaBase[];

        constructor()
        {
            this.Estaciones = new Estaciones();
            this.CaracterizacionEstaciones = [];
            this.EstacionCategoriaBase = [];
        }
}