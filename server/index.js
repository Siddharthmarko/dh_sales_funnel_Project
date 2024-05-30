const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const userRoutes = require('./router/userRoute.js');
const authRoutes = require('./router/authRoute.js');
const cron = require('node-cron');
const {getAllAssociates} = require('./controller/sheduler/email.js');

dotenv.config();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(cookieParser()); 
app.use(userRoutes);
app.use(authRoutes);

(function () {  
    cron.schedule('0 0 10 * * *', () => {
        console.log('Executing cron job at 10:00 AM daily');
        getAllAssociates(); 
    }, {
        timezone: "Asia/Kolkata"
      });
})();

app.listen(8080, () => {
    console.log('server is running');
});
