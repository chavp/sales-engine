angular.module("salesHubApp").controller("RegisterController",  function ($scope, localstorage, Warehouse) {
    $scope.company = '';
    $scope.firstName = '';
    $scope.lastName = '';
    $scope.email = '';
    $scope.password = '';
    $scope.phone = '';
    $scope.HMP = [{ value: 'Just Me' },
        { value: '2-5' },
        { value: '6-10' },
        { value: '11-30' },
        { value: '30-99' },
        { value: 'We`re Huge(100+)' }];
    $scope.afterRegisterError = '';
    $scope.registerForm = function (form) {
        $scope.afterRegisterError = '';
        var checkBox = false;
        angular.forEach($scope.register.$error.required, function (field) {
            field.$setDirty();
        });
        
        if (form.$valid) {
            if ($scope.checkfree) {
                checkBox = true;
            }
            else {
                checkBox = false;
            }
            // create user object
            var objNewUser = {
                Title: $scope.company,
                FirstName: $scope.firstName,
                LastName: $scope.lastName,
                Email: $scope.email,
                Password: $scope.password,
                Phone: $scope.phone,
                Size: $scope.selector,
                checkforfree: checkBox
            };
            var promise = Warehouse.CallApi('/user', 'POST',objNewUser , false);
            promise.error(function (data) {
                 //console.log(data);
                if (data.readyState) {
                    console.log('connection error');
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                //console.log(data);
                if (data.type == 100)
                {
                    console.log(data.type);

                    localstorage.setObject('currentUser', (data.data));

                    console.log(localstorage.getObject('currentUser'));

                    window.location = "/dashboard.html#/inbox";
                    
                }
                else if (data.type == 1) {
                    console.log(data.type);
                    $scope.afterRegisterError = data.message;
                    $scope.$apply();
                }
                else
                {
                    
                    if (data.message) {
                        console.log(data.message);
                        if (data.message == "Duplicated email") {
                            $scope.afterRegisterError = data.message;
                            $scope.$apply();
                        }
                        
                    }
                    else {
                        for (var i = 0; i < data.errors.length; i++) {
                            console.log(data.errors[i].message);
                            //$scope.afterRegisterError = data.errors[i].message;
                        }
                        $scope.$apply();
                    }
                }
            });

        }
    }
    console.log(22);
    $scope.goLogin = function () {
        window.location = "#/";
    }
});