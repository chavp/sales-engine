salesHubApp.controller("ReportexplorerController", function ($scope) {
    $scope.load = function () {
        // do your $() stuff here

        function cb(start, end, rangeName) {
            $('.rangeFilter span').html(rangeName); // show range name
        }
        // for default date

        $('.rangeFilter').daterangepicker({
            ranges: {
                ' Today ': [moment(), moment()],
                ' Yesterday ': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                ' This Week ': [moment().startOf('week'), moment().endOf('week')],
                ' Last Week ': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
                ' This Month ': [moment().startOf('month'), moment().endOf('month'), " This Month "],
                ' Last Month ': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                ' This Quarter ': [moment().startOf('quarter'), moment().endOf('quarter'), " This Quarter "],
                ' Last Quarter ': [moment().subtract(1, 'quarter').startOf('quarter'), moment().subtract(1, 'quarter').endOf('quarter')],
                ' This Year ': [moment().startOf('year'), moment().endOf('year')],
                ' Last Year ': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
                ' All Time ': [moment().subtract(100, 'year').startOf('year'), moment()],
            }
        }, cb);

        // append 2 inputs under ranges to show range on hide the 2 calenders
        $('.ranges').append('<div id="customDateRangePickerInput" class="daterangepicker_input">\
        <div class="has-feedback has-feedback-left">\
            <input class="input-mini form-control" type="text" name="daterangepicker_start" value="">\
            <i class="form-control-feedback fa fa-calendar glyphicon glyphicon-calendar"></i>\
            <div class="calendar-time" style="display: none;">\
            <div></div><i class="form-control-feedback fa fa-clock-o glyphicon glyphicon-time"></i></div>\
        </div>\
        <div class="has-feedback has-feedback-left">\
           <input class="input-mini form-control" type="text" name="daterangepicker_end" value="">\
           <i class="form-control-feedback fa fa-calendar glyphicon glyphicon-calendar"></i>\
           <div class="calendar-time" style="display: none;">\
           <div></div><i class="form-control-feedback fa fa-clock-o glyphicon glyphicon-time"></i></div>\
        </div>\
            </div>');
        // add current page class name & remove any other
        $('.daterangepicker').removeClass('leadprofileDateRangePicker');
        $('.daterangepicker').removeClass('opportunitiesDateRangePicker');
        $('.daterangepicker').addClass('activityDateRangePicker');



        //chart in explorer
        
        var data = {
            labels: ["oct 12", "oct 13", "oct 14", "oct 15", "oct 16", "oct 17", "oct 18"],
            datasets: [

                {
                    label: "My First dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [2, 4, 2, 3, 1, 2, 3]
                }
            ]
        };

        var ctx = document.getElementById("canvas").getContext("2d");
        var myLineChart = new Chart(ctx).Line(data, {
            responsive: true
        });

    };

    //don't forget to call the load function
    $scope.load();

   

});
