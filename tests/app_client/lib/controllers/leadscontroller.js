angular.module("salesHubApp").controller("LeadsController", function ($scope, $sce, $filter, localstorage, $timeout, $routeParams, Warehouse) {
    //var retrievedUser = localStorage.getItem('currentUser');
    //var userObject = JSON.parse(retrievedUser);
    var userObject = localstorage.getObject('currentUser');

    var organizationId = userObject.Organizations[0].Orgnization._id;
    $scope.query = $routeParams.query;
    $scope.PageTitle = "All leads";
    $scope.allLeads = [];
    $scope.notReadyLeads = [];
    $scope.LeadsCounter = 0;
    $scope.newSmartView = { Name: '-', Query: $scope.query, Organization: organizationId, CreatedBy: userObject._id, Shared: { Type: 'All', Users: [] } };
    $scope.load = function () {
        console.log(userObject);
        var promise = Warehouse.CallApi('/organization/leads?q=' + organizationId, 'GET', false);
        promise.error(function (data) {
            // console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // console.log(data);
            if (data.type == 100) {
                $scope.allLeads = data.data;
                console.log(data.data);
                $scope.notReadyLeads = data.data;
                $scope.LeadsCounter = data.data.length;

                $scope.allEmailTemplates = userObject.EmailTemplates;

                
                // using timeout solve not woking problem!.
                $timeout(function () {
                    $('.table').footable({});
                    $scope.contactsOption = "FirstOnly";
                    $('#bulkSelectTemplate').val("ChooseTemplate");
                }, 500);
                $scope.filterType();
                loadOrganizationLeadsStatuses();
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
    $scope.filterType = function () {
        if (typeof ($scope.query) == 'undefined') {
            $scope.allLeads = $scope.notReadyLeads;
            $scope.PageTitle = 'All leads';
            $scope.query="All Leads"
        }
        else {
            $scope.PageTitle = 'Search results';
            console.log($scope.query);
            console.log($scope.notReadyLeads);
            $scope.allLeads = $filter('filter')($scope.notReadyLeads, { Contacts: { Name: $scope.query } }, false)
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.load();
    $scope.saveSmartView = function () {
        //var newSmartView = $scope.newSmartView;

        var promise = Warehouse.CallApi('/organization/smartview', 'post', $scope.newSmartView, false);
        promise.error(function (data) {
            console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // console.log(data);
            if (data.type == 100) {
                console.log(data);
                console.log($scope.newSmartView);
                userObject.Organizations[0].Orgnization.SmartViews.push($scope.newSmartView);
                localstorage.resetObject('currentUser', userObject);
                //console.log(userObject);
                $('.modal').modal('hide');
                $timeout(function () {
                    //newSmartView = {};
                    $scope.newSmartView = { Name: '-', Query: $scope.query, Organization: organizationId, CreatedBy: userObject._id, Shared: { Type: 'All', Users: [] } };
                });
                $scope.$apply();
                $scope.filterType();
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
    }
    var _Keywords = {
        Title: 'Title:$Value$',
        Contact_Name: 'Contacts.Name:$Value$',
        Phone: 'Contacts.Detils.Value:$Value$',
        Email: 'Contacts.Details.Value:$Value$',
    }
    function formatQuery() {

    }
    $scope.showSecondEditMenu = function (actionType) {
        if (actionType == "updateLeadStatus") {
            $scope.updateLeadStatusChoices = true;
            $scope.updateCustomFieldChoices = false;
            $scope.clearCustomFieldChoices = false;
        }
        else if (actionType == "updateCustomField") {
            $scope.updateCustomFieldChoices = true;
            $scope.updateLeadStatusChoices = false;
            $scope.clearCustomFieldChoices = false;
        }
        else if (actionType == "clearCustomField") {
            $scope.clearCustomFieldChoices = true;
            $scope.updateLeadStatusChoices = false;
            $scope.updateCustomFieldChoices = false;
        }
        else if (actionType == "DeleteAllLeads") {
            $scope.clearCustomFieldChoices = false;
            $scope.updateLeadStatusChoices = false;
            $scope.updateCustomFieldChoices = false;
            $scope.actionText = "Delete all these leads (including their contacts, opportunities, calls, notes, emails, etc.)";
        }
        else {
            // fire required
        }

    }

    $scope.chooseNewStatus = function () {
        if ($('#newAllLeadsStatus').val() != 0 || $('#newAllLeadsStatus').val() != 1) {
            $scope.newStatusLabel = $('#newAllLeadsStatus  option:selected').text();
            $scope.actionText = "Replace all these leads' statuses with a value of '" + $scope.newStatusLabel + "'.";

        }
    }

    $scope.updateAllLeads = function () {
        var ActionType;
        if ($scope.actionToEdit == "updateLeadStatus") {
            ActionType = "ChangeStatus";
        }
        else if ($scope.actionToEdit == "DeleteAllLeads") {
            ActionType = "Delete";
        }
        else {
            ActionType = $scope.actionToEdit;
        }

        var updateObj = {
            type: ActionType,
            newvalue: $scope.AllLeadsNewStatus,
            label: ActionType,
            criteria: $scope.query
        };
        var promise = Warehouse.CallApi('/lead/update', 'PUT', updateObj, false);
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
    }

    $scope.renderHtml = function (html_code) {
        return $sce.trustAsHtml(html_code);
    };

    //$scope.showSecondEmailMenu = function (TemplateName) {
    //    if (TemplateName == "SampleColdEmail") {
    //        console.log(TemplateName);
    //        $scope.templateContent = "<div><b>Subject: </b>Sample Reply To Steli <br/><b>From: </b>mail@MyEmail.com<br/><b>To: </b>email@test.com<br/><br/>Hi, this is Sample Cold Email !</div>";
    //    }
    //    else if (TemplateName == "SampleReplyToSteli") {
    //        console.log(TemplateName);
    //        $scope.templateContent = "<div><b>Subject: </b>Sample Reply To Steli <br/><b>From: </b>mail@MyEmail.com<br/><b>To: </b>email@test.com<br/><br/>Hi, this is Sample Reply To Steli !<br/>,regards.</div>";
    //    }
    //    else if (TemplateName == "ManageTemplates") {
    //        console.log(TemplateName);
    //        $scope.dismiss();
    //        window.location = '#/settings/emailtemplatesetting';
    //    }
    //    else {
    //        // fire required
    //    }
    //}
    $scope.showSecondEmailMenu = function (TemplateName) {
        if (TemplateName == "ChooseTemplate") {
            // fire required
            console.log(TemplateName);
        }
        else if (TemplateName == "ManageTemplates") {
            console.log(TemplateName);
            $scope.dismiss();
            window.location = '#/settings/emailtemplatesetting';
        }
        else {
            for (var i = 0; i < userObject.EmailTemplates.length; i++) {
                console.log(TemplateName);
                if (userObject.EmailTemplates[i]._id == TemplateName) {
                    console.log(userObject.EmailTemplates[i]);
                    var contacts;
                    if ($scope.contactsOption == "FirstOnly") {
                        contacts = "First Contact Only";
                    }
                    else {
                        contacts = "All Contacts";
                    }

                    $scope.templateContent = "<div><b>Subject: </b>" + userObject.EmailTemplates[i].Subject + "<br/><b>From: </b>" + $scope.Useremail + "<br/><b>To: </b>" + contacts + "<br/><br/>" + userObject.EmailTemplates[i].Body + "</div>";
                }
            }
        }
    }
    $scope.EmailAllLeads = function () {
        var contacts;
        if ($scope.contactsOption == "FirstOnly") {
            contacts = "FirstOnly";
        }
        else {
            contacts = "AllContacts";
        }


        var updateObj = {
            contactOptions: contacts,
            template: $scope.chosenTemplate,
            user: userObject,
            criteria: $scope.query
        };
        var promise = Warehouse.CallApi('/lead/bulkemail', 'PUT', updateObj, false);
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

    }
    $scope.exportOptions = { Type: '', Format: '' };
    $scope.exportLeads = function () {
        console.log($scope.exportOptions);
        var toExport = [];
        if ($scope.exportOptions.Type == 'Leads') {
            for (var i = 0 ; i < $scope.allLeads.length; i++) {
                toExport.push({
                    Name: $scope.allLeads[i].Title,
                    Contact: $scope.allLeads[i].Contacts[0].Name,
                    Status: $scope.allLeads[i].StatusLabel,
                    Description: $scope.allLeads[i].Description,
                    URL: $scope.allLeads[i].Url
                });
            }
        }
        else if ($scope.exportOptions.Type == 'Contacts') {
            for (var i = 0 ; i < $scope.allLeads.length; i++) {
                for (var j = 0 ; j < $scope.allLeads[i].Contacts.length; j++) {
                    toExport.push({
                        Lead: $scope.allLeads[i].Title,
                        ContactName: $scope.allLeads[i].Contacts[i].Name,
                        Title: $scope.allLeads[i].Contacts[i].ContactTitle,
                        Type: $scope.allLeads[i].Contacts[i].Details[0].Type,
                        Info: $scope.allLeads[i].Contacts[i].Details[0].Value,
                    });
                }
            }

        }
        else if ($scope.exportOptions.Type == 'Opps') {

        }
        if ($scope.exportOptions.Format == 'CSV') {
            toCSV(toExport);
        }
        else if ($scope.exportOptions.Format == 'JSON') {
            toJSON(toExport);
        }
    }
    function toCSV(_array) {

        var csvContent = '';
        _array.forEach(function (infoArray, index) {
            var dataString = '';
            for (var property in infoArray) {
                if (infoArray.hasOwnProperty(property)) {
                    dataString += infoArray[property] + ","
                }
            }
            csvContent += dataString + "\n";
        });
        var uri = 'data:data:application/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csvContent);
        var downloadLink = document.createElement("a");
        downloadLink.href = uri;
        downloadLink.download = "data.csv";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        console.log(uri);
        document.body.removeChild(downloadLink);
    }
    function toJSON(_array) {

        var csvContent = JSON.stringify(_array);
        var uri = 'data:data:application/json;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csvContent);
        var downloadLink = document.createElement("a");
        downloadLink.href = uri;
        downloadLink.download = "data.json";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        console.log(uri);
        document.body.removeChild(downloadLink);
    }
    function loadOrganizationLeadsStatuses() {

        var promise = Warehouse.CallApi('/orgnization/leadstatus?org=' + organizationId, 'GET', false);
        promise.error(function (data) {
            // console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // console.log(data);
            if (data.type == 100) {
                // console.log(data.type);
                //  console.log(data.data);
                $scope.OrganizationLeadsStatuses = data.data;
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
    }
});


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