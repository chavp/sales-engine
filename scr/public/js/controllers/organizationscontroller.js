salesHubApp.controller("OrganizationsController", function ($scope,localstorage, Warehouse) {

    var userObject = localstorage.getObject('currentUser');

    $scope.allOrganizations = [];
    $scope.load = function () {
        var id = userObject._id;
        var promise = Warehouse.CallApi('/orgnization?u=' + id, 'GET', false);
        promise.error(function (data) {
            // console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // console.log(data);
            if (data.type == 100) {
                console.log(data.type);
                console.log(data.data);
                $scope.allOrganizations = data.data.Organizations;
                userObject.Organizations = data.data.Organizations;
                localstorage.resetObject('currentUser', userObject);
                console.log(userObject);
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
    $scope.load();
    $scope.leaveOrg = function (org) {
        console.log(org);
        var index = userObject.Organizations.indexOf(org);
        userObject.Organizations.splice(index, 1);
        var obj = {
            id: userObject._id,
            Organizations: userObject.Organizations
        };

        var promise = Warehouse.CallApi('/user/organization', 'PUT', obj, false);
        promise.error(function (data) {
            // console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            console.log(data);
            if (data.type == 100) {
                //$rootScope.orgTitle = org.Orgnization.Title;
                localstorage.resetObject('currentUser', userObject);
                //$scope.Organization = userObject.Organizations[0].Orgnization;
                $scope.load();
                $scope.$apply();
            }
            else {

                if (data.message) {
                    console.log(data.message);
                    console.log(data.type);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        console.log(data.errors[i].message);
                    }
                    console.log(data.type);
                }
            }
        });

    }
    $scope.company = '';
    
    $scope.HMP = [{ value: 'Just Me' },
        { value: '2-5' },
        { value: '6-10' },
        { value: '11-30' },
        { value: '30-99' },
        { value: 'We`re Huge(100+)' }];
    $scope.registerForm = function (form) {
        var checkBox = false;
        angular.forEach($scope.register.$error.required, function (field) {
            field.$setDirty();
        });

        if (form.$valid) {
            
            // create user object
            var objNewOrganization = {
                Title: $scope.company,
                Size: $scope.selector,
                User: userObject._id,
                FirstName: userObject.FirstName,
                LastName: userObject.LastName,
                Phone: userObject.Phone,
                Email:userObject.Email
            };
            var promise = Warehouse.CallApi('/orgnization', 'POST', objNewOrganization, false);
            promise.error(function (data) {
                //console.log(data);
                if (data.readyState) {
                    console.log('connection error');
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                //console.log(data);
                if (data.type == 100) {
                    console.log(data.type);
                    console.log(data.data);
                    $scope.dismiss();
                    $scope.load();
                    $scope.$apply();
                }
                else {

                    if (data.message) {
                        console.log(data.message);
                        $scope.$apply();
                    }
                    else {
                        for (var i = 0; i < data.errors.length; i++) {
                            console.log(data.errors[i].message);
                        }
                        $scope.$apply();
                    }
                }
            });

        }
    }

});

salesHubApp.directive('myModal2', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            scope.dismiss = function () {
                $(element).modal('hide');
            };
        }
    }
});