(function() {
    $(document).ready(function() {

        $('.rps-header-buscador .icon-close').click(function () {

            $(this).parent().find(".icon-buscar_descriptor_input").val("");
            $(this).removeClass("active")
            return false;

        })

        $(".icon-buscar_descriptor_input").keyup(function () {
            if($(this).val().length > 0){
                $('.rps-header-buscador .icon-close').addClass("active")
            }else{
                $('.rps-header-buscador .icon-close').removeClass("active")
            }
        })
    });
}());
