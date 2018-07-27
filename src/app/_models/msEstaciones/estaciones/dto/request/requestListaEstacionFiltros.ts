
export class RequestListaEstacionFiltros 
    {
        Filtro : string;
        Delegacionarea : number[];
        Provincia : number[];
        Segmento : number[];
        Caracterizacion : number[];
        Empresa : number;

        public constructor()
        {
            this.Filtro = "";
            this.Delegacionarea = [];
            this.Provincia = [];
            this.Segmento = [];
            this.Caracterizacion = [];
            this.Empresa = 1;

        }

    }