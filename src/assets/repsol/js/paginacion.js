(function() {
    $(document).ready(function() {

        $('.rps-pagination-list').twbsPagination({
            totalPages: 20,
            visiblePages: 5,
            prev: '<span aria-hidden="true">&laquo;</span>',
            next: '<span aria-hidden="true">&raquo;</span>',
            first: '',
            last: '',
            onPageClick: function(event, page) {
                $('#page-content').text('Page ' + page);
            }
        });

        $(".rps-btn-ant").click(function () {
            $(".rps-paginacion .rps-pagination-list .page-item.prev .page-link").trigger("click")
        })

        $(".rps-btn-sig").click(function () {
            $(".rps-paginacion .rps-pagination-list .page-item.next .page-link").trigger("click")
        })
    });
}());
