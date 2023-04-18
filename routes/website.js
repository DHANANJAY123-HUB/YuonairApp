const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');  
const nodemailer = require('nodemailer');
const websiteModel = require('../models/websiteModel');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'uploads/')
    }, 
    filename: function(req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null,Date.now()+ext)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req,files,callback){
    if( files.mimetype == "video/mp4" || files.mimetype == "image/png" || files.mimetype == "image/jpg" ||
        files.mimetype == "image/jpeg"){
        callback(null,true)
    }else{
        console.log('only  mp4 file supported')
        callback(null,false)
    }

    },
    limits:{
        fieldNameSize: 200,
        filesize:1024 * 1024 * 5
    }
});

const upload_image = multer({
    storage: storage,
    fileFilter: function(req,files,callback){
        if(
        files.mimetype == "image/png" ||
        files.mimetype == "image/jpg" ||
        files.mimetype == "image/jpeg"
    ){
        callback(null,true)
    }else{
        console.log('only  png , jpg & jpeg file supported')
        callback(null,false)
    }

   },
   limits:{
    filesize:1024 * 1024 * 2
   }
});

const upload_user_image = multer({
    storage: storage,
    fileFilter: function(req,file,callback){
        if(
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
    ){
        callback(null,true)
    }else{
        console.log('only  png , jpg & jpeg file supported')
        callback(null,false)
    }

   },
   limits:{
    filesize:1024 * 1024 * 2
   }
});

router.post('/upload_video',upload.any('user_video','video_thumbnail'),
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('channel_id').isMongoId().withMessage('channel_id should be required'),(req, res,next) => {
   
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({ 
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id,channel_id,channel_name,video_name,desc,user_video, & video_thumbnail..'
        });
    }

    websiteModel.upload_video(req.body,req.files).then((result)=>{
        console.log(req.files)
        if(result){
            res.json({
                result: 'true',
                msg:'video file uploaded successfully..',
                body:result
            })
        }else{
        
            res.json({
                result:'false',
                msg:'video file does not uploaded..',
                //body:result[0]
            })
        }
    }).catch((err)=>{
        //console.log(err)
        res.json({message:err.message})
    });
});

const upload_music = multer({
    storage: storage,
    fileFilter: function(req,file,callback){
    if( file.mimetype === "audio/mp3" || file.mimetype === "audio/mpeg" || file.mimetype === "audio/wav"){
        callback(null,true)
    }else{
        console.log('only  mp3 & mpeg file supported')
        callback(null,false)
    }

   },
   limits:{
    fieldNameSize: 200,
    filesize:1024 * 1024 * 5
   }
});

router.post('/upload_music',upload_music.single('file'),
    body('user_id').isMongoId().withMessage('_id should be required'),
      body('channel_id').isMongoId().withMessage('channel_id should be required'),(req, res,next) => {
   
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, channel_id, music_title & file..'
        });
    }

    websiteModel.upload_music(req.body,req.file).then((result)=>{
        console.log(req.file)

       // var music = req.file;
        if(result){
            res.json({
                result: 'true',
                msg:'music file uploaded successfully..',
                body:req.file
            })
        }else{
            res.json({
                result:'false',
                msg:'music file does not exist..',
            })
        }
    }).catch((err)=>{
        //console.log(err)
        res.json({message:err.message})
    });
});

router.post('/signup', 
    body('email').isEmail({}).withMessage('email should be required..'),(req,res)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required username, email, password, confirm_password & gender..'
        });
    }
	websiteModel.register_user(req.body).then((result2)=>{
       
        if(result2){
            res.json({
                ressult: 'true',
                msg :'user registered successfully..',
                data: result2
           })
        }else{
            res.json({
               result:'false',
        	   msg: 'email already registered please enter new email..',
              //data: result2
           })
        }   
        //var data = JSON.stringify(result2)
        
           // res.json({
              //  result:response,
        	   // msg:msg,
               // data:result2
          //  }); 
    }).catch((err)=>{
		res.json({message:err.message})
	})
});

