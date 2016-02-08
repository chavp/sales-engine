angular.module("salesHubApp").controller("InvitationsController", function ($scope, $sce, $filter, $timeout, $routeParams, localstorage, Warehouse) {
    $scope.newUser = {
        Email: $routeParams.email,
        Firstname: '',
        Lastname: '',
        Password: '',
        Phone: '',
        Organization: $routeParams.org
    };
    $scope.accept = function () {
        var promise = Warehouse.CallApi('/invitations/accept', 'post', $scope.newUser, false);
        promise.error(function (data) {
            console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            console.log(data);
            if (data.code == 100) {
                window.location = "/";
            }
            else {
                if (data.data) {
                    console.log(data.data);
                }
                else {
                    console.log(data);
                }
            }
        });
    }
});