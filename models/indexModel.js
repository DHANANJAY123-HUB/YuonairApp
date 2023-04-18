const db = require('./connection');

function indexModel() { 

    this.userLogin=(userDetails)=>{
		console.log(userDetails)
		return new Promise((resolve,reject)=>{
			db.collection('admin').find({'email':userDetails.email,'password':userDetails.password}).toArray((err,result)=>{
				err ? reject(err) :resolve(result)
			})
		})
	}
}
module.exports=new indexModel()