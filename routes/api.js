const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
//const { parseBuffer } = require('music-metadata');
const path = require('path'); 
const db = require('../models/connection');
const apiModel = require('../models/apiModel');
const ObjectId = require('mongoose').Types.ObjectId;
const thumbsupply = require('thumbsupply');
const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-access-token');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const apn = require('apn');
const serviceAccount = require("F:/NodeJs/Yuonair/yuonairadminjsom.json");
const token = ['AAAA6eHu7EM:APA91bEOuegLN7Kv2Pi5uOX0KuJZYdUnA_VN9Kdv1F80eVjoTaf7tKFkk2dutV9mfWFzuivA19pb5Zm5igkdsn9Y5epZIZpsUr8181e5AHmLin70HP6jMeuggGo4NgUDnSMHl_ridibB'];
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


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

    apiModel.upload_video(req.body,req.files).then((result)=>{
        console.log(req.files)
    
       var fcm = 'd1XyI2PMQI2sIZMU-zic--:APA91bFFrOe6jwo3YonCHQDChS0cDFj5OISdphLZTclnhqiTFfgUhTp9QR0weYe_CbaZuGNtnNcMfkoxo4s0eraINqhR6Y9tyqoqwCxDtjjfjE9oq_0KuINzqSLfo1bVPInLcbBVdzWP'
       var token = [fcm]
       var payload ={
             notification:{
                title: "Yuonair App",
                body: 'user successfully uploaded video in Yuonair App'
            }
        };
        var options ={
            priority: "high",
            timeToLive: 60 * 60 *24
        };
       
        admin.messaging().sendToDevice(token, payload, options)
        .then (function(response) {
        console.log ("Successfully sent message:", response);
        }).catch(function(error) {
        console.log( "Error sending message:", error);
        });
       
        
        /*var thumbnail_name = thumbsupply.generateThumbnail(req.file.path, {
            size: thumbsupply.ThumbSize.MEDIUM, // or ThumbSize.LARGE
            timestamp: req.body.file, // or `30` for 30 seconds
            forceCreate: true,
            cacheDir: "thumb/",
            mimetype: "video/mp4"
        })
        console.log(thumbnail_name);*/
        //var video = req.files;         
        //var video_thumbnail = req.files;
       
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

    apiModel.upload_music(req.body,req.file).then((result)=>{
        console.log(req.file)
       
       var fcm = 'd1XyI2PMQI2sIZMU-zic--:APA91bFFrOe6jwo3YonCHQDChS0cDFj5OISdphLZTclnhqiTFfgUhTp9QR0weYe_CbaZuGNtnNcMfkoxo4s0eraINqhR6Y9tyqoqwCxDtjjfjE9oq_0KuINzqSLfo1bVPInLcbBVdzWP'
       var token = [fcm]
       var payload ={
             notification:{
                title: "Yuonair App",
                body: 'user successfully uploaded audio in Yuonair App'
            }
        };
        var options ={
            priority: "high",
            timeToLive: 60 * 60 *24
        };
       
        admin.messaging().sendToDevice(token, payload, options)
        .then (function(response) {
        console.log ("Successfully sent message:", response);
        }).catch(function(error) {
        console.log( "Error sending message:", error);
        });
       
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


router.post('/upload_image',upload_image.any('cover_image','profile_image'),
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next) => {
   
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id(user_id), cover_image, profile_image, name & email..'
        });
    }
    apiModel.upload_image(req.body,req.files).then((result)=>{
        //console.log(req.files)

       var img = req.files;
      
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',

            })
        }else{
         req._id = result[0]._id

            if(result[0]._id == req._id ){
                res.json({
                    result:'true',
                    msg:'file uploaded successfully',
                    //body:req.file
                })

            }else{

            }
        }
    }).catch((err)=>{
        //console.log(err)
        res.json({message:err.message})
    });
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

router.post('/upload_user_image',upload_image.single('profile_image'),
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next) => {
   
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id(user_id), & profile_image..'
        });
    }
    apiModel.upload_user_image(req.body,req.file).then((result)=>{
        console.log(req.body._id);
        console.log(req.file);

       var img = req.file;
      
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',

            })
        }else{
         req._id = result[0]._id

            if(result[0]._id == req._id ){
                res.json({
                    result:'true',
                    msg:'file uploaded successfully',
                    //body:req.file
                })

            }else{

            }
        }
    }).catch((err)=>{
        //console.log(err)
        res.json({message:err.message})
    });
});
 
