angular.module("salesHubApp").controller("LeadprofileController", function ($scope, $filter, $timeout, localstorage, $routeParams, $sce, $rootScope, Warehouse) {

    //var retrievedUser = localStorage.getItem('currentUser');
    //var userObject = JSON.parse(retrievedUser);
    var userObject = localstorage.getObject('currentUser');
    $scope.userId = userObject._id;
    $scope.UserFirstName = userObject.FirstName;
    $scope.UserEmail = userObject.Email;
    var usersCurrency = userObject.Organizations[0].Orgnization.DefaultCurrency;

    $timeout(function () {
        if (usersCurrency == "USD" || usersCurrency == "Dollar") {
            $scope.userCurrency = "$";
        }
        else {
            $scope.userCurrency = usersCurrency;
        }
    }, 200);



    // lead Id from URL to get this selected lead's data
    $scope.leadId = $routeParams.leadId;
    //console.log(userObject);
    $scope.lead = null;
    $scope.allActivitiesList = [];
    $scope.filterableList = [];
    $scope.newCall = {
        "CreatedBy": $scope.userId,
        "Title": "A call ",
        "AssignTo": $scope.userId,
        "TaskCompleted": false,
        "Time": "",
        "OriginalDate": "",
        "CreatedDate": new Date()
    };
    $scope.CallNumber = "-";
    //// change the rootscope value
    //$scope.resetInboxCounter = function () {
    //    $rootScope.DashboardInboxCounter = 5;
    //};
    ///////////////////////////////////////////////////////////////////Tasks
    $scope.MakeCall = function (_Contact) {
        //console.log(_Contact)
        if (_Contact) {
            for (var j = 0; j < _Contact.Details.length; j++) {
                if (_Contact.Details[j].Value.indexOf('+') > -1 || _Contact.Details[j].Value.indexOf('00') > -1) {
                    Plivo.conn.call(_Contact.Details[j].Value);
                }
            }
        }
        else {
            if ($scope.CallNumber == "-")
                alert('This lead has no contact with valid numbers , please add the country code if its not exist');
            else
                Plivo.conn.call($scope.CallNumber);
        }
    }
    function callNumber() {
        for (var i = 0 ; i < $scope.lead.Contacts.length; i++) {
            for (var j = 0; j < $scope.lead.Contacts[i].Details.length; j++) {
                //console.log($scope.lead.Contacts[i].Details);
                if ($scope.lead.Contacts[i].Details[j].Value.indexOf('+') > -1) {
                    //console.log($scope.lead.Contacts[i].Details[j].Value);
                    $scope.CallNumber = $scope.lead.Contacts[i].Details[j].Value;
                    $scope.$apply();
                    return;
                }
            }
        }
    }
    $scope.newTask = {
        "CreatedBy": $scope.userId,
        "Title": "",
        "AssignTo": $scope.userId,
        "TaskCompleted": false,
        "Time": "",
        "OriginalDate": "",
        "CreatedDate": new Date()
    };
    $scope.taskToEdit;
    $scope.addNewTaskPart = false;
    $scope.addTask = function () {


        // AssignedToLabel
        for (var i = 0; i < $scope.OrganizationUsers.length; i++) {
            if (($scope.OrganizationUsers[i]._id) == $scope.newTask.AssignTo) {
                $scope.newTask.AssignedToLabel = ($scope.OrganizationUsers[i].FirstName + ' ' + $scope.OrganizationUsers[i].LastName);
            }
        }

        $scope.newTask.OriginalDate = $('#newTaskDate').val();
        $scope.newTask.Time = $('#newTaskTime').val();
        //console.log($scope.newTask);
        $scope.lead.Tasks.push($scope.newTask);
        var taskText = $('#newTaskText').val();
        $scope.lead.Activities = $scope.allActivitiesList;
        $scope.newTask = {
            "CreatedBy": $scope.userId,
            "Title": "",
            "AssignTo": $scope.userId,
            "TaskCompleted": false,
            "Time": "",
            "OriginalDate": "",
            "CreatedDate": new Date()
        };

        $('#newTaskTime').val("");
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            //console.log(data);
            if (data.type == 100) {
                $scope.addNewTaskPart = false;


                var objTaskCreatedActivity = {
                    Attributes: {
                        Text: taskText,
                    },
                    Date: new Date(),
                    Type: "CreatedTask"
                };
                //console.log(objTaskCreatedActivity);
                $scope.lead.Activities = $scope.allActivitiesList;
                $scope.lead.Activities.push(objTaskCreatedActivity);

                var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
                promise.error(function (data) {
                    // //console.log(data);
                    if (data.readyState) {
                        //console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    // //console.log(data);
                    if (data.type == 100) {
                        $scope.$apply();
                    }
                    else {
                        if (data.message) {
                            //console.log(data.message);
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                //console.log(data.errors[i].message);
                            }
                        }
                    }
                });


                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });

    }


    $scope.saveTask = function (task) {
        // AssignedToLabel
        for (var i = 0; i < $scope.OrganizationUsers.length; i++) {
            if (($scope.OrganizationUsers[i]._id) == $scope.taskToEdit.AssignTo) {
                $scope.taskToEdit.AssignedToLabel = ($scope.OrganizationUsers[i].FirstName + ' ' + $scope.OrganizationUsers[i].LastName);
            }
        }
        // //console.log($scope.taskToEdit);

        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                // //console.log(data.type);
                // //console.log(data.data);
                // after save close the edit part
                task.showEditTask = !task.showEditTask;
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });

    }

    $scope.deleteTask = function (task) {
        var index = $scope.lead.Tasks.indexOf(task);
        // //console.log($scope.lead.Tasks)
        $scope.lead.Tasks.splice(index, 1);
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                // //console.log(data.type);
                // //console.log(data.data);



                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });

    }

    $scope.showAddNewTaskPart = function () {
        $scope.addNewTaskPart = true;

    }

    $scope.hideAddNewTaskPart = function () {
        $scope.addNewTaskPart = false;
    }


    var HoverArray = [];
    $scope.hoverTask = function (task, index) {
        return task.showEditTaskIcon = !task.showEditTaskIcon;
    };

    $scope.initiateTask = function (task, index) {
        // Shows/hides the delete button on hover
        HoverArray.push({ 'taskId': index });
        var isafter = moment(task.OriginalDate).isAfter(new Date());
        if (isafter == false) {
            if (HoverArray.indexOf(index) > -1) {
            }
            else {

                $timeout(function () {
                    function cb(start, rangeName) {
                        //console.log(start.format('MM-DD-YYYY'));
                        $scope.taskToEdit = task;
                        $scope.taskToEdit.OriginalDate = start.format('MM-DD-YYYY');
                        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
                        promise.error(function (data) {
                            //console.log(data);
                            if (data.readyState) {
                                //console.log('connection error');
                            }
                        });
                        promise.done(function (data, textStatus, jqXhr) {
                            //console.log(data);
                            if (data.type == 100) {
                                task.showSnoozeTaskIcon = false;
                                $scope.$apply();
                            }
                            else {
                                if (data.message) {
                                    //console.log(data.message);
                                }
                                else {
                                    for (var i = 0; i < data.errors.length; i++) {
                                        //console.log(data.errors[i].message);
                                    }
                                }
                            }
                        });
                    }
                    $("#snoozeTask" + index).daterangepicker({
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
                        //add current page name class
                        $('.daterangepicker').removeClass('opportunitiesDateRangePicker');
                        $('.daterangepicker').removeClass('activityDateRangePicker');
                        $('.daterangepicker').addClass('leadprofileDateRangePicker');
                        $('.range_inputs').addClass('hide');
                        $('.ranges').addClass('showMe');
                    });
                }, 200);

            }
            return task.showSnoozeTaskIcon = true;
        }

    }


    $scope.showEditTaskPart = function (task, index) {
        $scope.taskToEdit = task;

        var date = new Date($scope.taskToEdit.OriginalDate);
        var formatted = moment(date).format('MM-DD-YYYY');
        // //console.log(formatted);
        $("#editTaskDate" + index).daterangepicker({
            "opens": "right",
            "singleDatePicker": true,
            "startDate": formatted
        });
        $("#editTaskDate" + index).on('change', function (e) {
            $scope.taskToEdit.OriginalDate = $("#editTaskDate" + index).val();
        });

        $("#editTaskTime" + index).timepicker();

        $("#editTaskTime" + index).on('change', function (e) {
            $scope.taskToEdit.Time = $("#editTaskTime" + index).val();
        });

        //console.log($scope.taskToEdit.Time);

        return task.showEditTask = !task.showEditTask;
    }

    $scope.markTaskAsDone = function (task) {
        $scope.taskToEdit = task;
        $scope.taskToEdit.TaskCompleted = true;

        $scope.taskToEdit.markAsUndone = true;

        var objTaskCompletedActivity = {
            Attributes: {
                Text: $scope.taskToEdit.Title,
                TaskId: $scope.taskToEdit._id
            },
            Date: new Date(),
            Status: "Active",
            TimeAgo: "Not yet",
            Type: "TaskCompleted"
        };
        //console.log(objTaskCompletedActivity);
        $scope.lead.Activities = $scope.allActivitiesList;
        $scope.lead.Activities.push(objTaskCompletedActivity);

        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    $scope.markTaskAsUnDone = function (task) {
        $scope.taskToEdit = task;
        $scope.taskToEdit.TaskCompleted = false;

        $scope.taskToEdit.markAsUndone = false;

        $scope.lead.Activities = $scope.allActivitiesList;

        for (var i = 0; i < $scope.lead.Activities.length; i++) {
            if ($scope.lead.Activities[i].Attributes.TaskId == $scope.taskToEdit._id) {
                var index = $scope.lead.Activities.indexOf($scope.lead.Activities[i]);
                $scope.lead.Activities.splice(index, 1);
            }
        }


        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }


    /////////////////////////////////////////////////////////////// Contacts
    $scope.newContact = {
        "Name": "",
        "ContactTitle": "",
        "CreatedBy": $scope.userId,
        "CreatedDate": new Date(),
        "Details": [
          {
              "Value": "",
              "Type": ""
          }
        ]
    };

    $scope.addNewContactPart = false;
    $scope.ContactToEdit;

    $scope.addContact = function () {
        $scope.lead.Contacts.push($scope.newContact);
        $scope.lead.Activities = $scope.allActivitiesList;
        $scope.newContact = {};
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                // //console.log(data.type);
                // //console.log(data.data);
                $scope.addNewContactPart = false;
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });

    }

    $scope.saveContact = function (Contact) {
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                ////console.log(data.type);
                ////console.log(data.data);
                // after save close the edit part
                Contact.showEditContact = !Contact.showEditContact;
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });

    }

    $scope.deleteContact = function (Contact) {
        var index = $scope.lead.Contacts.indexOf(Contact);
        // //console.log($scope.lead.Contacts);
        $scope.lead.Contacts.splice(index, 1);
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                // //console.log(data.type);
                // //console.log(data.data);

                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });

    }

    $scope.showAddNewContactPart = function () {
        //$scope.newContact.Details.push({value:'',Type:''});
        $scope.addNewContactPart = true;

    }
    $scope.hideAddNewContactPart = function () {
        $scope.addNewContactPart = false;
    }

    $scope.hoverContact = function (Contact) {
        // Shows/hides the delete button on hover
        return Contact.showEditContactIcon = !Contact.showEditContactIcon;
    };

    $scope.showEditContactPart = function (Contact) {
        $scope.ContactToEdit = Contact;
        return Contact.showEditContact = !Contact.showEditContact;
    }

    $scope.addContactDetails = function () {
        $scope.ContactToEdit.Details.push({ value: '', Type: '' });
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                //  //console.log(data.type);
                // //console.log(data.data);
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }
    $scope.removeContactDetails = function (oneDetail) {
        var index = $scope.ContactToEdit.Details.indexOf(oneDetail);
        //  //console.log($scope.lead.Contacts);
        $scope.ContactToEdit.Details.splice(index, 1);
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                // //console.log(data.type);
                //  //console.log(data.data);
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    $scope.addNewContactDetails = function () {
        $scope.newContact.Details.push({ value: '', Type: '' });
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                //   //console.log(data.type);
                //  //console.log(data.data);
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }
    $scope.removeNewContactDetails = function (oneDetail) {
        var index = $scope.newContact.Details.indexOf(oneDetail);
        // //console.log($scope.lead.Contacts);
        $scope.newContact.Details.splice(index, 1);
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                // //console.log(data.type);
                // //console.log(data.data);
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    $scope.EmailThisContact = function (contactID) {
        $scope.addNewMail = true;
        fillSendMailToSelect = [];
        // This shold be used in pre populate part for the field to 
        fillSendMailToSelectFirstObj = [];
        var id = 1;
        for (var i = 0; i < $scope.lead.Contacts.length; i++) {
            for (var j = 0; j < $scope.lead.Contacts[i].Details.length; j++) {
                if (($scope.lead.Contacts[i].Details[j].Value).indexOf('@') > -1 && ($scope.lead.Contacts[i].Details[j].Value).indexOf('.') > -1) {
                    fillSendMailToSelect.push({ 'id': id, 'name': $scope.lead.Contacts[i].Name, 'mail': $scope.lead.Contacts[i].Details[j].Value });
                    id++;
                }

            }
        }



        //  //console.log(fillSendMailToSelect);
        //fillSendMailToSelectFirstObj.push(fillSendMailToSelect[0]);
        //newMessageReciversArray.push(fillSendMailToSelect[0]);

        $scope.initialMailTo = fillSendMailToSelect[0].mail;
        $scope.initialSenderName = userObject.FirstName + ' ' + userObject.LastName;
        $scope.initialSenderMail = userObject.Email;
        if (x == 0) {
            x++;
            prepareNewEmail(fillSendMailToSelectFirstObj, fillSendMailToSelect);
        }

        var promise = Warehouse.CallApi('/user/settings/emailtemplate?u=' + $scope.userId, 'GET', false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                $scope.allEmailTemplates = data.data.EmailTemplates;
                $timeout(function () {
                    $("#selectEmailTemplate").val(0);
                });

                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }
    ///////////////////////////////////////////////////////////////Opportunities
    $scope.newOpportunity = {
        AssignedTo: $scope.userId,
        Confidence: 50,
        CreatedBy: $scope.userId,
        CreatedDate: new Date(),
        Currancy: "USD",
        CurrentStatus: "",
        DateOpen: "2015-11-23T08:15:12.156Z",
        Note: "",
        Repetion: "",
        StatusLabel: "",
        Value: "",
        AssignedToLabel: "",
        EstimateDate: ""
    };

    $scope.OpportunityStatus = '';

    $scope.OpportunityToEdit;
    $scope.addNewOpportunityPart = false;

    $scope.addOpportunity = function () {

        // StatusLabel
        for (var i = 0; i < $scope.OpportunitiesStatus.length; i++) {
            if (($scope.OpportunitiesStatus[i]._id) == $scope.newOpportunity.CurrentStatus) {
                $scope.newOpportunity.StatusLabel = $scope.OpportunitiesStatus[i].Title;
            }
        }

        // AssignedToLabel
        for (var i = 0; i < $scope.OrganizationUsers.length; i++) {
            if (($scope.OrganizationUsers[i]._id) == $scope.newOpportunity.AssignedTo) {
                $scope.newOpportunity.AssignedToLabel = ($scope.OrganizationUsers[i].FirstName + ' ' + $scope.OrganizationUsers[i].LastName);
            }
        }

        // ContactLabel
        for (var i = 0; i < $scope.lead.Contacts.length; i++) {
            if (($scope.lead.Contacts[i]._id) == $scope.newOpportunity.Contact) {
                $scope.newOpportunity.ContactLabel = $scope.lead.Contacts[i].Name;
            }
        }

        $scope.newOpportunity.EstimateDate = $('#newOppEstimatedDate').val();
        // //console.log($scope.newOpportunity);

        $scope.lead.Opportunities.push($scope.newOpportunity);
        //  //console.log($scope.lead);
        $scope.lead.Activities = $scope.allActivitiesList;
        $scope.newOpportunity = {};
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            //console.log(data);
            if (data.type == 100) {
                //  //console.log(data.type);
                // //console.log(data.data);
                $scope.addNewOpportunityPart = false;
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    if (data.errors) {
                        for (var i = 0; i < data.errors.length; i++) {
                            //console.log(data.errors[i].message);
                        }
                    }
                }
            }
        });

    }

    $scope.saveOpportunity = function (Opportunity) {
        var oldStatus = $scope.OpportunityToEdit.StatusLabel;
        var newStatus = "";
        // StatusLabel
        for (var i = 0; i < $scope.OpportunitiesStatus.length; i++) {
            if (($scope.OpportunitiesStatus[i]._id) == $scope.OpportunityToEdit.CurrentStatus) {
                $scope.OpportunityToEdit.StatusLabel = $scope.OpportunitiesStatus[i].Title;
                newStatus = $scope.OpportunityToEdit.StatusLabel;
            }
        }

        // AssignedToLabel
        for (var i = 0; i < $scope.OrganizationUsers.length; i++) {
            if (($scope.OrganizationUsers[i]._id) == $scope.OpportunityToEdit.AssignedTo) {
                $scope.OpportunityToEdit.AssignedToLabel = ($scope.OrganizationUsers[i].FirstName + ' ' + $scope.OrganizationUsers[i].LastName);
            }
        }

        // ContactLabel
        for (var i = 0; i < $scope.lead.Contacts.length; i++) {
            if (($scope.lead.Contacts[i]._id) == $scope.OpportunityToEdit.Contact) {
                $scope.OpportunityToEdit.ContactLabel = $scope.lead.Contacts[i].Name;
            }
        }

        //console.log($scope.OpportunityToEdit.StatusLabel);
        if ($scope.OpportunityToEdit.StatusLabel == "Won") {
            $scope.OpportunityToEdit.Confidence = 100;
        }
        if ($scope.OpportunityToEdit.StatusLabel == "Lost") {
            $scope.OpportunityToEdit.Confidence = 0;
        }

        var objNewOpprtunityStatusChangeActivity = {
            Attributes: {
                From: oldStatus,
                To: newStatus,
                Value: $scope.OpportunityToEdit.Value,
                OppRepetion: $scope.OpportunityToEdit.Repetion
            },
            Date: new Date(),
            Status: "Active",
            TimeAgo: "Not yet",
            Type: "OpprtunityStatusChange"
        };
        //console.log(objNewOpprtunityStatusChangeActivity);
        $scope.lead.Activities = $scope.allActivitiesList;
        if (newStatus != oldStatus) {
            $scope.lead.Activities.push(objNewOpprtunityStatusChangeActivity);
        }

        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                // after save close the edit part
                Opportunity.showEditOpportunity = !Opportunity.showEditOpportunity;
                $scope.$apply();
                var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                promise.error(function (data) {
                    // //console.log(data);
                    if (data.readyState) {
                        //console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    if (data.type == 100) {
                        //console.log(data.data);
                        $scope.allActivitiesList = data.data;
                        $scope.filterableList = data.data;
                        $scope.$apply();
                    }
                    else {
                        if (data.message) {
                            //console.log(data.message);
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                //console.log(data.errors[i].message);
                            }
                        }
                    }
                });
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });

    }

    $scope.deleteOpportunity = function (Opportunity) {
        var index = $scope.lead.Opportunities.indexOf(Opportunity);
        // //console.log($scope.lead.Opportunities)
        $scope.lead.Opportunities.splice(index, 1);
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                // //console.log(data.type);
                //  //console.log(data.data);

                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });

    }

    $scope.showAddNewOpportunityPart = function () {
        $scope.addNewOpportunityPart = true;
    }

    $scope.hideAddNewOpportunityPart = function () {
        $scope.addNewOpportunityPart = false;
    }

    $scope.hoverOpportunity = function (Opportunity) {
        // Shows/hides the delete button on hover
        return Opportunity.showEditOpportunityIcon = !Opportunity.showEditOpportunityIcon;
    };

    $scope.showEditOpportunityPart = function (Opportunity, index) {
        $scope.OpportunityToEdit = Opportunity;
        $scope.OpportunityToEdit.AssignedTo = Opportunity.AssignedTo;
        $scope.OpportunityToEdit.AssignedToLabel = Opportunity.AssignedToLabel;

        var date = new Date($scope.OpportunityToEdit.EstimateDate);
        var formatted = moment(date).format('MM-DD-YYYY');
        // //console.log(formatted);
        $("#editEstimatedDate" + index).daterangepicker({
            "opens": "right",
            "singleDatePicker": true,
            "startDate": formatted
        });
        $("#editEstimatedDate" + index).on('change', function (e) {
            $scope.OpportunityToEdit.EstimateDate = $("#editEstimatedDate" + index).val();
            // //console.log($scope.OpportunityToEdit.EstimateDate);
        });

        // //console.log(Opportunity);
        return Opportunity.showEditOpportunity = !Opportunity.showEditOpportunity;
    }

    $scope.hoverActivityOpprtunityStatusChange = function (activity) {
        return activity.showDeleteOpprtunityActivity = !activity.showDeleteOpprtunityActivity;
    }

    $scope.deleteActivityOpprtunityStatusChange = function (activity) {
        $scope.lead.Activities = $scope.allActivitiesList;
        var index = $scope.lead.Activities.indexOf(activity);
        $scope.lead.Activities.splice(index, 1);
        // activities
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            //console.log(data);
            if (data.type == 100) {
                var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                promise.error(function (data) {
                    // //console.log(data);
                    if (data.readyState) {
                        //console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    if (data.type == 100) {
                        //console.log(data.data);
                        $scope.allActivitiesList = data.data;
                        $scope.filterableList = data.data;
                        $scope.$apply();
                    }
                    else {
                        if (data.message) {
                            //console.log(data.message);
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                //console.log(data.errors[i].message);
                            }
                        }
                    }
                });
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    //////////////////////////////////////////////////////////////////// custom fields
    $scope.newCustomFieldObj = {
        CurrentValue: '',
        Name: "",
        Type: "",
        Values: "",
        CurrentTime: ""
    };

    $scope.customFieldSelect = function (type) {
        if (type == 'Choices') {
            $scope.NewChoics = '';
            $scope.showChoices = true;
        }
        else {
            $scope.showChoices = false;
        }
    }

    var choicesCounter = 1;
    $scope.choicesList = [];
    $scope.NewChoiceTxt = '';

    $scope.addChoice = function () {
        $scope.choicesList.push({ 'id': choicesCounter, 'choice': $scope.NewChoiceTxt });
        choicesCounter++;
        $scope.NewChoiceTxt = '';
        // //console.log($scope.choicesList);
    }

    $scope.removeChoice = function (onechoice) {
        var index = $scope.choicesList.indexOf(onechoice);
        $scope.choicesList.splice(index, 1);
        //  //console.log($scope.choicesList);
    }

    $scope.newCustomField = false;
    $scope.completeCustomFieldAdding = false;
    $scope.viewCustomField = true;
    $scope.showChoices = false;
    $scope.hideSpecialCustomField = true;

    $scope.createNewCustomField = function () {
        $scope.viewCustomField = false;
        $scope.completeCustomFieldAdding = false;
        $scope.newCustomField = true;
        $scope.customFieldSelector = 'text';
        $scope.modalChoiceName = '';

        $scope.showChoices = false;
        $scope.choicesList = [];
        $scope.NewChoiceTxt = '';

        $timeout(function () {
            $(".chosenSelector").chosen();
        });
    }

    $scope.cancelCreateNewCustomField = function () {
        $scope.newCustomField = false;

        $scope.newCustomField = false;
        $scope.completeCustomFieldAdding = false;
        $scope.viewCustomField = true;

        $scope.showChoices = false;
        $scope.choicesList = [];
        $scope.NewChoiceTxt = '';
    }

    $scope.organizationCustomFields = userObject.Organizations[0].Orgnization.CustomFields;

    $scope.fieldToEdit;
    $scope.arraycustomfields=[];
    $scope.initiateChoicesInCustomField = function (field, index) {

        $scope.FieldToEdit = field;
        $scope.FieldToEdit.fillCustomChoices;

        if ($scope.FieldToEdit.Type == 'Choices') {
            // set values + save 
            $scope.FieldToEdit.fillCustomChoices = [];
            var array = $scope.FieldToEdit.Values.split(','); console.log(array);
            for (var i = 0; i < array.length; i++) {
                if (array[i] != "") {
                    array[i] = $.trim(array[i]);
                    $scope.FieldToEdit.fillCustomChoices.push({ value: array[i] });
                }
            }
            $timeout(function () {
                //console.log($scope.FieldToEdit.fillCustomChoices);
                //$("#editableChosenSelector" + index).val($scope.FieldToEdit.CurrentValue);
                $("#editableChosenSelector" + index).trigger("chosen:updated.chosen");
                $("#editableChosenSelector" + index).on('change', function (e) {
                    //alert();
                    field.CurrentValue = $("#editableChosenSelector" + index).val();
                    console.log(field.CurrentValue);
                    
                });
            }, 500);

            
        }

        if ($scope.FieldToEdit.Type == 'Date') {
            //var date = new Date($scope.FieldToEdit.CurrentValue);
            //var formatted = moment(date).format('MM-DD-YYYY');
            $timeout(function () {
                $("#editCustomFieldDateOnlyDate" + index).daterangepicker({
                    "opens": "right",
                    "singleDatePicker": true,
                    //"startDate": formatted
                });
                $("#editCustomFieldDateOnlyDate" + index).on('change', function (e) {
                    field.CurrentValue = $("#editCustomFieldDateOnlyDate" + index).val();
                    console.log(field.CurrentValue);
                });
            });
            
           
        }

        if ($scope.FieldToEdit.Type == 'DateTime') {
            //var date = new Date($scope.FieldToEdit.CurrentValue);
            //var formatted = moment(date).format('MM-DD-YYYY');
            $timeout(function () {
                $("#editCustomFieldDateOfDateTime" + index).daterangepicker({
                    "opens": "right",
                    "singleDatePicker": true,
                    //"startDate": formatted
                });
                $("#editCustomFieldTimeOfDateTime" + index).timepicker();

                $("#editCustomFieldDateOfDateTime" + index).on('change', function (e) {
                    field.CurrentValue = $("#editCustomFieldDateOfDateTime" + index).val();
                    console.log(field.CurrentValue);
                });

                $("#editCustomFieldTimeOfDateTime" + index).on('change', function (e) {
                    field.CurrentTime = $("#editCustomFieldTimeOfDateTime" + index).val();
                    console.log(field.CurrentTime);
                });
            });
            
            
        }
        
        //return field.showEditField = !field.showEditField;
    }

    $("#saveGlobalCustomField").on('click', function (e) {
        console.log($scope.organizationCustomFields);
        //// if field has value , create it (push) ---> console.log(field.CurrentValue);
        //// else if ignore
        for (var i = 0; i < $scope.organizationCustomFields.length; i++) {
            if ($scope.organizationCustomFields[i].CurrentValue != "") {
                $scope.lead.CustomFeilds.push($scope.organizationCustomFields[i]);
            }
        }

        $timeout(function () {
            var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
            promise.error(function (data) {
                // //console.log(data);
                if (data.readyState) {
                    //console.log('connection error');
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                console.log(data);
                if (data.type == 100) {
                    // after save close the edit part
                    $scope.newCustomField = false;
                    $scope.completeCustomFieldAdding = false;
                    $scope.viewCustomField = true;
                    $scope.showChoices = false;
                    $scope.hideSpecialCustomField = true;
                    $scope.$apply();
                }
                else {
                    if (data.message) {
                        //console.log(data.message);
                    }
                    else {
                        for (var i = 0; i < data.errors.length; i++) {
                            //console.log(data.errors[i].message);
                        }
                    }
                }
            });
        });

       

    });

    $scope.fillNewCustomField = function () {
        console.log(userObject.Organizations[0].Orgnization.CustomFields);
        $scope.completeCustomFieldAdding = true;
        $scope.hideSpecialCustomField = true;
    }
   
    $scope.addCustomFieldEditableToLeadprofile = function (type) {
        $scope.newCustomField = false;
        $scope.hideSpecialCustomField = false;
        $scope.viewCustomField = false;

        $scope.customFieldType = type;
        $timeout(function () {
            $(".chosenSelector").chosen();
            $("#newCustomFieldDateOnly").daterangepicker({
                "opens": "right",
                "singleDatePicker": true,
            });
            $("#newCustomFieldDateOfDateTime").daterangepicker({
                "opens": "right",
                "singleDatePicker": true,
            });

            $("#newCustomFieldTimeOfDateTime").timepicker();
        });
    }


    $scope.addCustomFieldViewableToLeadprofile = function (customFieldType) {
        

        console.log($scope.organizationCustomFields);

        $scope.newCustomFieldObj.Type = $scope.customFieldType;
        $scope.newCustomFieldObj.Name = $scope.modalChoiceName;
        if ($scope.customFieldType == 'Choices') {

            var customValues = "";
            for (var i = 0; i < $scope.choicesList.length; i++) {
                if ($scope.choicesList.length == 1) {
                    customValues += $scope.choicesList[i].choice + " , ";
                }
                else {
                    customValues += $scope.choicesList[i].choice + " , ";
                }
            }
            customValues = customValues.substring(0, customValues.length - 1);
            // //console.log(customValues);

            $scope.newCustomFieldObj.Values = customValues;
            $scope.newCustomFieldObj.CurrentValue = $('#customSelectValues').val();
        }

        if ($scope.customFieldType == 'Date') {

            $scope.newCustomFieldObj.CurrentValue = $("#newCustomFieldDateOnly").val();
            $("#newCustomFieldDateOnly").daterangepicker({
                "opens": "right",
                "singleDatePicker": true,
            });

            $("#newCustomFieldDateOnly").on('change', function (e) {
                $scope.newCustomFieldObj.CurrentValue = $("#newCustomFieldDateOnly").val();
                //console.log($scope.newCustomFieldObj.CurrentValue);
            });
        }

        if ($scope.customFieldType == 'DateTime') {
            $scope.newCustomFieldObj.CurrentValue = $("#newCustomFieldDateOfDateTime").val();
            $("#newCustomFieldDateOfDateTime").daterangepicker({
                "opens": "right",
                "singleDatePicker": true,
            });

            $("#newCustomFieldDateOfDateTime").on('change', function (e) {
                $scope.newCustomFieldObj.CurrentValue = $("#newCustomFieldDateOfDateTime").val();
                //console.log($scope.newCustomFieldObj.CurrentValue);
            });


            $scope.newCustomFieldObj.CurrentTime = $("#newCustomFieldTimeOfDateTime").val();

            $("#newCustomFieldTimeOfDateTime").on('change', function (e) {
                $scope.newCustomFieldObj.CurrentTime = $("#newCustomFieldTimeOfDateTime").val();
                //console.log($scope.newCustomFieldObj.CurrentTime);
            });
        }

        //   //console.log($scope.newCustomFieldObj);
        $timeout(function () {
            $(".chosenSelector").chosen();
        });

        $scope.lead.CustomFeilds.push($scope.newCustomFieldObj);
        console.log($scope.lead);
        $scope.lead.Activities = $scope.allActivitiesList;
        $scope.newCustomFieldObj = {};
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                //  //console.log(data.type);
                //  //console.log(data.data);
                $scope.newCustomField = false;
                $scope.completeCustomFieldAdding = false;
                $scope.viewCustomField = true;
                $scope.hideSpecialCustomField = true;

                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    if (data.errors) {
                        for (var i = 0; i < data.errors.length; i++) {
                            //console.log(data.errors[i].message);
                        }
                    }
                }
            }
        });
        }
   

    $scope.showFieldIcons = false;
    $scope.showEditField = false;

    $scope.hoverField = function (field) {
        return field.showFieldIcons = !field.showFieldIcons;
    }

    $scope.fillCustomChoices = [];

    $scope.EditField = function (field, index) {
        $scope.fillCustomChoices = [];
        $scope.FieldToEdit = field;

        if ($scope.FieldToEdit.Type == 'Choices') {
            // set values + save 
            var array = $scope.FieldToEdit.Values.split(',');
            for (var i = 0; i < array.length; i++) {
                if (array[i] != "") {
                    array[i] = $.trim(array[i]);
                    $scope.fillCustomChoices.push({ value: array[i] });
                }
            }
            $timeout(function () {
                $("#editableChosenSelector" + index).val($scope.FieldToEdit.CurrentValue);
                $("#editableChosenSelector" + index).trigger("chosen:updated.chosen");
            });
            $("#editableChosenSelector" + index).on('change', function (e) {
                $scope.FieldToEdit.CurrentValue = $("#editableChosenSelector" + index).val();
                var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
                promise.error(function (data) {
                    // //console.log(data);
                    if (data.readyState) {
                        //console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    // //console.log(data);
                    if (data.type == 100) {
                        //   //console.log(data.type);
                        //   //console.log(data.data);
                        // after save close the edit part
                        $scope.FieldToEdit.showEditField = false;
                        $scope.$apply();
                    }
                    else {
                        if (data.message) {
                            //console.log(data.message);
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                //console.log(data.errors[i].message);
                            }
                        }
                    }
                });
            });
        }

        if ($scope.FieldToEdit.Type == 'Date') {
            var date = new Date($scope.FieldToEdit.CurrentValue);
            var formatted = moment(date).format('MM-DD-YYYY');
            $("#editCustomFieldDateOnlyDate" + index).daterangepicker({
                "opens": "right",
                "singleDatePicker": true,
                "startDate": formatted
            });
            $("#editCustomFieldDateOnlyDate" + index).on('change', function (e) {
                $scope.FieldToEdit.CurrentValue = $("#editCustomFieldDateOnlyDate" + index).val();
                //console.log($scope.FieldToEdit.CurrentValue);
            });
        }

        if ($scope.FieldToEdit.Type == 'DateTime') {
            var date = new Date($scope.FieldToEdit.CurrentValue);
            var formatted = moment(date).format('MM-DD-YYYY');
            $("#editCustomFieldDateOfDateTime" + index).daterangepicker({
                "opens": "right",
                "singleDatePicker": true,
                "startDate": formatted
            });
            $("#editCustomFieldDateOfDateTime" + index).on('change', function (e) {
                $scope.FieldToEdit.CurrentValue = $("#editCustomFieldDateOfDateTime" + index).val();
                //console.log($scope.FieldToEdit.CurrentValue);
            });

            $("#editCustomFieldTimeOfDateTime" + index).timepicker();

            $("#editCustomFieldTimeOfDateTime" + index).on('change', function (e) {
                $scope.FieldToEdit.CurrentTime = $("#editCustomFieldTimeOfDateTime" + index).val();
                //console.log($scope.FieldToEdit.CurrentTime);
            });
        }

        return field.showEditField = !field.showEditField;
    }

    $scope.saveField = function (field, index) {

        $timeout(function () {
            var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
            promise.error(function (data) {
                // //console.log(data);
                if (data.readyState) {
                    //console.log('connection error');
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                // //console.log(data);
                if (data.type == 100) {
                    //   //console.log(data.type);
                    //  //console.log(data.data);
                    // after save close the edit part
                    $scope.FieldToEdit.showEditField = false;
                    $scope.hideSpecialCustomField = true;
                    $scope.$apply();
                }
                else {
                    if (data.message) {
                        //console.log(data.message);
                    }
                    else {
                        for (var i = 0; i < data.errors.length; i++) {
                            //console.log(data.errors[i].message);
                        }
                    }
                }
            });
        }, 200);

    }

    /////////////////////////////////////////////////////////////// lead data

    $scope.saveLeadData = function () {
        //  //console.log($scope.lead);
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                $scope.showEditLeadData = false;
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });


    }

    $scope.updateLeadStatus = function () {
        if ($('#leadStatusSelector').val() == 'Customize') {
            window.location = '#/settings/customizationsetting';
        }
        else {
            var oldStatus = $scope.lead.StatusLabel;
            $scope.lead.StatusLabel = $('#leadStatusSelector  option:selected').text();
            var newStatus = $scope.lead.StatusLabel;

            var objNewStatusChangeActivity = {
                Attributes: {
                    From: oldStatus,
                    To: newStatus
                },
                Date: new Date(),
                Status: "Active",
                TimeAgo: "Not yet",
                Type: "LeadStatusChange"
            };

            //console.log(objNewStatusChangeActivity);
            $scope.lead.Activities = $scope.allActivitiesList;
            $scope.lead.Activities.push(objNewStatusChangeActivity);

            var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
            promise.error(function (data) {
                // //console.log(data);
                if (data.readyState) {
                    //console.log('connection error');
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                // //console.log(data);
                if (data.type == 100) {
                    var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                    promise.error(function (data) {
                        // //console.log(data);
                        if (data.readyState) {
                            //console.log('connection error');
                        }
                    });
                    promise.done(function (data, textStatus, jqXhr) {
                        if (data.type == 100) {
                            //console.log(data.data);
                            $scope.allActivitiesList = data.data;
                            $scope.filterableList = data.data;
                            $scope.$apply();
                        }
                        else {
                            if (data.message) {
                                //console.log(data.message);
                            }
                            else {
                                for (var i = 0; i < data.errors.length; i++) {
                                    //console.log(data.errors[i].message);
                                }
                            }
                        }
                    });
                }
                else {
                    if (data.message) {
                        //console.log(data.message);
                    }
                    else {
                        for (var i = 0; i < data.errors.length; i++) {
                            //console.log(data.errors[i].message);
                        }
                    }
                }
            });
        }
    }

    $scope.hoverActivityTask = function (activity) {
        return activity.showDeleteTaskIcon = !activity.showDeleteTaskIcon;
    }

    $scope.deleteActivityLeadStatusChange = function (activity) {
        $scope.lead.Activities = $scope.allActivitiesList;
        var index = $scope.lead.Activities.indexOf(activity);
        $scope.lead.Activities.splice(index, 1);
        // activities
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            //console.log(data);
            if (data.type == 100) {
                var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                promise.error(function (data) {
                    // //console.log(data);
                    if (data.readyState) {
                        //console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    if (data.type == 100) {
                        //console.log(data.data);
                        $scope.allActivitiesList = data.data;
                        $scope.filterableList = data.data;
                        $scope.$apply();
                    }
                    else {
                        if (data.message) {
                            //console.log(data.message);
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                //console.log(data.errors[i].message);
                            }
                        }
                    }
                });
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    $scope.deleteLead = function () {
        if (confirm("Are you sure you want to delete this lead?")) {
            // todo code for deletion

            var objCurrentLead = {
                id: $scope.lead
            };
            var promise = Warehouse.CallApi('/lead/remove', 'PUT', objCurrentLead, false);
            promise.error(function (data) {
                // //console.log(data);
                if (data.readyState) {
                    //console.log('connection error');
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                // //console.log(data);
                if (data.type == 100) {
                    //  //console.log(data.type);
                    //  //console.log(data.data);
                    window.location = "#/leads";
                    $scope.$apply();
                }
                else {
                    if (data.message) {
                        //console.log(data.message);
                    }
                    else {
                        for (var i = 0; i < data.errors.length; i++) {
                            //console.log(data.errors[i].message);
                        }
                    }
                }
            });
        }
    }

    $scope.mergeLeads = function (lead) {
        if (confirm('Merge the current lead into "' + lead.Title + '" and then delete it?')) {
            var mergingObj = {
                id: $scope.leadId,
                toLead: lead._id
            };
            // //console.log(mergingObj);
            var promise = Warehouse.CallApi('/lead/merge', 'PUT', mergingObj, false);
            promise.error(function (data) {
                // //console.log(data);
                if (data.readyState) {
                    //console.log('connection error');
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                // //console.log(data);
                if (data.type == 100) {
                    //   //console.log(data.type);
                    //   //console.log(data.data);
                    $scope.dismiss();
                    window.location = '#/leadprofile/' + lead._id;

                    $scope.$apply();
                }
                else {
                    if (data.message) {
                        //console.log(data.message);
                    }
                    else {
                        for (var i = 0; i < data.errors.length; i++) {
                            //console.log(data.errors[i].message);
                        }
                    }
                }
            });
        }
    }

    /////////////////////////////////////////////////////////////// lead addresses

    // default value of new address 
    $('#NewAddressCountrySelectValues').val('United States');

    $scope.newAddress = {
        "Type": "",
        "Country": "",
        "State": "",
        "City": "",
        "Address": "",
        "ContinueAddress": "",
        "PostalCode": "",
        "GEOID": ""
    };

    $scope.AddressToEdit;
    $scope.addNewAddressPart = true;

    $scope.addAddress = function () {
        $scope.newAddress.Country = $('#NewAddressCountrySelectValues').val();
        $scope.lead.Addresses.push($scope.newAddress);
        $scope.newAddress = {};
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                $scope.addNewAddressPart = false;
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    $scope.showEditAddressPart = function (oneaddress, index) {
        $scope.AddressToEdit = oneaddress;
        oneaddress.showEditAddress = true;
        $("#oneaddress" + index).val($scope.AddressToEdit.Country);
        $("#oneaddress" + index).trigger("chosen:updated.chosen");
        setTimeout(function () {
            $(".chosenSelector").chosen();
        }, 300);
    }


    $scope.saveAddress = function (oneaddress, index) {

        $scope.AddressToEdit.Country = $("#oneaddress" + index).val();
        //  //console.log($scope.AddressToEdit.Country);
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                oneaddress.showEditAddress = false;
                $timeout(function () {
                    $(".chosenSelector").chosen();
                });
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    $scope.removeAddress = function (oneaddress) {
        var index = $scope.lead.Addresses.indexOf(oneaddress);
        //  //console.log($scope.lead.Addresses)
        $scope.lead.Addresses.splice(index, 1);
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }


    /////////////////////////////////////////////////////////////// add note

    $scope.addNewNote = false;
    $scope.newNoteText = '';

    $scope.NoteToEdit;

    $scope.showAddNewNotePart = function () {
        $scope.addNewNote = true;
    }

    $scope.deleteNewNote = function () {
        $scope.addNewNote = false;
        $scope.newNoteText = '';
    }

    $scope.addNoteToTimeline = function () {
        var objNewNote = {
            lead: $scope.leadId,
            text: $scope.newNoteText
        };
        var promise = Warehouse.CallApi('/activity/note', 'PUT', objNewNote, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            if (data.type == 100) {
                $scope.addNewNote = false;
                $scope.newNoteText = '';
                // should call update activities
                // activities
                var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                promise.error(function (data) {
                    // //console.log(data);
                    if (data.readyState) {
                        //console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    if (data.type == 100) {
                        //console.log(data.data);
                        $scope.allActivitiesList = data.data;
                        $scope.filterableList = data.data;
                        $scope.$apply();
                    }
                    else {
                        if (data.message) {
                            //console.log(data.message);
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                //console.log(data.errors[i].message);
                            }
                        }
                    }
                });
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    $scope.hoverNote = function (activity) {
        return activity.showEditNoteLink = !activity.showEditNoteLink;
    }

    $scope.showEditNotePart = function (activity) {
        $scope.NoteToEdit = activity;
        return activity.showEditNote = !activity.showEditNote;
    }

    $scope.deleteNote = function (activity) {
        // delete note 
        $scope.lead.Activities = $scope.allActivitiesList;
        var index = $scope.lead.Activities.indexOf(activity);
        $scope.lead.Activities.splice(index, 1);

        // call update activities
        // activities
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            //console.log(data);
            if (data.type == 100) {
                var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                promise.error(function (data) {
                    // //console.log(data);
                    if (data.readyState) {
                        //console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    if (data.type == 100) {
                        //console.log(data.data);
                        $scope.allActivitiesList = data.data;
                        $scope.filterableList = data.data;
                        $scope.NoteToEdit.showEditNote = false;
                        $scope.$apply();
                    }
                    else {
                        if (data.message) {
                            //console.log(data.message);
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                //console.log(data.errors[i].message);
                            }
                        }
                    }
                });
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    $scope.saveNote = function (activity) {
        // activities 
        $scope.lead.Activities = $scope.allActivitiesList;
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            //console.log(data);
            if (data.type == 100) {
                var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                promise.error(function (data) {
                    // //console.log(data);
                    if (data.readyState) {
                        //console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    if (data.type == 100) {
                        //console.log(data.data);
                        $scope.allActivitiesList = data.data;
                        $scope.filterableList = data.data;
                        $scope.NoteToEdit.showEditNote = false;
                        $scope.$apply();
                    }
                    else {
                        if (data.message) {
                            //console.log(data.message);
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                //console.log(data.errors[i].message);
                            }
                        }
                    }
                });
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });

    }
    /////////////////////////////////////////////////////////////// add call

    $scope.addNewCall = false;
    $scope.newCallText = '';
    $scope.newCallDuration = '';


    var fillCallContactSelect = [];

    $scope.showAddNewCallPart = function () {
        $scope.addNewCall = true;

        fillCallContactSelect = [];
        var id = 1;
        for (var i = 0; i < $scope.lead.Contacts.length; i++) {
            for (var j = 0; j < $scope.lead.Contacts[i].Details.length; j++) {
                fillCallContactSelect.push({ 'id': id, 'contactName': $scope.lead.Contacts[i].Name, 'contactNumber': $scope.lead.Contacts[i].Details[j].Value });
                id++;
            }
        }
        $scope.allContactsDetails = fillCallContactSelect;
        $scope.allContactsDetails.id = '';
    }

    $scope.deleteNewCall = function () {
        $scope.addNewCall = false;
        $scope.newCallText = '';
        $scope.allContactsDetails = [];
    }

    $scope.addCallToTimeline = function () {
        var objNewCall = {
            lead: $scope.leadId,
            text: $scope.newCallText,
            contact: $scope.allContactsDetails[$scope.allContactsDetails.id - 1].contactName,
            number: $scope.allContactsDetails[$scope.allContactsDetails.id - 1].contactNumber,
            Duration: $scope.newCallDuration
        };
        // //console.log(objNewCall);
        var promise = Warehouse.CallApi('/activity/logcall', 'PUT', objNewCall, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            if (data.type == 100) {
                //  //console.log(data.type);
                //  //console.log(data.data);
                $scope.addNewCall = false;
                $scope.newCallText = '';
                $scope.newCallDuration = '';
                $scope.allContactsDetails.id = '';
                $scope.$apply();
                // should call update activities
                // activities
                var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                promise.error(function (data) {
                    // //console.log(data);
                    if (data.readyState) {
                        //console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    // //console.log(data);
                    if (data.type == 100) {
                        //   //console.log(data.type);
                        //console.log(data.data);
                        $scope.allActivitiesList = data.data;
                        $scope.filterableList = data.data;
                        $scope.$apply();
                    }
                    else {
                        if (data.message) {
                            //console.log(data.message);
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                //console.log(data.errors[i].message);
                            }
                        }
                    }
                });
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });


    }

    $scope.hoverCall = function (activity) {
        return activity.showEditCallLink = !activity.showEditCallLink;
    }

    $scope.showEditCallPart = function (activity) {
        $scope.CallToEdit = activity;

        fillCallContactSelect = [];
        var id = 1;
        for (var i = 0; i < $scope.lead.Contacts.length; i++) {
            for (var j = 0; j < $scope.lead.Contacts[i].Details.length; j++) {
                fillCallContactSelect.push({ 'id': id, 'contactName': $scope.lead.Contacts[i].Name, 'contactNumber': $scope.lead.Contacts[i].Details[j].Value });
                id++;
            }
        }
        $scope.CallToEdit.allContactsDetails = fillCallContactSelect;
        //$scope.allContactsDetails.id = '';
        //console.log($scope.CallToEdit);
        return activity.showEditCall = !activity.showEditCall;
    }

    $scope.deleteCall = function (activity) {
        // delete Call 
        $scope.lead.Activities = $scope.allActivitiesList;
        var index = $scope.lead.Activities.indexOf(activity);
        //  //console.log($scope.lead.Activities)
        $scope.lead.Activities.splice(index, 1);

        // activities
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            //console.log(data);
            if (data.type == 100) {
                var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                promise.error(function (data) {
                    // //console.log(data);
                    if (data.readyState) {
                        //console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    if (data.type == 100) {
                        //console.log(data.data);
                        $scope.allActivitiesList = data.data;
                        $scope.filterableList = data.data;
                        $scope.$apply();
                    }
                    else {
                        if (data.message) {
                            //console.log(data.message);
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                //console.log(data.errors[i].message);
                            }
                        }
                    }
                });
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });

    }

    $scope.saveCall = function (activity) {
        // get contact name & number
        for (var i = 0; i < activity.allContactsDetails.length; i++) {
            if ((activity.allContactsDetails[i]).contactNumber == activity.Attributes.Number) {
                //console.log((activity.allContactsDetails[i]).contactName);
                //console.log((activity.allContactsDetails[i]).contactNumber);
                activity.Attributes.Number = (activity.allContactsDetails[i]).contactNumber;
                activity.Attributes.Contact = (activity.allContactsDetails[i]).contactName;
            }
        }

        // call update activities 
        //console.log($scope.allActivitiesList);
        $scope.lead.Activities = $scope.allActivitiesList;

        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            //console.log(data);
            if (data.type == 100) {
                $scope.CallToEdit.showEditCall = false;
                var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                promise.error(function (data) {
                    // //console.log(data);
                    if (data.readyState) {
                        //console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    if (data.type == 100) {
                        //console.log(data.data);
                        $scope.allActivitiesList = data.data;
                        $scope.filterableList = data.data;
                        $scope.$apply();
                    }
                    else {
                        if (data.message) {
                            //console.log(data.message);
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                //console.log(data.errors[i].message);
                            }
                        }
                    }
                });
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });

    }

    /////////////////////////////////////////////////////////////// task part

    $scope.hoverActivityLeadStatusChange = function (activity) {
        return activity.showDeleteLeadStatusChangeIcon = !activity.showDeleteLeadStatusChangeIcon;
    }

    $scope.deleteActivityTask = function (activity) {
        $scope.lead.Activities = $scope.allActivitiesList;
        var index = $scope.lead.Activities.indexOf(activity);
        $scope.lead.Activities.splice(index, 1);
        // activities
        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            //console.log(data);
            if (data.type == 100) {
                var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                promise.error(function (data) {
                    // //console.log(data);
                    if (data.readyState) {
                        //console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    if (data.type == 100) {
                        //console.log(data.data);
                        $scope.allActivitiesList = data.data;
                        $scope.filterableList = data.data;
                        $scope.$apply();
                    }
                    else {
                        if (data.message) {
                            //console.log(data.message);
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                //console.log(data.errors[i].message);
                            }
                        }
                    }
                });
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    /////////////////////////////////////////////////////////////// add email

    //to force prepare mail to be called one time only , initialize var x
    var x = 0;

    newMessageReciversArray = [];
    newMessageCopyReciversArray = [];
    newMessageBlindReciversArray = [];

    $scope.addNewMail = false;
    $scope.mailSubject = '';
    $scope.newMessageBody = '';


    $scope.showAddNewMailPart = function () {
        $scope.addNewMail = true;

        fillSendMailToSelect = [];
        // This shold be used in pre populate part for the field to 
        fillSendMailToSelectFirstObj = [];
        var id = 1;
        for (var i = 0; i < $scope.lead.Contacts.length; i++) {
            for (var j = 0; j < $scope.lead.Contacts[i].Details.length; j++) {
                if (($scope.lead.Contacts[i].Details[j].Value).indexOf('@') > -1 && ($scope.lead.Contacts[i].Details[j].Value).indexOf('.') > -1) {
                    fillSendMailToSelect.push({ 'id': id, 'name': $scope.lead.Contacts[i].Name, 'mail': $scope.lead.Contacts[i].Details[j].Value });
                    id++;
                }

            }
        }
        //  //console.log(fillSendMailToSelect);
        fillSendMailToSelectFirstObj.push(fillSendMailToSelect[0]);
        newMessageReciversArray.push(fillSendMailToSelect[0]);

        $scope.initialMailTo = fillSendMailToSelect[0].mail;
        $scope.initialSenderName = userObject.FirstName + ' ' + userObject.LastName;
        $scope.initialSenderMail = userObject.Email;
        if (x == 0) {
            x++;
            prepareNewEmail(fillSendMailToSelectFirstObj, fillSendMailToSelect);
        }

        var promise = Warehouse.CallApi('/user/settings/emailtemplate?u=' + $scope.userId, 'GET', false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                $scope.allEmailTemplates = data.data.EmailTemplates;
                $timeout(function () {
                    $("#selectEmailTemplate").val(0);
                });

                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    $scope.deleteNewMail = function () {
        $scope.addNewMail = false;
        $scope.addCCPart = false;
        $scope.addBCCPart = false;
    }

    $scope.addEmailToTimeline = function () {
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


        //var messageBody = $('#newMessageBody').val();
        //var lines = $('#newMessageBody').val().split('\n');
        //var firstLine;
        //for (var i = 0; i < lines.length; i++) {
        //    //code here using lines[i] which will give you each line
        //    firstLine = lines[0];
        //}

        //var isChecked;
        //if (reminderCheckbox.checked) {
        //    isChecked = true;
        //}

        var isChecked;
        if ($('#reminderCheckbox').is(":checked")) {
            isChecked = true;
        }


        var subject;
        if ($scope.mailSubject == "") {
            subject = "No Subject";
        }
        else {
            subject = $scope.mailSubject;
        }

        $timeout(function () {
            if (isChecked == true) {
                var objNewEmail = {
                    lead: $scope.leadId,
                    to: receivers,
                    cc: copyReceivers,
                    bcc: copyBlindReceivers,
                    subject: subject,
                    text: $('#newMessageBody').trumbowyg('html'),
                    user: userObject,
                    EmailStatus: "Sent",
                    MailBy: userObject.FirstName + " " + userObject.LastName,
                    remind: true,
                    remindDate: $('#hiddenReindReplyDate').text(),
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
                    text: $('#newMessageBody').trumbowyg('html'),
                    user: userObject,
                    EmailStatus: "Sent",
                    MailBy: userObject.FirstName + " " + userObject.LastName,
                    Attachements: $scope.filesList
                };
                console.log(objNewEmail);
            }
        });

        
        var promise = Warehouse.CallApi('/activity/email', 'PUT', objNewEmail, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            if (data.type == 100) {
                $scope.addNewMail = false;
                $scope.addCCPart = false;
                $scope.addBCCPart = false;
                receivers = "";
                copyReceivers = "";
                copyBlindReceivers = "";
                subject = "";

                $('#newMessageBody').trumbowyg('html', "");
                // should call update activities
                // activities
                var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                promise.error(function (data) {
                    // //console.log(data);
                    if (data.readyState) {
                        //console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    if (data.type == 100) {
                        //console.log(data.data);
                        $scope.allActivitiesList = data.data;
                        $scope.filterableList = data.data;
                        var promise = Warehouse.CallApi('/lead?id=' + $scope.leadId, 'GET', false);
                        promise.error(function (data) {
                            // //console.log(data);
                            if (data.readyState) {
                                //console.log('connection error');
                            }
                        });
                        promise.done(function (data, textStatus, jqXhr) {
                            // //console.log(data);
                            if (data.type == 100) {
                                //console.log(data.data);
                                $scope.lead = data.data;
                            }
                            else {
                                if (data.message) {
                                    //console.log(data.message);
                                }
                                else {
                                    for (var i = 0; i < data.errors.length; i++) {
                                        //console.log(data.errors[i].message);
                                    }
                                }
                            }
                        });
                        $scope.$apply();
                    }
                    else {
                        if (data.message) {
                            //console.log(data.message);
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                //console.log(data.errors[i].message);
                            }
                        }
                    }
                });
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    $scope.addDraftToTimeline = function () {
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
        if ($('#reminderCheckbox').is(":checked")) {
            isChecked = true;
        }


        var subject;
        if ($scope.mailSubject == "") {
            subject = "No Subject";
        }
        else {
            subject = $scope.mailSubject;
        }

        $timeout(function () {
            if (isChecked == true) {
                var objNewEmail = {
                    lead: $scope.leadId,
                    to: receivers,
                    cc: copyReceivers,
                    bcc: copyBlindReceivers,
                    subject: subject,
                    text: $('#newMessageBody').trumbowyg('html'),
                    user: userObject,
                    EmailStatus: "Draft",
                    MailBy: userObject.FirstName + " " + userObject.LastName,
                    remind: true,
                    remindDate: $('#hiddenReindReplyDate').text(),
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
                    text: $('#newMessageBody').trumbowyg('html'),
                    user: userObject,
                    EmailStatus: "Draft",
                    MailBy: userObject.FirstName + " " + userObject.LastName,
                    Attachements: $scope.filesList
                };
                console.log(objNewEmail);
            }
        });

        
        var promise = Warehouse.CallApi('/activity/email', 'PUT', objNewEmail, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            if (data.type == 100) {
                $scope.addNewMail = false;
                $scope.addCCPart = false;
                $scope.addBCCPart = false;
                receivers = "";
                copyReceivers = "";
                copyBlindReceivers = "";
                subject = "";

                $('#newMessageBody').trumbowyg('html', "");
                // should call update activities
                // activities
                var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                promise.error(function (data) {
                    // //console.log(data);
                    if (data.readyState) {
                        //console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    if (data.type == 100) {
                        //console.log(data.data);
                        $scope.allActivitiesList = data.data;
                        $scope.filterableList = data.data;
                        var promise = Warehouse.CallApi('/lead?id=' + $scope.leadId, 'GET', false);
                        promise.error(function (data) {
                            // //console.log(data);
                            if (data.readyState) {
                                //console.log('connection error');
                            }
                        });
                        promise.done(function (data, textStatus, jqXhr) {
                            // //console.log(data);
                            if (data.type == 100) {
                                //console.log(data.data);
                                $scope.lead = data.data;
                            }
                            else {
                                if (data.message) {
                                    //console.log(data.message);
                                }
                                else {
                                    for (var i = 0; i < data.errors.length; i++) {
                                        //console.log(data.errors[i].message);
                                    }
                                }
                            }
                        });
                        $scope.$apply();
                    }
                    else {
                        if (data.message) {
                            //console.log(data.message);
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                //console.log(data.errors[i].message);
                            }
                        }
                    }
                });
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    $scope.showCollapsedMail = function (activity) {
        return activity.uncollapsedMail = !activity.uncollapsedMail;
    }

    $scope.deleteEmail = function (activity) {
        $scope.lead.Activities = $scope.allActivitiesList;
        var index = $scope.lead.Activities.indexOf(activity);
        //   //console.log($scope.lead.Activities)
        $scope.lead.Activities.splice(index, 1);
        // call update activities

        var promise = Warehouse.CallApi('/lead/fullupdate', 'PUT', $scope.lead, false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            //console.log(data);
            if (data.type == 100) {
                var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
                promise.error(function (data) {
                    // //console.log(data);
                    if (data.readyState) {
                        //console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    if (data.type == 100) {
                        //console.log(data.data);
                        $scope.allActivitiesList = data.data;
                        $scope.filterableList = data.data;
                        $scope.$apply();
                    }
                    else {
                        if (data.message) {
                            //console.log(data.message);
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                //console.log(data.errors[i].message);
                            }
                        }
                    }
                });
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    // read the html tags inside repeated Email body
    $scope.renderHtml = function (html_code) {
        //return  $sce.trustAsHtml((html_code));
        //html_code = html_code.replace('=09', '');
        //html_code = html_code.replace('3D', '');
        //html_code = html_code.replace('= ', '');
        //html_code = html_code.replace('=2C', ',');
        return $sce.trustAsHtml((html_code).replace(/[3D]/g, "").replace(/[=09]/g, "").replace(/[=2C]/g, ","));
    };


    $scope.mailReply = function (index, activity, type) {
        //console.log(type);
        activityToEdit = activity;
        activityToEdit.isReplyIncluded = true;
        if ($("#dvReplyEmail" + index)[0]) {
            // Do something if class exists
        }
        else {
            if (type == 1) {
                //  reply all
                activityToEdit.newMessageReciversArray = [];
                activityToEdit.newMessageCopyReciversArray = [];
                activityToEdit.newMessageBlindReciversArray = [];

                if (activity.Attributes.To) {
                    var array = activity.Attributes.To.split(',');
                    for (var i = 0; i < array.length; i++) {
                        if (array[i] != "") {
                            array[i] = $.trim(array[i]);
                            activityToEdit.newMessageReciversArray.push({ 'mail': array[i] });
                        }
                    }
                }


                if (activity.Attributes.CC) {

                    var array = activity.Attributes.CC.split(',');
                    for (var i = 0; i < array.length; i++) {
                        if (array[i] != "") {
                            array[i] = $.trim(array[i]);
                            activityToEdit.newMessageCopyReciversArray.push({ 'mail': array[i] });
                        }
                    }
                }

                if (activity.Attributes.BCC) {
                    var array = activity.Attributes.BCC.split(',');
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
                            //console.log(activityToEdit.fillCC);
                            //console.log(activityToEdit.newMessageCopyReciversArray);
                        }
                        if (activityToEdit.fillBCC.length > 0) {
                            //this array is not empty 
                            activity.addBCCPart = true;
                        }
                    });
                    $('#initialMailTo' + index).text(activityToEdit.Attributes.To + ',' + activityToEdit.Attributes.CC + ',' + activityToEdit.Attributes.BCC); // need all emails
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

                    activityToEdit.addCCPart = false;
                    activityToEdit.addBCCPart = false;



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
                    if (fillSendMailToSelect.length > 0) {
                        activityToEdit.fillSendMailToSelectFirstObj.push(activityToEdit.fillSendMailToSelect[0]);
                        newMessageReciversArray.push(activityToEdit.fillSendMailToSelect[0]);

                        $('#initialMailTo' + index).text(activityToEdit.fillSendMailToSelect[0].mail);
                        $('#initialSenderName' + index).text(userObject.FirstName + ' ' + userObject.LastName);
                        $('#initialSenderMail' + index).text(userObject.Email);
                    }


                    // convert date in readable formate
                    var unformatedDate = getProperDate(activity.Date);
                    var formatedDate = moment().format('lll');
                    //console.log(getProperDate(activity.Date));
                    function getProperDate(date) {
                        if (date == null) return null;
                        return new Date(parseInt(date.substr(6)));
                    }

                    //console.log(activityToEdit.fillSendMailToSelectFirstObj[0].mail);

                    var message = "On " + formatedDate + " " + activityToEdit.fillSendMailToSelectFirstObj[0].mail + " wrote:<blockquote>";
                    message = message + activity.Attributes.Text + "</blockquote>";

                    $timeout(function () {
                        $('#txtBody' + index).trumbowyg('html', message);
                    }, 500);


                    $('#txtSubject' + index).val("FW: " + activity.Attributes.Subject);

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
                // //console.log(data);
                if (data.readyState) {
                    //console.log('connection error');
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                // //console.log(data);
                if (data.type == 100) {
                    //console.log(data.type);
                    //console.log(data.data);
                    $scope.allEmailTemplates = data.data.EmailTemplates;
                    $timeout(function () {
                        $("#selectTemplate" + index).val(0);
                    });

                    $scope.$apply();
                }
                else {
                    if (data.message) {
                        //console.log(data.message);
                    }
                    else {
                        for (var i = 0; i < data.errors.length; i++) {
                            //console.log(data.errors[i].message);
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
            //console.log($('#selectTemplate' + index).val());
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
        //activity.filesList = [];
        $timeout(function () {
            var filesSelected = document.getElementById("uploadAttachfile1").files;
            if (filesSelected.length > 0) {
                var fileToLoad = filesSelected[0];
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    fileContent = fileLoadedEvent.target.result;
                    fileName = filesSelected[0].name;
                    //console.log(fileContent);
                    //console.log(fileName);
                };
                fileReader.readAsDataURL(fileToLoad);
                $timeout(function () {

                    $scope.filesList.push({ 'Name': fileName, 'Content': fileContent });
                    //filesList = activity.filesList.slice();
                    ////console.log(activity.filesList);
                    //console.log($scope.filesList);
                }, 500);

            }
        });
    }

    $scope.removeFile = function (onechoice) {
        var index = $scope.filesList.indexOf(onechoice);
        $scope.filesList.splice(index, 1);
        //  //console.log($scope.filesList);
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
                //console.log(objNewEmail);
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
                //console.log(objNewEmail);
            }

            var promise = Warehouse.CallApi('/activity/email', 'PUT', objNewEmail, false);
            promise.error(function (data) {
                // //console.log(data);
                if (data.readyState) {
                    //console.log('connection error');
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
                        // //console.log(data);
                        if (data.readyState) {
                            //console.log('connection error');
                        }
                    });
                    promise.done(function (data, textStatus, jqXhr) {
                        if (data.type == 100) {
                            //console.log(data.data);
                            $scope.allActivitiesList = data.data;
                            $scope.filterableList = data.data;
                            var promise = Warehouse.CallApi('/lead?id=' + $scope.leadId, 'GET', false);
                            promise.error(function (data) {
                                // //console.log(data);
                                if (data.readyState) {
                                    //console.log('connection error');
                                }
                            });
                            promise.done(function (data, textStatus, jqXhr) {
                                // //console.log(data);
                                if (data.type == 100) {
                                    //console.log(data.data);
                                    $scope.lead = data.data;

                                }
                                else {
                                    if (data.message) {
                                        //console.log(data.message);
                                    }
                                    else {
                                        for (var i = 0; i < data.errors.length; i++) {
                                            //console.log(data.errors[i].message);
                                        }
                                    }
                                }
                            });
                            $scope.$apply();
                        }
                        else {
                            if (data.message) {
                                //console.log(data.message);
                            }
                            else {
                                for (var i = 0; i < data.errors.length; i++) {
                                    //console.log(data.errors[i].message);
                                }
                            }
                        }
                    });
                    $scope.$apply();
                }
                else {
                    if (data.message) {
                        //console.log(data.message);
                    }
                    else {
                        for (var i = 0; i < data.errors.length; i++) {
                            //console.log(data.errors[i].message);
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
        //console.log(attachmentArray);

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
                //console.log(objNewEmail);
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
                //console.log(objNewEmail);
            }

            var promise = Warehouse.CallApi('/activity/email', 'PUT', objNewEmail, false);
            promise.error(function (data) {
                // //console.log(data);
                if (data.readyState) {
                    //console.log('connection error');
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
                        // //console.log(data);
                        if (data.readyState) {
                            //console.log('connection error');
                        }
                    });
                    promise.done(function (data, textStatus, jqXhr) {
                        if (data.type == 100) {
                            //console.log(data.data);
                            $scope.allActivitiesList = data.data;
                            $scope.filterableList = data.data;
                            var promise = Warehouse.CallApi('/lead?id=' + $scope.leadId, 'GET', false);
                            promise.error(function (data) {
                                // //console.log(data);
                                if (data.readyState) {
                                    //console.log('connection error');
                                }
                            });
                            promise.done(function (data, textStatus, jqXhr) {
                                // //console.log(data);
                                if (data.type == 100) {
                                    //console.log(data.data);
                                    $scope.lead = data.data;
                                    $scope.$apply();
                                }
                                else {
                                    if (data.message) {
                                        //console.log(data.message);
                                    }
                                    else {
                                        for (var i = 0; i < data.errors.length; i++) {
                                            //console.log(data.errors[i].message);
                                        }
                                    }
                                }
                            });
                        }
                        else {
                            if (data.message) {
                                //console.log(data.message);
                            }
                            else {
                                for (var i = 0; i < data.errors.length; i++) {
                                    //console.log(data.errors[i].message);
                                }
                            }
                        }
                    });
                    $scope.$apply();
                }
                else {
                    if (data.message) {
                        //console.log(data.message);
                    }
                    else {
                        for (var i = 0; i < data.errors.length; i++) {
                            //console.log(data.errors[i].message);
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

    $scope.filesList = [];
    $scope.uploadnew = function () {
        // file upload
        var fileContent = "";
        var fileName = "";
        //activity.filesList = [];
        $timeout(function () {
            var filesSelected = document.getElementById("uploadAttachfilenew").files;
            if (filesSelected.length > 0) {
                var fileToLoad = filesSelected[0];
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    fileContent = fileLoadedEvent.target.result;
                    fileName = filesSelected[0].name;
                    //console.log(fileContent);
                    //console.log(fileName);
                };
                fileReader.readAsDataURL(fileToLoad);
                $timeout(function () {

                    $scope.filesList.push({ 'Name': fileName, 'Content': fileContent });
                    //console.log($scope.filesList);
                }, 500);

            }
        });
    }
    $scope.removeNewFile = function (onechoice) {
        var index = $scope.filesList.indexOf(onechoice);
        $scope.filesList.splice(index, 1);
        //  //console.log($scope.filesList);
    }
    $scope.chooseEmailTemplate = function () {
        if ($('#selectEmailTemplate').val() == 'manageTemplates') {
            window.location = '#/settings/emailtemplatesetting';
        }
        else {
            //console.log($('#selectEmailTemplate').val());
            for (var i = 0; i < $scope.allEmailTemplates.length; i++) {
                if ($scope.allEmailTemplates[i]._id == $('#selectEmailTemplate').val()) {

                    $('#txtSubjectNew').val($scope.allEmailTemplates[i].Subject);
                    $('#newMessageBody').trumbowyg('html', $scope.allEmailTemplates[i].Body);
                    $scope.filesList = $scope.allEmailTemplates[i].Attachements;
                }
            }
        }
    }

    function prepareNewEmail(fillSendMailToSelectFirstObj, fillSendMailToSelect) {
        $('.newMessageBody').trumbowyg({
            btns: ['bold', 'italic', 'orderedList', 'unorderedList', 'link', 'insertImage', 'viewHTML']
        });
        //newMessageDateRangePicker();
        $(".txtNewEmailTo").tokenInput(fillSendMailToSelect, {
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
        $(".txtNewEmailCC").tokenInput(fillSendMailToSelect, {
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
        $(".txtNewEmailBCC").tokenInput(fillSendMailToSelect, {
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

        $("#leadprofileNewMessageDateRangePickerInput").daterangepicker({
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
            //console.log(start.format('MM-DD-YYYY'));
            //console.log(rangeName);
            if (typeof rangeName === 'undefined') {
                $('#leadprofileNewMessageDateRangePickerInput span').html("in " + start.format('MMMM D, YYYY')); // show date
                $('#hiddenReindReplyDate').text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "Custom Range") {
                $('#leadprofileNewMessageDateRangePickerInput span').html("in " + start.format('MMMM D, YYYY')); // show date
                $('#hiddenReindReplyDate').text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "2 m") {
                $('#leadprofileNewMessageDateRangePickerInput span').html("in 2 monthes"); // show date
                $('#hiddenReindReplyDate').text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "3 m") {
                $('#leadprofileNewMessageDateRangePickerInput span').html("in 3 monthes"); // show date
                $('#hiddenReindReplyDate').text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "2 w") {
                $('#leadprofileNewMessageDateRangePickerInput span').html("in 2 weeks"); // show date
                $('#hiddenReindReplyDate').text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "3 w") {
                $('#leadprofileNewMessageDateRangePickerInput span').html("in 3 weeks"); // show date
                $('#hiddenReindReplyDate').text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "2 d") {
                $('#leadprofileNewMessageDateRangePickerInput span').html("in 2 days"); // show date
                $('#hiddenReindReplyDate').text(start.format('MM-DD-YYYY'));
            }
            else if (rangeName === "3 d") {
                $('#leadprofileNewMessageDateRangePickerInput span').html("in 3 days"); // show date
                $('#hiddenReindReplyDate').text(start.format('MM-DD-YYYY'));
            }
            else {
                $('#leadprofileNewMessageDateRangePickerInput span').html("in " + rangeName); // show range name
                $('#hiddenReindReplyDate').text(start.format('MM-DD-YYYY'));
            }

        }


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
            //console.log(start.format('MM-DD-YYYY'));
            //console.log(rangeName);
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
            //console.log(start.format('MM-DD-YYYY'));
            //console.log(rangeName);
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

    //////////////////////////////////////////////////////////////////
    $scope.load = function () {

        var promise = Warehouse.CallApi('/lead?id=' + $scope.leadId, 'GET', false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                initAddressAuto();
                $scope.lead = data.data;
                $scope.Orgnization = data.data.Orgnization;
                loadoppstatus();
                loadOrganizationUsers();
                loadOrganizationLeads();
                loadOrganizationLeadsStatuses();

                // for repeated items (datePicker & timePicker) it's not included onloading page !!
                $timeout(function () {
                    $('#leadStatusSelector').val($scope.lead.CurrentStatus);
                    $(".chosenSelector").chosen();
                });

                $scope.$apply();
                callNumber();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });



        // activities
        var promise = Warehouse.CallApi('/activity?lead=' + $scope.leadId + '&skip=0,&limit=50', 'GET', false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                //   //console.log(data.type);
                //console.log(data.data);
                $scope.allActivitiesList = data.data;
                $scope.filterableList = data.data;
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });

        if ($routeParams.action == "newEmail") {
            $timeout(function () {
                $scope.addNewMail = true;

                fillSendMailToSelect = [];
                // This shold be used in pre populate part for the field to 
                // fillSendMailToSelectFirstObj = [];
                var id = 1;
                for (var i = 0; i < $scope.lead.Contacts.length; i++) {
                    for (var j = 0; j < $scope.lead.Contacts[i].Details.length; j++) {
                        if (($scope.lead.Contacts[i].Details[j].Value).indexOf('@') > -1 && ($scope.lead.Contacts[i].Details[j].Value).indexOf('.') > -1) {
                            fillSendMailToSelect.push({ 'id': id, 'name': $scope.lead.Contacts[i].Name, 'mail': $scope.lead.Contacts[i].Details[j].Value });
                            id++;
                        }

                    }
                }
                //  //console.log(fillSendMailToSelect);
                $scope.initialMailTo = fillSendMailToSelect[0].mail;
                $scope.initialSenderName = userObject.FirstName + ' ' + userObject.LastName;
                $scope.initialSenderMail = userObject.Email;
                if (x == 0) {
                    x++;
                    prepareNewEmail(fillSendMailToSelect);
                }

            }, 500);

        }

        $scope.initiateTimeFormat = function (index, activity) {
            var testTime = moment(activity.Date).fromNow();

            if (testTime == "Invalid date") {
                $timeout(function () {
                    $(".activityTime" + index).html("");
                });
            }
            else {

                if (!moment(activity.Date, 'yy').isValid()) {
                    if (!moment(activity.Date, 'MM').isValid()) {
                        if (!moment(activity.Date, 'dd').isValid()) {
                            if (!moment(activity.Date, 'hh').isValid()) {
                                if (!moment(activity.Date, 'mm').isValid()) {
                                    if (!moment(activity.Date, 's').isValid()) {
                                    } else {
                                        $timeout(function () {
                                            $(".activityTime" + index).html(testTime);
                                        });
                                    }
                                } else {
                                    $timeout(function () {
                                        $(".activityTime" + index).html(testTime);
                                    });
                                }
                            } else {
                                $timeout(function () {
                                    $(".activityTime" + index).html(testTime);
                                });
                            }
                        } else {
                            $timeout(function () {
                                $(".activityTime" + index).html(testTime);
                            });
                        }
                    } else {
                        $timeout(function () {
                            $(".activityTime" + index).html(testTime);
                        });
                    }

                } else {
                    $timeout(function () {
                        $(".activityTime" + index).html(testTime);
                    });
                }
            }
        }


        loadGoogleMap();
        timeAndCustomDateRangePicker();
        $(".chosenSelector").chosen();
        $('.timepicker').timepicker();

        $(function () {
            $("#contactsSortable").sortable({
                opacity: 0.5,
                update: function (event, ui) {
                    var sortedIDs = $("#contactsSortable").sortable("toArray");
                    var test = $("#contactsSortable").sortable("toArray", { attribute: 'data-item_number' });
                    //console.log(test);
                }
                //revert: true
            });

            //alert($("#contactsSortable").sortable("toArray", { attribute: 'data-item_number' }).toSource());
        });



    };
    function initAddressAuto() {
        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-33.8902, 151.1759),
            new google.maps.LatLng(-33.8474, 151.2631));

        var input = document.getElementById('autoCompleteAddress');
        var options = {
            types: ['establishment']
        };

        autocomplete = new google.maps.places.Autocomplete(input, options);
        //console.log(autocomplete);
    }
    //don't forget to call the load function
    $scope.load();

    function loadGoogleMap() {
        google.maps.event.addDomListener(window, 'load', initialize);
        function initialize() {
            var myLatlng = new google.maps.LatLng(52.353735, 4.901957);

            var mapOptions = {
                center: new google.maps.LatLng(52.353735, 4.901957),
                zoom: 17,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById('mapContainer'),
                mapOptions);
            // Google Map Maker 
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
            });

        }
    }

    function timeAndCustomDateRangePicker() {
        function showDate(start, rangeName) {
            //$('.timeRangePickerInput').html(" " + start.format('MMMM D, YYYY')); // show range instead of range name
        }


        $('.timeRangePickerInput').daterangepicker({
            "opens": "right",
            "singleDatePicker": true,

        }, showDate);

        $('.customFieldDateRangePicker').daterangepicker({
            "opens": "right",
            "singleDatePicker": true,

        }, showDate);
    }

    function loadoppstatus() {
        var promise = Warehouse.CallApi('/orgnization/opprtunitystatus?org=' + $scope.Orgnization, 'GET', false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                //  //console.log(data.type);
                //  //console.log(data.data);
                $scope.OpportunitiesStatus = data.data;
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    function loadOrganizationUsers() {
        var promise = Warehouse.CallApi('/orgnization/users?org=' + $scope.Orgnization, 'GET', false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                //   //console.log(data.type);
                //  //console.log(data.data);
                $scope.OrganizationUsers = data.data;
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    function loadOrganizationLeads() {

        var promise = Warehouse.CallApi('/organization/leads?q=' + $scope.Orgnization, 'GET', false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                //   //console.log(data.type);
                //  //console.log(data.data);
                $scope.OrganizationLeads = data.data;
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }

    function loadOrganizationLeadsStatuses() {

        var promise = Warehouse.CallApi('/orgnization/leadstatus?org=' + $scope.Orgnization, 'GET', false);
        promise.error(function (data) {
            // //console.log(data);
            if (data.readyState) {
                //console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            // //console.log(data);
            if (data.type == 100) {
                // //console.log(data.type);
                //  //console.log(data.data);
                $scope.OrganizationLeadsStatuses = data.data;
                $scope.$apply();
            }
            else {
                if (data.message) {
                    //console.log(data.message);
                }
                else {
                    for (var i = 0; i < data.errors.length; i++) {
                        //console.log(data.errors[i].message);
                    }
                }
            }
        });
    }




    $scope.filterType = function (_Type) {
        $scope.filtrationType = _Type;
        if (_Type == 'All')
            $scope.filterableList = $scope.allActivitiesList;
        else {
            $scope.filterableList = $filter('filter')($scope.allActivitiesList, _Type, false)
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
});

// reverse data to appear in timeline descending order
salesHubApp.filter('reverse', function () {
    return function (items) {
        return items.slice().reverse();
    };
});

// used in custom field to convert saved string (number part) to number
salesHubApp.directive('stringToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                return parseFloat(value, 10);
            });
        }
    };
});

// close modal directive
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