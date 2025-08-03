// const fs = require('fs');
// const path = require('path');
// const rootDir = require('../utils/pathUtil');
// const { error } = require('console');

const {getDB} = require('../utils/databaseutil');

module.exports = class userFeedback{
  constructor(name,email,rating,message){
    this.name = name;
    this.email = email;
    this.rating = rating;
    this.message = message;
  }
  
  save(){
    const db = getDB();
    const userFeed = {
      name : this.name,
      email : this.email,
      rating : this.rating,
      message : this.message
    };
    
      return db.collection('feedback').insertOne(this);
    
  };

  static fetchAll(){
    const db = getDB();
    return db.collection('feedback').find().toArray();
     }

     
}