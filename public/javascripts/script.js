/**
 * Created by Juliang on 5/13/16.
 */
var modeToggle = 'none';
var polling = AsyncPolling(function(end){
    var id = $('#sessionID');
    var self = this;
    console.log("Polling files");
    if (id.length){
        //console.log(data);
        $.ajax({
            url: 'http://127.0.0.1:3000/hasfile.json',
            type:'GET',
            data:"sessionID="+id.text(),
            dataType:'JSON',
            success:function(json){
                if (json.hasFile){
                    $('#downloadButton').remove();
                    var downloadForm = "<form action='http://127.0.0.1:3000/getfile' method='get'>" +
                       " <Button type='submit' value='" + id.text() + "' class='btn btn-hg btn-success' name='sessionID' id='downloadButton'>Download</Button>" +
                        "</form>";
                    $('#sessionIDContainer').append(downloadForm);
                    $('#downloadButton').on('click',function(event){
                        $('#receiveFileButton').trigger('click');
                    });
                    self.stop(); //stop polling
                }else {
                    //keep polling
                    end();
                }
            }
        });
    }else{
        this.stop();
    }
},3*1000); // every 3 seconds
$(document).ready(function(){


    //receive button configuration

    $('#receiveFileButton').on('click',function(event){
        event.preventDefault();
        modeToggle = modeToggle === 'none' ? 'receive' : 'none';
        if (modeToggle === 'receive'){
            $(this).css('backgroundColor','#34495E');
            $('#sendFileButton').css('backgroundColor','#1ABC9C');
        }else{
            $(this).css('backgroundColor','#1ABC9C');
        }
        var dynamicContainer = $('#dynamicContainer');
        //if the container already have stuffs in it then empty it
        if (dynamicContainer.children().length){
            dynamicContainer.empty();
        }else {
            var newIDButton = "<div class='col-lg-6 col-lg-offset-3 text-center'> " +
                "<button class='btn btn-hg btn-primary' id='getidButton'>Get Session Number</button>" +
                "</div>";
            dynamicContainer.append(newIDButton);
            $('#getidButton').on('click', function () {
                var sessionIDContainer = $('#sessionIDContainer');
                if (sessionIDContainer.length){
                    sessionIDContainer.remove();
                }
                $.ajax({
                    url: 'http://127.0.0.1:3000/getsessionid.json',
                    type: 'GET',
                    dataType: 'JSON',
                    success: function (json) {
                        var newSessionIDContainer = "<div class='col-lg-6 col-lg-offset-3 text-center' id='sessionIDContainer'> " +
                            "<p>Session ID</p>" +
                            "<p id='sessionID'>" + json.id + "</p>" +
                            "<button class='btn btn-hg btn-default disabled' id='downloadButton' data-toggle='tooltip' title='File is not ready yet'>Download</button>"+
                            "</div>";
                        dynamicContainer.append(newSessionIDContainer);
                        polling.run();
                    }
                });
            });
        }
    });

    //send file button configuration
    $('#sendFileButton').on('click',function(event) {
        event.preventDefault();
        modeToggle = modeToggle === 'none' ? 'send' : 'none';
        if (modeToggle === 'send'){
            $(this).css('backgroundColor','#34495E');
            $('#receiveFileButton').css('backgroundColor','#1ABC9C');
        }else{
            $(this).css('backgroundColor','#1ABC9C');
        }
        var dynamicContainer = $('#dynamicContainer');
        //if the container already have stuffs in it then empty it
        if (dynamicContainer.children().length){
            dynamicContainer.empty();
        }else {
            //var fileDropZone = new Dropzone("div", { url: "http://127.0.0.1:3000/upload.json"});
            var fileDropZone = "<form action='http://127.0.0.1:3000/upload.json' method='post' class='dropzone dz-drag-hover dz-clickable dz-preview dz-file-preview dz-image-preview dz-details dz-size dz-filename dz-remove dz-image dz-processing dz-progress dz-complete dz-error dz-success-mark dz-error-mark text-center' enctype='multipart/form-data' id='dropzone'>" +
                "<div class='dz-message'><h5>Drop a file here or click to upload</h5></div> " +
                "</form>";
            dynamicContainer.append(fileDropZone);
            var myDropzone = new Dropzone("#dropzone",
                {   maxFiles:1,
                    addRemoveLinks: true,
                    init: function() {
                    },
                    maxfilesexceeded: function(file){
                        this.removeAllFiles();
                        this.addFile(file);
                    },
                    success:function(file,response){
                        console.log("Success: " + response);
                        json = JSON.parse(response);
                        //if (json.success){
                        //    $("#dropzone").addClass("dz-success");
                        //}else{
                        //    $("#dropzone").addClass("dz-error");
                        //}
                    },
                    error: function(file,response){
                        console.log("Error happened: " + response);
                    }

                });
        }
    });
    $('[data-toggle="tooltip"]').tooltip();
});