var salesHubApp = angular.module("salesHubApp", ['ngRoute']).run(function ($templateCache, $http) {

    $http.get('views/templates/login.html', { cache: $templateCache });
    $http.get('views/templates/forgotpassword.html', { cache: $templateCache });
    $http.get('views/templates/register.html', { cache: $templateCache });

    $http.get('views/templates/inbox.html', { cache: $templateCache });
    $http.get('views/templates/done.html', { cache: $templateCache });
    $http.get('views/templates/future.html', { cache: $templateCache });
    $http.get('views/templates/allleads.html', { cache: $templateCache });
    $http.get('views/templates/opportunities.html', { cache: $templateCache });
    $http.get('views/templates/leadprofile.html', { cache: $templateCache });
    $http.get('views/templates/bulk.html', { cache: $templateCache });

    $http.get('views/templates/activity.html', { cache: $templateCache });
    $http.get('views/templates/sentemails.html', { cache: $templateCache });
    $http.get('views/templates/statuschanges.html', { cache: $templateCache });
    $http.get('views/templates/explorer.html', { cache: $templateCache });

    $http.get('views/templates/settings.html', { cache: $templateCache });
    $http.get('views/templates/organization.html', { cache: $templateCache });
    $http.get('views/templates/phonesetting.html', { cache: $templateCache });
    $http.get('views/templates/emailsetting.html', { cache: $templateCache });
    $http.get('views/templates/emailtemplatesetting.html', { cache: $templateCache });
    $http.get('views/templates/newtemplate.html', { cache: $templateCache });
    $http.get('views/templates/apisetting.html', { cache: $templateCache });
    $http.get('views/templates/customizationsetting.html', { cache: $templateCache });
    $http.get('views/templates/membersetting.html', { cache: $templateCache });
    $http.get('views/templates/billingsetting.html', { cache: $templateCache });
    $http.get('views/templates/bulk2.html', { cache: $templateCache });
    $http.get('views/templates/accept.html', { cache: $templateCache });
    $http.get('views/templates/replyemail.html', { cache: $templateCache });

    $http.get('views/templates/replyinbox.html', { cache: $templateCache });
});

salesHubApp.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            controller: "LoginController",
            templateUrl: "views/templates/login.html"
        })
    .when("/Users/:invitationURL", {
        controller: "LoginController",
        templateUrl: "views/templates/login.html"
    })
    .when("/forgot", {
        controller: "ForgotController",
        templateUrl: "views/templates/forgotpassword.html"
    })
    .when("/invitations/:org/:email", {
        controller: "InvitationsController",
            templateUrl: "views/templates/accept.html"
    })
    .when("/register", {
        controller: "RegisterController",
        templateUrl: "views/templates/register.html"
    })
    .when("/inbox", {
        controller: "InboxController",
        templateUrl: "views/templates/inbox.html"
    })
    .when("/inbox/done", {
        controller: "DoneController",
        templateUrl: "views/templates/done.html"
    })
    .when("/inbox/future", {
        controller: "FutureController",
        templateUrl: "views/templates/future.html"
    })
    .when("/leads/:query?", {
        controller: "LeadsController",
        templateUrl: "views/templates/allleads.html"
    })
    .when("/opportunities", {
        controller: "OpportunitiesController",
        templateUrl: "views/templates/opportunities.html"
    })

    .when("/leadprofile/:leadId?/:action?", {
        controller: "LeadprofileController",
        templateUrl: "views/templates/leadprofile.html"
    })
    .when("/bulk", {
        controller: "bulkController",
        templateUrl: "views/templates/bulk.html"
    })
    .when("/bulk/review", {
        controller: "bulkreviewController",
        templateUrl: "views/templates/bulk2.html"
    })
    .when("/reports/activity", {
        controller: "ReportsController",
        templateUrl: "views/templates/activity.html"
    })
    .when("/reports/sentemails", {
        controller: "ReportsController",
        templateUrl: "views/templates/sentemails.html"
    })
    .when("/reports/statuschanges", {
        controller: "ReportsController",
        templateUrl: "views/templates/statuschanges.html"
    })
    .when("/reports/explorer", {
        controller: "ReportexplorerController",
        templateUrl: "views/templates/explorer.html"
    })
    .when("/settings/accountsetting", {
        controller: "SettingsController",
        templateUrl: "views/templates/settings.html",
    })
    .when("/settings/organization", {
        controller: "OrganizationsController",
        templateUrl: "views/templates/organization.html",
    })
    .when("/settings/phonesetting", {
        controller: "SettingsController",
        templateUrl: "views/templates/phonesetting.html",
    })
    .when("/settings/emailsetting", {
        controller: "SettingsController",
        templateUrl: "views/templates/emailsetting.html",
    })
    .when("/settings/emailtemplatesetting", {
        controller: "EmailSettingsController",
        templateUrl: "views/templates/emailtemplatesetting.html",
    })
    .when("/settings/emailtemplatesetting/newtemplate/:templateId?", {
        controller: "EmailSettingsController",
        templateUrl: "views/templates/newtemplate.html",
    })
    .when("/settings/apisetting", {
        controller: "SettingsController",
        templateUrl: "views/templates/apisetting.html",
    })
    .when("/settings/customizationsetting", {
        controller: "SettingsController",
        templateUrl: "views/templates/customizationsetting.html",
    })
    .when("/settings/membersetting", {
        controller: "SettingsController",
        templateUrl: "views/templates/membersetting.html",
    })
    .when("/settings/billingsetting", {
        controller: "SettingsController",
        templateUrl: "views/templates/billingsetting.html",
    })
    ;
    //$routeProvider.otherwise({ "redirectTo": "/" });
});

