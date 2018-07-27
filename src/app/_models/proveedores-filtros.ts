export class ProveedoresFiltros {

    texto_busc: string;
    campo_recom: string;
    clas_ceci: boolean;
    clas_cneci: boolean;
    clas_aeci: boolean;
    clas_aneci: boolean;
    clas_local: boolean;
    resp_preprov: boolean;
    resp_prov: boolean;
    resp_fac: boolean;
    resp_dist: boolean;
    e_alta: boolean;
    e_baja: boolean;

    constructor () {
        this.texto_busc = "";
        this.campo_recom = "";
        this.clas_ceci = false;
        this.clas_cneci = false;
        this.clas_aeci = false;
        this.clas_aneci = false;
        this.clas_local = false;
        this.resp_preprov = false;
        this.resp_prov = false;
        this.resp_fac = false;
        this.resp_dist = false;
        this.e_alta = false;
        this.e_baja = false;
    }

}

