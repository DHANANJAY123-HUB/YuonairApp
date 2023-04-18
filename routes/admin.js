const express = require('express');
const router = express.Router();
const db = require('../models/connection')
const adminModel = require('../models/adminModel');
 
router.get('/index',(req,res)=>{
  //res.render('index') 
  const user = db.collection('user');
  Promise.all([user.countDocuments({})]).then((result)=>{
    res.render('index',{'total_user':result[0]});
  })
});

router.get('/user_list',(req,res)=>{
  adminModel.fetchDetails(req.body).then((result)=>{
      res.render('user_list',{'list':result});   
       /*res.json({
        result
       }) */
    }).catch((err)=>{
       res.render({message:err.message});
      /* res.json({
        message:err.message
       })*/
    })
});

router.get('/delete_user_list/:id', (req, res,next)=>{
  adminModel.delete_user_list(req.params).then((result)=>{
        var new_id = parseInt(req.params.id);
         if(result.length==0){
              result = 'false',
              msg ='_id invalid...'
          }else{
              result = 'true',
              msg ='user successfully deleted',
              res.redirect('/admin/user_list') 
          }
          res.render('user_list',{});
         /* res.json({
            result:result,
            msg:msg
          })*/
  }).catch((err)=>{
    res.json({message:err.message})
  })
});

router.get('/video_list',(req,res)=>{
  adminModel.video_list(req.body).then((result)=>{
      res.render('video_list',{'list':result});   
       /*res.json({
        result
       }) */
    }).catch((err)=>{
       res.render({message:err.message});
      /* res.json({
        message:err.message
       })*/
    })
});

router.get('/delete_video_list/:id', (req, res,next)=>{
  adminModel.delete_video_list(req.params).then((result)=>{
        var new_id = parseInt(req.params.id);
         if(result.length==0){
              result = 'false',
              msg ='_id invalid...'
          }else{
              result = 'true',
              msg ='video successfully deleted',
              res.redirect('/admin/video_list') 
          }
          res.render('video_list',{});
         /* res.json({
            result:result,
            msg:msg
          })*/
  }).catch((err)=>{
    res.json({message:err.message})
  })
});

router.get('/manage_user_status', (req, res, next)=>{
  adminModel.manage_user_status(req.query).then((result)=>{
    console.log(req.query)
    //var new_id = req.query._id;
    //var s = req.query.s;
    if(result.length==0){
                 //result = 'false',
                msg ='_id invalid...'
        
          }else{
                //result = 'true',
                msg ='user successfully updated',
                res.redirect('/admin/user_list')
            }
          

          res.render('user_list',{});
         /* res.json({
            //response:result,
            msg:msg,
            data:result
          })  */
  }).catch((err)=>{
     res.json({message:err.message})
     //console.log(err)
  })
});

router.get('/manage_video_status', (req, res, next)=>{
  adminModel.manage_video_status(req.query).then((result)=>{
    console.log(req.query)
    //var new_id = req.query._id;
    //var s = req.query.s;
    if(result.length==0){
                 //result = 'false',
                //msg ='_id invalid...'
        
          }else{
                //result = 'true',
               // msg ='user successfully updated',
                res.redirect('/admin/video_list')
            }
          

          res.render('video_list',{});
         /* res.json({
            //response:result,
            msg:msg,
            data:result
          })  */
  }).catch((err)=>{
     res.json({message:err.message})
     //console.log(err)
  })
});

router.get('/music_list',(req,res)=>{
  adminModel.music_list(req.body).then((result)=>{
      res.render('music_list',{'list':result});   
       /*res.json({
        result
       }) */
    }).catch((err)=>{
       res.render({message:err.message});
      /* res.json({
        message:err.message
       })*/
    })
});

router.get('/delete_music_list/:id', (req, res,next)=>{
  adminModel.delete_music_list(req.params).then((result)=>{
        var new_id = parseInt(req.params.id);
         if(result.length==0){
              result = 'false',
              msg ='_id invalid...'
          }else{
              result = 'true',
              msg ='music successfully deleted',
              res.redirect('/admin/music_list') 
          }
          res.render('music_list',{});
         /* res.json({
            result:result,
            msg:msg
          })*/
  }).catch((err)=>{
    res.json({message:err.message})
  })
});

router.get('/about_us',(req,res)=>{
  adminModel.about_us(req.body).then((result)=>{
    console.log(result)
      res.render('about_us',{'result':result});   

       /*res.json({
        result
       }) */
    }).catch((err)=>{
       res.render({message:err.message});
      /* res.json({
        message:err.message
       })*/
    })
});

router.get('/privacy_policy',(req,res)=>{
  adminModel.privacy_policy(req.body).then((result)=>{
    console.log(result)
      res.render('privacy_policy',{'result':result});   

       /*res.json({
        result
       }) */
    }).catch((err)=>{
       res.render({message:err.message});
      /* res.json({
        message:err.message
       })*/
    })
});

router.get('/help_list',(req,res)=>{
  adminModel.helpDetails(req.body).then((result)=>{
      res.render('help_list',{'list':result});   
       /*res.json({
        result
       }) */
    }).catch((err)=>{
       res.render({message:err.message});
      /* res.json({
        message:err.message
       })*/
    })
});

router.get('/delete_help_list/:id', (req, res,next)=>{
  adminModel.delete_help_list(req.params).then((result)=>{
        var new_id = parseInt(req.params.id);
         if(result.length==0){
              result = 'false',
              msg ='_id invalid...'
          }else{
              result = 'true',
              msg ='music successfully deleted',
              res.redirect('/admin/help_list') 
          }
          res.render('help_list',{});
         /* res.json({
            result:result,
            msg:msg
          })*/
  }).catch((err)=>{
    res.json({message:err.message})
  })
});





module.exports = router;