angular.module("salesHubApp").controller("FutureController", function ($scope, $filter, $timeout, Warehouse, localstorage, $sce, $rootScope) {
    var retrievedUser = localStorage.getItem('currentUser');
    var userObject = JSON.parse(retrievedUser);
    $scope.UserOrganization = userObject.Organizations[0].Orgnization;
    $scope.UserEmail = userObject.Email;
    $scope.allInboxList = [];
    $scope.notReadyInboxList = [];
    $scope.filtrationType = 'All';
    $scope.snoozedTo = new Date().getTime();
    $scope.allUsers = [];
    //load page
    $scope.load = function () {
        var promise = Warehouse.CallApi('/orgnization/inbox/future?org=' + $scope.UserOrganization._id, 'GET', false);
        promise.error(function (data) {
            console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            console.log(data);
            if (data.type == 100) {
                $scope.allInboxList = data.data;
                $scope.notReadyInboxList = data.data;
                $scope.InboxCounter = data.data.length;
                $scope.$apply();
            }
            else {
                if (data.message) {
                    console.log(data.message);
                }
                else {
                    if (data.errors) {
                        for (var i = 0; i < data.errors.length; i++) {
                            console.log(data.errors[i].message);
                        }
                    }
                }
            }
        });
    }
    $scope.initUsersList = function () {
        var promise = Warehouse.CallApi('/orgnization/users?org=' + $scope.UserOrganization._id, 'get', $scope.lead, false);
        promise.error(function (data) {
            // console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // console.log(data);
            if (data.type == 100) {
                $scope.allUsers = data.data;
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

    }; $scope.isActive = function (type) {
        return type == $scope.filtrationType;
    };
    $scope.itemDone = function (_Inbox) {
        _Inbox.Activities.Status = 'Done';
        var promise = Warehouse.CallApi('/lead/inbox', 'put', _Inbox, false);
        promise.error(function (data) {
            // console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // console.log(data);
            if (data.type == 100) {
                $scope.load();
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
    $scope.multiDone = function () {
        for (var i = 0 ; i < $scope.allInboxList.length; i++) {
            if ($scope.allInboxList[i].Check == true) {
                $scope.allInboxList[i].Activities.Status = 'Done';
                var promise = Warehouse.CallApi('/lead/inbox', 'put', $scope.allInboxList[i], false);
                promise.error(function (data) {
                     console.log(data);
                    if (data.readyState) {
                        console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                     console.log(data);
                    if (data.type == 100) {
                        $scope.load();
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
        }


    }
    $scope.itemSnooze = function (_Inbox) {
        _Inbox.Activities.Due = $scope.snoozedTo;
        var body = [];
        body.push(_Inbox);
        var promise = Warehouse.CallApi('/lead/inbox', 'put', _Inbox, false);
        promise.error(function (data) {
            // console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // console.log(data);
            if (data.type == 100) {
                $scope.load();
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
    ;
    $scope.isActive = function (type) {
        return type == $scope.filtrationType;
    };
    $scope.CheckAll = function () {
        for (var i = 0 ; i < $scope.allInboxList.length; i++) {
            $scope.allInboxList[i].Check = !$scope.allInboxList[i].Check;
        }
        console.log($scope.allInboxList);
    };
    $scope.hoverinbox = function (oneInbox) {
        return oneInbox.showInboxActions = !oneInbox.showInboxActions;
    }
    $scope.showInboxDetails = function (oneInbox) {
        return oneInbox.InboxDetailsPart = !oneInbox.InboxDetailsPart;
    }
    $scope.showCollapsedMail = function (oneInbox) {
        return oneInbox.collapsedMail = !oneInbox.collapsedMail;
    }
    $scope.order = function (predicate, reverse) {
        if (predicate == 'Older')
            reverse = false;
        else
            reverse = true;
        $scope.allInboxList = $filter('orderBy')($scope.notReadyInboxList, 'DueDate', reverse);
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.filterType = function (_Type) {
        $scope.filtrationType = _Type;
        if (_Type == 'All')
            $scope.allInboxList = $scope.notReadyInboxList;
        else {
            $scope.allInboxList = $filter('filter')($scope.notReadyInboxList, _Type, false)
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.filterUser = function (_User) {
        if (_User == 'All') {
            $scope.allInboxList = $scope.notReadyInboxList;
        }
        else {
            var Name = _User.FirstName + " " + _User.LastName;
            $scope.allInboxList = $filter('filter')($scope.notReadyInboxList, Name, false);
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.initUsersList();
    $scope.load();



    // read the html tags inside repeated Email body
    $scope.renderHtml = function (html_code) {
        // return $sce.trustAsHtml(html_code);
        return $sce.trustAsHtml((html_code).replace(/[3D]/g, "").replace(/[=09]/g, "").replace(/[=2C]/g, ","));
    };



    newMessageReciversArray = [];
    newMessageCopyReciversArray = [];
    newMessageBlindReciversArray = [];

    $scope.deleteEmail = function (activity) {
        // alert("delete this");
    }

    $scope.mailReply = function (index, activity, type) {
        console.log(type);
        activityToEdit = activity;
        activityToEdit.isReplyIncluded = true;
        if ($("#dvReplyEmail" + index)[0]) {
            // Do something if class exists
        }
        else {

            $scope.leadId = activityToEdit._id;

            var promise = Warehouse.CallApi('/lead?id=' + $scope.leadId, 'GET', false);
            promise.error(function (data) {
                // console.log(data);
                if (data.readyState) {
                    console.log('connection error');
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                // console.log(data);
                if (data.type == 100) {
                    console.log(data.data);
                    $scope.lead = data.data;
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

            if (type == 1) {
                //  reply all
                activityToEdit.newMessageReciversArray = [];
                activityToEdit.newMessageCopyReciversArray = [];
                activityToEdit.newMessageBlindReciversArray = [];

                if (activity.Activities.Attributes.To) {
                    var array = activity.Activities.Attributes.To.split(',');
                    for (var i = 0; i < array.length; i++) {
                        if (array[i] != "") {
                            array[i] = $.trim(array[i]);
                            activityToEdit.newMessageReciversArray.push({ 'mail': array[i] });
                        }
                    }
                }



                if (activity.Activities.Attributes.CC) {
                    var array = activity.Activities.Attributes.CC.split(',');
                    for (var i = 0; i < array.length; i++) {
                        if (array[i] != "") {
                            array[i] = $.trim(array[i]);
                            activityToEdit.newMessageCopyReciversArray.push({ 'mail': array[i] });
                        }
                    }
                }

                if (activity.Activities.Attributes.BCC) {
                    var array = activity.Activities.Attributes.BCC.split(',');
                    for (var i = 0; i < array.length; i++) {
                        if (array[i] != "") {
                            array[i] = $.trim(array[i]);
                            activityToEdit.newMessageBlindReciversArray.push({ 'mail': array[i] });
                        }
                    }
                }


                $timeout(function () {

                    activityToEdit.addCCPart = false;
                    activityToEdit.addBCCPart = false;

                    $('#txtBody' + index).trumbowyg('html', "");


                    activityToEdit.fillSendMailToSelect = [];
                    // This shold be used in pre populate part for the field to 
                    activityToEdit.fillSendMailToSelectFirstObj = [];
                    activityToEdit.fillCC = [];
                    activityToEdit.fillBCC = [];


                    activityToEdit.fillSendMailToSelectFirstObj = activityToEdit.newMessageReciversArray.slice();
                    newMessageReciversArray = activityToEdit.newMessageReciversArray.slice();

                    activityToEdit.fillCC = activityToEdit.newMessageCopyReciversArray.slice();
                    newMessageCopyReciversArray = activityToEdit.newMessageCopyReciversArray.slice();

                    activityToEdit.fillBCC = activityToEdit.newMessageBlindReciversArray.slice();
                    newMessageBlindReciversArray = activityToEdit.newMessageBlindReciversArray.slice();

                    $timeout(function () {
                        if (activityToEdit.fillCC.length > 0) {
                            //this array is not empty 
                            activity.addCCPart = true;
                            console.log(activityToEdit.fillCC);
                            console.log(activityToEdit.newMessageCopyReciversArray);
                        }
                        if (activityToEdit.fillBCC.length > 0) {
                            //this array is not empty 
                            activity.addBCCPart = true;
                        }
                    });
                    $('#initialMailTo' + index).text(activityToEdit.Activities.Attributes.To + ',' + activityToEdit.Activities.Attributes.CC + ',' + activityToEdit.Activities.Attributes.BCC); // need all emails
                    $('#initialSenderName' + index).text(userObject.FirstName + ' ' + userObject.LastName);
                    $('#initialSenderMail' + index).text(userObject.Email);

                    prepareReplyAllEmail(index, activityToEdit.fillSendMailToSelectFirstObj, activityToEdit.fillCC, activityToEdit.fillBCC, activityToEdit.fillSendMailToSelect);

                }, 500);

            }
            else if (type == 2) {
                // forward
                activityToEdit.newMessageReciversArray = [];
                activityToEdit.newMessageCopyReciversArray = [];
                activityToEdit.newMessageBlindReciversArray = [];
                $timeout(function () {

                    // convert date in readable formate
                    var unformatedDate = getProperDate(activity.Activities.Date);
                    var formatedDate = moment().format('lll');
                    console.log(getProperDate(activity.Activities.Date));
                    function getProperDate(date) {
                        if (date == null) return null;
                        return new Date(parseInt(date.substr(6)));
                    }

                    console.log(activityToEdit.LeadLabel);

                    var message = "On " + formatedDate + " " + activityToEdit.LeadLabel + " wrote:<blockquote>";
                    message = message + activity.Activities.Attributes.Text + "</blockquote>";
                    activityToEdit.addCCPart = false;
                    activityToEdit.addBCCPart = false;

                    $timeout(function () {
                        $('#txtBody' + index).trumbowyg('html', message);
                    }, 500);


                    $('#txtSubject' + index).val("FW: " + activity.Activities.Attributes.Subject);

                    activityToEdit.fillSendMailToSelect = [];
                    // This shold be used in pre populate part for the field to 
                    activityToEdit.fillSendMailToSelectFirstObj = [];

                    var id = 1;
                    for (var i = 0; i < $scope.lead.Contacts.length; i++) {

                        for (var j = 0; j < $scope.lead.Contacts[i].Details.length; j++) {

                            if (($scope.lead.Contacts[i].Details[j].Value).indexOf('@') > -1 && ($scope.lead.Contacts[i].Details[j].Value).indexOf('.') > -1) {
                                activityToEdit.fillSendMailToSelect.push({ 'id': id, 'name': $scope.lead.Contacts[i].Name, 'mail': $scope.lead.Contacts[i].Details[j].Value });
                                id++;
                            }

                        }
                    }
                    activityToEdit.fillSendMailToSelectFirstObj.push(activityToEdit.fillSendMailToSelect[0]);
                    newMessageReciversArray.push(activityToEdit.fillSendMailToSelect[0]);

                    $('#initialMailTo' + index).text(activityToEdit.fillSendMailToSelect[0].mail);
                    $('#initialSenderName' + index).text(userObject.FirstName + ' ' + userObject.LastName);
                    $('#initialSenderMail' + index).text(userObject.Email);

                    prepareReplyEmail(index, activityToEdit.fillSendMailToSelectFirstObj, activityToEdit.fillSendMailToSelect);

                }, 500);
            }
            else {
                // reply
                // Do something if class does not exist
                activityToEdit.newMessageReciversArray = [];
                activityToEdit.newMessageCopyReciversArray = [];
                activityToEdit.newMessageBlindReciversArray = [];
                $timeout(function () {

                    activityToEdit.addCCPart = false;
                    activityToEdit.addBCCPart = false;

                    $('#txtBody' + index).trumbowyg('html', "");


                    activityToEdit.fillSendMailToSelect = [];
                    // This shold be used in pre populate part for the field to 
                    activityToEdit.fillSendMailToSelectFirstObj = [];



                    var id = 1;
                    for (var i = 0; i < $scope.lead.Contacts.length; i++) {

                        for (var j = 0; j < $scope.lead.Contacts[i].Details.length; j++) {

                            if (($scope.lead.Contacts[i].Details[j].Value).indexOf('@') > -1 && ($scope.lead.Contacts[i].Details[j].Value).indexOf('.') > -1) {
                                activityToEdit.fillSendMailToSelect.push({ 'id': id, 'name': $scope.lead.Contacts[i].Name, 'mail': $scope.lead.Contacts[i].Details[j].Value });
                                id++;
                            }

                        }
                    }

                    activityToEdit.fillSendMailToSelectFirstObj.push(activityToEdit.fillSendMailToSelect[0]);
                    newMessageReciversArray.push(activityToEdit.fillSendMailToSelect[0]);

                    $('#initialMailTo' + index).text(activityToEdit.fillSendMailToSelect[0].mail);
                    $('#initialSenderName' + index).text(userObject.FirstName + ' ' + userObject.LastName);
                    $('#initialSenderMail' + index).text(userObject.Email);

                    prepareReplyEmail(index, activityToEdit.fillSendMailToSelectFirstObj, activityToEdit.fillSendMailToSelect);

                }, 500);
            }

            var promise = Warehouse.CallApi('/user/settings/emailtemplate?u=' + $scope.userId, 'GET', false);
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
                    $scope.allEmailTemplates = data.data.EmailTemplates;
                    $("#selectTemplate" + index).val("0");
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
    }

    $scope.chooseTemplate = function (index) {
        if ($('#selectTemplate' + index).val() == 'manageTemplates') {
            window.location = '#/settings/emailtemplatesetting';
        }
        else {
            console.log($('#selectTemplate' + index).val());
            for (var i = 0; i < $scope.allEmailTemplates.length; i++) {
                if ($scope.allEmailTemplates[i]._id == $('#selectTemplate' + index).val()) {

                    $('#txtSubject' + index).val($scope.allEmailTemplates[i].Subject);
                    $('#txtBody' + index).trumbowyg('html', $scope.allEmailTemplates[i].Body);
                    $scope.filesList = $scope.allEmailTemplates[i].Attachements;
                }
            }
        }
    }


    $scope.filesList = [];
    $scope.upload = function (activity) {
        // file upload
        var fileContent = "";
        var fileName = "";
        $timeout(function () {
            var filesSelected = document.getElementById("uploadAttachfile1").files;
            if (filesSelected.length > 0) {
                var fileToLoad = filesSelected[0];
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    fileContent = fileLoadedEvent.target.result;
                    fileName = filesSelected[0].name;
                    console.log(fileContent);
                    console.log(fileName);
                };
                fileReader.readAsDataURL(fileToLoad);
                $timeout(function () {
                    $scope.filesList.push({ 'Name': fileName, 'Content': fileContent });
                    console.log($scope.filesList);
                }, 500);

            }
        });
    }

    $scope.removeFile = function (onechoice) {
        var index = $scope.filesList.indexOf(onechoice);
        $scope.filesList.splice(index, 1);
        console.log($scope.filesList);
    }

    $scope.addDraftReply = function (index, activity) {


        // To
        var receivers = "";
        for (var i = 0; i < newMessageReciversArray.length; i++) {
            if (newMessageReciversArray.length == 1) {
                receivers += newMessageReciversArray[i].mail + " ,";
            }
            else {
                receivers += newMessageReciversArray[i].mail + " ,";
            }
        }
        receivers = receivers.substring(0, receivers.length - 1);

        // CC
        var copyReceivers = "";
        for (var i = 0; i < newMessageCopyReciversArray.length; i++) {
            if (newMessageCopyReciversArray.length == 1) {
                copyReceivers += newMessageCopyReciversArray[i].mail + " ,";
            }
            else {
                copyReceivers += newMessageCopyReciversArray[i].mail + " ,";
            }
        }
        copyReceivers = copyReceivers.substring(0, copyReceivers.length - 1);

        // BCC
        var copyBlindReceivers = "";
        for (var i = 0; i < newMessageBlindReciversArray.length; i++) {
            if (newMessageBlindReciversArray.length == 1) {
                copyBlindReceivers += newMessageBlindReciversArray[i].mail + " ,";
            }
            else {
                copyBlindReceivers += newMessageBlindReciversArray[i].mail + " ,";
            }
        }
        copyBlindReceivers = copyBlindReceivers.substring(0, copyBlindReceivers.length - 1);

        var isChecked;
        if ($('#reminderCheckbox' + index).is(":checked")) {
            isChecked = true;
        }

        var subject;
        if ($('#txtSubject' + index).val() == "") {
            subject = "No Subject";
        }
        else {
            subject = $('#txtSubject' + index).val();
        }

        $timeout(function () {
            if (isChecked == true) {
                var objNewEmail = {
                    lead: $scope.leadId,
                    to: receivers,
                    cc: copyReceivers,
                    bcc: copyBlindReceivers,
                    subject: subject,
                    text: $('#txtBody' + index).trumbowyg('html'),
                    user: userObject,
                    EmailStatus: "Draft",
                    MailBy: userObject.FirstName + " " + userObject.LastName,
                    remind: true,
                    remindDate: $('#hiddenReindReplyDate' + index).text(),
                    Attachements: $scope.filesList
                };
                console.log(objNewEmail);
            }
            else {
                var objNewEmail = {
                    lead: $scope.leadId,
                    to: receivers,
                    cc: copyReceivers,
                    bcc: copyBlindReceivers,
                    subject: subject,
                    text: $('#txtBody' + index).trumbowyg('html'),
                    user: userObject,
                    EmailStatus: "Draft",
                    MailBy: userObject.FirstName + " " + userObject.LastName,
                    Attachements: $scope.filesList
                };
                console.log(objNewEmail);
            }

            var promise = Warehouse.CallApi('/activity/email', 'PUT', objNewEmail, false);
            promise.error(function (data) {
                // console.log(data);
                if (data.readyState) {
                    console.log('connection error');
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                if (data.type == 100) {
                    activityToEdit.isReplyIncluded = false;
                    $('#dvReplyEmail' + index).remove();
                    newMessageReciversArray = [];
                    newMessageCopyReciversArray = [];
                    newMessageBlindReciversArray = [];
                    // should call update activities
                    // activities
                    var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                    promise.error(function (data) {
                        // console.log(data);
                        if (data.readyState) {
                            console.log('connection error');
                        }
                    });
                    promise.done(function (data, textStatus, jqXhr) {
                        if (data.type == 100) {
                            console.log(data.data);
                            $scope.allActivitiesList = data.data;
                            $scope.notReadyInboxList = data.data;
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

        }, 500);


    }

    $scope.addSentReply = function (index, activity) {

        // To
        var receivers = "";
        for (var i = 0; i < newMessageReciversArray.length; i++) {
            if (newMessageReciversArray.length == 1) {
                receivers += newMessageReciversArray[i].mail + " ,";
            }
            else {
                receivers += newMessageReciversArray[i].mail + " ,";
            }
        }
        receivers = receivers.substring(0, receivers.length - 1);

        // CC
        var copyReceivers = "";
        for (var i = 0; i < newMessageCopyReciversArray.length; i++) {
            if (newMessageCopyReciversArray.length == 1) {
                copyReceivers += newMessageCopyReciversArray[i].mail + " ,";
            }
            else {
                copyReceivers += newMessageCopyReciversArray[i].mail + " ,";
            }
        }
        copyReceivers = copyReceivers.substring(0, copyReceivers.length - 1);

        // BCC
        var copyBlindReceivers = "";
        for (var i = 0; i < newMessageBlindReciversArray.length; i++) {
            if (newMessageBlindReciversArray.length == 1) {
                copyBlindReceivers += newMessageBlindReciversArray[i].mail + " ,";
            }
            else {
                copyBlindReceivers += newMessageBlindReciversArray[i].mail + " ,";
            }
        }
        copyBlindReceivers = copyBlindReceivers.substring(0, copyBlindReceivers.length - 1);

        var isChecked;
        if ($('#reminderCheckbox' + index).is(":checked")) {
            isChecked = true;
        }

        var subject;
        if ($('#txtSubject' + index).val() == "") {
            subject = "No Subject";
        }
        else {
            subject = $('#txtSubject' + index).val();
        }

        var attachmentArray = $scope.filesList;
        console.log(attachmentArray);

        $timeout(function () {
            if (isChecked == true) {
                var objNewEmail = {
                    lead: $scope.leadId,
                    to: receivers,
                    cc: copyReceivers,
                    bcc: copyBlindReceivers,
                    subject: subject,
                    text: $('#txtBody' + index).trumbowyg('html'),
                    user: userObject,
                    EmailStatus: "Sent",
                    MailBy: userObject.FirstName + " " + userObject.LastName,
                    remind: true,
                    remindDate: $('#hiddenReindReplyDate' + index).text(),
                    Attachements: attachmentArray
                };
                console.log(objNewEmail);
            }
            else {
                var objNewEmail = {
                    lead: $scope.leadId,
                    to: receivers,
                    cc: copyReceivers,
                    bcc: copyBlindReceivers,
                    subject: subject,
                    text: $('#txtBody' + index).trumbowyg('html'),
                    user: userObject,
                    EmailStatus: "Sent",
                    MailBy: userObject.FirstName + " " + userObject.LastName,
                    Attachements: attachmentArray
                };
                console.log(objNewEmail);
            }

            var promise = Warehouse.CallApi('/activity/email', 'PUT', objNewEmail, false);
            promise.error(function (data) {
                // console.log(data);
                if (data.readyState) {
                    console.log('connection error');
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                if (data.type == 100) {
                    activityToEdit.isReplyIncluded = false;
                    $('#dvReplyEmail' + index).remove();
                    newMessageReciversArray = [];
                    newMessageCopyReciversArray = [];
                    newMessageBlindReciversArray = [];
                    // should call update activities
                    // activities
                    var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                    promise.error(function (data) {
                        // console.log(data);
                        if (data.readyState) {
                            console.log('connection error');
                        }
                    });
                    promise.done(function (data, textStatus, jqXhr) {
                        if (data.type == 100) {
                            console.log(data.data);
                            $scope.allActivitiesList = data.data;
                            $scope.notReadyInboxList = data.data;
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

        }, 500);
    }

    $scope.deleteReply = function (index, activity) {
        activityToEdit.isReplyIncluded = false;
        $('#dvReplyEmail' + index).remove();
        newMessageReciversArray = [];
        newMessageCopyReciversArray = [];
        newMessageBlindReciversArray = [];
    }

    function prepareReplyEmail(index, fillSendMailToSelectFirstObj, fillSendMailToSelect) {
        $('#txtBody' + index).trumbowyg({
            btns: ['bold', 'italic', 'orderedList', 'unorderedList', 'link', 'insertImage', 'viewHTML']
        });
        // newMessageDateRangePicker();
        $("#txtNewEmailTo" + index).tokenInput(fillSendMailToSelect, {
            prePopulate: fillSendMailToSelectFirstObj,
            onAdd: function (item) {
                newMessageReciversArray.push({ 'name': item.name, 'mail': item.mail });
            },
            onDelete: function (item) {
                newMessageReciversArray.pop(item);
            },
            theme: "facebook",
            preventDuplicates: true,
            propertyToSearch: "mail",
            //choises
            resultsFormatter: function (item) { return "<li>" + "<div><div class='full_name'> " + item.name + "</div><div class='email grayFont smallFont full_name'>" + item.mail + "</div></div></li>" },
            // result token
            tokenFormatter: function (item) {
                if (item.name === undefined) {
                    return "<li><div class='grayFont smallFont'>" + item.mail + "</div></li>"
                }
                else {
                    return "<li><p>" + item.name + "</p>&nbsp;<div class='grayFont smallFont'>" + item.mail + "</div></li>"
                }
            },
            deleteText: "x "
        });
        $("#txtNewEmailCC" + index).tokenInput(fillSendMailToSelect, {
            onAdd: function (item) {
                newMessageCopyReciversArray.push({ 'name': item.name, 'mail': item.mail });
            },
            onDelete: function (item) {
                newMessageCopyReciversArray.pop(item);
            },
            theme: "facebook",
            preventDuplicates: true,
            propertyToSearch: "mail",
            //choises
            resultsFormatter: function (item) { return "<li>" + "<div><div class='full_name'> " + item.name + "</div><div class='email grayFont smallFont full_name'>" + item.mail + "</div></div></li>" },
            // result token
            tokenFormatter: function (item) {
                if (item.name === undefined) {
                    return "<li><div class='grayFont smallFont'>" + item.mail + "</div></li>"
                }
                else {
                    return "<li><p>" + item.name + "</p>&nbsp;<div class='grayFont smallFont'>" + item.mail + "</div></li>"
                }
            },
            deleteText: "x "
        });
        $("#txtNewEmailBCC" + index).tokenInput(fillSendMailToSelect, {
            onAdd: function (item) {
                newMessageBlindReciversArray.push({ 'name': item.name, 'mail': item.mail });
            },
            onDelete: function (item) {
                newMessageBlindReciversArray.pop(item);
            },
            theme: "facebook",
            preventDuplicates: true,
            propertyToSearch: "mail",
            //choises
            resultsFormatter: function (item) { return "<li>" + "<div><div class='full_name'> " + item.name + "</div><div class='email grayFont smallFont full_name'>" + item.mail + "</div></div></li>" },
            // result token
            tokenFormatter: function (item) {
                if (item.name === undefined) {
                    return "<li><div class='grayFont smallFont'>" + item.mail + "</div></li>"
                }
                else {
                    return "<li><p>" + item.name + "</p>&nbsp;<div class='grayFont smallFont'>" + item.mail + "</div></li>"
                }
            },
            deleteText: "x "
        });
        $("#leadprofileNewMessageDateRangePickerInput" + index).daterangepicker({
            "opens": "right",
            "singleDatePicker": true,
            "ranges": {
                '1 month': [moment().add(1, 'months')],
                '2 m': [moment().add(2, 'months')],
                '3 m': [moment().add(3, 'months')],
                '1 week': [moment().add(1, 'weeks')],
                '2 w': [moment().add(2, 'weeks')],
                '3 w': [moment().add(3, 'weeks')],
                '1 day': [moment().add(1, 'days')],
                '2 d': [moment().add(2, 'days')],
                '3 d': [moment().add(3, 'days')]
            },
        }, cb);
        $timeout(function () {
            // add current page name class
            $('.daterangepicker').removeClass('opportunitiesDateRangePicker');
            $('.daterangepicker').removeClass('activityDateRangePicker');
            $('.daterangepicker').addClass('leadprofileDateRangePicker');
            $('.range_inputs').addClass('hide');
            $('.ranges').addClass('showMe');
        });
        function cb(start, end, rangeName) {
            console.log(start.format('MM-DD-YYYY'));
            console.log(rangeName);
            if (typeof rangeName === 'undefined') {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in " + start.format('MMMM D, YYYY')); // show date
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "Custom Range") {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in " + start.format('MMMM D, YYYY')); // show date
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "2 m") {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in 2 monthes"); // show date
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "3 m") {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in 3 monthes"); // show date
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "2 w") {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in 2 weeks"); // show date
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "3 w") {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in 3 weeks"); // show date
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "2 d") {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in 2 days"); // show date
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "3 d") {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in 3 days"); // show date
            }
            else {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in " + rangeName); // show range name
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }

        }

    }

    function prepareReplyAllEmail(index, fillSendMailToSelectFirstObj, fillCC, fillBCC, fillSendMailToSelect) {
        $('#txtBody' + index).trumbowyg({
            btns: ['bold', 'italic', 'orderedList', 'unorderedList', 'link', 'insertImage', 'viewHTML']
        });
        // newMessageDateRangePicker();
        $("#txtNewEmailTo" + index).tokenInput(fillSendMailToSelect, {
            prePopulate: fillSendMailToSelectFirstObj,
            onAdd: function (item) {
                newMessageReciversArray.push({ 'name': item.name, 'mail': item.mail });
            },
            onDelete: function (item) {
                newMessageReciversArray.pop(item);
            },
            theme: "facebook",
            preventDuplicates: true,
            propertyToSearch: "mail",
            //choises
            resultsFormatter: function (item) { return "<li>" + "<div><div class='full_name'> " + item.name + "</div><div class='email grayFont smallFont full_name'>" + item.mail + "</div></div></li>" },
            // result token
            tokenFormatter: function (item) {
                if (item.name === undefined) {
                    return "<li><div class='grayFont smallFont'>" + item.mail + "</div></li>"
                }
                else {
                    return "<li><p>" + item.name + "</p>&nbsp;<div class='grayFont smallFont'>" + item.mail + "</div></li>"
                }
            },
            deleteText: "x "
        });
        $("#txtNewEmailCC" + index).tokenInput(fillSendMailToSelect, {
            prePopulate: fillCC,
            onAdd: function (item) {
                newMessageCopyReciversArray.push({ 'name': item.name, 'mail': item.mail });
            },
            onDelete: function (item) {
                newMessageCopyReciversArray.pop(item);
            },
            theme: "facebook",
            preventDuplicates: true,
            propertyToSearch: "mail",
            //choises
            resultsFormatter: function (item) { return "<li>" + "<div><div class='full_name'> " + item.name + "</div><div class='email grayFont smallFont full_name'>" + item.mail + "</div></div></li>" },
            // result token
            tokenFormatter: function (item) {
                if (item.name === undefined) {
                    return "<li><div class='grayFont smallFont'>" + item.mail + "</div></li>"
                }
                else {
                    return "<li><p>" + item.name + "</p>&nbsp;<div class='grayFont smallFont'>" + item.mail + "</div></li>"
                }
            },
            deleteText: "x "
        });
        $("#txtNewEmailBCC" + index).tokenInput(fillSendMailToSelect, {
            prePopulate: fillBCC,
            onAdd: function (item) {
                newMessageBlindReciversArray.push({ 'name': item.name, 'mail': item.mail });
            },
            onDelete: function (item) {
                newMessageBlindReciversArray.pop(item);
            },
            theme: "facebook",
            preventDuplicates: true,
            propertyToSearch: "mail",
            //choises
            resultsFormatter: function (item) { return "<li>" + "<div><div class='full_name'> " + item.name + "</div><div class='email grayFont smallFont full_name'>" + item.mail + "</div></div></li>" },
            // result token
            tokenFormatter: function (item) {
                if (item.name === undefined) {
                    return "<li><div class='grayFont smallFont'>" + item.mail + "</div></li>"
                }
                else {
                    return "<li><p>" + item.name + "</p>&nbsp;<div class='grayFont smallFont'>" + item.mail + "</div></li>"
                }
            },
            deleteText: "x "
        });
        $("#leadprofileNewMessageDateRangePickerInput" + index).daterangepicker({
            "opens": "right",
            "singleDatePicker": true,
            "ranges": {
                '1 month': [moment().add(1, 'months')],
                '2 m': [moment().add(2, 'months')],
                '3 m': [moment().add(3, 'months')],
                '1 week': [moment().add(1, 'weeks')],
                '2 w': [moment().add(2, 'weeks')],
                '3 w': [moment().add(3, 'weeks')],
                '1 day': [moment().add(1, 'days')],
                '2 d': [moment().add(2, 'days')],
                '3 d': [moment().add(3, 'days')]
            },
        }, cb);
        $timeout(function () {
            // add current page name class
            $('.daterangepicker').removeClass('opportunitiesDateRangePicker');
            $('.daterangepicker').removeClass('activityDateRangePicker');
            $('.daterangepicker').addClass('leadprofileDateRangePicker');
            $('.range_inputs').addClass('hide');
            $('.ranges').addClass('showMe');
        });
        function cb(start, end, rangeName) {
            console.log(start.format('MM-DD-YYYY'));
            console.log(rangeName);
            if (typeof rangeName === 'undefined') {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in " + start.format('MMMM D, YYYY')); // show date
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "Custom Range") {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in " + start.format('MMMM D, YYYY')); // show date
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "2 m") {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in 2 monthes"); // show date
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "3 m") {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in 3 monthes"); // show date
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "2 w") {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in 2 weeks"); // show date
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "3 w") {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in 3 weeks"); // show date
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "2 d") {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in 2 days"); // show date
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "3 d") {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in 3 days"); // show date
            }
            else {
                $('#leadprofileNewMessageDateRangePickerInput' + index + ' span').html("in " + rangeName); // show range name
                $('#hiddenReindReplyDate' + index).text(start.format('MM-DD-YYYY'));
            }

        }

    }

    $scope.emailThisLead = function (leadId) {
        window.location = "#/leadprofile/" + leadId + "/newEmail";
    }

    $scope.callThisLead = function (leadId) {
        window.location = "#/leadprofile/" + leadId;
    }

});

// dateRange picker directive (single Picker with ranges)
salesHubApp.directive('myDatepicker2', function ($parse) {
    return function (scope, element, attrs, controller) {
        $(function () {
            $(element).daterangepicker({
                "singleDatePicker": true,
                "ranges": {
                    '1 month': [moment().add(1, 'months')],
                    '2 m': [moment().add(2, 'months')],
                    '3 m': [moment().add(3, 'months')],
                    '1 week': [moment().add(1, 'weeks')],
                    '2 w': [moment().add(2, 'weeks')],
                    '3 w': [moment().add(3, 'weeks')],
                    '1 day': [moment().add(1, 'days')],
                    '2 d': [moment().add(2, 'days')],
                    '3 d': [moment().add(3, 'days')]
                },
            }, cb);

            function cb(start, rangeName) {
                scope.snoozedTo = start.format('MM/D/YYYY');
                scope.$apply();
            }
            setTimeout(function () {
                // add current page name class
                $('.daterangepicker').removeClass('opportunitiesDateRangePicker');
                $('.daterangepicker').removeClass('activityDateRangePicker');
                $('.daterangepicker').addClass('leadprofileDateRangePicker');
                $('.range_inputs').addClass('hide');
                $('.ranges').addClass('showMe');
            }, 500);
        });
    }
});

