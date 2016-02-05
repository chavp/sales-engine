salesHubApp.controller("NewleadController", ['$scope', 'Warehouse', function ($scope, Warehouse) {
    $scope.newLeadCompany = '';
    $scope.newLeadContactName = '';
   // $scope.isDuplicated = false;



    $scope.createNewLead = function (form) {
        // get from local storage
        var retrievedUser = localStorage.getItem('currentUser');

        if (form.$valid) {
            // title= company name , 
            var objNewLead = {
                Title: $scope.newLeadCompany,
                Contact: $scope.newLeadContactName,
                Orgnization: JSON.parse(retrievedUser).Organizations[0].Orgnization._id,
                User: JSON.parse(retrievedUser)._id
            };
            console.log(objNewLead);
            var promise = Warehouse.CallApi('/lead', 'POST', objNewLead, false);
            promise.error(function (data) {
                // console.log(data);
                if (data.readyState) {
                    console.log('connection error');
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                // console.log(data);
                if (data.type == 100) {
                    // success
                  //  $scope.isDuplicated = false;
                    $scope.dismiss();
                    $scope.newLeadCompany = '';
                    $scope.newLeadContactName = '';
                    $scope.$apply();
                    window.location = "/dashboard.html#/leadprofile/" + data.data._id;
                }
                else {

                    if (data.message) {
                        console.log(data.message);
                        // duplicate entry
                     //   $scope.isDuplicated = true;
                        $scope.$apply();
                    }
                    else {
                        for (var i = 0; i < data.errors.length; i++) {
                            console.log(data.errors[i].message);
                        }
                    }
                }
            });
        }

    }
}]);

salesHubApp.directive('myModal', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            scope.dismiss = function () {
                $(element).modal('hide');
            };
        }
    }
});