angular.module("salesHubApp").controller("bulkreviewController", function ($scope, $rootScope, $location) {
    var _csv = $rootScope.csvFile;
    $scope.headers = [];
    $scope.data = [];
    processCSV(_csv);
    function processCSV(_csv) {
        var _lines = _csv.split('\n');
        console.log(_lines.length);
        var _array = [];
        $scope.headers = _lines[0];
        for (var i = 1; i < _lines.length - 1; i++) {
            $scope.data.push(toObject(_lines[i].split(',')));
        }
    }
    function toObject(arr) {
        var rv = {};
        for (var i = 0; i < arr.length; ++i)
            if (arr[i] !== undefined) rv[i] = arr[i];
        return rv;
    }
});
