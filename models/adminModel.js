const db = require('./connection');
const ObjectId = require('mongoose').Types.ObjectId;

function adminModel() { 

	this.fetchDetails=(userDetails)=>{ 
		return new Promise((resolve,reject)=>{
			db.collection('user').find({}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.delete_user_list=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			       db.collection('user').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
			        })
		        }
		      resolve(result)
		    })
	    })
    }

    this.video_list=(userDetails)=>{ 
		return new Promise((resolve,reject)=>{
			db.collection('user_video_list').find({}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.delete_video_list=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_video_list').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			       db.collection('user_video_list').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
			        })
		        }
		      resolve(result)
		    })
	    })
    }

    this.manage_user_status=(userDetails)=>{
		console.log(userDetails)
		//console.log(new_id)
		//console.log(s)
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			        if(userDetails.s=='block'){
				        db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'user_status':0}},(err1,result1)=>{
					       err1 ? reject(err1) : resolve(result1);
				        })
			        }else if(userDetails.s=='verify'){
				        db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'user_status':1}},(err2,result2)=>{
					        err2 ? reject(err2) : resolve(result2);
				        })
			        }
		        }
		      resolve(result)
		    })  
		})	
	}

	this.manage_video_status=(userDetails)=>{
		console.log(userDetails)
		//console.log(new_id)
		//console.log(s)
		return new Promise((resolve,reject)=>{
			db.collection('user_video_list').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			        if(userDetails.s =='block'){
				        db.collection('user_video_list').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'video_status':0}},(err1,result1)=>{
					       err1 ? reject(err1) : resolve(result1);
				        })
			        }else if(userDetails.s =='verify'){
				        db.collection('user_video_list').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'video_status':1}},(err2,result2)=>{
					        err2 ? reject(err2) : resolve(result2);
				        })
			        }else{
				    
				    }
		        }
		      resolve(result)
		    })  
		})	
	}

	this.music_list=(userDetails)=>{ 
		return new Promise((resolve,reject)=>{
			db.collection('user_music_list').find({}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.delete_music_list=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_music_list').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			       db.collection('user_music_list').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
			        })
		        }
		      resolve(result)
		    })
	    })
    }

    this.about_us=(userDetails)=>{ 
		return new Promise((resolve,reject)=>{
			db.collection('about').find({}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.privacy_policy=(userDetails)=>{ 
		return new Promise((resolve,reject)=>{
			db.collection('privacy_policy').find({}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.helpDetails=(userDetails)=>{ 
		return new Promise((resolve,reject)=>{
			db.collection('help').find({}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.delete_help_list=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('help').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			       db.collection('help').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
			        })
		        }
		      resolve(result)
		    })
	    })
    }
 
}
module.exports=new adminModel()