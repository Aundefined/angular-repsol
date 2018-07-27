export class Utilidades {    
       
   dia:string;
   mes:string; 
   annio:string;
   


    constructor()
    {   
        var d = new Date();      

        if(d.getDate().toString().length == 1){            
            this.dia = "0" + d.getDate().toString();
        }else{
            this.dia = d.getDate().toString();
        }

        if(d.getMonth().toString().length == 1){            
            this.mes = "0" + (d.getMonth()+ 1 ).toString();
        }else{
            this.mes = d.getDate().toString();
        }

        this.annio = d.getFullYear().toString();

    }

    getFecha(){
        return this.dia + "/" + this.mes + "/" + this.annio;
    }
}
