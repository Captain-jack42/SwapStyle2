// const fs = require('fs');
// const path = require('path');
// const rootDir = require('../utils/pathUtil');
// const { error } = require('console');

const { ObjectId } = require('mongodb');
const {getDB} = require('../utils/databaseutil');

module.exports = class userAccount{
  constructor(firstname,lastname,email,phone,password){
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.phone = phone;
    this.password = password;
  }
  
  save(){
    const db = getDB();
    const updateAcc = {
      firstname : this.firstname,
      lastname : this.lastname,
      email : this.email,
      phone : this.phone,
      password : this.password
    };
    if(this._id){
      console.log("Account already exits");
    }else{
      return db.collection('accounts').insertOne(this);
    }
  };

  static fetchAll(){
    const db = getDB();
    return db.collection('accounts').find().toArray();
     }

     static FindById(Account){
      const db = getDB();
      return db.collection('accounts').find({_id:new ObjectId(String(Account))}).next();
     };
}