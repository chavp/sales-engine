angular.module("salesHubApp").controller("DashboardController", function ($scope, $window, $filter, $routeParams, $rootScope, Warehouse, localstorage) {
    var userObject = JSON.parse(localStorage.getItem('currentUser'));
    var organizationId = userObject.Organizations[0].Orgnization._id;
    $scope.user = userObject;
    $scope.org = userObject.Organizations[0].Orgnization;
    $scope.sv = userObject.Organizations[0].Orgnization.SmartViews;
    $scope.SmartView = { Name: '', Query: '' };
    $scope.svIndex = 10000;
    // to load inbox counter
    $scope.load = function () {
        var promise = Warehouse.CallApi('/orgnization/inbox?org=' + organizationId, 'GET', false);
        promise.error(function (data) {
            console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            if (data.type == 100) {
                // set initial value of inbox counter
                $rootScope.DashboardInboxCounter = data.data.length;
                // show inbox counter
                $scope.getInboxCounter = function () {
                    return $rootScope.DashboardInboxCounter;
                };
                console.log('Img: '+userObject.Img);
                $rootScope.firstName = userObject.FirstName;
                $rootScope.lastName = userObject.LastName;
                $rootScope.orgTitle = $scope.org.Title;
                $rootScope.Useremail = userObject.Email;
                $rootScope.Userphone = userObject.Phone;
                $rootScope.UserImg = userObject.Img;
                $rootScope.$apply()
            }
            else {
                if (data.message) {
                    console.log(data.message);
                }
                else {
                    if (data.errors) {
                        for (var i = 0; i < data.errors.length; i++) {
                            console.log(data.errors[i].message);
                        }
                    }
                }
            }
        });
    }
    $scope.startSmartViewUpdate = function (_item) {
        $scope.svIndex = _item;
        $scope.SmartView = $scope.sv[_item];
    }
    $scope.updateSmartView = function () {
        var promise = Warehouse.CallApi('/organization', 'PUT', $scope.org, false);
        $('.alert').hide();
        $('#loader').show();
        $('modal').modal('hide');
        promise.error(function (data) {
            // console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            $('#loader').hide();
            if (data.type == 100) {
                console.log(data.data);
                userObject.Organizations[0].Orgnization.SmartViews = $scope.sv;
                localstorage.resetObject('currentUser', userObject);
            }
            else {
                $('.alert').removeClass('alert-success');
                $('.alert').removeClass('alert-warning');
                $('.alert').removeClass('alert-danger');
                $('.alert').addClass('alert-danger');
                $('.alert').html('Something went wrong');
            }
        });
    }
    $scope.removeSmartView = function (SmartView) {
        console.log(SmartView);
        var obj = { org: $scope.org._id, name: $scope.SmartView.Name };
        var promise = Warehouse.CallApi('/smartviews/remove', 'POST', obj, false);
        $('.alert').hide();
        $('#loader').show();
        $('modal').modal('hide');
        promise.error(function (data) {
            // console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            //console.log(data);
            $('#loader').hide();
            if (data.code == "100") {
                //console.log(data.data);
                //console.log(userObject.Organizations[0].Orgnization.SmartViews);

                //userObject.Organizations[0].Orgnization.SmartViews.pop($scope.SmartView);

                var index = userObject.Organizations[0].Orgnization.SmartViews.indexOf(SmartView);
                userObject.Organizations[0].Orgnization.SmartViews.splice(index, 1);

                localstorage.resetObject('currentUser', userObject);
                console.log(userObject);
                $scope.$apply();
            }
            else {
                $('.alert').removeClass('alert-success');
                $('.alert').removeClass('alert-warning');
                $('.alert').removeClass('alert-danger');
                $('.alert').addClass('alert-danger');
                $('.alert').html('Something went wrong');
            }
        });
    }
    $scope.load();
    $scope.logout = function () {
        //$window.localStorage.clear();
        $window.localStorage.removeItem('currentUser');
        $window.location = "/index.html#/";
    }


});