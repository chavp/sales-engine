/*Narrow Menu Part*/
function showSubMenu(id) {
    if ($('#subMenu' + id).hasClass('hide')) {
        $('#subMenu' + id).removeClass('hide');
        $('#subMenu' + id).attr('style', 'display: block');
    } 
}
function hideSubMenu(id) {
    $('#subMenu' + id).addClass('hide');
}


function showNarrowOptions() {
    $('.narrowOptions').removeClass('hide').addClass('nonCollapsedNarrowOptions');
    $('.narrowOptionsTitle').addClass('hide');
    $('#rightMenu').removeClass('narrowMenu');
    $('#buttonsRow').removeClass('col-lg-12 col-md-12 col-sm-12 col-xs-12').addClass('col-lg-9 col-md-9 col-sm-9 col-xs-9');
    $('#tableRow').removeClass('col-lg-12 col-md-12 col-sm-12 col-xs-12').addClass('col-lg-9 col-md-9 col-sm-9 col-xs-9');
    $('#tipsRow').removeClass('col-lg-12 col-md-12 col-sm-12 col-xs-12').addClass('col-lg-9 col-md-9 col-sm-9 col-xs-9');
}
function hideNarrowOptions() {
    $('.narrowOptions').removeClass('nonCollapsedNarrowOptions').addClass('hide');
    $('.narrowOptionsTitle').removeClass('hide');
    $('#rightMenu').addClass('narrowMenu');
    $('#buttonsRow').removeClass('col-lg-9 col-md-9 col-sm-9 col-xs-9').addClass('col-lg-12 col-md-12 col-sm-12 col-xs-12');
    $('#tableRow').removeClass('col-lg-9 col-md-9 col-sm-9 col-xs-9').addClass('col-lg-12 col-md-12 col-sm-12 col-xs-12');
    $('#tipsRow').removeClass('col-lg-9 col-md-9 col-sm-9 col-xs-9').addClass('col-lg-12 col-md-12 col-sm-12 col-xs-12');
}

function showLeadDv() {
    $('#titleLead').addClass('hide');
    $('#dvAllLeads').removeClass('hide');
}
function hideLeadDv() {
    $('#dvAllLeads').addClass('hide');
    $('#titleLead').removeClass('hide');
}
function showMoreLeadOptions() {
    $('#lnkshowMoreLeadOptions').addClass('hide');
    $('#moreLeadOptions').removeClass('hide');
}
function showLessLeadOptions() {
    $('#moreLeadOptions').addClass('hide');
    $('#lnkshowMoreLeadOptions').removeClass('hide');
}


function showCustomFieldsDv() {
    $('#titleCustomFields').addClass('hide');
    $('#dvCustomFields').removeClass('hide');
}
function hideCustomFieldsDv() {
    $('#dvCustomFields').addClass('hide');
    $('#titleCustomFields').removeClass('hide');
}


function showEmailActivityDv() {
    $('#titleEmailActivity').addClass('hide');
    $('#dvEmailActivityDv').removeClass('hide');
}
function hideEmailActivityDv() {
    $('#dvEmailActivityDv').addClass('hide');
    $('#titleEmailActivity').removeClass('hide');
}
function showMoreEmailActivityOptions() {
    $('#lnkshowMoreEmailActivityOptions').addClass('hide');
    $('#moreEmailActivityOptions').removeClass('hide');
}
function showLessEmailActivityOptions() {
    $('#moreEmailActivityOptions').addClass('hide');
    $('#lnkshowMoreEmailActivityOptions').removeClass('hide');
}


function showCallActivityDv() {
    $('#titleCallActivity').addClass('hide');
    $('#dvCallActivityDv').removeClass('hide');
}
function hideCallActivityDv() {
    $('#dvCallActivityDv').addClass('hide');
    $('#titleCallActivity').removeClass('hide');
}
function showMoreCallActivityOptions() {
    $('#lnkshowMoreCallActivityOptions').addClass('hide');
    $('#moreCallActivityOptions').removeClass('hide');
}
function showLessCallActivityOptions() {
    $('#moreCallActivityOptions').addClass('hide');
    $('#lnkshowMoreCallActivityOptions').removeClass('hide');
}


function showCommunicationDv() {
    $('#titleCommunication').addClass('hide');
    $('#dvCommunication').removeClass('hide');
}
function hideCommunicationDv() {
    $('#dvCommunication').addClass('hide');
    $('#titleCommunication').removeClass('hide');
}


function showNotesDv() {
    $('#titleNotes').addClass('hide');
    $('#dvNotes').removeClass('hide');
}
function hideNotesDv() {
    $('#dvNotes').addClass('hide');
    $('#titleNotes').removeClass('hide');
}


function showOpportunitiesDv() {
    $('#titleOpportunities').addClass('hide');
    $('#dvOpportunitiesDv').removeClass('hide');
}
function hideOpportunitiesDv() {
    $('#dvOpportunitiesDv').addClass('hide');
    $('#titleOpportunities').removeClass('hide');
}
function showMoreOpportunitiesOptions() {
    $('#lnkshowMoreOpportunitiesOptions').addClass('hide');
    $('#moreOpportunitiesOptions').removeClass('hide');
}
function showLessOpportunitiesOptions() {
    $('#moreOpportunitiesOptions').addClass('hide');
    $('#lnkshowMoreOpportunitiesOptions').removeClass('hide');
}


function showTasksDv() {
    $('#titleTasks').addClass('hide');
    $('#dvTasks').removeClass('hide');
}
function hideTasksDv() {
    $('#dvTasks').addClass('hide');
    $('#titleTasks').removeClass('hide');
}

//table filteration menu

function toggleFiltrationMenu() {
    if($('#coulmnFiltrationMenu').hasClass('hide')){
        $('#coulmnFiltrationMenu').removeClass('hide');
    }
    else {
        $('#coulmnFiltrationMenu').addClass('hide');
    }
}

function applyCoulmnFiltration() {

    $('input[type=checkbox]', $('.LeadsCoulmnFiltration')).each(function () {
        if ($(this).is(':checked')) {
            var x = $(this).attr('id');
            var checkedName = x.substr(5);
            $('#th' + checkedName).attr('data-hide', 'phone,tablet');
            $('#th' + checkedName).attr('data-ignore', false);
            $('#th' + checkedName).attr('style', 'display: table-cell;');
            $('.coulmn' + checkedName).attr('style', 'display: table-cell;');
        }
        else {
            var x = $(this).attr('id');
            var UnCheckedName = x.substr(5);
            $('#th' + UnCheckedName).attr('data-hide', 'all');
            $('#th' + UnCheckedName).attr('data-ignore', true);
            $('#th' + UnCheckedName).attr('style', 'display: none;');
            $('.coulmn' + UnCheckedName).attr('style', 'display: none;');
        }
    });

    $('#coulmnFiltrationMenu').addClass('hide');
}


/*Edit All Leads Modal*/

function showEditLeadsPreview() {
    $('#editAllLeadsDv').addClass('hide');
    $('#editLeadsPreview').removeClass('hide');
}

function backToEditLeadsDv() {
    $('#editLeadsPreview').addClass('hide');
    $('#editAllLeadsDv').removeClass('hide');
}

function resetEditModel() {
    if ($('#editAllLeadsDv').hasClass('hide')) {
     $('#editLeadsPreview').addClass('hide');
     $('#editAllLeadsDv').removeClass('hide');
    }
    
}

/*Export Modal*/

function showActivitiesCheck() {
    $('#jsonOption').removeClass('hide');
}
function hideActivitiesCheck() {
    $('#jsonOption').addClass('hide');
}