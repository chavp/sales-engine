salesHubApp.controller("OpportunitiesController", function ($scope, localstorage, $filter, $timeout, Warehouse) {
    $scope.text = "Opportunities page";
    $scope.allOpportunities = [];
    $scope.filteredOpp = [];
    $scope.allStatuses = [];
    $scope.allUsers = [];
    $scope.oppotunitiesCounter = 0;
    $scope.OppCount = 0;
    $scope.totalValue = 0;
    $scope.expectedValue = 0;


    

    var currentUser = localstorage.getObject('currentUser');
    var defOrganization = currentUser.Organizations[0];
    var usersCurrency = defOrganization.Orgnization.DefaultCurrency;
    
    //don't forget to call the load function
    $scope.initUsersList = function () {
        var promise = Warehouse.CallApi('/orgnization/users?org=' + defOrganization.Orgnization._id, 'get', $scope.lead, false);
        promise.error(function (data) {
            // console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // console.log(data);
            if (data.type == 100) {
                $scope.allUsers = data.data;
            }
            else {
                if (data.message) {
                    console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        console.log(data.errors[i].message);
                    }
                }
            }
        });

    };
    $scope.initOppStatusList = function () {
        var promise = Warehouse.CallApi('/orgnization/opprtunitystatus?org=' + defOrganization.Orgnization._id, 'get', $scope.lead, false);
        promise.error(function (data) {
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            if (data.type == 100) {
                $scope.allStatuses = data.data;
            }
            else {
                if (data.message) {
                    console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        console.log(data.errors[i].message);
                    }
                }
            }
        });

    };
    $scope.initOpprtunities = function () {

        
        $timeout(function () {
            if (usersCurrency == "USD" || usersCurrency == "Dollar") {
                $scope.userCurrency = "$";
            }
            else {
                $scope.userCurrency = usersCurrency;
            }
        });


        var promise = Warehouse.CallApi('/orgnization/opprtunities?org=' + defOrganization.Orgnization._id, 'get', $scope.lead, false);
        console.log(defOrganization.Orgnization);

        promise.error(function (data) {
            // console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // console.log(data);
            if (data.type == 100) {
                $scope.allOpportunities = data.data;
                $scope.filteredOpp = data.data;
                console.log(data.data);
                $timeout(function () {
                    $('.table').footable({});
                }, 200);
                $scope.OppCount = data.data.length;
                var totalValue = 0;
                var expectedValue = 0;
                for (var i = 0 ; i < data.data.length; i++) {
                    if (data.data[i].Repetion == 'Monthly') {
                        totalValue += parseFloat(data.data[i].Value) * 12;
                        expectedValue += (parseFloat(data.data[i].Value) * 12 * parseFloat(data.data[i].Confidence) / 100);
                    }
                    else {
                        totalValue += parseFloat(data.data[i].Value);
                        expectedValue += (parseFloat(data.data[i].Value) * parseFloat(data.data[i].Confidence) / 100);
                    }
                }
                $scope.totalValue = totalValue;
                $scope.expectedValue = expectedValue;
                $scope.$apply();
            }
            else {
                if (data.message) {
                    console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        console.log(data.errors[i].message);
                    }
                }
            }
        });

    };
    $scope.load = function () {
        $scope.initUsersList();
        $scope.initOppStatusList();
        $scope.initOpprtunities();
        timeRangePicker();
        
    };
    $scope.order = function (predicate, reverse) {
        $scope.filteredOpp = $filter('orderBy')($scope.allOpportunities, predicate, reverse);
        $timeout(function () {
            $('.table').footable({});
        });
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.filterStatus = function (_status) {
        var expression = { Title: _status.Title };
        $scope.filteredOpp = $filter('filter')($scope.allOpportunities, expression.Title, false)
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.filterUser = function (_status) {
        var expression = { AssignedToLabel: _status.Title };
        $scope.filteredOpp = $filter('filter')($scope.allOpportunities, expression.AssignedToLabel, false)
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    /////////////////////////////////////////////////////////////// group by
    $scope.groupedOpp = [];

    $scope.gropingByTxt = "None";

    function cleanCheckBox() {
        $("#checkWeek").prop("checked", false);
        $("#checkMonth").prop("checked", false);
        $("#checkQuarter").prop("checked", false);
        $("#checkYear").prop("checked", false);
        $("#checkUser").prop("checked", false);
        $("#checkNone").prop("checked", false);
    }

    $scope.groupByWeek = function () {
        cleanCheckBox();
        $("#checkWeek").prop("checked", true);
        $scope.gropingByTxt = "Week";
        var singleArray = [];
        var totalValue = 0;
        var expectedValue = 0;
        for (var i = 0; i < $scope.filteredOpp.length; i++) {
            var weekDate = "Week of " + moment($scope.filteredOpp[i].EstimateDate).startOf('week').format('ll') + "-" + moment($scope.filteredOpp[i].EstimateDate).endOf('week').format('ll');
            singleArray.push({ "week": weekDate, "data": [$scope.filteredOpp[i]] });
        }
        $timeout(function () {
            console.log(singleArray);
            function groupBy(array, f) {
                var groups = {};
                array.forEach(function (o) {
                    var group = JSON.stringify(f(o));
                    groups[group] = groups[group] || [];
                    groups[group].push(o);
                });
                return Object.keys(groups).map(function (group) {
                    return groups[group];
                });
            }
            var result = groupBy(singleArray, function (item) {
                return [item.week];
            });
            console.log(result);
            $scope.groupedOpp = result;
        });
    }

    $scope.groupByMonth = function () {
        cleanCheckBox();
        $("#checkMonth").prop("checked", true);
        $scope.gropingByTxt = "Month";
        var singleArray = [];
        var totalValue = 0;
        var expectedValue = 0;
        for (var i = 0; i < $scope.filteredOpp.length; i++) {
            var weekDate =  moment($scope.filteredOpp[i].EstimateDate).startOf('month').format('ll') + "-" + moment($scope.filteredOpp[i].EstimateDate).endOf('month').format('ll');
            singleArray.push({ "week": weekDate, "data": [$scope.filteredOpp[i]] });
        }
        $timeout(function () {
            console.log(singleArray);
            function groupBy(array, f) {
                var groups = {};
                array.forEach(function (o) {
                    var group = JSON.stringify(f(o));
                    groups[group] = groups[group] || [];
                    groups[group].push(o);
                });
                return Object.keys(groups).map(function (group) {
                    return groups[group];
                });
            }
            var result = groupBy(singleArray, function (item) {
                return [item.week];
            });
            console.log(result);
            $scope.groupedOpp = result;
        });
    }

    $scope.groupByQuarter = function () {
        cleanCheckBox();
        $("#checkQuarter").prop("checked", true);
        $scope.gropingByTxt = "Quarter";
        var singleArray = [];
        var totalValue = 0;
        var expectedValue = 0;
        for (var i = 0; i < $scope.filteredOpp.length; i++) {
            var weekDate = moment($scope.filteredOpp[i].EstimateDate).startOf('quarter').format('ll') + "-" + moment($scope.filteredOpp[i].EstimateDate).endOf('quarter').format('ll');
            singleArray.push({ "week": weekDate, "data": [$scope.filteredOpp[i]] });
        }
        $timeout(function () {
            console.log(singleArray);
            function groupBy(array, f) {
                var groups = {};
                array.forEach(function (o) {
                    var group = JSON.stringify(f(o));
                    groups[group] = groups[group] || [];
                    groups[group].push(o);
                });
                return Object.keys(groups).map(function (group) {
                    return groups[group];
                });
            }
            var result = groupBy(singleArray, function (item) {
                return [item.week];
            });
            console.log(result);
            $scope.groupedOpp = result;
        });
    }

    $scope.groupByYear = function () {
        cleanCheckBox();
        $("#checkYear").prop("checked", true);
        $scope.gropingByTxt = "Year";
        var singleArray = [];
        var totalValue = 0;
        var expectedValue = 0;
        for (var i = 0; i < $scope.filteredOpp.length; i++) {
            var weekDate = moment($scope.filteredOpp[i].EstimateDate).startOf('year').format('ll') + "-" + moment($scope.filteredOpp[i].EstimateDate).endOf('year').format('ll');
            singleArray.push({ "week": weekDate, "data": [$scope.filteredOpp[i]] });
        }
        $timeout(function () {
            console.log(singleArray);
            function groupBy(array, f) {
                var groups = {};
                array.forEach(function (o) {
                    var group = JSON.stringify(f(o));
                    groups[group] = groups[group] || [];
                    groups[group].push(o);
                });
                return Object.keys(groups).map(function (group) {
                    return groups[group];
                });
            }
            var result = groupBy(singleArray, function (item) {
                return [item.week];
            });
            console.log(result);
            $scope.groupedOpp = result;
        });
    }

    $scope.groupByUser = function () {
        cleanCheckBox();
        $("#checkUser").prop("checked", true);
        $scope.gropingByTxt = "User";
        var singleArray = [];
        var totalValue = 0;
        var expectedValue = 0;
        for (var i = 0; i < $scope.filteredOpp.length; i++) {
            var weekDate = "User : "+ $scope.filteredOpp[i].AssignedToLabel;
            singleArray.push({ "week": weekDate, "data": [$scope.filteredOpp[i]] });
        }
        $timeout(function () {
            console.log(singleArray);
            function groupBy(array, f) {
                var groups = {};
                array.forEach(function (o) {
                    var group = JSON.stringify(f(o));
                    groups[group] = groups[group] || [];
                    groups[group].push(o);
                });
                return Object.keys(groups).map(function (group) {
                    return groups[group];
                });
            }
            var result = groupBy(singleArray, function (item) {
                return [item.week];
            });
            console.log(result);
            $scope.groupedOpp = result;
        });
    }

    $scope.groupByNone = function () {
        cleanCheckBox();
        $("#checkNone").prop("checked", true);
        $scope.gropingByTxt = "None";
        $scope.groupedOpp = [];
    }

    $scope.initiateGroupedOpp = function (index) {
        var totalValue = 0;
        var expectedValue = 0;
        for (var j = 0; j < $scope.groupedOpp.length; j++) {
            if (index == j) {
                for (var k = 0; k < $scope.groupedOpp[index].length; k++) {
                    if ($scope.groupedOpp[index][k].data[0].Repetion == 'Monthly') {
                        totalValue += parseFloat($scope.groupedOpp[index][k].data[0].Value) * 12;
                        expectedValue += (parseFloat($scope.groupedOpp[index][k].data[0].Value) * 12 * parseFloat($scope.groupedOpp[index][k].data[0].Confidence) / 100);
                    }
                    else {
                        totalValue += parseFloat($scope.groupedOpp[index][k].data[0].Value);
                        expectedValue += (parseFloat($scope.groupedOpp[index][k].data[0].Value) * parseFloat($scope.groupedOpp[index][k].data[0].Confidence) / 100);
                    }
                }
            }
        }
        $timeout(function () {
            $('#totalValueGrouped' + index).text(totalValue);
            $('#expectedValueGroued' + index).text(expectedValue);
            totalValue = 0;
            expectedValue = 0;
            $timeout(function () {
                $('.table').footable({});
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
                $('.table').footable({});
            });
        });
    }

    /////////////////////////////////////////////////////////////// 

    $scope.order('Value', true);
    $scope.load();
    $scope.toCSV = function () {
        var _array = $scope.allOpportunities;
        var csvContent = '';
        _array.forEach(function (infoArray, index) {
            var dataString = '';
            for (var property in infoArray) {
                if (infoArray.hasOwnProperty(property)) {
                    dataString += infoArray[property] + ","
                }
            }
            csvContent += dataString + "\n";
        });
        var uri = 'data:data:application/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csvContent);
        var downloadLink = document.createElement("a");
        downloadLink.href = uri;
        downloadLink.download = "data.csv";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        console.log(uri);
        document.body.removeChild(downloadLink);
    }
    $scope.toJSON = function () {
        var _array = $scope.allOpportunities;
        var csvContent = JSON.stringify(_array);
        var uri = 'data:data:application/json;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csvContent);
        var downloadLink = document.createElement("a");
        downloadLink.href = uri;
        downloadLink.download = "data.json";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        console.log(uri);
        document.body.removeChild(downloadLink);
    }

    function timeRangePicker() {
        // do your $() stuff here
        function cb(start, end, rangeName) {
            if (rangeName == "Custom Range") {
                $('#rangeFilter span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY')); // show range instead of range name
                alert(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            }
            else {
                $('#rangeFilter span').html(rangeName); // show range name
                alert(rangeName);
                alert(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            }
        }

        ////for default date
        //cb(moment().subtract(29, 'days'), moment(), "default date this month");

        $('#rangeFilter').daterangepicker({
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
        $('.daterangepicker').removeClass('activityDateRangePicker');
        $('.daterangepicker').addClass('opportunitiesDateRangePicker');
    }

    //$('.sort-column').click(function (e) {
    //    e.preventDefault();

    //    //get the footable sort object
    //    var footableSort = $('table').data('footable-sort');

    //    //get the index we are wanting to sort by
    //    var index = $(this).data('index');

    //    //get the sort order
    //    var ascending = $(this).data('ascending');

    //    footableSort.doSort(index, ascending);
    //});

    $scope.test = function () {
        //get the footable sort object
        var footableSort = $('.footable').data('footable-sort');

        //get the index we are wanting to sort by
        var index = $(this).data(4);

        //get the sort order
        var ascending = $(this).data('ascending');

        footableSort.doSort(index, ascending);
    }
});