const express = require('express');
const router = express.Router();
const indexModel = require('../models/indexModel');

router.get('/login',(req,res)=>{
  res.render('login',{'output':''})
});


router.post('/login',(req,res)=>{
    indexModel.userLogin(req.body).then((result)=>{
        
    if(result.length==0){
      res.render('login',{'output':'Invalid email & password....'});
            /*res.json({
                result:false,
                msg:'email  not registered please enter register email..'
            })*/
    }else{
      req.sunm = result[0].email,
      req.srole = result[0].role

      if(result[0].role=="admin"){
            res.redirect('/admin/index')
            /* res.json({
                result:true,
                msg:'admin successfully login..'
             })*/
            }else{
             res.redirect('/login')    
            }
        }
      }).catch((err)=>{
    //res.render({message:err.message})
        console.log(err)
  })
})

module.exports = router;