router.post('/login',
   body('email').isEmail({}).withMessage('email should be required..'),(req,res,next)=>{
   const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg: 'parameter required email & password..'
        });
    } 
    websiteModel.userLogin(req.body).then((result)=>{
          
        if(result.length==0){
            res.json({ 
                result: 'false',
                msg:'email_id or password invalid..',
            })
        }else{
            var user_status = result[0].user_status;
            req.email = result[0].email,
            req.password = result[0].password

            if(result[0].email == req.email && result[0].password==req.password && user_status == 0){
                res.json({
                    result: 'true',
                    msg:'user successfully login..',
                    _id:result[0]._id,
                    username:result[0].username,
                    email:result[0].email,
                    password:result[0].password,
                    fieldname:result[0].profile_image.fieldname,
                    path:result[0].profile_image.path
                   /* data:{
                        _id:result[0]._id,
                        username:result[0].username,
                        email:result[0].email,
                        password:result[0].password,
                        path:result[0].profile_image.path
                    }*/
                });
            }else{
                res.json({
                    result:'false',
                    msg:'user blocked by admin...'
                })
            }
        }
    }).catch((err)=>{
      res.json({message:err.message})
   })
});

router.post('/google_login',
    body('email').isEmail({}).withMessage('email should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg: 'parameter required google_id & email..'
        });
    }

    websiteModel.googleLogin(req.body).then((result3)=>{
         
       if(result3){
           response = 'true',
           msg ='google_id registered successfully..'
        }else{
           response = 'false',
           msg = 'google_id already registered please enter new google_id..'
        }

        res.json({
            result:response,
            msg:msg,
            data:result3
        }); 
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/facebook_login',
    body('email').isEmail({}).withMessage('email should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg: 'parameter required facebook_id & email..'
        });
    }

    websiteModel.facebookLogin(req.body).then((result3)=>{
         
       if(result3){
            res.json({
                result: 'true',
                msg:'user registered successfully..',
                data:result3
            })
        }else{
            res.json({
                result: 'true',
                msg:'facebook_id already registered please enter new facebook_id..',
                data:result3
            })
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/twitter_login',
    body('email').isEmail({}).withMessage('email should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg: 'parameter required twitter_id & email..'
        });
    }

    websiteModel.twitterLogin(req.body).then((result3)=>{
         
       if(result3){
             res.json({
                result: 'true',
                msg:'user registered successfully..',
                data:result3
            })
        }else{
            res.json({
                result: 'true',
                msg:'twitter_id already registered please enter new twitter_id..',
                //data:result
            })
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.put('/update_user_data',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id..'
        });
    }
    websiteModel.update_user_data(req.body).then((result)=>{
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req._id = result[0]._id
        
            if(result[0]._id == req._id){
                res.json({
                    result:'true',
                    msg:'data successfully updated..'
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/view_profile',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id..'
        });
    }

    websitModel.view_profile(req.body).then((result)=>{
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req._id = result[0]._id
        
            if(result[0]._id == req._id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result[0]
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/delete_user_account',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id..'
        });
    }
    websiteModel.delete_user_account(req.body).then((result)=>{
        //var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req._id = result[0]._id
            
            if(result[0]._id == req._id ){
                res.json({
                    result:'true',
                    msg:'user account deleted successfully..',
                })
            }else{
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message}) 
    })

});

router.patch('/forget_password',
    body('email').isEmail({}).withMessage('email should be required'),
    /*body('password').isLength({
        min:1,
        max:20
    }).withMessage('password should be required'),*/(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false', 
            //errors: errors.array()
            msg:'parameter required email(please enter valid & register email id)..'
        });
    }
    //const password = `pass@`+Math.floor(1000 + Math.random() * 9000);
    function generatePassword() {
        var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
      return retVal;
    }
    var password = generatePassword();
    console.log(password);
    
    websiteModel.forget_password(req.body,password).then((result)=>{

        const email = result[0].email;
        console.log(email)
       
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'iossecond20@gmail.com',
                pass: 'gosayrgqayduleed'
            }
        });

        var mailOptions = {
            from: 'iossecond20@gmail.com',
            to: email,
            subject: "new password send your register email from Yuonair",
            html: "<h4>email : "+email+"</h4><h4>password : "+password.toString()+"</h4>"
        }
         
        transporter.sendMail(mailOptions, function(err, result){
            if(err) {
                res.json({
                    result:'false',
                    msg: 'email does not exist..',
                })
            }else{
                res.json({
                    result: 'true',
                    msg :'password send successfully your email address please check your email..',
                    email:email,
                    password: password.toString(),
                    //data:result
                })
            }
        })
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_video',
    body('user_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{

   const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    }

    websiteModel.get_video(req.body).then((result)=>{
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result.user_id
        
            if(result.user_id == req.user_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.get('/get_music',(req,res,next)=>{
    websiteModel.get_music(req.body).then((result)=>{
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            //req.user_id = result.user_id
        
            //if(result.user_id == req.user_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result
                })
            //}else{

            //}
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/delete_music',
    body('_id').isMongoId().withMessage('_id should be required'),
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id & user_id..'
        });
    }
    websiteModel.delete_music(req.body).then((result)=>{
        //var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'music deleted only by authentic user..',
            })
        }else{
            req._id = result[0]._id,
            req.user_id = result[0].user_id
            
            if(result[0]._id == req._id && result[0].user_id == req.user_id ){
                res.json({
                    result:'true',
                    msg:'music deleted successfully..',
                })
            }else{
                /* res.json({
                    result:'false',
                    msg:'music deleted only by authentic user..',
                })*/
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message}) 
    })
});

