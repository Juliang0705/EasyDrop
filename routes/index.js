var express = require('express');
var multer  = require('multer');
var fs = require("fs");
var upload = multer({ dest: 'uploads' });
var router = express.Router();
var sessionIDCreator = require('../models/sessionIDCreator.js');
var sessionTable = require('../models/sessionTable.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Easy Drop' });
});


var idCreator = new sessionIDCreator();
var completedSessions = new sessionTable();

//create the id and send it to the client
router.get('/getsessionid.json',function(req,res,next){
    var newSessionID = idCreator.getNewSessionID();
    console.log("New id = " + newSessionID);
    var response = {id:newSessionID};
    res.send(JSON.stringify( response ));
});

router.get('/hasfile.json',function(req,res,next){
    var sessionID =  req.query.sessionID;
    var response = {};
    console.log("checking file from session " + sessionID);
    if (sessionID){
        if (!idCreator.contains(sessionID)){
            response = {
                hasFile : false,
                id : sessionID,
                message: "Session ID doesn't exist"
            };
        }else if (completedSessions.hasSession(sessionID)){
            response = {
                hasFile : true,
                id : sessionID,
                message: "File is ready"
            };
        }else{
            response = {
                hasFile : false,
                id : sessionID,
                message: "File is not ready"
            };
        }
    }else{
        response = {
            hasFile : false,
            id : sessionID,
            message: "session ID missing"
        };
    }
    res.end(JSON.stringify(response));
});
//get file with the session id
router.get('/getfile',function(req,res,next){
    var sessionID =  req.query.sessionID;
    var response = {};
    console.log("Requesting file from session " + sessionID);
    if (sessionID){
        if (completedSessions.hasSession(sessionID)){
            var file = completedSessions.getFileWithSessionID(sessionID);
            console.log(file.path);
            res.download(file.path,file.originalname,function(err){
                if (err)
                    console.log(err);
                else
                    completedSessions.removeSession(sessionID);
            });
        }else{
            response = {
                success : false,
                id : sessionID,
                message: "Session ID doesn't exist"
            };
            res.end(JSON.stringify(response));
        }
    }else{
        response = {
            success : false,
            id : sessionID,
            message: "Session ID missing"
        };
        res.end(JSON.stringify(response));
    }
});

//can handle single file uploaded
router.post('/upload.json',upload.single('file'),function(req,res){
   var sessionID =  req.body.sessionID;
   var uploadedFile = req.file;
   var response =  {};
   console.log('{ '+ sessionID + ' : ' + uploadedFile + '}');
    // check if form is valid
   if (sessionID && uploadedFile){
       //the sessionID is valid
       if (idCreator.contains(sessionID)){
           completedSessions.add(sessionID,uploadedFile);
           response = {
               success : true,
               id : sessionID,
               file: uploadedFile,
               message: 'File uploaded successfully to session id ' + sessionID
           };
       }else{
           response = {
               success : false,
               id : sessionID,
               file: uploadedFile,
               message: 'Unrecognized session ID ' + sessionID
           };
           fs.unlink(uploadedFile.path,function(err){
               if (err)
                    console.log(err);
               else
                    console.log("Removed file");
           });
       }
   } else{
       response = {
           success : false,
           id : sessionID,
           file: uploadedFile,
           message: 'One or more parameters missing'
       };
       fs.unlink(uploadedFile.path,function(err){
           if (err)
               console.log(err);
           else
               console.log("Removed file");
       });
   }
   res.end(JSON.stringify(response));
});

module.exports = router;
