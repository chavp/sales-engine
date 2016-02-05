var currentUser = JSON.parse(localStorage.getItem('currentUser'));
$('#txtSearchLead').bind('keypress', function (event) {
    if (event.keyCode === 13) {
        var term = $(this).val();
        location.href = "#/leads/" + term;
    }
});

$(document).ready(function () {
    //console.log(currentUser);
    //var sv = currentUser.Organizations[0].Orgnization.SmartViews;
    //for (var i = 0 ; i < sv.length; i++) {
    //    $('#ulSmartViews').append('<li>\
    //                                <a href="#/leads/'+ sv[i].Query + '" class="smart-view pointer">' + sv[i].Name + '<span class="glyphicon glyphicon-cog pull-right" data-toggle="modal" data-target="#smartView"></span></a>\
    //                           </li>');
    //}
    var url = window.location.href;
    $('ul.secondLevelMenu > li:first').find('a:first').addClass('activeTxt');

    if (url.indexOf("reports/activity") > -1) {
        expandMenu(4);
        innerMenuChoice(1);
    }
    else if (url.indexOf("reports/statuschanges") > -1) {
        expandMenu(4);
        innerMenuChoice(2);
    }
    else if (url.indexOf("reports/explorer") > -1) {
        expandMenu(4);
        innerMenuChoice(3);
    }
    else if (url.indexOf("reports/sentemails") > -1) {
        expandMenu(4);
        innerMenuChoice(4);
    }
    else if (url.indexOf("/opportunities") > -1) {
        expandMenu(2);

    }
    else if (url.indexOf("/leads") > -1) {
        expandMenu(3);

    }
    else if (url.indexOf("/inbox") > -1) {
        expandMenu(1);
        innerMenuChoice(7);
    }
    else {
        $('.txtItem').removeClass('activeTxt');
        $('ul.secondLevelMenu').addClass('hide');
    }
});

function changeMenuActiveLink() {

    if (window.location.href.indexOf("reports/activity") > -1) {
    }
    else if (window.location.href.indexOf("reports/statuschanges") > -1) {
    }
    else if (window.location.href.indexOf("reports/explorer") > -1) {
    }
    else if (window.location.href.indexOf("reports/sentemails") > -1) {
    }
    else if (window.location.href.indexOf("/opportunities") > -1) {
    }
    else if (window.location.href.indexOf("/leads") > -1) {
    }
    else if (window.location.href.indexOf("/inbox") > -1) {
    }
    else {
        $('.txtItem').removeClass('activeTxt');
        $('ul.secondLevelMenu').addClass('hide');
    }
}

function expandMenu(id) {
    $('.txtItem').removeClass('activeTxt');
    $('.menuItemName' + id, $('.routing')).addClass('activeTxt');
    $('ul.secondLevelMenu').addClass('hide');
    if ($('ul.secondLevelMenuOfSelectedItem' + id)[0]) {
        $('ul.secondLevelMenuOfSelectedItem' + id).removeClass('hide');
    }
}

function innerMenuChoice(id) {
    $('ul.secondLevelMenu> li').find('a').removeClass('activeTxt');
    $('#lnkReports' + id).addClass('activeTxt');
    if (id == 0) {
        $('#lnkReports1').addClass('activeTxt');
    }
    if (id == 7) {
        $('#lnkReports8').addClass('activeTxt');
    }
}
