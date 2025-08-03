const path = require('path');
const fs = require('fs');
const rootdir = require("../utils/pathUtil");
const userFeedback = require('../Models/Feedback');
const Clothes = require('../Models/Addclothes');
const Purchase = require('../Models/Purchased');


exports.getHome = (req,res,next)=>{
  Clothes.fetchAll().then(cloth=>{
    res.render('home', {colthList: cloth});
  })
   };
   
   
   exports.getSignup = (req,res,next)=>{
    res.render('Signin');
    };

    exports.getLogin = (req,res,next)=>{
      res.render('Login');
    };


    exports.postSubmitData = (req, res) => {
  fs.writeFileSync('user.txt', JSON.stringify(req.body));
  res.send('<h1>Data Received and Saved</h1>');
  };

    exports.getHost = (req, res, next) => {
  fs.readFile("user.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.send('<h1>Error reading data</h1>');
    } else {
      console.log(data);
      res.end('<h1>Welcome host to home page</h1><pre>' + data + '</pre>');
    }
  });
    }

    exports.getPayment = async (req, res, next) => {
    const itemId = req.query.itemId;
    // Optionally fetch item details to show on payment page
    res.render('payment', { itemId });
};

    exports.getFeedbackForm = (req,res,next) =>{
     
        userFeedback.fetchAll().then(Feed=>{
          res.render('Feedback',{givenFeed:Feed});
        })
    
    }

    exports.getItemListing = (req,res,next) =>{
      Clothes.fetchAll().then(cloth=>{
        res.render('itemlisting', {colthList: cloth});
      })
    }

    exports.getUserDashboard = async (req, res, next) => {
      if (!req.session.user) {
        return res.redirect('/login');
      }
      const user = req.session.user;
      const userEmail = user.email;

      // Fetch only clothes listed by this user
      const userClothes = await Clothes.findByUserId(userEmail);
      const userPurchases = await Purchase.findByBuyer(userEmail);

      res.render('userDashboard', {
        userName: user.firstname + ' ' + user.lastname,
        userEmail: user.email,
        userClothesCount: userClothes.length,
        userPurchasesCount: userPurchases.length, // Update if you have purchases logic
        userClothes: userClothes,
        userPurchases: userPurchases,
        isLoggedIn: req.session.isLoggedIn
      });
    };

    exports.getaddClothes = (req,res,next) =>{
      res.render('addclothes');
    }

    // Example purchase controller
exports.purchaseItem = async (req, res, next) => {
  try {
    const itemId = req.body.itemId; // or req.params.itemId
    const buyerEmail = req.session.user.email;

    // Fetch the item to get seller info
    const item = await Clothes.findById(itemId);
    if (!item) return res.status(404).send('Item not found');

    const sellerEmail = item.userId; // userId is email in your setup
    const price = item.price;
    const points = item.points;

    // Create and save purchase
    const purchase = new Purchase(
      itemId,
      buyerEmail,
      sellerEmail,
      price,
      points,
      'completed',
      item.itemName,         // add this
      item.mainImageUrl,     // add this
      item.category          // add this
    );
    await purchase.save();

    // Optionally, update item status to 'sold'
    await Clothes.updateStatus(itemId, 'sold');

    res.redirect('/userDashboard'); // or show a success page
  } catch (err) {
    console.error('Error processing purchase:', err);
    res.status(500).send('Error processing purchase');
  }
};

    

// const Purchase = require('../Models/Purchase');

// exports.getUserDashboard = async (req, res, next) => {
//   // ...existing code...
//   const userEmail = req.session.user.email;
//   const userPurchases = await Purchase.findByBuyer(userEmail);

//   res.render('userDashboard', {
//     // ...other data...
//     userPurchases: userPurchases
//   });
// };