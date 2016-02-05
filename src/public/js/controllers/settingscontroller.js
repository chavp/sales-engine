salesHubApp.controller("SettingsController", function ($scope, $timeout, $rootScope, $routeParams, localstorage, Warehouse) {

    var userObject = localstorage.getObject('currentUser');
    $scope.firstName = userObject.FirstName;
    $scope.lastName = userObject.LastName;
    console.log(userObject);
    $scope.profileDataSaved = false;
    $scope.currencySaved = false;
    $scope.leadStatusNew = '';
    $scope.OppStatusNew = '';
    $scope.secretEmail = userObject.SecretEmail;
    $scope.user = userObject;
    $scope.CustomField = { Name: '', Type: '', Choices: '' };
    $scope.Organization = userObject.Organizations[0].Orgnization;
    $scope.newInvite = { Name: '', Email: '', Phone: '', Role: '', Plan: '', Status: 'Invited' };
    var _org = $routeParams.org;
    var _email = $routeParams.email;
    if (_org && _email) {
        $scope.accept();
    }
    if ($scope.user.EmailSettings) {
        $scope.mailSettings = $scope.user.EmailSettings;
        $scope.mailSettings.id = $scope.user._id;
    }
    else {
        $scope.mailSettings = {
            id: $scope.user._id,
            Name: $scope.firstName + " " + $scope.lastName,
            Username: userObject.Email,
            Password: '',
            IMAPHost: '',
            SMTPHost: '',
            IMAPPort: '993',
            SMTPPort: '25',
            SMTPSSL: false,
            IMAPSSL: false
        };
    }
    $scope.deleteMember = function () {
        var _index = 1000;
        for (var i = 0 ; i < $scope.Organization.Members.length; i++) {
            if ($scope.Organization.Members[i]._id == $scope.newInvite._id) {
                _index = i;
            }
        }
        $scope.Organization.Members.splice(_index, 1);
        console.log($scope.Organization.Members);
        $scope.updateOrg();
    }
    $scope.updateMember = function (item) {
        $scope.newInvite = item;
        $('#changePlan').modal('show');
        console.log($scope.newInvite);
    }
    $scope.updateEmailSettings = function (form) {
        var promise = Warehouse.CallApi('/user/settings/email', 'PUT', $scope.mailSettings, false);
        $('.alert').hide();
        $('#loader').show();
        promise.error(function (data) {
            console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            $('#loader').hide();
            console.log(data);
            if (data.type == 100) {
                $('#mailDetails').modal('hide');
                console.log(data.data);
                userObject.EmailSettings = data.data.EmailSettings;
                localstorage.resetObject('currentUser', userObject);
            }
            else {
                $('.alert').removeClass('alert-success');
                $('.alert').removeClass('alert-warning');
                $('.alert').removeClass('alert-danger');
                $('.alert').addClass('alert-danger');
                $('.alert').html(data.message);
            }
        });
    }

    $scope.accept = function () {
        var body = { org: _org, email: _email }
        var promise = Warehouse.CallApi('/organization/accept', 'post', body, false);
        $('.alert').hide();
        $('#loader').show();
        promise.error(function (data) {
            // console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            $('#loader').hide();
            if (data.type == 100) {
                console.log(data);
                $('.alert').removeClass('alert-success');
                $('.alert').removeClass('alert-warning');
                $('.alert').removeClass('alert-danger');
                $('.alert').addClass('alert-success');
                $('.alert').html('you have accepted the invitation, please update your basic info');
            }
            else {
                $('.alert').removeClass('alert-success');
                $('.alert').removeClass('alert-warning');
                $('.alert').removeClass('alert-danger');
                $('.alert').addClass('alert-danger');
                $('.alert').html('Something went wrong');
            }
        });
    }
    $scope.updateOrg = function (_Inv) {
        if (_Inv) {
            $scope.Organization.Inv = _Inv;
        }
        var promise = Warehouse.CallApi('/organization', 'PUT', $scope.Organization, false);
        $('.alert').hide();
        $('#loader').show();
        $('modal').modal('hide');
        //$scope.dismiss();
        promise.error(function (data) {
            // console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            $('#loader').hide();
            if (data.type == 100) {
                //userObject.Organizations[0].Orgnization.DefaultCurrency = $('#currencySelector').val();
                //console.log(userObject);
                //localstorage.resetObject('currentUser', userObject);

                //$scope.currencySaved = true;
                // Simulate 1 seconds loading delay
                ////setTimeout(function () {
                //// Loadind done here - Show message for 1 more seconds.
                //    setTimeout(function () {
                //        $scope.currencySaved = false;
                //        $scope.$apply();
                //        console.log(userObject);
                //    }, 1000);
                //}, 1000);


                //$scope.$apply();
                $rootScope.orgTitle = $scope.Organization.Title;
                $rootScope.$apply();
            }
            else {
                $('.alert').removeClass('alert-success');
                $('.alert').removeClass('alert-warning');
                $('.alert').removeClass('alert-danger');
                $('.alert').addClass('alert-danger');
                $('.alert').html('Something went wrong');
            }
        });
    }

    $scope.saveNewLeadStatus = function (form) {
        $scope.Organization.LeadStatus.push({ Title: $scope.leadStatusNew });
        $scope.updateOrg();
    }
    $scope.saveNewInvite = function (form) {
        $scope.Organization.Members.push($scope.newInvite);
        $scope.updateOrg(true);
    }
    $scope.saveNewOppStatus = function (form) {
        $scope.Organization.OpprtunityStatus.push({ Title: $scope.OppStatusNew });
        $scope.updateOrg();
        $('modal').modal('hide');
    }

    $scope.removeOppStatus = function (_index) {
        $scope.Organization.OpprtunityStatus.splice(_index, 1);
        $scope.updateOrg();
    }
    $scope.removeLeadStatus = function (_index) {
        $scope.Organization.LeadStatus.splice(_index, 1);
        $scope.updateOrg();
    }

    $scope.updateCurrency = function () {

        var promise = Warehouse.CallApi('/organization', 'PUT', $scope.Organization, false);
        $('.alert').hide();
        $('#loader').show();
        $('modal').modal('hide');
        $scope.dismiss();
        promise.error(function (data) {
            // console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            $('#loader').hide();
            if (data.type == 100) {
                userObject.Organizations[0].Orgnization.DefaultCurrency = $('#currencySelector').val();
                console.log(userObject);
                localstorage.resetObject('currentUser', userObject);

                $scope.currencySaved = true;
                 //Simulate 1 seconds loading delay
                setTimeout(function () {
                // Loadind done here - Show message for 1 more seconds.
                    setTimeout(function () {
                        $scope.currencySaved = false;
                        $scope.$apply();
                        console.log(userObject);
                    }, 1000);
                }, 1000);


                $scope.$apply();
            }
            else {
                $('.alert').removeClass('alert-success');
                $('.alert').removeClass('alert-warning');
                $('.alert').removeClass('alert-danger');
                $('.alert').addClass('alert-danger');
                $('.alert').html('Something went wrong');
            }
        });
    }
    /////////////////////////////////////////////////////////////////
    $scope.updateProfileData = function (form) {
        angular.forEach($scope.frmProfileData.$error.required, function (field) {
            field.$setDirty();
        });
        // file upload
        var BaseImg64 = "";
        var filesSelected = document.getElementById("uploadProfileImage").files;
        if (filesSelected.length > 0) {
            var fileToLoad = filesSelected[0];
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
                BaseImg64 = fileLoadedEvent.target.result;
                console.log(BaseImg64);
                $scope.user.Img = BaseImg64;
                //uploadFile();
            };
            fileReader.readAsDataURL(fileToLoad);
        }
        $timeout(function () {
            if (form.$valid) {
                if (BaseImg64 == "") {
                    // create user object
                    var objCurrentUser = {
                        firstname: $scope.firstName,
                        lastname: $scope.lastName,
                        img: userObject.Img,
                        id: userObject._id
                    };
                    var promise = Warehouse.CallApi('/user/profile', 'PUT', objCurrentUser, false);
                    promise.error(function (data) {
                        // console.log(data);
                        if (data.readyState) {
                            console.log('connection error');
                        }
                    });
                    promise.done(function (data, textStatus, jqXhr) {
                        console.log(data.data);
                        if (data.type == 100) {

                            // local storage update 
                            userObject.FirstName = objCurrentUser.firstname;
                            userObject.LastName = objCurrentUser.lastname;
                            localstorage.resetObject('currentUser', userObject);



                            // set value of rootscope
                            $rootScope.firstName = objCurrentUser.firstname;
                            $rootScope.lastName = objCurrentUser.lastname;
                            $rootScope.$apply();

                            $scope.profileDataSaved = true;
                            // Simulate 1 seconds loading delay
                            setTimeout(function () {
                                // Loadind done here - Show message for 1 more seconds.
                                setTimeout(function () {
                                    $scope.profileDataSaved = false;
                                    $scope.$apply();
                                    console.log(userObject);
                                }, 1000);
                            }, 1000);
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
                else {
                    // create user object
                    var objCurrentUser = {
                        firstname: $scope.firstName,
                        lastname: $scope.lastName,
                        img: BaseImg64,
                        id: userObject._id
                    };
                    var promise = Warehouse.CallApi('/user/profile', 'PUT', objCurrentUser, false);
                    promise.error(function (data) {
                        // console.log(data);
                        if (data.readyState) {
                            console.log('connection error');
                        }
                    });
                    promise.done(function (data, textStatus, jqXhr) {
                        console.log(data.data);
                        if (data.type == 100) {

                            // local storage update 
                            userObject.FirstName = objCurrentUser.firstname;
                            userObject.LastName = objCurrentUser.lastname;
                            userObject.Img = BaseImg64;
                            localstorage.resetObject('currentUser', userObject);

                            // set value of rootscope
                            $rootScope.firstName = objCurrentUser.firstname;
                            $rootScope.lastName = objCurrentUser.lastname;
                            $rootScope.UserImg = BaseImg64;
                            $rootScope.$apply();

                            $scope.profileDataSaved = true;
                            // Simulate 1 seconds loading delay
                            setTimeout(function () {
                                // Loadind done here - Show message for 1 more seconds.
                                setTimeout(function () {
                                    $scope.profileDataSaved = false;
                                    $rootScope.UserImg = BaseImg64;
                                    $scope.$apply();
                                }, 1000);
                            }, 1000);
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


            }
        });



    }


    $scope.currentPassword = '';
    $scope.currentEmail = userObject.Email;

    $scope.EmailSaved = false;
    $scope.EmailError = false;
    $scope.messageEmailForm = '';

    $scope.changeEmail = function (form) {
        $scope.EmailError = false;
        $scope.EmailSaved = false;
        angular.forEach($scope.frmchangeEmail.$error.required, function (field) {
            field.$setDirty();
        });

        if (form.$valid) {
            // create Email object
            var objchangeEmail = {
                password: $scope.currentPassword,
                email: $scope.currentEmail,
                id: userObject._id
            };
            console.log(objchangeEmail);
            var promise = Warehouse.CallApi('/user/email', 'PUT', objchangeEmail, false);
            promise.error(function (data) {
                // console.log(data);
                if (data.readyState) {
                    $scope.EmailError = true;
                    $scope.messageEmailForm = 'Connection error, please try again later.';
                    console.log('connection error');
                }
            });
            promise.done(function (data, textStatus, jqXhr) {
                console.log(data);
                if (data.type == 100) {

                    console.log(data.type);
                    console.log(data.data);


                    // local storage update 
                    userObject.Email = objchangeEmail.email;
                    localstorage.resetObject('currentUser', userObject);
                    // set value of rootscope
                    $rootScope.Useremail = objchangeEmail.email;

                    $scope.EmailError = false;
                    $scope.currentPassword = '';
                    // reset the form after dirty to remove required validation of password
                    $scope.frmchangeEmail.$setPristine();
                    $scope.EmailSaved = true;
                    // Simulate 1 seconds loading delay
                    setTimeout(function () {
                        // Loadind done here - Show message for 1 more seconds.
                        setTimeout(function () {
                            $scope.EmailSaved = false;
                            $scope.$apply();
                        }, 1000);
                    }, 1000);
                    $scope.$apply();
                }
                else {

                    if (data.message) {
                        console.log(data.message);
                        console.log(data.type);
                        $scope.EmailError = true;
                        $scope.messageEmailForm = data.message;
                        $scope.$apply();
                    }
                    else {
                        for (var i = 0; i < data.errors.length; i++) {
                            console.log(data.errors[i].message);
                            $scope.messageEmailForm = data.errors[i].message;
                        }
                        console.log(data.type);
                        $scope.EmailError = true;
                        $scope.$apply();
                    }
                }
            });
        }
    }


    $scope.oldPassword = '';
    $scope.newPassword = '';
    $scope.confirmNewPassword = '';
    $scope.PasswodSaved = false;
    $scope.samepassword = false;
    $scope.incorrectPassword = false;
    $scope.changePassword = function (form) {
        $scope.samepassword = false;
        $scope.incorrectPassword = false;
        angular.forEach($scope.frmchangePassword.$error.required, function (field) {
            field.$setDirty();
        });

        if (form.$valid) {
            if ($scope.oldPassword == $scope.newPassword) {
                $scope.samepassword = true;
            }
            else {

                // create password object
                var objchangePassword = {
                    oldpassword: $scope.oldPassword,
                    newpassword: $scope.newPassword,
                    id: userObject._id
                };
                console.log(objchangePassword);
                var promise = Warehouse.CallApi('/user/password', 'PUT', objchangePassword, false);
                promise.error(function (data) {
                    // console.log(data);
                    if (data.readyState) {
                        console.log('connection error');
                    }
                });
                promise.done(function (data, textStatus, jqXhr) {
                    console.log(data);
                    if (data.type == 100) {
                        console.log(data.type);
                        console.log(data.data);

                        // local storage update 
                        userObject.Password = objchangePassword.newpassword;
                        localstorage.resetObject('currentUser', userObject);

                        $scope.oldPassword = '';
                        $scope.newPassword = '';
                        $scope.confirmNewPassword = '';
                        // reset the form after dirty to remove required validation of password
                        $scope.frmchangePassword.$setPristine();

                        $scope.PasswodSaved = true;
                        // Simulate 1 seconds loading delay
                        setTimeout(function () {
                            // Loadind done here - Show message for 1 more seconds.
                            setTimeout(function () {
                                $scope.PasswodSaved = false;
                                $scope.$apply();
                            }, 1000);
                        }, 1000);
                        $scope.$apply();
                    }
                    else if (data.type == 2) {
                        $scope.incorrectPassword = true;
                        $scope.$apply();
                    }
                    else {

                        if (data.message) {
                            console.log(data.message);
                            $scope.incorrectPassword = true;
                            console.log(data.type);
                            $scope.$apply();
                        }
                        else {
                            for (var i = 0; i < data.errors.length; i++) {
                                console.log(data.errors[i].message);
                            }
                            console.log(data.type);
                            $scope.$apply();
                        }
                    }
                });
            }
        }
    }



    $scope.EmailSignatureSaved = false;
    $scope.EmailSignature = userObject.EmailSignature;
    $scope.updateSinature = function () {
        //get txt editor data
        var emailSignatureValue = $('.txtBody').trumbowyg('html');
        var objEmailSignature = {
            EmailSignature: emailSignatureValue,
            id: userObject._id
        };
        console.log(objEmailSignature);
        var promise = Warehouse.CallApi('/user/settings/emailsignature', 'PUT', objEmailSignature, false);
        promise.error(function (data) {
            // console.log(data);
            if (data.readyState) {
                console.log('connection error');
            }
        });
        promise.done(function (data, textStatus, jqXhr) {
            console.log(data);
            if (data.type == 100) {

                // local storage update 
                userObject.EmailSignature = emailSignatureValue;
                localstorage.resetObject('currentUser', userObject);


                $scope.EmailSignatureSaved = true;
                // Simulate 1 seconds loading delay
                setTimeout(function () {
                    // Loadind done here - Show message for 1 more seconds.
                    setTimeout(function () {
                        $scope.EmailSignatureSaved = false;
                        $scope.$apply();
                    }, 1000);
                }, 1000);
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
    };

    $scope.initControls = function () {
        // do your $() stuff here
        $(".chosenSelector").chosen();
        $(function () {
            $("#sortable").sortable({
                update: function (event, ui) {
                    console.log($scope.Organization.LeadStatus);
                }
            });
            $("#sortable").disableSelection();
        });

        $(function () {
            $("#sortable2").sortable({
                update: function (event, ui) {
                    console.log($scope.Organization.OpprtunityStatus);
                }
            });
            $("#sortable2").disableSelection();
        });

        // set text editor data
        $('.txtBody').trumbowyg({
            btns: ['bold', 'italic', 'orderedList', 'unorderedList', 'link', 'insertImage', 'viewHTML']
        });
        $('.txtBody').trumbowyg('html', userObject.EmailSignature);
        console.log(userObject.EmailSignature);
    }

    $scope.load = function () {
        console.log(userObject.Organizations);
        $scope.userOrganizations = userObject.Organizations;

        $('#currencySelector').val(userObject.Organizations[0].Orgnization.DefaultCurrency);
        $timeout(function () { $scope.initControls(); }, 500);
    }
    $scope.switchOrganizations = function (org) {
        var temp = userObject.Organizations[0];

        userObject.Organizations[0] = org;

        var index = userObject.Organizations.indexOf(org);
        userObject.Organizations.splice(index, 1);

        userObject.Organizations.push(temp);
        
        console.log(userObject.Organizations);

                $rootScope.orgTitle = org.Orgnization.Title;
                localstorage.resetObject('currentUser', userObject);
                $scope.Organization = org.Orgnization;
                $scope.load();
       
    }
    $scope.load();

    //////////////////////////////////////////////////////// customField
    console.log($scope.Organization);
    $scope.newCustomFieldObj = {
        CurrentValue: '',
        Name: "",
        Type: "",
        Values: "",
        CurrentTime: ""
    };

    $scope.customFieldSelector = 'Text';
    $scope.customFieldSelect = function (type) {
        if (type == 'Choices') {
            $scope.NewChoics = '';
            $scope.showChoices = true;
        }
        else {
            $scope.showChoices = false;
        }
        $scope.customFieldType = type;
    }

    var choicesCounter = 1;
    $scope.choicesList = [];
    $scope.NewChoiceTxt = '';

    $scope.addChoice = function () {
        $scope.choicesList.push({ 'id': choicesCounter, 'choice': $scope.NewChoiceTxt });
        choicesCounter++;
        $scope.NewChoiceTxt = '';
        console.log($scope.choicesList);
    }

    $scope.removeChoice = function (onechoice) {
        var index = $scope.choicesList.indexOf(onechoice);
        $scope.choicesList.splice(index, 1);
        console.log($scope.choicesList);
    }

    $scope.saveNewCustomField = function () {
        if ($scope.customFieldType === undefined) {
            $scope.customFieldType = 'Text';
        }
        $scope.newCustomFieldObj.Type = $scope.customFieldType;
        $scope.newCustomFieldObj.Name = $scope.modalChoiceName;
        if ($scope.customFieldType == 'Choices') {

            var customValues = "";
            for (var i = 0; i < $scope.choicesList.length; i++) {
                if ($scope.choicesList.length == 1) {
                    customValues += $scope.choicesList[i].choice + ",";
                }
                else {
                    customValues += $scope.choicesList[i].choice + ",";
                }
            }
            customValues = customValues.substring(0, customValues.length - 1);
            console.log(customValues);

            $scope.newCustomFieldObj.Values = customValues;
        }

        console.log($scope.newCustomFieldObj);
        $scope.Organization.CustomFields.push($scope.newCustomFieldObj);

        $scope.newCustomFieldObj = {
            CurrentValue: '',
            Name: "",
            Type: "",
            Values: "",
            CurrentTime: ""
        };
        $scope.customFieldSelector = 'text';
        $scope.modalChoiceName = '';

        $scope.showChoices = false;
        $scope.choicesList = [];
        $scope.NewChoiceTxt = '';
        $scope.dismiss();
        $scope.updateOrg();
    }

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

// compare password validation
var compareTo = function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function (modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
};

salesHubApp.directive("compareTo", compareTo);