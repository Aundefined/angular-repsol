(function() {
    $(document).ready(function() {

        $('.input-limit').keypress(function(event) {
            var max = $(this).attr('maxlength');
            var len = $(this).val().length;

            if (event.which < 0x20) {
                // e.which < 0x20, then it's not a printable character
                // e.which === 0 - Not a character
                return; // Do nothing
            }

            if (len >= max) {
                event.preventDefault();
            }

        });

        $('.input-limit').keyup(function(event) {
            var max = $(this).attr('maxlength');
            var len = $(this).val().length;
            var char = max - len;

            $('#cuenta').text('Le quedan ' + char + ' caracteres');

        });

        $('input[type=number]').keydown(function (e) {

            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
                 // Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                 // Ctrl+C
                (e.keyCode == 67 && e.ctrlKey === true) ||
                 // Ctrl+X
                (e.keyCode == 88 && e.ctrlKey === true) ||
                 // home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                     return;
            }
           //Previene cuando no es un número
            if ((e.shiftKey ||
                (e.keyCode < 48 || e.keyCode > 57))         // sea del 0 al 9
                && (e.keyCode < 96 || e.keyCode > 105))     // sea del 0 al 9
            {
                e.preventDefault();
            }

        });

        $('input.calendarForm').keydown(function (e) {

            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
                 // Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                 // Ctrl+C
                (e.keyCode == 67 && e.ctrlKey === true) ||
                 // Ctrl+X
                (e.keyCode == 88 && e.ctrlKey === true) ||

                (e.keyCode == 55 && e.keyCode == 16) ||
                 e.keyCode == 111  ||

                 // home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                     return;
            }
           //Previene cuando no es un número
            if ((e.shiftKey ||
                (e.keyCode < 48 || e.keyCode > 57))         // sea del 0 al 9
                && (e.keyCode < 96 || e.keyCode > 105))      // sea del 0 al 9
            {
                e.preventDefault();
            }

        });

    });
}());
