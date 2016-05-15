/**
 * Created by Juliang on 5/13/16.
 */
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    $('#receiveFileButton').on('click',function(event){
        event.preventDefault();
        var dynamicContainer = $('#dynamicContainer');
        if (dynamicContainer.children().length){
            dynamicContainer.empty();
        }else {
            var newIDButton = "<div class='col-lg-6 col-lg-offset-3 text-center'> " +
                "<button class='btn btn-hg btn-primary' id='getidButton'>Get Session Number</button>" +
                "</div>";
            dynamicContainer.append(newIDButton);
            $('#getidButton').on('click', function () {
                $.ajax({
                    url:'http://127.0.0.1:3000/getsessionid.json',
                    type:'GET',
                    dataType:'JSON',
                    success: function(json){
                        var newSessionID ="<div class='col-lg-6 col-lg-offset-3 text-center'> " +
                            "<p>Session ID</p>" +
                            "<p>" + json.id +"</p>" +
                            "</div>";
                        dynamicContainer.append(newSessionID);
                    }
                });
            });
        }
    });
});