router.patch('/change_password',
    body('_id').isMongoId().withMessage('_id should be required'),
    body('password').isLength({
        min:1,
        max:20
    }).withMessage('password should be required.'),
    body('new_password').isLength({
        min:1,
        max:20
    }).withMessage('new_password should be required.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id, password & new_password..'
        });
    }

    websiteModel.change_password(req.body).then((result)=>{
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'_id & password does not exist..',
            })
        }else{
            
            req._id = result[0]._id,
            req.password = result[0].password
            
            if(result[0]._id == req._id && result[0].password == req.password){
                res.json({
                    result:'true',
                    msg:'password successfully changed..'
                })
            }else{

            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/create_channel', upload_image.any('image'),
     body('user_id').isMongoId().withMessage('user_id should be required'),
     body('channel_name').isLength({
        min:1,
        max:20
    }).withMessage('name should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, channel_name, cover_image,profile_image & handle..'
        });
    } 

    websiteModel.create_channel(req.body,req.files).then((result2)=>{
         
        var img = req.files;
        if(result2){
            res.json({
                ressult: 'true',
                msg :'channel created successfully..',
                data: result2
           })
        }else{
            res.json({
               result:'false',
               msg: 'channel already created by user..',
               //data:[]
           })
        }   
        //var data = JSON.stringify(result2)
        
           // res.json({
              //  result:response,
               // msg:msg,
               // data:result2
          //  }); 
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.put('/update_channel', upload_image.any('image'),
     body('_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id(channel_id) & update_field_name(channel_name, cover_image,profile_image & handle)..'
        });
    } 

    websiteModel.update_channel(req.body,req.files).then((result)=>{
         var img = req.files;
        if(result.length==0){
            res.json({
                ressult: 'false',
                msg :'record not found..'
           })
        }else{
            req._id = result[0]._id

            if (result[0]._id == req._id ){
                res.json({
                    result:'false',
                     msg: 'channel successfully updated..',
                    //data:result[0]
                })
            }else{

            }
        }   
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_my_channel',
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    } 
    websiteModel.get_my_channel(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result.user_id
        
            if(result.user_id == req.user_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_my_channel_video',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('channel_id').isMongoId().withMessage('channel_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id & channel_id..'
        });
    } 
    websiteModel.get_my_channel_video(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result.user_id,
            req.channel_id = result.channel_id
        
            if(result.user_id == req.user_id && result.channel_id == req.channel_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/delete_channel',
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    }
    websiteModel.delete_channel(req.body).then((result)=>{
        
        //var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result[0].user_id
            
            if(result[0].user_id == req.user_id ){
                res.json({
                    result:'true',
                    msg:'record deleted successfully..',
                })
            }else{
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/subscribe_to_channel',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('channel_id').isMongoId().withMessage('channel_id should be required'),(req,res,next)=>{   

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id & channel_id..'
        });
    } 
    websiteModel.subscribe_to_channel(req.body).then((result)=>{
       
        if(result.length==0){
            res.json({
                result: 'true',
                msg:'channel subscribe successfully..',
            })
        }else{
            var subscribe_status = result[0].subscribe_status;
            req.user_id = result[0].user_id,
            req.channel_id = result[0].channel_id
            
            if(result[0].user_id == req.user_id && result[0].channel_id == req.channel_id && subscribe_status == '1'){
                res.json({
                    result:'true',
                    msg:'channel un_subscribe successfully..'
                })
            }else{
                res.json({
                    result:'true',
                    msg:'channel subscribe successfully..'
                })

            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    }) 
});

router.post('/get_subscribe_channel',
    body('user_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id(user_id)..'
        });
    } 

    websiteModel.get_subscribe_channel(req.body).then((result1)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result1.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
           // req.user_id = result.user_id
        
            //if(result.user_id == req.user_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result1
                })
           // }else{

            //}
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_subscribe_single_channel',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('channel_id').isMongoId().withMessage('channel_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id & channel_id..'
        });
    } 

    websiteModel.get_subscribe_single_channel(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result[0].user_id,
            req.channel_id = result[0].channel_id
        
            if(result[0].user_id == req.user_id && result[0].channel_id == req.channel_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result[0]
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_single_channel_subscribe',
    body('channel_id').isMongoId().withMessage('channel_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required channel_id..'
        });
    }

    websiteModel.get_single_channel_subscribe(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..'
            })
        }else{
            req.channel_id = result[0].channel_id
        
            if(result[0].channel_id == req.channel_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    _id:result[0]._id,
                    subscribe_count:result[0].subscribe_count
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/create_playlist',upload_user_image.single('image'),
    body('user_id').isMongoId().withMessage('_id should be required'),
    body('name').isLength({
        min:1,
        max:20
    }).withMessage('name should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, name & image..'
        });
    } 

    websiteModel.create_playlist(req.body,req.file).then((result)=>{
       var img = req.file;
        if(result){
            res.json({
                ressult: 'true',
                msg :'playlist created successfully..',
                data: result
           })
        }else{
            res.json({
               result:'false',
               msg: 'playlist does not created..',
               //data:[]
           })
        }   
        //var data = JSON.stringify(result2)
        
           // res.json({
              //  result:response,
               // msg:msg,
               // data:result2
          //  }); 
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/upload_my_playlist_video', 
    body('playlist_id').isMongoId().withMessage('playlist_id should be required'),
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('video_id').isMongoId().withMessage('video_id should be required'),(req, res,err) => {
   
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required playlist_id, user_id, video_id, & playlist_name ..'
        });
    }

    websiteModel.upload_my_playlist_video(req.body).then((result)=>{
        
        if(result){
            res.json({
                result: 'true',
                msg:'video uploaded successfully..',
            })
        }else{
           // req._id = result[0]._id

            //if(result[0]._id == req._id ){
                res.json({
                     result:'false',
                    msg:'video does not uploaded successfully..',
                   // body:req.file
                })
            //}else{

            //}
        }
    }).catch((err)=>{
        console.log(err)
        res.json({message:err.message})
    });
});

