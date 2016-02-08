//table filteration menu

function toggleFiltrationMenuOpp() {
    if ($('#coulmnFiltrationMenuOpp').hasClass('hide')) {
        $('#coulmnFiltrationMenuOpp').removeClass('hide');
    }
    else {
        $('#coulmnFiltrationMenuOpp').addClass('hide');
    }
}

function applyCoulmnFiltrationOpp() {
   
    $('input[type=checkbox]', $('.opportunitiesCoulmnFiltration')).each(function () {
        if ($(this).is(':checked')) {
            var x = $(this).attr('id');
            var checkedName = x.substr(8);
            $('.thOpp' + checkedName).attr('data-hide', 'phone,tablet');
            $('.thOpp' + checkedName).attr('data-ignore', false);
            $('.thOpp' + checkedName).attr('style', 'display: table-cell;');
            $('.coulmnOpp' + checkedName).attr('style', 'display: table-cell;');
        }
        else {
            var x = $(this).attr('id');
            var UnCheckedName = x.substr(8);
            $('.thOpp' + UnCheckedName).attr('data-hide', 'all');
            $('.thOpp' + UnCheckedName).attr('data-ignore', true);
            $('.thOpp' + UnCheckedName).attr('style', 'display: none;');
            $('.coulmnOpp' + UnCheckedName).attr('style', 'display: none;');
        }
    });

    $('#coulmnFiltrationMenuOpp').addClass('hide');
}