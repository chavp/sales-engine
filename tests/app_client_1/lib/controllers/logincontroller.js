angular.module("salesHubApp")
.controller("LoginController", function ($scope, $routeParams, localstorage, Warehouse) {
    $scope.text = "login page";
    $scope.email = '';
    $scope.password = '';
    $scope.afterLoginError = '';

    $scope.resetPasswordMode = false;
    
    if ($routeParams.invitationURL !== undefined) {
        $scope.userType = $routeParams.type;
        // user Id from URL to get this selected user's data
        $scope.userId = $routeParams.invitationURL.substring(5);
        $scope.resetPasswordMode = true;
    }
            

    $scope.loginForm = function (form) {
        $scope.afterLoginError = '';
        
        angular.forEach($scope.login.$error.required, function (field) {
            field.$setDirty();
        });

        if (form.$valid) {
            // create user object
            var objNewUser = {
                Email: $scope.email,
                Password: $scope.password
            };
            var promise = Warehouse.CallApi('/login', 'POST', objNewUser, false);
            promise.error(function (data) {
                if (data.readyState) {
                    console.log('connection error');
                    //$scope.afterLoginError = 'connection error , please try again later';
                    // $scope.$apply();
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                if (data.type == 100) {
                    console.log(data.type);

                    localstorage.setObject('currentUser', (data.data));

                    console.log(localstorage.getObject('currentUser'));

                    window.location = "/dashboard.html#/inbox";
                }
                else {
                    if (data.message) {
                        console.log(data.message);
                        // show after submit message
                        $scope.afterLoginError = 'Invalid email  or password.';
                        $scope.$apply();
                    }
                    else {
                        for (var i = 0; i < data.errors.length; i++) {
                            $scope.afterLoginError = data.errors[i].message;
                        }
                        $scope.$apply();
                    }

                }
            });
        }
        
        
    }

    $scope.resetForm = function (form) {
        angular.forEach($scope.reset.$error.required, function (field) {
            field.$setDirty();
        });
        if (form.$valid) {
            var objUser = {
                id: $scope.userId,
                newpassword: $scope.password
            };
            var promise = Warehouse.CallApi('/user/reset', 'PUT', objUser, false);
            promise.error(function (data) {
                if (data.readyState) {
                    console.log('connection error');
                    //$scope.afterLoginError = 'connection error , please try again later';
                    // $scope.$apply();
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                if (data.type == 100) {
                    console.log(data.type);
                    window.location = "#/";
                }
                else {
                    if (data.message) {
                        console.log(data.message);
                        // show after submit message
                        $scope.afterLoginError = 'Invalid email  or password.';
                        $scope.$apply();
                    }
                    else {
                        for (var i = 0; i < data.errors.length; i++) {
                            $scope.afterLoginError = data.errors[i].message;
                        }
                        $scope.$apply();
                    }

                }
            });
        }
    }
});

// local storage update 
//var updatedUser = localstorage.getObject('currentUser');
//updatedUser.FirstName = "eeeeee";
//localstorage.resetObject('currentUser', updatedUser);