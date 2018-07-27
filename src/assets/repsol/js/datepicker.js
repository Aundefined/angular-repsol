(function() {
    $(document).ready(function() {

		$( ".rps-datepicker .rps-calendar" ).datepicker({
            changeMonth: true,
            changeYear: true,
            showOtherMonths: true,
            selectOtherMonths: true,
            showOn: "button",
            buttonText: "",
            dateFormat: 'dd/mm/yy',
            monthNamesShort: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio", "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
            onSelect: function () {
                $(".rps-datepicker button").removeClass("active");
            }
        });

        $( ".rps-calendar" ).datepicker( $.datepicker.regional[ "es" ] );

        $(".rps-datepicker button").click(function () {

            var input = $(this).offset();
            var calendarTop = parseInt($(".ui-datepicker").css("top"));
            var classButton = $(this).attr("class");

            if(classButton.indexOf("active") > -1){
                $(this).removeClass("active")
            }else{
                $(this).addClass("active")
            }

            if(input.top > calendarTop){
                $(".ui-datepicker").addClass("calendar-top")
            }else{
                $(".ui-datepicker").removeClass("calendar-top")
            }

            $(document).click(function () {
                $(".rps-datepicker button").removeClass("active");
            })

        })

    });
}());
