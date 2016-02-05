salesHubApp.controller("ForgotController", function ($scope, $rootScope, Warehouse) {
    $scope.load = function () {
        // formForgotDone is a flag (consider global variable)
        // used to show/hide form & hide/show confirmation message
        // this should be reset here every time the page is loaded
        $rootScope.formForgotDone = false;
    };
    $scope.load();
    $scope.text = "forgot page";
    $scope.email = '';
    $scope.submitForgot = function (form) {
        angular.forEach($scope.frmForgot.$error.required, function (field) {
            field.$setDirty();
        });
        if (form.$valid) {
            var emailObj = {
                Email:$scope.email
        }
            var promise = Warehouse.CallApi('/Forgot', 'POST', emailObj, false);
            promise.error(function (data) {
                    console.log(data);
                if (data.readyState) {
                    console.log('connection error');
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                    console.log(data);
                if (data.type == 100) {
                    console.log(data.type);
                    //console.log(data.data);
                    // after save close the edit part
                    $rootScope.formForgotDone = true;
                    $rootScope.$apply();
                }
                else {
                    if (data.message) {
                        //console.log(data.message);
                    }
                    else {
                        for (var i = 0; i < data.errors.length; i++) {
                            //console.log(data.errors[i].message);
                        }
                    }
                }
            });

        }
    }
});
