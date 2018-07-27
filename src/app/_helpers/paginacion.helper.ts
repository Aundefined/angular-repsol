import { Injectable } from '@angular/core';
import { Paginacion } from "../_models/util/paginacion";

@Injectable()
export class PaginacionHelper
{
    public calcularPaginacion(p : Paginacion): Paginacion {

          let paginaInicialNueva = 0;
          if (p.paginaActual == 1 || p.numeroPaginas < 6)
            paginaInicialNueva = 1;
          else if (p.paginaActual == p.numeroPaginas)
            paginaInicialNueva = p.numeroPaginas - 4;
          else
            paginaInicialNueva = p.listPaginas.length > 0 ? p.listPaginas[0] : 1;
    
          let indiceSeleccionado = 0;
          if (p.paginaActual > 1 && p.paginaActual != p.numeroPaginas) {
            p.listPaginas.forEach((element, i) => {
              if (element == p.paginaActual)
                indiceSeleccionado = i;
            });
            switch (indiceSeleccionado) {
              case 0:
                if (p.paginaActual == 1 || p.paginaActual == 2)
                  paginaInicialNueva = 1;
                else
                  paginaInicialNueva = paginaInicialNueva - 2;
                break;
              case 1:
                if (p.paginaActual == 2)
                  paginaInicialNueva = 1;
                else
                  paginaInicialNueva = paginaInicialNueva - 1;
                break;
              case 2:
                if (p.paginaActual == 3)
                  paginaInicialNueva = 1;
                else
                  paginaInicialNueva = paginaInicialNueva;
                break;
              case 3:
                if (p.paginaActual == p.numeroPaginas - 1)
                  paginaInicialNueva = p.numeroPaginas - 4;
                else
                  paginaInicialNueva = paginaInicialNueva + 1;
                break;
              case 4:
                if (p.paginaActual == p.numeroPaginas)
                  paginaInicialNueva = p.numeroPaginas - 4;
                else if(p.paginaActual == p.numeroPaginas - 1)
                  paginaInicialNueva = paginaInicialNueva + 1;
                else
                  paginaInicialNueva = paginaInicialNueva + 2;
                break;
              default:
                break;
            }
          }
    
          p.listPaginas = [];
          //p.totalItemsGO = p.data.length > 0 ? p.data[0].totalFilas : 0;
          if (p.totalItems % p.filasPorPagina == 0) {
            p.numeroPaginas = parseInt((p.totalItems / p.filasPorPagina).toString());
          }
          else {
            p.numeroPaginas = parseInt((p.totalItems / p.filasPorPagina).toString()) + 1;
          }
          if (p.numeroPaginas >= 5) {
            for (let index = 0; index < 5; index++) {
              p.listPaginas.push(paginaInicialNueva + index);
            }
          }
          else {
            for (let index = 0; index < p.numeroPaginas; index++) {
              p.listPaginas.push(paginaInicialNueva + index);
            }
          }

        return p;
      }
}