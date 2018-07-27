export class DetalleArticulo {
    ID_ARTICULO: number;
    CODIGO: string;
    EAN: string;
    COD_GRUPO: string;
    GRUPO: string;
    COD_SUBFAMILIA: string;
    SUBFAMILIA: string;
    FAMILIA: string;
    COD_FAMILIA: string;
    CONSIGNA: boolean;
    MODIF_PVP: boolean;
    MODELO: string;
    CARACTERISTICAS: string;
    LINK_WEB: string;
    OBSERVACIONES: string;

    constructor(id?: number, cod?: string, ean?: string, codgrup?: string, grup?: string, codsub?: string, sub?: string,
        fam?: string, codfam?: string, cons?: boolean, modif?: boolean, mod?: string, carac?: string, link?: string, obs?: string ) {

        this.ID_ARTICULO = id;
        this.CODIGO = cod;
        this.EAN = ean;
        this.COD_GRUPO = codgrup;
        this.GRUPO = grup;
        this.COD_FAMILIA = codsub;
        this.SUBFAMILIA = sub;
        this.FAMILIA = fam;
        this.COD_FAMILIA = codfam;
        this.CONSIGNA = cons;
        this.MODIF_PVP = modif;
        this.MODELO = mod;
        this.CARACTERISTICAS = carac;
        this.LINK_WEB = link;
        this.OBSERVACIONES = obs;
        }


}