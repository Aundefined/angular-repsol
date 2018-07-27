export class EstacionDelegacionArea{
    Selected : boolean;
    Id_Delegacion_Area : number;
    Nombre : string;
    Es_Visible : boolean;

    constructor()
    {
        this.Selected = false;
        this.Id_Delegacion_Area = 0;
        this.Nombre = "";
        this.Es_Visible = false;
    }
}