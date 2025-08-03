const express = require('express');
const userrouter = express.Router();
const usercontroller = require('../Controller/usercontroller');

   userrouter.get("/" ,usercontroller.getHome );

   userrouter.get("/Signin" ,usercontroller.getSignup );

   userrouter.get("/Login" , usercontroller.getLogin);
   
  
  userrouter.post("/submit-data", usercontroller.postSubmitData);


  userrouter.get("/host", usercontroller.getHost);

  userrouter.get("/Feedback" , usercontroller.getFeedbackForm);

  userrouter.get("/itemlisting", usercontroller.getItemListing);

  userrouter.get("/userDashboard" , usercontroller.getUserDashboard);

  userrouter.get("/addClothes" , usercontroller.getaddClothes);

  userrouter.get("/payment" , usercontroller.getPayment);

  userrouter.post("/purchase" , usercontroller.purchaseItem);

module.exports = userrouter;