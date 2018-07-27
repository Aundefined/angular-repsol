//Función para obtener el encabezado de las columnas y que aparezcan en cada celda
(function() {
    var headerText = [],
        headers = document.querySelectorAll("thead"),
        tableBody = document.querySelectorAll("tbody");

    for (var i = 0; i < headers.length; i++) {
        headerText[i] = [];
        for (var j = 0, headrow; headrow = headers[i].rows[0].cells[j]; j++) {
            var current = headrow;
            headerText[i].push(current.textContent.replace(/\r?\n|\r/, ""));
        }
    }

    for (var h = 0, tbody; tbody = tableBody[h]; h++) {
        for (var i = 0, row; row = tbody.rows[i]; i++) {
            for (var j = 0, col; col = row.cells[j]; j++) {
                col.setAttribute("data-th", headerText[h][j]);
            }
        }
    }
}());
// Función en jQuery para alternar la clase active para los radio-box especiales con forma de botón
(function() {
    $(document).ready(function() {
        $('.container').on('click', '.botones-radio-especial-item a', function() {
            var sel = $(this).data('title');
            var tog = $(this).data('toggle');
            $(this).parent().next('.' + tog).prop('value', sel);
            $(this).parent().find('a[data-toggle="' + tog + '"]').not('[data-title="' + sel + '"]').removeClass('active').addClass('notActive');
            $(this).parent().find('a[data-toggle="' + tog + '"][data-title="' + sel + '"]').removeClass('notActive').addClass('active');
        });
    });
}());

// Inicialización de jquery.tablesorter.js script para ordenar la tabla por columna
(function() {
    $(document).ready(function() {
        $("#tablaOrdenable").tablesorter({sortList: [[0,0]], headers: { 1:{sorter: false}, 2:{sorter: false},3:{sorter: false}, 4:{sorter: false}}});
    });
}());
