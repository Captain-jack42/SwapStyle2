const express = require('express');
const hostrouter = express.Router();
const hostcontroller = require('../Controller/hostcontroller');

hostrouter.post("/addAccount", hostcontroller.postAddAccount);

hostrouter.post("/accountExist", hostcontroller.postAccountExist);

hostrouter.post("/submitFeedback", hostcontroller.postFeedback);

hostrouter.get("/getFeedback", hostcontroller.getFeedback);

hostrouter.get("/getadminpannel007" , hostcontroller.getadminpannel);

hostrouter.post("/addClothes" , hostcontroller.postAddClothes);
// add new routing here.
hostrouter.get('/logout' , hostcontroller.logout);

hostrouter.post('/admin/deleteUser', hostcontroller.deleteUser);
hostrouter.post('/admin/deleteOrder', hostcontroller.deleteOrder);
hostrouter.post('/admin/deleteListing', hostcontroller.deleteListing);


hostrouter.use("/", hostcontroller.get404);
module.exports = hostrouter;
