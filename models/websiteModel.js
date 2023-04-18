const db = require('./connection');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

function websiteModel() {

	this.register_user=(userDetails)=>{
		//console.log(userDetails) 
		return new Promise((resolve,reject)=>{
			db.collection('user').find({}).toArray((err,result)=>{
	 			if(err){
					reject(err)
				}else{
					var flag=0
                    if(result.length==0){
						_id=1
                    }else{   
					    var max_id=result[0]._id
					    for(let row of result){
					    	if(row._id>max_id)
						 	max_id=row._id
						
						 if(row.email==userDetails.email)
						 	flag=1							 	
						 	
						}
						_id=max_id+1  	
					}
					
					userDetails.form_status='0'
					//userDetails.role="user"
					userDetails.current_date= new Date()
					//userDetails.fcm = null
					userDetails.user_status = 0
					if(flag)
					{
						resolve(0)
					}
					else
					{
						db.collection('user').insertOne(userDetails,(err1,result1)=>{
						   //err1 ? reject(err1) : resolve(result1);
						   if(err1){
						   	reject(err1)
						   }
						   else
						   {
						   	db.collection('user').find({'email':userDetails.email}).toArray((err2,result2)=>{
						   		err2?reject(err2):resolve(result2)
						   	})
						   }
						   //resolve(result1)
					 	})	
					}
					//resolve(result)
				}	
			})
			
		})	
	}

	this.userLogin=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'email':userDetails.email,'password':userDetails.password}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					db.collection('user').updateOne({'email':userDetails.email},{$set:{'fcm':userDetails.fcm}},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1)
					})
				}
				resolve(result)
			})
		})
	}

    this.upload_video=(userDetails,files)=>{
	    return new Promise((resolve,reject)=>{
			db.collection('user_video_list').insertOne({'user_id':mongoose.Types.ObjectId(userDetails.user_id),'channel_id':mongoose.Types.ObjectId(userDetails.channel_id),'video':files,'channel_name':userDetails.channel_name,'video_name':userDetails.video_name,'video_status':'0','video_comments':'','video_dislike':'','video_likes':0,'video_views':'0','video_subscriber':'','category_type':'bollywood','description':userDetails.desc,'current_date':new Date()},(err,result)=>{
				err ? reject(err) : resolve(result);
			})
	  })
	}

	this.upload_music=(userDetails,file)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_music_list').insertOne({'user_id':ObjectId(userDetails.user_id),'channel_id':mongoose.Types.ObjectId(userDetails.channel_id),'music_title':userDetails.music_title,'music':file,'current_date':new Date()},(err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})
	}

	this.forget_password=(userDetails,password)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'email':userDetails.email}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			       db.collection('user').updateOne({'email':userDetails.email},{$set:{'password':password.toString(),'confirm_password':password.toString()}},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
			       })
                }
		       resolve(result)
		   })
	    })
    }

    this.googleLogin=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'google_id':userDetails.google_id}).toArray((err,result)=>{
				//err?reject(err):resolve(result)
				
				if(result.length==0){
					userDetails.form_status='1'
					userDetails.role="user"
					userDetails.current_date= new Date()
					userDetails.user_status = 0
					db.collection('user').insertOne(userDetails,(err1,result1)=>{
						//err1 ? reject(err1) : resolve(result1);
						if(err1){
							reject(err1)
						}else{
						    db.collection('user').find({'google_id':userDetails.google_id}).toArray((err3,result3)=>{
				                err3?reject(err3):resolve(result3)	
				            })
						}
				    })
				}else{
					db.collection('user').updateOne({'google_id':userDetails.google_id},{$set:{'current_date': new Date()}},(err2,result2)=>{
						//err2 ? reject(err2) : resolve(result2)
						if(err2){
							reject(err2)
						}else{
						    db.collection('user').find({'google_id':userDetails.google_id}).toArray((err3,result3)=>{
				                err3?reject(err3):resolve(result3)	
				            })
						}
				    })
				}
				
		      //resolve(result)
			})
		}) 
	}

	this.facebookLogin=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'facebook_id':userDetails.facebook_id}).toArray((err,result)=>{
				//err?reject(err):resolve(result)
				
				if(result.length==0){
					userDetails.form_status='1'
					userDetails.role="user"
					userDetails.current_date= new Date()
					userDetails.user_status = 0
					db.collection('user').insertOne(userDetails,(err1,result1)=>{
						//err1 ? reject(err1) : resolve(result1);
						if(err1){
							reject(err1)
						}else{
						    db.collection('user').find({'facebook_id':userDetails.facebook_id}).toArray((err3,result3)=>{
				                err3?reject(err3):resolve(result3)	
				            })
						}
                    })
				}else{
					db.collection('user').updateOne({'facebook_id':userDetails.facebook_id},{$set:{'current_date':new Date()}},(err2,result2)=>{
						//err2 ? reject(err2) : resolve(result2)
						if(err2){
							reject(err2)
						}else{
						    db.collection('user').find({'facebook_id':userDetails.facebook_id}).toArray((err3,result3)=>{
				                err3?reject(err3):resolve(result3)	
				            })
						}
				    })	
				}
		     //resolve(result)
			})
		}) 
	}

	this.twitterLogin=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'twitter_id':userDetails.twitter_id}).toArray((err,result)=>{
				//err?reject(err):resolve(result)
				
				if(result.length==0){
					userDetails.form_status='1'
					userDetails.role="user"
					userDetails.current_date= new Date()
					userDetails.user_status = 0
					db.collection('user').insertOne(userDetails,(err1,result1)=>{
						//err1 ? reject(err1) : resolve(result1);
						if(err1){
							reject(err1)
						}else{
						    db.collection('user').find({'twitter_id':userDetails.twitter_id}).toArray((err3,result3)=>{
				                err3?reject(err3):resolve(result3)	
				            })
						}
				    })
				}else{
					db.collection('user').updateOne({'twitter_id':userDetails.twitter_id},{$set:{'current_date':new Date()}},(err2,result2)=>{
						//err2 ? reject(err2) : resolve(result2)
						if(err2){
							reject(err2)
						}else{
						    db.collection('user').find({'twitter_id':userDetails.twitter_id}).toArray((err3,result3)=>{
				                err3?reject(err3):resolve(result3)	
				            })
						}
				    })	
				}
		     //resolve(result)
			})
		}) 
	}

	this.update_user_data=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
				   reject(err)
				}else{
            db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:userDetails/*{'gender':userDetails.gender}*/},(err1,result1)=>{
				      err1 ? reject(err1) : resolve(result1);
            })
		    }
		   resolve(result)
      })
		})				
	}

	this.view_profile=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
			   err?reject(err):resolve(result)	
      })
		})				
	}

	this.delete_user_account=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			        db.collection('user').deleteOne({'_id':ObjectId(userDetails._id)},(err1,result1)=>{
				        //err1 ? reject(err1) : resolve(result1);
				        if(err1){
				        	reject(err1)
				        }else{
				        		db.collection('user_channel_list').find({'user_id':ObjectId(userDetails._id)}).toArray((err2,result2)=>{
				        		//err2 ? reject(err2) : resolve(result2);
				        		if (err2) {
				        			reject(err2)
				        		}else{
				        			 db.collection('user_channel_list').deleteOne({'user_id':ObjectId(userDetails._id)},(err3,result3)=>{
				                //err3 ? reject(err3) : resolve(result3);
				                if (err3) {
				                	reject(err3)
				                }else{
				                		db.collection('user_video_list').find({'user_id':ObjectId(userDetails._id)}).toArray((err4,result4)=>{
				        		        //err2 ? reject(err2) : resolve(result2);
				        		        if(err4){
				        		        	reject(err4)
				        		        }else{
				        		        	db.collection('user_video_list').deleteMany({'user_id':ObjectId(userDetails._id)},(err5,result5)=>{
				                       err5 ? reject(err5) : resolve(result5);
				                     })
				        		        }
				        		        resolve(result4)
				        		      })
				                }
				                resolve(result3)
				              })
				        		}
				        		resolve(result2)
				        	})
				        }
				        resolve(result1)
				    })
				  }
		      resolve(result)     
		    })
		  })
    }

    this.get_video=(userDetails)=>{
		  return new Promise((resolve,reject)=>{
			  db.collection('user_video_list').find({'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
			    // err?reject(err):resolve(result)	
			    if(err){
				  reject(err)
                }else{
         	   var channel_id = result.map(function(i) {
                  return i.channel_id;
                });
                console.log(channel_id)
          
          	db.collection('user_video_list').aggregate([
                
         		{ $lookup:
         			{
         				from: 'user_channel_list',
         				localField : 'channel_id',
         				foreignField :'_id',
         				as :'data'
         			}
         			},
         		
                    ]).toArray((err1,result1)=>{
         		        err1 ? reject(err1):resolve(result1)
                    })
         		}
         		//resolve(result)
            })
		  })				
	  }

	  this.get_music=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_music_list').find({}).toArray((err,result)=>{
			   err?reject(err):resolve(result)	
        })
		  })				
	  }

	  this.delete_music=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_music_list').find({'_id':ObjectId(userDetails._id),'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			        db.collection('user_music_list').deleteOne({'_id':ObjectId(userDetails._id),'user_id':ObjectId(userDetails.user_id)},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
				    })
				}
		      resolve(result)     
		    })
		})
    }

    this.change_password=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id),'password':userDetails.password}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			         db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'password':userDetails.new_password}},(err1,result1)=>{
				       err1 ? reject(err1) : resolve(result1);
			        })
                } 
		     resolve(result)
		    })
	    })
    }

    this.create_channel=(userDetails,img)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_channel_list').find().toArray((err,result)=>{
	 			if(err){
					reject(err)
				}else{
					    var flag=0
               if(result.length==0){
						   _id=1
                 }else{   
					         var max_id=result[0]._id
					         for(let row of result){
					    	   if(row._id>max_id)
						 	        max_id=row._id
						
						        if(row.user_id==userDetails.user_id)
						 	         flag=1							 	
						 	      }
						        _id=max_id+1  	
					          }
					          if(flag){
						          resolve(0)
					          }else{
			            db.collection('user_channel_list').insertOne({'user_id':mongoose.Types.ObjectId(userDetails.user_id),'channel_name':userDetails.channel_name,'subscribe_count':0,'image':img,'handle':userDetails.handle,'current_date': new Date ()},(err1,result1)=>{
			                //err1 ? reject(err1): resolve(result1)	
			                if(err1){
						   	         reject(err1)
						          }else{
						   	        db.collection('user_channel_list').find({'user_id':ObjectId(userDetails.user_id)}).toArray((err2,result2)=>{
						   		          err2?reject(err2):resolve(result2)
						   	        })
						          }
					 	        })
                 //resolve(result1)
                  }
               }  
             //resolve(result)      
		      })				
	      })
	}

	this.update_channel=(userDetails,img)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_channel_list').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			         //db.collection('user_channel_list').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'user_id':mongoose.Types.ObjectId(userDetails.user_id),'channel_name':userDetails.channel_name,'image':img,'handle':userDetails.handle}},(err1,result1)=>{
				      db.collection('user_channel_list').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'channel_name':userDetails.channel_name,'image':img,'handle':userDetails.handle}},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
			        })
            } 
		     resolve(result)
		    })
	    })
    }

  this.get_my_channel=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_channel_list').find({'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
			   err?reject(err):resolve(result)	
      })
		})				
	}

	this.get_my_channel_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_video_list').find({'user_id':ObjectId(userDetails.user_id),'channel_id':ObjectId(userDetails.channel_id)}).toArray((err,result)=>{
			   err?reject(err):resolve(result)	
      })
		})				
	}

	this.delete_channel=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_channel_list').find({'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			        db.collection('user_channel_list').deleteOne({'user_id':ObjectId(userDetails.user_id)},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
				    })
				}
		      resolve(result)     
		    })
		})
    }

    this.subscribe_to_channel=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('subscribe_channel_list').find({'user_id':ObjectId(userDetails.user_id),'channel_id':ObjectId(userDetails.channel_id)}).toArray((err,result)=>{
				if(result.length==0){
					//reject(err)
					db.collection('subscribe_channel_list').insertOne({'user_id':mongoose.Types.ObjectId(userDetails.user_id),'channel_id':mongoose.Types.ObjectId(userDetails.channel_id),'subscribe_status':'1','current_date': new Date ()},(err1,result1)=>{
			          //err1?reject(err1):resolve(result1)	
			            if(err1){
			          		reject(err1)
			            }else{
			                db.collection('user_channel_list').find({'_id':ObjectId(userDetails.channel_id)}).toArray((err3,result3)=>{
				       	  	//err3 ? reject(err3) : resolve(result3);
				       	  	    if(err3){
				       	  		   reject(err3)
				       	  	    }else{
				       	  		    var subscribe_count = result3[0].subscribe_count;
				       	  		    console.log(subscribe_count)
				       	  		    var total_subscribe_count = subscribe_count + 1;
				       	  		   /* if (subscribe_status == '1') {
                                        total_subscribe_count = total_subscribe_count + 1;
                                    }else if(subscribe_status =='0') {
                                        total_subscribe_count = total_subscribe_count - 1
                                    }else {
                    	
                                    }*/
                                    db.collection('user_channel_list').updateOne({'_id':ObjectId(userDetails.channel_id)},{$set:{'subscribe_count':total_subscribe_count}},(err4,result4)=>{
				       	  		 	    err4 ? reject(err4) : resolve(result4);
				       	  		    })	
				       	  	    }
				       	    })
				       	} 
				       	resolve(result1)	
                    })
				}else{
					//var total_like_status = 0;
					var total_subscribe_status = 0;
                    var subscribe_status = result[0].subscribe_status;
                     console.log(subscribe_status)
                    if (subscribe_status == undefined) {
                       //total_like_status = 1;
                          total_subscribe_status = '1'
                    }else if(subscribe_status == '0') {
                        //total_like_status = 1;
                            total_subscribe_status = '1' 
                    }else if(subscribe_status == '1'){
                    	//total_like_count = 0;
                    	   total_subscribe_status = '0'
                    }

			         db.collection('subscribe_channel_list').updateOne({'user_id':ObjectId(userDetails.user_id),'channel_id':ObjectId(userDetails.channel_id)},{$set:{'subscribe_status':total_subscribe_status}},(err2,result2)=>{
				       //err2 ? reject(err2) : resolve(result2);
				       if(err2){
				       	reject(err2)
				       }else{
				       	  db.collection('user_channel_list').find({'_id':ObjectId(userDetails.channel_id)}).toArray((err3,result3)=>{
				       	  	//err3 ? reject(err3) : resolve(result3);
				       	  	if(err3){
				       	  		reject(err3)
				       	  	}else{
				       	  		var subscribe_count = result3[0].subscribe_count;
				       	  		console.log(subscribe_count);
				       	  		var total_subscribe_count = 0;
				       	  		if (subscribe_status == '1') {
                                  total_subscribe_count = subscribe_count - 1;
                                }else if(subscribe_status =='0') {
                                  total_subscribe_count = subscribe_count + 1;
                                }else {
                    	
                                }
                                db.collection('user_channel_list').updateOne({'_id':ObjectId(userDetails.channel_id)},{$set:{'subscribe_count':total_subscribe_count}},(err4,result4)=>{
				       	  		 	err4 ? reject(err4) : resolve(result4);
				       	  		})	
				       	  	}
				       	  	resolve(result3)
				       	})
                    } 
                  resolve(result2)
                })
			       }
		     resolve(result)
		    })
	    })
    }

    this.get_subscribe_channel=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('subscribe_channel_list').find({'user_id':ObjectId(userDetails.user_id),'subscribe_status':'1'}).toArray((err,result)=>{
			   //err?reject(err):resolve(result)
			   if(err){
				  reject(err)
                }else{
         	   var channel_id = result.map(function(i) {
                  return i.channel_id;
                });
                console.log(channel_id)
          
          	db.collection('subscribe_channel_list').aggregate([
              { $match: { user_id: ObjectId(userDetails.user_id),subscribe_status:'1'} },
         		{ $lookup:
         			{
         				from: 'user_channel_list',
         				localField : 'channel_id',
         				foreignField :'_id',
         				as :'channel_data'
         			}
         			},
         	//{ $match: { user_id: ObjectId(userDetails.user_id)}},
         			{ $lookup:
         			{
         				from: 'user_video_list',
         				localField : 'channel_id',
         				foreignField :'channel_id',
         				as :'video_data'
         			}
         			},
         			]).toArray((err1,result1)=>{
         		  err1 ? reject(err1):resolve(result1)
              })
         		}
             	//resolve(result)
			      })
          })			
	 }

	this.get_subscribe_single_channel=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('subscribe_channel_list').find({'user_id':ObjectId(userDetails.user_id),'channel_id':ObjectId(userDetails.channel_id)}).toArray((err,result)=>{
			   //err?reject(err):resolve(result)
			   if(err){
				  reject(err)
                }else{
         	   //var channel_id = result.map(function(i) {
                  //return i.channel_id;
                //});
              //  console.log(channel_id)
              var channel_id = userDetails.channel_id;
          
          	db.collection('subscribe_channel_list').aggregate([
              { $match: { user_id: ObjectId(userDetails.user_id),channel_id: ObjectId(userDetails.channel_id)} },
         		{ $lookup:
         			{
         				from: 'user_channel_list',
         				localField : 'channel_id',
         				foreignField :'_id',
         				as :'channel_data'
         			}
         			},
         	  //{ $match: { user_id: ObjectId(userDetails.user_id),channel_id: ObjectId(userDetails.channel_id)} },
         			{ $lookup:
         			{
         				from: 'user_video_list',
         				localField : 'channel_id',
         				foreignField :'channel_id',
         				as :'video_data'
         			}
         			},
         			]).toArray((err1,result1)=>{
         		  err1 ? reject(err1):resolve(result1)
              })
         		}
             	//resolve(result)
			      })

        })			
	}

	this.get_single_channel_subscribe=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_channel_list').find({'_id':ObjectId(userDetails.channel_id)}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.create_playlist=(userDetails,img)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_play_list').insertOne({'user_id':mongoose.Types.ObjectId(userDetails.user_id),'name':userDetails.name,'image':img,'video_count':0,'current_date': new Date ()},(err,result)=>{
			   err?reject(err):resolve(result)	
      })
		})				
	}

	this.upload_my_playlist_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('play_list_video').insertOne({'playlist_id':mongoose.Types.ObjectId(userDetails.playlist_id),'user_id':mongoose.Types.ObjectId(userDetails.user_id),'video_id':mongoose.Types.ObjectId(userDetails.video_id),'playlist_name':userDetails.playlist_name,'current_date': new Date ()},(err,result)=>{
			   //err?reject(err):resolve(result)	
			   if(err){
			   	reject(err)
			   }else{
			   	   db.collection('user_play_list').find({'_id':ObjectId(userDetails.playlist_id)}).toArray((err1,result1)=>{
			  // err?reject(err):resolve(result)
			        if(err1){
			        	reject(err1)
			        }else{
			        	var video_count;
			   	      var total_video_count = result1[0].video_count + 1;
			   	       db.collection('user_play_list').updateOne({'_id':ObjectId(userDetails.playlist_id)},{$set:{'video_count':total_video_count}},(err2,result2)=>{
				          err2 ? reject(err2) : resolve(result2);
				        })    
			         }
			        resolve(result1)
			      })
			    }
			   resolve(result)
       })
		})
	}

	this.get_my_playlist=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_play_list').find({'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
			 err ? reject(err) : resolve(result)	
      })
		})				
	}

	this.get_my_playlist_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('play_list_video').find({'user_id':ObjectId(userDetails.user_id),'playlist_id':ObjectId(userDetails.playlist_id)}).toArray((err,result)=>{
			   //err?reject(err):resolve(result)
			   if(err){
				  reject(err)
                }else{
         	   var video_id = result.map(function(i) {
                  return i.video_id;
                });
                console.log(video_id)
          
          	db.collection('play_list_video').aggregate([
              { $match: { user_id: ObjectId(userDetails.user_id),'playlist_id':ObjectId(userDetails.playlist_id)} },
         		{ $lookup:
         			{
         				from: 'user_video_list',
         				localField : 'video_id',
         				foreignField :'_id',
         				as :'video_data'
         			}
         			},
         			]).toArray((err1,result1)=>{
         		  err1 ? reject(err1):resolve(result1)
             })
         		}
         		//resolve(result)	
            })
		})				
	}

	this.delete_my_playlist_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_play_list').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			        db.collection('user_play_list').deleteOne({'_id':ObjectId(userDetails._id)},(err1,result1)=>{
				        //err1 ? reject(err1) : resolve(result1);
				        if(err1){
				        	reject(err1)
				        }else{
				        	db.collection('play_list_video').deleteOne({'playlist_id':ObjectId(userDetails._id)},(err2,result2)=>{
				               err2 ? reject(err2) : resolve(result2);
                            })   
				        }
				        resolve(result1)
				    })
				}
		      resolve(result)     
		    })
		})
    }

    this.update_my_playlist_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_play_list').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			         db.collection('user_play_list').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'name':userDetails.name}},(err1,result1)=>{
				       err1 ? reject(err1) : resolve(result1);
			        })
                } 
		     resolve(result)
		    })
	    })
    }

    this.create_history=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_history_list').find({'user_id':ObjectId(userDetails.user_id),'channel_id':ObjectId(userDetails.channel_id),'video_id':ObjectId(userDetails.video_id)}).toArray((err,result)=>{
				//err?reject(err):resolve(result)
				
				if(result.length==0){
					
					db.collection('user_history_list').insertOne({'user_id':mongoose.Types.ObjectId(userDetails.user_id),'channel_id':mongoose.Types.ObjectId(userDetails.channel_id),'video_id':mongoose.Types.ObjectId(userDetails.video_id),'current_date':new Date()},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1);
				    })
				}else{
					db.collection('user_history_list').updateOne({'user_id':ObjectId(userDetails.user_id),'channel_id':ObjectId(userDetails.channel_id),'video_id':ObjectId(userDetails.video_id)},{$set:{'current_date':new Date()}},(err2,result2)=>{
						err2 ? reject(err2) : resolve(result2)
				  })	
				}
		      resolve(result)
			})
		}) 
	}

	this.delete_history=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_history_list').find({'user_id':ObjectId(userDetails.user_id),'video_id':ObjectId(userDetails.video_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			        db.collection('user_history_list').deleteOne({'user_id':ObjectId(userDetails._id),'video_id':ObjectId(userDetails.video_id)},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
				    })
				}
		      resolve(result)     
		    })
		})
    }

    this.get_history=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_history_list').find({'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
			   //err?reject(err):resolve(result)
			   if(err){
				  reject(err)
                }else{
         	   var video_id = result.map(function(i) {
                  return i.video_id;
                });
                console.log(video_id)
          
          	db.collection('user_history_list').aggregate([
              { $match: {'user_id':ObjectId(userDetails.user_id)} },
         		{ $lookup:
         			{
         				from: 'user_video_list',
         				localField : 'video_id',
         				foreignField :'_id',
         				as :'video_data'
         			}
         			},
         			{
                $sort:{current_date:-1}
              },
              {
                $limit:10
              },
         			
              ]).toArray((err1,result1)=>{
         		  err1 ? reject(err1):resolve(result1)
              })
         		}
         		//resolve(result)	
            })
		})				
	}

	this.get_play_list_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_video_list').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
			   err?reject(err):resolve(result)	
            })
		})				
	}

	this.delete_playlist_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_video_list').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			        db.collection('user_video_list').deleteOne({'_id':ObjectId(userDetails._id)},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
				    })
				}
		      resolve(result)     
		    })
		})
    }

    this.search=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_video_list').find({}).toArray((err,result)=>{
			   //err?reject(err):resolve(result)
			    if(err){
				  reject(err)
                }else{
         	   var channel_id = result.map(function(i) {
                  return i.channel_id;
                });
                console.log(channel_id)
          
          	db.collection('user_video_list').aggregate([
          
         		{ $lookup:
         			{
         				from: 'user_channel_list',
         				localField : 'channel_id',
         				foreignField :'_id',
         				as :'channel_data'
         			}
         			},
         			{
                    $sort:{current_date:-1}
                    },
         			
                    ]).toArray((err1,result1)=>{
         		        err1 ? reject(err1):resolve(result1)
                    })
         		}
         		//resolve(result)	
            })
		})				
	}

	this.like_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('like_video_list').find({'user_id':ObjectId(userDetails.user_id),'channel_id':ObjectId(userDetails.channel_id),'video_id':ObjectId(userDetails.video_id)}).toArray((err,result)=>{
				if(result.length==0){
	               //reject(err)
	               var total_like_status = 0;
	              // var total_dislike_status = 0;
	               if(userDetails.like_status == '1'){
	               	 total_like_status = 1;
	               }else if(userDetails.like_status == '0'){
	               	 total_like_status = 0
	               }else{

	               }
	                db.collection('like_video_list').insertOne({'user_id':mongoose.Types.ObjectId(userDetails.user_id),'channel_id':mongoose.Types.ObjectId(userDetails.channel_id),'video_id':mongoose.Types.ObjectId(userDetails.video_id),'like_status':total_like_status,'dislike_status':0,'current_date': new Date ()},(err1,result1)=>{
		    	        //err1 ? reject(err1): resolve(result1)
		    	        if (err1) {
				        	reject(err1)
				        }else{
				        	db.collection('user_video_list').find({'_id':ObjectId(userDetails.video_id)}).toArray((err3,result3)=>{
				        		//err3 ? reject(err3): resolve(result3)
				        		if(err3){
				        			reject(err3)
				        		}else{
                          
				        		    var video_likes = result3[0].video_likes;
				        		    console.log(video_likes)
				        		    var total_like_count = 0;
				        		    if(userDetails.like_status == '1'){
				        			    total_like_count = video_likes + 1;
				        		    }else if(userDetails.like_status == '0'){
				        		  	    total_like_count = video_likes - 1
				        		    }else{

				        		    }
				        			db.collection('user_video_list').updateOne({'_id':ObjectId(userDetails.video_id)},{$set:{'video_likes':total_like_count}},(err4,result4)=>{
				        				err4 ? reject(err4) : resolve(result4);
				        			})
				        		}
                            }) 
				        }
				    })    
                }else{

                	var total_like_status = 0;
                    
                    if(userDetails.like_status == '1') {
                      total_like_status = 1;
                    }else if(userDetails.like_status == '0') {
                      total_like_status = 0;
                    }else{

                    }
			        db.collection('like_video_list').updateOne({'user_id':ObjectId(userDetails.user_id),'channel_id':ObjectId(userDetails.channel_id),'video_id':ObjectId(userDetails.video_id)},{$set:{'like_status':total_like_status,'dislike_status':0,}},(err2,result2)=>{
				        //err2 ? reject(err2) : resolve(result2);
				        if (err2) {
				        	reject(err2)
				        }else{
				        	db.collection('user_video_list').find({'_id':ObjectId(userDetails.video_id)}).toArray((err3,result3)=>{
				        		if(err3){
				        			reject(err3)
				        		}else{
                          
				        		    var video_likes = result3[0].video_likes;
				        		    console.log(video_likes)
				        		    var total_like_count = 0;
				        		    if(userDetails.like_status == '1'){
				        			    total_like_count = video_likes+1;
				        		    }else if(userDetails.like_status == '0'){
				        		  	    total_like_count = video_likes-1
				        		    }else{

				        		    }
				        			db.collection('user_video_list').updateOne({'_id':ObjectId(userDetails.video_id)},{$set:{'video_likes':total_like_count}},(err4,result4)=>{
				        				err4 ? reject(err4) : resolve(result4);
				        			})
				        		}
				        		resolve(result3)
				        	})
				        }
				        resolve(result2)
				      })
		        }
		      resolve(result)
		    })
		})				
	}

	this.delete_like_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('like_video_list').find({'user_id':ObjectId(userDetails.user_id),'video_id':ObjectId(userDetails.video_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			        db.collection('like_video_list').deleteOne({'user_id':ObjectId(userDetails.user_id),'video_id':ObjectId(userDetails.video_id)},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
				    })
				}
		      resolve(result)     
		    })
		})
    }

    this.help=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_help').insertOne(userDetails,(err,result)=>{
			   err?reject(err):resolve(result)	
            })
		})				
	}

	this.about=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('about').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.privacy_and_policy=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('privacy_policy').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.related_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_video_list').find({'category_type':userDetails.category_type}).toArray((err,result)=>{
			   //err?reject(err):resolve(result)	
			   if(err){
				  reject(err)
                }else{
         	   var channel_id = result.map(function(i) {
                  return i.channel_id;
                });
                console.log(channel_id)
          
          	db.collection('user_video_list').aggregate([
              { $match: { category_type:userDetails.category_type } },
         		{ $lookup:
         			{
         				from: 'user_channel_list',
         				localField : 'channel_id',
         				foreignField :'_id',
         				as :'channel_data'
         			}
         			},
         			{
                $unwind: "$channel_data"
              },
               {
               $project: {
                __v: 0,
                "channel_data._v": 0,
                //"video_data._id": 0,
               // "channel_data.userId": 0,
               // "channel_data.channel_name": 0,
                "channel_data.image.originalname":0,
                "channel_data.image.encoding":0,
                "channel_data.image.mimetype":0,
                "channel_data.image.destination":0,
                "channel_data.image.filename":0,
                "channel_data.image.size":0,
                "channel_data.handle":0
              }
            },

         			]).toArray((err1,result1)=>{
         		    err1 ? reject(err1):resolve(result1)
              })
         		}
         		//resolve(result)	
        })
		})				
	}

	this.get_like_video_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('like_video_list').find({'user_id':ObjectId(userDetails.user_id),'like_status':1}).toArray((err,result)=>{
			   //err?reject(err):resolve(result)
			   if(err){
				  reject(err)
                }else{
         	    var video_id = result.map(function(i) {
                  return i.video_id;
                });

                var channel_id = result.map(function(i) {
                  return i.channel_id;
                });
                
                console.log(video_id)
                //var user_id = userDetails.user_id
          	db.collection('like_video_list').aggregate([
              { $match: { user_id: ObjectId(userDetails.user_id),'like_status':1} },
              { $lookup:
         			{
         				from: 'user_channel_list',
         				localField : 'channel_id',
         				foreignField :'_id',
         				as :'channel_data'
         			}
         			},
         		{ $lookup:
         			{
         				from: 'user_video_list',
         				localField : 'video_id',
         				foreignField :'_id',
         				as :'video_data'
         			}
         			}

         			/*{
               $project: { '_id': 1}
               }*/
         			
                    ]).toArray((err1,result1)=>{
         		        err1 ? reject(err1):resolve(result1)
                    })
                    
         		}
         		//resolve(result)	
            })
		})				
	}


  this.get_like_single_video_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('like_video_list').find({'user_id':ObjectId(userDetails.user_id),'video_id':ObjectId(userDetails.video_id)}).toArray((err,result)=>{
			   //err?reject(err):resolve(result)
			   if(err){
				  reject(err)
                }else{
         	   var video_id = result.map(function(i) {
                  return i.video_id;
                });
                console.log(video_id)
          
          	db.collection('like_video_list').aggregate([
              { $match: { user_id: ObjectId(userDetails.user_id),video_id: ObjectId(userDetails.video_id)} },
         		{ $lookup:
         			{
         				from: 'user_video_list',
         				localField : 'video_id',
         				foreignField :'_id',
         				as :'video_data'
         			}
         			}
         			]).toArray((err1,result1)=>{
         		   err1 ? reject(err1):resolve(result1)
               })
         		}
         		//resolve(result)	
        })
		})				
	}

	this.get_single_video_likes=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_video_list').find({'_id':ObjectId(userDetails.video_id)}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.report_single_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_video_report').insertOne({'user_id':mongoose.Types.ObjectId(userDetails.user_id),'video_id':mongoose.Types.ObjectId(userDetails.video_id),'report':userDetails.report,'current_date': new Date ()},(err,result)=>{
			   err?reject(err):resolve(result)	
            })
		})				
	}

	this.not_interested_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('not_intrest_video').insertOne({'user_id':mongoose.Types.ObjectId(userDetails.user_id),'video_id':mongoose.Types.ObjectId(userDetails.video_id),'interest_status':'1','current_date': new Date ()},(err,result)=>{
			   err?reject(err):resolve(result)	
            })
		})				
	}

	this.dont_recommend_channel=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('not_recommend_video').insertOne({'user_id':mongoose.Types.ObjectId(userDetails.user_id),'channel_id':mongoose.Types.ObjectId(userDetails.channel_id),'video_id':mongoose.Types.ObjectId(userDetails.video_id),'recommend_status':'1','current_date': new Date ()},(err,result)=>{
			   err?reject(err):resolve(result)	
            })
		})				
	}

	this.send_comment=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_comment_msg').insertOne({'user_id':mongoose.Types.ObjectId(userDetails.user_id),'channel_id':mongoose.Types.ObjectId(userDetails.channel_id),'video_id':mongoose.Types.ObjectId(userDetails.video_id),'msg':userDetails.msg,'comment_likes':0,'current_date': new Date ()},(err,result)=>{
			   err?reject(err):resolve(result)	
        })
		})				
	}

	this.get_comment=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_comment_msg').find({'video_id':ObjectId(userDetails.video_id)}).toArray((err,result)=>{
			   //err?reject(err):resolve(result)
			   if(err){
				  reject(err)
         }else{
         	     var user_id = result.map(function(i) {
                 return i.user_id;
               });
                //console.log(channel_id)
               var _id = result[0]._id
                 
          	db.collection('user_comment_msg').aggregate([
              { $match: { video_id: ObjectId(userDetails.video_id)} },
         		{ $lookup:
         			{
         				from: 'user',
         				localField : 'user_id',
         				foreignField :'_id',
         				as :'user_data'
         			}
         		},
         		{
                $unwind: "$user_data"
              },
               {
               $project: {
                __v: 0,
                "user_data._v": 0,
                //"user_data._id": 0,
                "user_data.password": 0,
                "user_data.gender": 0,
                "user_data.email": 0,
                "user_data.username": 0,
                "user_data.confirm_password": 0,
                "user_data.form_status": 0,
                "user_data.role": 0,
                "user_data.fcm": 0,
                "user_data.user_status": 0,
                "user_data.otp": 0,
                "user_data.current_date": 0,
                "user_data.profile_image.originalname":0,
                "user_data.profile_image.encoding":0,
                "user_data.profile_image.mimetype":0,
                "user_data.profile_image.destination":0,
                "user_data.profile_image.filename":0,
                "user_data.profile_image.size":0,
              }
            },

         			{ $lookup:
         			  {
         				from: 'like_comment_list',
         				localField : '_id',
         				foreignField :'comment_id',
         				as :'status_data'
         			  }
         		},
         		{
                $unwind: "$status_data"
              },
               {
               $project: {
                __v: 0,
                "status_data._v": 0,
               // "status_data._id": 1,
               // "status_data.user_id": 1,
               // "status_data.comment_id": 1,
               // "status_data.like_status": 1,
               // "status_data.dislike_status": 1,
              }
            },
         			]).toArray((err1,result1)=>{
         		    err1 ? reject(err1):resolve(result1)
              })
         		}
             	//resolve(result)
			     })

        })			
	}

	this.download_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_download_video').insertOne({'user_id':mongoose.Types.ObjectId(userDetails.user_id),'channel_id':mongoose.Types.ObjectId(userDetails.channel_id),'video_id':mongoose.Types.ObjectId(userDetails.video_id),'current_date': new Date ()},(err,result)=>{
			   err?reject(err):resolve(result)	
      })
		})				
	}

	this.get_download_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_download_video').find({'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
			   //err?reject(err):resolve(result)	
			   if(err){
				  reject(err)
         }else{
         	    var video_id = result.map(function(i) {
                  return i.video_id;
                });

                var channel_id = result.map(function(i) {
                  return i.channel_id;
                });
                //console.log(channel_id)

               // var user_id = userDetails.user_id;
          
          	db.collection('user_download_video').aggregate([
              { $match: { user_id: ObjectId(userDetails.user_id)} },

              { $lookup:
         			{
         				from: 'user_channel_list',
         				localField : 'channel_id',
         				foreignField :'_id',
         				as :'channel_data'
         			}
         			},
         			{
                $unwind: "$channel_data"
              },
               {
               $project: {
                __v: 0,
                "channel_data._v": 0,
                //"video_data._id": 0,
               // "channel_data.userId": 0,
                "channel_data.channel_name": 0,
                "channel_data.image":0,
                "channel_data.handle":0
              }
            },
         		{ $lookup:
         			{
         				from: 'user_video_list',
         				localField : 'video_id',
         				foreignField :'_id',
         				as :'video_data'
         			}
         			},
         			{
                $unwind: "$video_data"
              },
               {
               $project: {
                __v: 0,
                "video_data._v": 0,
                //"video_data._id": 0,
                "video_data.userId": 0,
                "video_data.channel_Id": 0,
                //"video_data.video.fieldname":0,
                "video_data.video.originalname":0,
                "video_data.video.encoding":0,
                "video_data.video.mimetype":0,
                "video_data.video.destination":0,
                "video_data.video.filename":0,
                "video_data.video.size":0,
                //"video_data.video[1].fieldname":0,
                "video_data.video_likes":0, 
                "video_data.video_subscriber":0,
                "video_data.category_type":0,
                "video_data.video_views":0,
                "video_data.video_status":0
              }
            },
            ]).toArray((err1,result1)=>{
         		    err1 ? reject(err1):resolve(result1)
              })
         		}
        })
			//resolve(result)
		})				
	}

	this.delete_download_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_download_video').find({'user_id':ObjectId(userDetails.user_id),'video_id':ObjectId(userDetails.video_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			        db.collection('user_download_video').deleteOne({'user_id':ObjectId(userDetails.user_id),'video_id':ObjectId(userDetails.video_id)},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
				    })
				}
		      resolve(result)     
		    })
		})
    }

    this.get_latest_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			if(userDetails.user_id == null){
			db.collection('user_video_list').find().toArray((err,result)=>{
			   //err?reject(err):resolve(result)
			   if(err){
				  reject(err)
                }else{
         	   var channel_id = result.map(function(i) {
                  return i.channel_id;
                });
         	   var user_id = result.map(function(i) {
                  return i.user_id;
                });
                console.log(channel_id)
          
          	db.collection('user_video_list').aggregate([
           // { $match: {'interest_status':'0'} },
         		{ $lookup:
         			{
         				from: 'user_channel_list',
         				localField : 'channel_id',
         				foreignField :'_id',
         				as :'channel_data'
         			}
         			},
         			{
              $sort:{current_date:-1}
              },
         			
              ]).toArray((err1,result1)=>{
         		    err1 ? reject(err1):resolve(result1)
              })
         		}
         		//resolve(result)	
            })
		   } else if(userDetails.user_id!=null){
		   	db.collection('not_recommend_video').find({'user_id':ObjectId(userDetails.user_id)}).toArray((err2,result2)=>{
			   //err2?reject(err2):resolve(result2)
			         if(result2.length==0){
				         db.collection('user_video_list').find({}).toArray((err,result)=>{
			            //err?reject(err):resolve(result)
			             if(err){
				           reject(err)
                   }else{
         	         var channel_id = result.map(function(i) {
                      return i.channel_id;
                   });
         	         var user_id = result.map(function(i) {
                      return i.user_id;
                    });
                console.log(channel_id)
          
          	     db.collection('user_video_list').aggregate([
                 // { $match: {'interest_status':'0'} },
         		     { $lookup:
         			   {
         				     from: 'user_channel_list',
         				     localField : 'channel_id',
         				     foreignField :'_id',
         				     as :'channel_data'
         		    	}
         			   },
         			   {
                   $sort:{current_date:-1}
                  },
         			
                  ]).toArray((err1,result1)=>{
         		        err1 ? reject(err1):resolve(result1)
                  })
         		       }
         		      //resolve(result)	
                 })
                }else{
                 var video_id = result2.map(function(i) {
                  return i.video_id;
                });
                 console.log(video_id)
         	      var channel_id = result2.map(function(i) {
                  return i.channel_id;
                });
         	   
            console.log(channel_id)
            //{ $and:[{'gender': {$eq :user_prefrence}},{'_id':{$nin :frnd_id1}},{'_id':{$ne : ObjectId(new_id)}},{'form_status':'7'}]}
          	db.collection('user_video_list').aggregate([
             { $match: {'channel_id':{$nin : channel_id}} },
         		{ $lookup:
         			{
         				from: 'user_channel_list',
         				localField : 'channel_id',
         				foreignField :'_id',
         				as :'channel_data'
         			}
         			},
         			{
              $sort:{current_date:-1}
              },
         			
              ]).toArray((err1,result1)=>{
         		  err1 ? reject(err1):resolve(result1)
              })
         		}
         		//resolve(result2)	
            })
         }
		})
    }

    this.get_top_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_video_list').find().toArray((err,result)=>{
			  // err?reject(err):resolve(result)	
			   if(err){
				  reject(err)
                }else{
         	   var channel_id = result.map(function(i) {
                  return i.channel_id;
                });
                console.log(channel_id)
          
          	 db.collection('user_video_list').aggregate([
             // { $match: {} },
         		{ $lookup:
         			{
         				from: 'user_channel_list',
         				localField : 'channel_id',
         				foreignField :'_id',
         				as :'channel_data'
         			}
         			},
         			{
                    $sort:{video_likes:-1}
                    },
         			
                    ]).toArray((err1,result1)=>{
         		        err1 ? reject(err1):resolve(result1)
                    })
         		}
         		//resolve(result)
            })
		})				
	}

	this.get_live_video=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_token_list').find().toArray((err,result)=>{
			   // err?reject(err):resolve(result)
			    if(err){
				  reject(err)
                }else{
         	   var channel_id = result.map(function(i) {
                  return i.channel_id;
                });
                console.log(channel_id)
          
          	db.collection('user_token_list').aggregate([
             // { $match: {} },
         		{ $lookup:
         			{
         				from: 'user_channel_list',
         				localField : 'channel_id',
         				foreignField :'_id',
         				as :'channel_data'
         			}
         			},
         			{
                    $sort:{current_date:-1}
                    },
                    ]).toArray((err1,result1)=>{
         		        err1 ? reject(err1):resolve(result1)
                    })
         		}
         		//resolve(result)
            })
		})				
	}

}
module.exports=new websiteModel()