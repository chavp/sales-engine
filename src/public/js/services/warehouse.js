salesHubApp.factory("Warehouse", function () {
    //var API = 'http://128.199.169.188/warehouse';
    var API = 'http://127.0.0.1/warehouse';
    return {
        CallApi: function (_method, _type, _data, _cashed) {
            var promise = $.ajax({
                type: _type,
                data: _data,
                url: API + _method,
                cache: _cashed,
                statusCode: {
                    401: function () {
                        $(document).trigger("error_401_unauthorized");
                    },
                    500: function () {
                        $(document).trigger("error_500_unauthorized");
                    }
                }
            });
            return promise;
        }
    };
});


