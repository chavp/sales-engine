angular.module("salesHubApp",
    ['ngRoute',
    'appRoutes',
    'ngSanitize',
    'ngMessages',
    'Warehouse',
    'localstorage',
    'angularMoment',
    'RegisterController',
    'LoginController',
    'ForgotController',
    'InboxController',
    'LeadsController',
    'OpportunitiesController',
    'SettingsController',
    'LeadprofileController',
    'ReportsController',
    'ReportexplorerController',
    'NewleadController',
    'bulkController',
    'OrganizationsController',
    'EmailSettingsController'])
.run(function ($rootScope) {
    $rootScope.formForgotDone = false;
    $rootScope.csvFile = '';
    $rootScope._status = false;
    $rootScope._element = '';
    $rootScope.DashboardInboxCounter = 0;
    $rootScope.firstName = '';
    $rootScope.lastName = '';
    $rootScope.orgTitle = '';
    $rootScope.Useremail = '';
    $rootScope.Userphone = '';
    $rootScope.UserImg = '';
    $rootScope.loader = function () {
        alert('hi');
        $('#loader').remove();
        if ($rootScope._status == true) {
            alert('adding');
            $('<img id="loader" src="/images/loader.gif" style="max-height:20px;border:none;"/>').insertAfter($rootScope._element);
        }
        $rootScope.$apply();
    };
});