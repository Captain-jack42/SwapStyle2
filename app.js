const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const rootdir = require("./utils/pathUtil");
const userrouter = require('./Routes/userrouter');
const hostrouter = require('./Routes/hostrouter');
const { mongoConnect } = require('./utils/databaseutil');
const session = require('express-session');

app.set('view engine','ejs');
app.set('views' , 'views');
// Middleware configuration
app.use(express.urlencoded());
app.use(express.static(path.join(rootdir, 'Public')));

// Add this after your other middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    next();
});


// Routes
app.use(userrouter);
app.use(hostrouter);



const port = 3000;
mongoConnect(()=>{
app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}/home`);
});
});