var express = require('express')
var multer  = require('multer')
var fs = require("fs")
var upload = multer({ dest: 'uploads' })
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Easy Drop' })
})

//can handle single file uploaded
router.post('/upload',upload.single('file'),function(req,res){

   console.log(req.file)
   var file =  "./uploads/" + req.file.originalname
   fs.readFile( req.file.path, function (err, data) {
       //send file here
       fs.writeFile(file, data, function (err) {
           if( err ){
               console.log( err );
           }else{
               response = {
                   message:'File uploaded successfully',
                   filename:req.file.originalname
               }
               console.log( response )
               res.end( JSON.stringify( response ) )
           }
       })
   })
})
module.exports = router
