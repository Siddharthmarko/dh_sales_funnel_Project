const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const userRoutes = require('./router/userRoute.js');
const authRoutes = require('./router/authRoute.js');
const cron = require('node-cron');
const {gotUsers} = require('./controller/sheduler/email.js');

dotenv.config();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(cookieParser()); 
app.use(userRoutes);
app.use(authRoutes);

function start() {
    console.log('start');
    const now = new Date();
    let utctime = now.toUTCString();
    let utcTime = new Date(utctime);

    const ISTOffset = 5 * 60 + 30; // IST is UTC + 5:30
    const nowInIST = new Date(utcTime.getTime() + ISTOffset * 60 * 1000);

    const tenAMToday = new Date(utcTime.getTime() + ISTOffset * 60 * 1000);
    tenAMToday.setHours(10, 0, 0, 0); // Set to today's 10:00 AM
  
    if (nowInIST > tenAMToday) {
        tenAMToday.setDate(tenAMToday.getDate() + 1); // Move to tomorrow if 10:00 AM has already passed today
    }

    const cronExpression = `${tenAMToday.getSeconds()} ${tenAMToday.getMinutes()} ${tenAMToday.getHours()} * * *`;
    // const cronExpression = `* * * * *`;
    // console.log('after some time');
    cron.schedule(cronExpression, () => {
        console.log('Executing cron job at 10:00 AM daily');
        gotUsers(); 
    }, {
        timezone: "Asia/Kolkata"
      });
}

start();
app.listen(8080, () => {
    console.log('server is running');
});
