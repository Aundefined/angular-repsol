import { Component, OnInit } from '@angular/core';
import { SearchService } from '../_services/search.service';
import { Key } from 'protractor';
declare var $;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  listaTabla2: any[];
  keys: any[];
  values: any[] = [];
  values2: any[] = [];
  hola:string;

  constructor(private SearchService: SearchService) { }
  
  ngOnInit() : void {

    /* buscar() { */
    this.SearchService.getAll()
    .subscribe(
      result => {
        this.listaTabla2 = result;
        //console.log(this.listaTabla2);
        this.keys = Object.keys(this.listaTabla2[0]);

        for (let _i:number = 0; _i < this.listaTabla2.length; _i++)
        {
          this.values.push(Object.values(this.listaTabla2[_i]));
          //console.log(Object.values(this.listaTabla2[_i]));
        }
        /* this.values = Object.values(this.listaTabla2[]); */
        console.log(this.values);
      },
      error =>{
        console.log(error);
      }
    )
    /* } */
    
    
    
  }
    

    montarTabla(){
      $('select').niceSelect();
      $('#myTable').DataTable({
        searching: false,
        info: false,
        pageLength: 5,
        lengthChange: false,
        paging: true,
        language: {
          processing:     "Lectura de datos en curso...",
          paginate: {
              previous:   "&laquo;",
              next:       "&raquo;"
              }
          }
      });
      
    }

  /* montarTabla(){
    $(function() {
      $("#myTable").tablesorter();
    });
    $('.rps-pagination-list').twbsPagination({
      totalPages: 20,
      visiblePages: 4,
      prev: '<span aria-hidden="true">&laquo;</span>',
      next: '<span aria-hidden="true">&raquo;</span>',
      first: '',
      last: '',
      onPageClick: function(event, page) {
        console.log(page);
        /* 
        $('#page-content').text('Page ' + page); 
      }
    });
  } */

 /*  pasarPagina(page){
    var final = page * 5;
    for (let _i = final-5; _i <= final; _i++){
      this.values2.push(Object.values(this.listaTabla2[_i]));
      console.log(this.values2);
    }
    return this.values2;

  } */

  MaysPrimera(string)
  {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  
}