router.post('/signup',
    body('email').isEmail({}).withMessage('email should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required username, email,password,confirm_password & gender..'
        });
    }
	apiModel.registerUser(req.body).then((result2)=>{
       
        var options = {
            token: {
                key: "F:/NodeJs/Yuonair/AuthKey_5A8WT4F74F.p8",
                keyId: "5A8WT4F74F",
                teamId: "37883T85CH",
                proxy: {
                  host: "locahost",
                   port: 3003
               }
            },
            development: true
        };
      try{
        var apnProvider = new apn.Provider(options);
        var note = new apn.Notification();
        var deviceToken = "d6ywfBBkV0ilj1erKHGlBv:APA91bHN-pF7brAizBJNQR64Ci30ixHLYo-EK2lpGh4f2X7qFoXxLIuDU9M4oyQyNYPf6R03j3gUJsainkU9SR37vdXF4YzSPOCJUb9m0QILLTO9wWfVAAtuZVG5cSgLezGDXICdtoEY";
        
        
        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 1;
        note.sound = "ping.aiff";
        note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
        note.payload = {'messageFrom': 'John Appleseed'};
        note.topic = "com.LogicalSoftectYuoNair.com.yunairProject";

        apnProvider.send(note, deviceToken).then( (result) => {
       // see documentation for an explanation of result
       if(result) {
        console.log ("Successfully sent message:", result);
         }
       }); 
     }catch(error) {
        console.log( "Error sending message:", error.message);
        };
    

        
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
               data:[]
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
    apiModel.userLogin(req.body).then((result)=>{
          
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
                     data:result[0]
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
    body('email').isEmail({}).withMessage('email should be required..'),
    body('fcm').isLength({
        min:0,
        max:400
    }).withMessage('fcm should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg: 'parameter required google_id, email & fcm..'
        });
    }

    apiModel.googleLogin(req.body).then((result3)=>{
         
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
    body('email').isEmail({}).withMessage('email should be required..'),
     body('fcm').isLength({
        min:0,
        max:400
    }).withMessage('fcm should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg: 'parameter required facebook_id, email & fcm..'
        });
    }

    apiModel.facebookLogin(req.body).then((result3)=>{
         
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
    body('email').isEmail({}).withMessage('email should be required..'),
    body('fcm').isLength({
        min:0,
        max:400
    }).withMessage('fcm should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg: 'parameter required twitter_id, email & fcm..'
        });
    }

    apiModel.twitterLogin(req.body).then((result3)=>{
         
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

router.post('/apple_login',
    body('email').isEmail({}).withMessage('email should be required..'),
    body('fcm').isLength({
        min:0,
        max:400
    }).withMessage('fcm should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg: 'parameter required apple_id, email & fcm..'
        });
    }

    apiModel.appleLogin(req.body).then((result3)=>{
         
       if(result3){
             res.json({
                result: 'true',
                msg:'user registered successfully..',
                data:result3
            })
        }else{
            res.json({
                result: 'false',
                msg:'apple_id already registered please enter new apple_id..',
                //data:result
            })
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })
});


router.get('/list', (req,res,next)=>{
    apiModel.fetchAllDetails(req.params,req.body).then((result)=>{
   
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
    apiModel.update_user_data(req.body).then((result)=>{
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

    apiModel.view_profile(req.body).then((result)=>{
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
    apiModel.delete_user_account(req.body).then((result)=>{
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

router.patch('/logout',  
     body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{ 

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id..'
        });
    }   
    apiModel.updateFCM(req.body).then((result)=>{
       
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
                    msg:'user successfully logout..'
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
    body('password').isLength({
        min:1,
        max:20
    }).withMessage('password should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required email & password..'
        });
    }

    apiModel.forget_password(req.body).then((result)=>{
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'_id  does not exist..',
            })
        }else{
            req.email = result[0].email

            if(result[0].email == req.email){
                res.json({
                    result:'true',
                    msg:'password successfully updated..'
                })
            }else{

            }    
        }
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

    apiModel.get_video(req.body).then((result)=>{
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
    apiModel.get_music(req.body).then((result)=>{
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
    apiModel.delete_music(req.body).then((result)=>{
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

    apiModel.change_password(req.body).then((result)=>{
        
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

    apiModel.create_channel(req.body,req.files).then((result2)=>{
         
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

    apiModel.update_channel(req.body,req.files).then((result)=>{
         
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
    apiModel.get_my_channel(req.body).then((result)=>{
       
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
    apiModel.get_my_channel_video(req.body).then((result)=>{
       
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
    apiModel.delete_channel(req.body).then((result)=>{
        
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
    apiModel.subscribe_to_channel(req.body).then((result)=>{
        
       var fcm = 'd1XyI2PMQI2sIZMU-zic--:APA91bFFrOe6jwo3YonCHQDChS0cDFj5OISdphLZTclnhqiTFfgUhTp9QR0weYe_CbaZuGNtnNcMfkoxo4s0eraINqhR6Y9tyqoqwCxDtjjfjE9oq_0KuINzqSLfo1bVPInLcbBVdzWP'
       var token = [fcm]
       var payload ={
             notification:{
                title: "Yuonair App",
                body: 'user your channel subscribe successfully in Yuonair App'
            }
        };
        var options ={
            priority: "high",
            timeToLive: 60 * 60 *24
        };
       
        admin.messaging().sendToDevice(token, payload, options)
        .then (function(response) {
        console.log ("Successfully sent message:", response);
        }).catch(function(error) {
        console.log( "Error sending message:", error);
        });
        
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

    apiModel.get_subscribe_channel(req.body).then((result1)=>{
       
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

    apiModel.get_subscribe_single_channel(req.body).then((result)=>{
       
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

    apiModel.get_single_channel_subscribe(req.body).then((result)=>{
       
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

    apiModel.create_playlist(req.body,req.file).then((result)=>{
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
    body('channel_id').isMongoId().withMessage('channel_id should be required'),
    body('video_id').isMongoId().withMessage('video_id should be required'),(req, res,err) => {
   
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required playlist_id, user_id, channel_id, video_id, & playlist_name ..'
        });
    }

    apiModel.upload_my_playlist_video(req.body).then((result)=>{
        
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
    apiModel.get_my_playlist(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result.user_id
         
            if(result.user_id == req.user_id){
                
               /* for(let i=0;i<result.length;i++){
                    var  _id = result[i]._id;
                    var  user_id = result[i].user_id;
                    var  name = result[i].name;
                    if(result[i].image.length>0){
                        var  image = result[i].image[0].path;
                    }
                    var  video_count = result[i].video_count;*/
                
                
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result,
                    /*data:[{
                      
                        _id:_id,
                        user_id:user_id,
                        name:name,
                        image:image,
                        video_count:video_count
                    }]*/
                })
              //}
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
    apiModel.get_my_playlist_video(req.body).then((result)=>{
       
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
    apiModel.delete_my_playlist_video(req.body).then((result)=>{
        
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

    apiModel.update_my_playlist_video(req.body).then((result)=>{
         
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
    apiModel.delete_playlist(req.body).then((result)=>{
        
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

    apiModel.create_history(req.body).then((result)=>{
         
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
    apiModel.delete_history(req.body).then((result)=>{
       
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

router.post('/add_to_list',(req,res,next)=>{
    apiModel.add_to_list(req.body).then((result)=>{
       
        if(result){
            res.json({
                ressult: 'true',
                msg :'list add successfully..',
               // data: result
           })
        }else{
            res.json({
               result:'false',
               msg: 'list does not added..',
               //data:[]
           })
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
    apiModel.get_history(req.body).then((result)=>{
       
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

    apiModel.get_play_list_video(req.body).then((result)=>{
       
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
    apiModel.delete_playlist_video(req.body).then((result)=>{
        
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
    /*body('video_name').isLength({
       min:1,
       max:20
    }).withMessage('video_name should be required.'),(req,res,next)=>{*/

    /*const errors = validationResult(req);
    
   if(!errors.isEmpty()) {
       return res.status(400).json({
           result: 'false',
            //errors: errors.array()
           msg:'parameter required video_name..'
       });
   } */
    apiModel.search(req.body).then((result)=>{
       

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

router.post('/search_video',
    body('video_name').isLength({
       min:1,
       max:20
    }).withMessage('video_name should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
   if(!errors.isEmpty()) {
       return res.status(400).json({
           result: 'false',
            //errors: errors.array()
           msg:'parameter required video_name..'
       });
   } 
    apiModel.search_video(req.body).then((result)=>{
        //var video_name = req.body.video_name;
        //const search = result.filter(obj => Object.values(obj).some(val => val.includes(video_name)))

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
           // req.video_name = result.video_name
            
            //if(result[0].video_name == req.video_name ){
            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
            });
           // }else{
                    
            //}
        }        
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/get_video_details',(req,res,next)=>{
    apiModel.get_video_details(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
          // for(var i of result) {
            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
                /*data:[{
                _id:result[i]._id,
                user_id:result[i].user_id
                }]*/
            });

         // }
        }        
    }).catch((err)=>{
       //res.json({message:err.message})
       console.log(err)
    })
});

router.post('/get_latest_video',(req,res,next)=>{
    apiModel.get_latest_video(req.body).then((result)=>{

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
    apiModel.get_live_video(req.body).then((result)=>{

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
    apiModel.get_top_video(req.body).then((result)=>{

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

router.get('/get_featured_video',(req,res,next)=>{
    apiModel.get_featured_video(req.body).then((result)=>{

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

    apiModel.like_video(req.body).then((result)=>{
     
     if(req.body.like_status == '1'){ 
       var fcm = 'd1XyI2PMQI2sIZMU-zic--:APA91bFFrOe6jwo3YonCHQDChS0cDFj5OISdphLZTclnhqiTFfgUhTp9QR0weYe_CbaZuGNtnNcMfkoxo4s0eraINqhR6Y9tyqoqwCxDtjjfjE9oq_0KuINzqSLfo1bVPInLcbBVdzWP'
       var token = [fcm]
       var payload ={
             notification:{
                title: "Yuonair App",
                body: 'user like video in Yuonair App'
            }
        };
        var options ={
            priority: "high",
            timeToLive: 60 * 60 *24
        };
       
        admin.messaging().sendToDevice(token, payload, options)
        .then (function(response) {
        console.log ("Successfully sent message:", response);
        }).catch(function(error) {
        console.log( "Error sending message:", error);
        });
        }else{

        }

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

    apiModel.delete_like_video(req.body).then((result)=>{
       
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

router.post('/dislike_video',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('video_id').isMongoId().withMessage('video_id should be required'),
    body('dislike_status').isLength({
        min:1,
        max:20
    }),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg:'parameter required user_id, video_id & dislike_status..'
        });
    }

    apiModel.dislike_video(req.body).then((result)=>{

        if(result.length==0 && req.body.dislike_status == '1'){
            res.json({
                result: 'true',
                msg:'video disliked successfully..',
            }) 
        }else if(result.length==0 && req.body.dislike_status == '0') {
             res.json({
                result: 'true',
                msg:'remove disliked successfully..',
            })  
        }else{
            var dislike_status = req.body.dislike_status;
            req.user_id = result[0].user_id,
            req.video_id = result[0].video_id
           
            if(result[0].user_id == req.user_id && result[0].video_id == req.video_id && dislike_status == '1'){
                res.json({
                    result:'true',
                    msg:'video disliked successfully..'
                })
            }else{
                res.json({
                    result:'true',
                    msg:'remove disliked successfully..'
                })
            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.patch('/dislike_count',
    body('_id').isMongoId().withMessage('_id should be required'),
    body('video_id').isMongoId().withMessage('video_id should be required'),
    body('dislike_count').isLength({
        min:1,
        max:20
    }),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg:'parameter required _id, video_id & dislike_count..'
        });
    }

    apiModel.dislike_count(req.body).then((result)=>{

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
                    msg:'dislike count successfully updated..'
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
})

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
    apiModel.help(req.body).then((result)=>{
       
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
    apiModel.about(req.body).then((result)=>{
   
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

router.get('/report_history', (req,res,next)=>{
    apiModel.report_history(req.body).then((result)=>{
   
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
    apiModel.privacy_and_policy(req.body).then((result)=>{
   
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

    apiModel.related_video(req.body).then((result)=>{
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
                    data:result._id
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

    apiModel.get_like_video_list(req.body).then((result)=>{
       
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

    apiModel.get_like_single_video_list(req.body).then((result)=>{
       
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

    apiModel.get_single_video_likes(req.body).then((result)=>{
       
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
router.post('/user_activity',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id(user_id)..'
        });
    }

    apiModel.user_activity(req.body).then((result)=>{
       
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

    apiModel.report_single_video(req.body).then((result)=>{
       
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

router.post('/get_report_history_video', 
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    }

    apiModel.get_report_history_video(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
                like_status:0,
                dislike_status:0
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

    apiModel.not_interested_video(req.body).then((result)=>{

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

    apiModel.dont_recommend_channel(req.body).then((result)=>{
       
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

    apiModel.send_comment(req.body).then((result)=>{
       
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

    apiModel.get_comment(req.body).then((result)=>{
       
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

    apiModel.download_video(req.body).then((result)=>{
       
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

    apiModel.get_download_video(req.body).then((result)=>{
       
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

    apiModel.delete_download_video(req.body).then((result)=>{
       
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

router.post('/save_watch_later',
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

    apiModel.save_watch_later(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result){
            res.json({
                result: 'true',
                msg:'video save successfully..',
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

router.post('/get_save_watch_later',
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    }

    apiModel.get_save_watch_later(req.body).then((result)=>{
       
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

router.post('/delete_save_watch_later',
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

    apiModel.delete_save_watch_later(req.body).then((result)=>{
       
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

router.post('/send_reply_comment',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('channel_id').isMongoId().withMessage('channel_id should be required'),
    body('video_id').isMongoId().withMessage('video_id should be required'),
    body('comment_id').isMongoId().withMessage('comment_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, channel_id, video_id, comment_id & msg..'
        });
    }

    apiModel.send_reply_comment(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result){
            res.json({
                result: 'true',
                msg:'msg reply successfully..',
            })
        }else{
            res.json({
                result:'false',
                msg:'msg does not reply..'
            })
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_reply_comment',
    body('video_id').isMongoId().withMessage('video_id should be required'),
    body('comment_id').isMongoId().withMessage('comment_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required video_id & comment_id..'
        });
    }

    apiModel.get_reply_comment(req.body).then((result)=>{
       
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.video_id = result.video_id,
             req.comment_id = result.comment_id
            if(result.video_id == req.video_id && result.comment_id == req.comment_id){
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

router.post('/like_comment',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('comment_id').isMongoId().withMessage('comment_id should be required'),
    body('like_status').isLength({
        min:1,
        max:20
    }),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg:'parameter required user_id, comment_id & like_status..'
        });
    }

    apiModel.like_comment(req.body).then((result)=>{

     if(req.body.like_status == '1'){ 
       var fcm = 'd1XyI2PMQI2sIZMU-zic--:APA91bFFrOe6jwo3YonCHQDChS0cDFj5OISdphLZTclnhqiTFfgUhTp9QR0weYe_CbaZuGNtnNcMfkoxo4s0eraINqhR6Y9tyqoqwCxDtjjfjE9oq_0KuINzqSLfo1bVPInLcbBVdzWP'
       var token = [fcm]
       var payload ={
             notification:{
                title: "Yuonair App",
                body: 'user like comment in Yuonair App'
            }
        };
        var options ={
            priority: "high",
            timeToLive: 60 * 60 *24
        };
       
        admin.messaging().sendToDevice(token, payload, options)
        .then (function(response) {
        console.log ("Successfully sent message:", response);
        }).catch(function(error) {
        console.log( "Error sending message:", error);
        });
        }else{
            
        }

        if(result.length==0 && req.body.like_status == '1'){
            res.json({
                result: 'true',
                msg:'comment liked successfully..',
            }) 
        }else if(result.length==0 && req.body.like_status == '0') {
             res.json({
                result: 'true',
                msg:'remove liked successfully..',
            })  
        }else{
            var like_status = req.body.like_status;
            req.user_id = result[0].user_id,
            req.comment_id = result[0].comment_id
           
            if(result[0].user_id == req.user_id && result[0].comment_id == req.comment_id && like_status == '1'){
                res.json({
                    result:'true',
                    msg:'comment liked successfully..'
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

router.post('/dislike_comment',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('comment_id').isMongoId().withMessage('comment_id should be required'),
    body('dislike_status').isLength({
        min:1,
        max:20
    }),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg:'parameter required user_id, comment_id & dislike_status..'
        });
    }

    apiModel.dislike_comment(req.body).then((result)=>{

        if(result.length==0 && req.body.dislike_status == '1'){
            res.json({
                result: 'true',
                msg:'comment disliked successfully..',
            }) 
        }else if(result.length==0 && req.body.dislike_status == '0') {
             res.json({
                result: 'true',
                msg:'remove disliked successfully..',
            })  
        }else{
            var dislike_status = req.body.dislike_status;
            req.user_id = result[0].user_id,
            req.comment_id = result[0].comment_id
           
            if(result[0].user_id == req.user_id && result[0].comment_id == req.comment_id && dislike_status == '1'){
                res.json({
                    result:'true',
                    msg:'comment disliked successfully..'
                })
            }else{
                res.json({
                    result:'true',
                    msg:'remove disliked successfully..'
                })
            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/delete_comment',
    body('comment_id').isMongoId().withMessage('comment_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required comment_id..'
        });
    }
    apiModel.delete_comment(req.body).then((result)=>{
        
        //var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.comment_id = result[0].comment_id
            
            if(result[0].comment_id == req.comment_id ){
                res.json({
                    result:'true',
                    msg:'comment deleted successfully..',
                })
            }else{
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.post('/like_reply',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('comment_id').isMongoId().withMessage('comment_id should be required'),
    body('like_status').isLength({
        min:1,
        max:20
    }),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg:'parameter required user_id, comment_id & like_status..'
        });
    }

    apiModel.like_reply(req.body).then((result)=>{

        if(result.length==0 && req.body.like_status == '1'){
            res.json({
                result: 'true',
                msg:'reply liked successfully..',
            }) 
        }else if(result.length==0 && req.body.like_status == '0') {
             res.json({
                result: 'true',
                msg:'remove liked successfully..',
            })  
        }else{
            var like_status = req.body.like_status;
            req.user_id = result[0].user_id,
            req.comment_id = result[0].comment_id
           

           
            if(result[0].user_id == req.user_id && result[0].comment_id == req.comment_id && like_status == '1'){
                res.json({
                    result:'true',
                    msg:'comment liked successfully..'
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

router.post('/dislike_reply',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('comment_id').isMongoId().withMessage('comment_id should be required'),
    body('dislike_status').isLength({
        min:1,
        max:20
    }),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg:'parameter required user_id, comment_id & dislike_status..'
        });
    }

    apiModel.dislike_reply(req.body).then((result)=>{

        if(result.length==0 && req.body.dislike_status == '1'){
            res.json({
                result: 'true',
                msg:'reply disliked successfully..',
            }) 
        }else if(result.length==0 && req.body.dislike_status == '0') {
             res.json({
                result: 'true',
                msg:'remove disliked successfully..',
            })  
        }else{
            var dislike_status = req.body.dislike_status;
            req.user_id = result[0].user_id,
            req.comment_id = result[0].comment_id
           
            if(result[0].user_id == req.user_id && result[0].comment_id == req.comment_id && dislike_status == '1'){
                res.json({
                    result:'true',
                    msg:'reply disliked successfully..'
                })
            }else{
                res.json({
                    result:'true',
                    msg:'remove disliked successfully..'
                })
            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/delete_reply',
    body('comment_id').isMongoId().withMessage('comment_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required comment_id..'
        });
    }
    apiModel.delete_reply(req.body).then((result)=>{
        
        //var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.comment_id = result[0].comment_id
            
            if(result[0].comment_id == req.comment_id ){
                res.json({
                    result:'true',
                    msg:'comment deleted successfully..',
                })
            }else{
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.post('/user_profile_details',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('email').isEmail({}).withMessage('email should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, username, first_name, email, about, facebook(username),google(username),twitter(username),instagram(username) & favourite_category(username)..'
        });
    }
    apiModel.user_profile_details(req.body).then((result)=>{
       
        if(result){
            res.json({
                ressult: 'true',
                msg :'user profile details added successfully..',
                //data: result
           })
        }else{
            res.json({
               result:'false',
               msg: 'user profile details does not registered..',
           })
        }  
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/user_account_verification',
    body('email').isEmail({}).withMessage('email should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required email..'
        });
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    
    apiModel.user_account_verification(req.body,otp).then((result)=>{
        console.log(req.body)   
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
            subject: "Verification mail from Yuonair",
            html: "<h4>email : "+email+"</h4><h4>otp : "+otp+"</h4>"
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
                    msg :'mail send successfully..',
                    email:email,
                    otp: otp.toString(),
                    //data:result
                })
            }
        })
   
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/user_resend_otp',
    body('email').isEmail({}).withMessage('email should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required email..'
        });
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    
    apiModel.user_resend_otp(req.body,otp).then((result)=>{
        console.log(req.body)   
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
            subject: "Verification mail from Yuonair",
            html: "<h4>email : "+email+"</h4><h4>otp : "+otp+"</h4>"
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
                    msg :'mail send successfully..',
                    email:email,
                    otp: otp.toString(),
                    //data:result
                })
            }
        })
   
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/user_verify_email',
    body('email').isEmail({}).withMessage('email should be required..'),
    body('otp').isLength({
        min:1,
        max:4
    }),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required email & otp..'
        });
    }
    apiModel.user_verify_email(req.body).then((result)=>{
        
        //var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'your otp invalid, plese enter valid otp..',
            })
        }else{
            req.email = result[0].email,
            req.otp = result[0].otp
            
            if(result[0].email == req.email && result[0].otp == req.otp){
                res.json({
                    result:'true',
                    msg:'otp verify successfully..',
                })
            }else{

                res.json({
                    result:'false',
                    msg:'your otp invalid, plese enter valid otp..',
                })
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.post('/account_balance',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('ammount').isLength({
        min:1,
        max:20
    }).withMessage('ammount should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, available_balance, paypal_email, ammount & max_limit..'
        });
    }
    apiModel.account_balance(req.body).then((result)=>{
       
        if(result){
            res.json({
                ressult: 'true',
                msg :'account_balance added successfully..',
                data: result
           })
        }else{
            res.json({
               result:'false',
               msg: 'account_balance does not exist..',
              // data:[]
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

router.post('/block_user',
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
    apiModel.block_user(req.body).then((result)=>{
        
        //var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'true',
                msg:'user blocked successfully..',
            })
        }else{
            req.user_id = result[0].user_id,
            req.channel_id = result[0].channel_id
            
            if(result[0].user_id == req.user_id && result[0].channel_id == req.channel_id){
                res.json({
                    result:'true',
                    msg:'user blocked successfully..',
                })
            }else{
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.post('/unblock_user',
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
    apiModel.unblock_user(req.body).then((result)=>{
        
        //var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result[0].user_id,
            req.channel_id = result[0].channel_id
            
            if(result[0].user_id == req.user_id && result[0].channel_id == req.channel_id ){
                res.json({
                    result:'true',
                    msg:'user unblock successfully..',
                })
            }else{
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.post('/block_user_list',
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    }
    
    apiModel.block_user_list(req.body).then((result)=>{
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
          
           req.user_id = result[0].user_id
            
            if(result[0].user_id == req.user_id){
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

router.post('/notification_list',
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    }
    apiModel.notification_list(req.body).then((result)=>{
        
        //var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result.user_id
            
            if(result.user_id == req.user_id ){
                res.json({
                    result:'true',
                    msg:'notificaton list get successfully..',
                    data:result
                })
            }else{
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.post('/notification_count',
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    }
    apiModel.notification_count(req.body).then((result1)=>{
        
        //var new_id = parseInt(req.params.id);
        
        if(result1.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result1[0].user_id
            
            if(result1[0].user_id == req.user_id ){
                res.json({
                    result:'true',
                    msg:'notificaton count get successfully..',
                    video_count:result1
                })
            }else{
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.post('/video_views',
    body('video_id').isMongoId().withMessage('video_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required video_id..'
        });
    }
    apiModel.video_views(req.body).then((result)=>{
        
        //var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.video_id = result[0].video_id
            
            if(result[0].video_id == req.video_id ){
                res.json({
                    result:'true',
                    msg:'video views updated successfully..'
                })
            }else{
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.post('/view_all_video',
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    }
    apiModel.view_all_video(req.body).then((result)=>{
       
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

router.post('/generate_agrora_token',upload_image.single('thumbnail_image'),
    body('user_id').isMongoId().withMessage('user_id should be required..'),
    body('channel_id').isMongoId().withMessage('channel_id should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, channel_id, channel_name, video_name & thumbnail_image..'
        });
    }

        const appID = '537ee9fcc8f24c33b4b823896c9db588';
        const appCertificate = 'e776b6e37faa4b719b802b0306d2faea';
        const channelName = req.body.channel_name;
        const uid = 0//2882341273;
        const account = 0//"2882341273";
        const role = 0//RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 3600
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
        const tokenA = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
        const img = req.file;
       //const token = tokenA;
    apiModel.generate_agrora_token(req.body,req.file,appID,appCertificate,tokenA).then((result)=>{
        
        if(result){
            res.json({
                result: 'true',
                msg :'token generated successfully..',
                //data:result,
                app_id:appID,
                token: tokenA 
            });
        }else{
            res.json({
               result:'false',
               msg: 'token does not generated successfully..',
               //data: result1
           })
        }   
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/delete_live_video',
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
    apiModel.delete_live_video(req.body).then((result)=>{
        
        //var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result[0].user_id,
            req.channel_id = result[0].channel_id
            
            if(result[0].user_id == req.user_id && result[0].channel_id == req.channel_id   ){
                res.json({
                    result:'true',
                    msg:'live video deleted successfully..',
                })
            }else{
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.post('/add_live_views',
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id & token..'
        });
    }
    apiModel.add_live_views(req.body).then((result)=>{
       
        if(result){
            res.json({
                ressult: 'true',
                msg :'user live added successfully..',
                //data: result
           })
        }else{
            res.json({
               result:'false',
               msg: 'user does not live..',
    
           })
        }   
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/remove_live_views',
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id & token..'
        });
    }
    apiModel.remove_live_views(req.body).then((result)=>{
       
        if(result){
            res.json({
                ressult: 'true',
                msg :'user remove successfully..'
                //data: result
           })
        }else{
            res.json({
               result:'false',
               msg: 'user does not live..',
    
           })
        }   
    }).catch((err)=>{
        res.json({message:err.message})
    })
});


router.post('/user_general_information',
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, first_name, gender, age, email, country, paypal_email & newsletter..'
        });
    }
    apiModel.user_general_information(req.body).then((result)=>{
       
        if(result){
            res.json({
                ressult: 'true',
                msg :'data add successfully..',
                //data: result
           })
        }else{
            res.json({
               result:'false',
               msg: 'record not found..'
            })
        }   
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/create_music_playlist',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('name').isLength({
        min:1,
        max:20
    }).withMessage('name should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id & name..'
        });
    } 

    apiModel.create_music_playlist(req.body).then((result)=>{
       //var img = req.file;
        if(result){
            res.json({
                ressult: 'true',
                msg :'music playlist created successfully..',
                data: result
           })
        }else{
            res.json({
               result:'false',
               msg: 'music playlist does not created..',
               //data:[]
           })
        }   
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_my_music_playlist',
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    } 
    apiModel.get_my_music_playlist(req.body).then((result)=>{
       
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

router.post('/upload_my_playlist_audio', 
    body('playlist_id').isMongoId().withMessage('playlist_id should be required'),
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('audio_id').isMongoId().withMessage('audio_id should be required'),(req, res,err) => {
   
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required playlist_id, user_id, audio_id, & playlist_name ..'
        });
    }

    apiModel.upload_my_playlist_audio(req.body).then((result)=>{
        
        if(result){
            res.json({
                result: 'true',
                msg:'music uploaded successfully..',
            })
        }else{
           // req._id = result[0]._id

            //if(result[0]._id == req._id ){
                res.json({
                     result:'false',
                    msg:'music does not uploaded successfully..',
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

router.post('/get_my_playlist_audio',
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
    apiModel.get_my_playlist_audio(req.body).then((result)=>{
       
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
                    msg:'music file get successfully..',
                    data:result
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/delete_my_playlist_audio',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id(playlist_id)..'
        });
    }
    apiModel.delete_my_playlist_audio(req.body).then((result)=>{
        
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
                    msg:'music file deleted successfully..',
                })
            }else{
                    
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});


module.exports = router;