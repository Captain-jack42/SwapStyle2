const path = require('path');
const fs = require('fs');

const rootdir = require("../utils/pathUtil");
const userAccount = require('../Models/Account');
const userFeedback = require('../Models/Feedback');
const Clothes = require('../Models/Addclothes');
const Purchase = require('../Models/Purchased');

exports.postAddAccount = async (req, res, next) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;
    const account = new userAccount(firstname, lastname, email, phone, password);
    await account.save();

    // Fetch the newly created account
    const db = require('../utils/databaseutil').getDB();
    const newAccount = await db.collection('accounts').findOne({ email });

    // Store user info in session
    req.session.user = {
      _id: newAccount._id,
      firstname: newAccount.firstname,
      lastname: newAccount.lastname,
      email: newAccount.email,
      phone: newAccount.phone
    };
    req.session.isLoggedIn = true;

    res.redirect('/userDashboard');
  } catch (error) {
    console.error('Error saving account:', error);
    res.status(500).send('Error saving account');
  }
};

exports.postAddClothes = (req, res, next) => {
  try {
    const { 
      itemName, 
      category, 
      subcategory, 
      size, 
      condition, 
      brand, 
      color, 
      price, 
      points, 
      mainImageUrl, 
      description, 
      tags 
    } = req.body;

    // Get the logged-in user's email from the session
    const userEmail = req.session.user ? req.session.user.email : null;
    if (!userEmail) {
        // Not logged in, redirect to login
        return res.redirect('/login');
    }

    const clothes = new Clothes(
      itemName,
      category,
      subcategory,
      size,
      condition,
      brand,
      color,
      price,
      points,
      mainImageUrl,
      description,
      tags,
      userEmail // Save email as userId
    );
    
    clothes.save();
    console.log("Clothes added successfully");
    res.redirect('/userDashboard');
  } catch (error) {
    console.error('Error saving clothes:', error);
    res.status(500).send('Error saving clothes');
  }
};

exports.postAccountExist = (req, res, next) => {
  const { email, password } = req.body;
  userAccount.fetchAll().then(accounts => {
    const existingAccount = accounts.find(account => 
      account.email === email && account.password === password
    );
    
    if (existingAccount) {
      // Store user info in session
      req.session.user = {
        _id: existingAccount._id,
        firstname: existingAccount.firstname,
        lastname: existingAccount.lastname,
        email: existingAccount.email,
        phone: existingAccount.phone
      };
      req.session.isLoggedIn = true;
      res.redirect('/userDashboard');
    } else {
      res.render('Login', { 
        error: 'Login failed. Please check your email and password and try again.' 
      });
    }
  });
};

exports.postFeedback= (req,res,next)=>{
  try {
    const { name,  email, rating, message } = req.body;
    const feedback = new userFeedback(name,  email, rating, message);
    console.log(feedback);

    feedback.save();
    console.log("Feedback added successfully");
    res.redirect("/Feedback");
  } catch (error) {
    console.error('Error saving feedbac:', error);
    res.status(500).send('Error saving feedback');
  }
}

exports.getFeedback = (req, res, next) => {
    userFeedback.fetchAll().then(Feed=>{
      res.render('Feedback',{givenFeed:Feed});
    })
};

exports.getadminpannel = async (req, res, next) => {
  try {
    const users = await userAccount.fetchAll();
    const orders = await Purchase.fetchAll();
    const listings = await Clothes.fetchAll();
    res.render('adminpannel', {
      users,
      orders,
      listings
    });
  } catch (err) {
    console.error('Error loading admin panel:', err);
    res.status(500).send('Error loading admin panel');
  }
};

exports.logout = (req, res, next) => {
  req.session.destroy(err => {
      if (err) {
          console.error('Error destroying session:', err);
          // Optionally, handle the error (show a message, etc.)
      }
      res.redirect('/login'); // or '/home' if you prefer
  });
};

exports.deleteUser = async (req, res, next) => {
  await userAccount.deleteById(req.body.userId);
  res.redirect('/adminpannel');
};

exports.deleteOrder = async (req, res, next) => {
  await Purchase.deleteById(req.body.orderId);
  res.redirect('/adminpannel');
};

exports.deleteListing = async (req, res, next) => {
  await Clothes.deleteById(req.body.listingId);
  res.redirect('/adminpannel');
};

exports.get404 = (req,res,next)=>{
       res.sendFile(path.join(rootdir,'views','404Error.html'));
    }