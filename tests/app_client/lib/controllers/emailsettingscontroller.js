angular.module("salesHubApp").controller("EmailSettingsController", function ($scope, $timeout,localstorage , $routeParams, Warehouse) {

    var retrievedUser = localStorage.getItem('currentUser');
    var userObject = JSON.parse(retrievedUser);
    $scope.userId = userObject._id;
    console.log('User: ', JSON.parse(retrievedUser));

    $scope.templateName = '';
    $scope.templateSubject = '';
    $scope.selector = 'Shared';
    $scope.saveNewTemplate = function () {
        var shared;
        if ($scope.selector == 'Shared') {
            shared = true;
        }
        else {
            shared = false;
        }
        var objNewTemplate = {
            Title: $scope.templateName,
            Subject: $scope.templateSubject,
            Body: $('.txtBody').trumbowyg('html'),
            Shared: shared,
            User: $scope.userId,
            Attachements: $scope.filesList
        };
        console.log(objNewTemplate.Shared);
        if (typeof $scope.templateId === "undefined") {
            // create new template
            var promise = Warehouse.CallApi('/user/settings/emailtemplate', 'POST', objNewTemplate, false);
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
                    window.location = '#/settings/emailtemplatesetting';
                    $scope.load();
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
            // edit template
            window.location = '#/settings/emailtemplatesetting';
            $scope.load();

            //var promise = Warehouse.CallApi('/user/settings/emailtemplate', 'POST', objNewTemplate, false);
            //promise.error(function (data) {
            //    // console.log(data);
            //    if (data.readyState) {
            //        console.log('connection error');
            //    }
            //});
            //promise.done(function (data, textStatus, jqXhr) {
            //    console.log(data);
            //    if (data.type == 100) {
            //        console.log(data.type);
            //        console.log(data.data);
            //        window.location = '#/settings/emailtemplatesetting';
            //        $scope.load();
            //        $scope.$apply();
            //    }

            //    else {

            //        if (data.message) {
            //            console.log(data.message);
            //            console.log(data.type);

            //        }
            //        else {
            //            for (var i = 0; i < data.errors.length; i++) {
            //                console.log(data.errors[i].message);
            //            }
            //            console.log(data.type);
            //        }
            //    }
            //});
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

    $scope.editTemplate = function (template) {
        window.location = '#/settings/emailtemplatesetting/newtemplate/' + template._id + '';
        $scope.templateName = template.Title;
        $scope.templateSubject = template.Subject;
        console.log(template);
    }

    $scope.deleteTemplate = function () {
        console.log($routeParams.templateId);
        // delete here
    }

    $scope.load = function () {
        // do your $() stuff here
        $(".chosenSelector").chosen();


        $(function () {
            $("#sortable").sortable();
            $("#sortable").disableSelection();
        });

        $(function () {
            $("#sortable2").sortable();
            $("#sortable2").disableSelection();
        });

        
        $scope.showdeleteTemplate = false;
        $scope.allEmailTemplates = '';
        //var id = JSON.parse(retrievedUser)._id;
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
                userObject.EmailTemplates = data.data.EmailTemplates;
                localstorage.resetObject('currentUser', userObject);
                console.log(userObject);

                // lead Id from URL to get this selected lead's data
                $scope.templateId = $routeParams.templateId;

                console.log($scope.templateId);
                if (typeof $scope.templateId === "undefined") {
                }
                else {
                    for (var i = 0; i < $scope.allEmailTemplates.length; i++) {
                        if ($scope.allEmailTemplates[i]._id == $scope.templateId) {
                            $scope.templateName = $scope.allEmailTemplates[i].Title;
                            $scope.templateSubject = $scope.allEmailTemplates[i].Subject;
                            if ($scope.allEmailTemplates[i].Shared==true) {
                                $scope.selector = 'Shared';
                            }
                            else {
                                $scope.selector = 'Private';
                            }
                            $('.txtBody').trumbowyg('html', $scope.allEmailTemplates[i].Body);
                            $scope.filesList = $scope.allEmailTemplates[i].Attachements;
                            $scope.showdeleteTemplate = true;
                        }
                    }
                }
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

        $('.txtBody').trumbowyg({
            btns: ['bold', 'italic', 'orderedList', 'unorderedList', 'link', 'insertImage', 'viewHTML']
        });
    }
    $scope.load();


});
