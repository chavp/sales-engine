// file upload
var attach = 1;
var BaseImg64;

function uploadFile() {
    $('#attachLink').attr('href', BaseImg64);
    $('#dvAttachments').append('<a>attach ' + attach + ' </a>');
    attach++;
}

function convertFileToBase64URL(event) {
    var filesSelected = document.getElementById("uploadAttachfile1").files;
    console.log(filesSelected);
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];
        var fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            BaseImg64 = fileLoadedEvent.target.result;
            uploadFile();
        };
        
        fileReader.readAsDataURL(fileToLoad);
    }
    
}