router.post('/get_my_playlist',
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    } 
    websiteModel.get_my_playlist(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result.user_id
         
            if(result.user_id == req.user_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result,
                })
              
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_my_playlist_video',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('playlist_id').isMongoId().withMessage('playlist_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id & playlist_id..'
        });
    } 
    websiteModel.get_my_playlist_video(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result.user_id,
            req.playlist_id = result.playlist_id
        
            if(result.user_id == req.user_id && result.playlist_id == req.playlist_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/delete_my_playlist_video',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id..'
        });
    }
    websiteModel.delete_my_playlist_video(req.body).then((result)=>{
        
        //var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req._id = result[0]._id
            
            if(result[0]._id == req._id ){
                res.json({
                    result:'true',
                    msg:'record deleted successfully..',
                })
            }else{
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.put('/update_my_playlist_video',
     body('_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id(playlist_id) & update_field_name(name)..'
        });
    } 

    websiteModel.update_my_playlist_video(req.body).then((result)=>{
         
        if(result.length==0){
            res.json({
                ressult: 'false',
                msg :'record not found..'
           })
        }else{
            req._id = result[0]._id

            if (result[0]._id == req._id ){
                res.json({
                    result:'false',
                     msg: 'my_playlist successfully updated..',
                    //data:result[0]
                })
            }else{

            }
        }   
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/create_history',
     body('user_id').isMongoId().withMessage('user_id should be required'),
     body('channel_id').isMongoId().withMessage('channel_id should be required'),
     body('video_id').isMongoId().withMessage('video_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, channel_id & video_id..'
        });
    } 

    websiteModel.create_history(req.body).then((result)=>{
         
        if(result.length==0){
            res.json({
                result: 'true',
                msg :'video_history add successfully..',
           })
        }else{
            req.user_id = result.user_id,
            req.channel_id = result.channel_id,
            req.video_id = result.video_id
            
            if(result.user_id == req.user_id && result.channel_id == req.channel_id && result.video_id == req.video_id){   

                res.json({
                    result:'false',
                    msg: 'video_history add successfully..'
                })
            }else{

            }
        }   
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/delete_history',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('video_id').isMongoId().withMessage('video_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id & video_id..'
        });
    }
    websiteModel.delete_history(req.body).then((result)=>{
       
       // var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result[0].user_id,
            req.video_id = result[0].video_id

            
            if(result[0].user_id == req.user_id && result[0].video_id == req.video_id  ){
                res.json({
                    result:'true',
                    msg:'video history deleted successfully..',
                })
            }else{
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_history',
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    }
    websiteModel.get_history(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result.user_id

            if(result.user_id == req.user_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_play_list_video',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id(video_id)..'
        });
    }

    websiteModel.get_play_list_video(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req._id = result[0]._id
        
            if(result[0]._id == req._id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result[0]
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/delete_playlist_video',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id(video_id)..'
        });
    }
    websiteModel.delete_playlist_video(req.body).then((result)=>{
        
        //var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req._id = result[0]._id
            
            if(result[0]._id == req._id ){
                res.json({
                    result:'true',
                    msg:'record deleted successfully..',
                })
            }else{
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.get('/search',(req,res,next)=>{
    websiteModel.search(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
            });
        }        
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.post('/like_video',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('channel_id').isMongoId().withMessage('channel_id should be required'),
    body('video_id').isMongoId().withMessage('video_id should be required'),
    body('like_status').isLength({
        min:1,
        max:20
    }),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg:'parameter required user_id, channel_id, video_id & like_status..'
        });
    }

    websiteModel.like_video(req.body).then((result)=>{

        if(result.length==0 && req.body.like_status == '1'){
            res.json({
                result: 'true',
                msg:'video liked successfully..',
            }) 
        }else if(result.length==0 && req.body.like_status == '0') {
             res.json({
                result: 'true',
                msg:'remove liked successfully..',
            })  
        }else{
            var like_status = req.body.like_status;
            req.user_id = result[0].user_id,
            req.channel_id = result[0].channel_id,
            req.video_id = result[0].video_id
           
            if(result[0].user_id == req.user_id && result[0].channel_id == req.channel_id && result[0].video_id == req.video_id && like_status == '1'){
                res.json({
                    result:'true',
                    msg:'video liked successfully..'
                })
            }else{
                res.json({
                    result:'true',
                    msg:'remove liked successfully..'
                })
            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/delete_like_video',
    body('user_id').isMongoId().withMessage('user_id should be required'),
     body('video_id').isMongoId().withMessage('video_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id & video_id..'
        });
    }

    websiteModel.delete_like_video(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result.user_id,
            req.video_id = result.video_id
        
            if(result.user_id == req.user_id && result.video_id == req.video_id){
                res.json({
                    result:'true',
                    msg:'data deleted successfully..',
                    //data:result
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/help',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('email').isEmail({}).withMessage('email should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id,first_name,last_name email & massage..'
        });
    }
    websiteModel.help(req.body).then((result)=>{
       
        if(result){
            res.json({ 
                ressult: 'true',
                msg :'data add successfully..',
               // data: result
           })
        }else{
            res.json({
               result:'false',
               msg: 'data does not added..',
               //data:[]
           })
        }   
        
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.get('/about', (req,res,next)=>{
    websiteModel.about(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{

            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
            }); 
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.get('/privacy_and_policy', (req,res,next)=>{
    websiteModel.privacy_and_policy(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{

            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
            }); 
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.post('/related_video',
    body('category_type').isLength({
        min:1,
        max:20
    }).withMessage('category_name should be required'),(req,res,next)=>{

   const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required category_type..'
        });
    }

    websiteModel.related_video(req.body).then((result)=>{
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            
            req.category_type = result.category_type

            if(result.category_type == req.category_type){
              // for(let i=0; i < result.length; i++) {
                 
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result
                 /*   data:[{
                      _id:result[i]._id,
                      user_id:result[i].user_id,
                      channel_id:result[i].channel_id,
                      channel_data:{
                        _id:result[i]._id
                      }
                    }]*/

                })
           // }
              
            }else{

            }
           
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_like_video_list',
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    }

    websiteModel.get_like_video_list(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
           // for(let i= 0; i < result.length; i++){

            req.user_id = result.user_id
        
            if(result.user_id == req.user_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result
                    /*data:[{
                    video_id:result[i].video_id,
                    user_id:result[i].user_id,
                    channel_id:result[i].channel_id
                    }]*/
                })
            }else{

            }
         // }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_like_single_video_list',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('video_id').isMongoId().withMessage('video_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id & video_id..'
        });
    }

    websiteModel.get_like_single_video_list(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
                like_status:0,
                dislike_status:0,
                data:result
            })
        }else{
            req.user_id = result[0].user_id,
            req.video_id = result[0].video_id
        
            if(result[0].user_id == req.user_id && result[0].video_id == req.video_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result[0]
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_single_video_likes',
    body('video_id').isMongoId().withMessage('video_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required video_id..'
        });
    }

    websiteModel.get_single_video_likes(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..'
            })
        }else{
            req.video_id = result[0].video_id
        
            if(result[0].video_id == req.video_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    _id:result[0]._id,
                    video_likes:result[0].video_likes
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/report_single_video',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('video_id').isMongoId().withMessage('video_id should be required'),
     body('report').isLength({
        min:1,
        max:20
    }).withMessage('report should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id,video_id & report..'
        });
    } 

    websiteModel.report_single_video(req.body).then((result)=>{
       
        if(result){
            res.json({
                result: 'true',
                msg :'report send successfully..',
               // data: result
           })
        }else{
            res.json({
               result:'false',
               msg: 'report does not send..',
               //data:[] 
           })
        }   
        //var data = JSON.stringify(result2)
        
           // res.json({
              //  result:response,
               // msg:msg,
               // data:result2
          //  }); 
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/not_interested_video',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('video_id').isMongoId().withMessage('video_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg:'parameter required user_id, & video_id..'
        });
    }

    websiteModel.not_interested_video(req.body).then((result)=>{

        if(result){
            res.json({
                result: 'true',
                msg:'data add successfully..',
            }) 
        }else{
            res.json({
                result:'false',
                msg:'data does not exit..'
            })
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/dont_recommend_channel',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('channel_id').isMongoId().withMessage('channel_id should be required'),
    body('video_id').isMongoId().withMessage('video_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, channel_id & video_id..'
        });
    }

    websiteModel.dont_recommend_channel(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result){
            res.json({
                result: 'true',
                msg:'data added successfully..',
            })
        }else{
            res.json({
                result:'true',
                msg:'data does not exist..'
            })
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/send_comment',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('channel_id').isMongoId().withMessage('channel_id should be required'),
    body('video_id').isMongoId().withMessage('video_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, channel_id, video_id & msg..'
        });
    }

    websiteModel.send_comment(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result){
            res.json({
                result: 'true',
                msg:'msg send successfully..',
            })
        }else{
            res.json({
                result:'false',
                msg:'msg does not send..'
            })
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_comment',
    body('video_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required video_id..'
        });
    }

    websiteModel.get_comment(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.video_id = result.video_id
        
            if(result.video_id == req.video_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/download_video',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('channel_id').isMongoId().withMessage('channel_id should be required'),
    body('video_id').isMongoId().withMessage('video_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, channel_id & video_id ..'
        });
    }

    websiteModel.download_video(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result){
            res.json({
                result: 'true',
                msg:'video download successfully..',
            })
        }else{
            res.json({
                result:'false',
                msg:'video does not exist..'
            })
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_download_video',
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    }

    websiteModel.get_download_video(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            
            req.user_id = result.user_id
           
            if(result.user_id == req.user_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data: result
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/delete_download_video',
    body('user_id').isMongoId().withMessage('user_id should be required'),
     body('video_id').isMongoId().withMessage('video_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id & video_id..'
        });
    }

    websiteModel.delete_download_video(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result.user_id,
            req.video_id = result.video_id
        
            if(result.user_id == req.user_id && result.video_id == req.video_id){
                res.json({
                    result:'true',
                    msg:'data deleted successfully..',
                    //data:result
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_latest_video',(req,res,next)=>{
    websiteModel.get_latest_video(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
            });
        }        
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/get_top_video',(req,res,next)=>{
    websiteModel.get_top_video(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
            });
        }        
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/get_live_video',(req,res,next)=>{
    websiteModel.get_live_video(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
            });
        }        
    }).catch((err)=>{
       res.json({message:err.message})
    })
});



module.exports = router;