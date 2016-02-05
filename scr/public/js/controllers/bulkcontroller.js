salesHubApp.controller("bulkController", function ($scope, $rootScope, $location) {
    $rootScope.csvFile = '';
    $scope.upload = function (fileread) {
        var reader = new FileReader();
        reader.readAsText(fileread, "UTF-8");
        reader.onload = function (evt) {
            console.log(evt.target.result);
            $rootScope.csvFile = evt.target.result;
            $rootScope.$apply();
            location.href = '#/bulk/review';
        }
        reader.onerror = function (evt) {
            console.log("error reading file");
        }
    };
})
.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread(changeEvent.target.files[0]);
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}]);
