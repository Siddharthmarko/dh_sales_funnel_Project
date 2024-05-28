const nodemailer = require('nodemailer');
const {db} = require('../../config/db')
const cron = require('node-cron');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abhishekdoaguru@gmail.com',
    pass: 'onmkmsfelvgnfnoa',
  },
  tls: {
      rejectUnauthorized: false,
    },
});

const go = (userEmail, clientName, date) => {
  
  const meetDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const meetTime = `${date.getHours()}-${date.getMinutes() + 1}-${date.getSeconds()}`;

  let mailOptions = {
    from: 'alternatedotme@gmail.com',
    to: `${userEmail}`,
    subject: `Reminder: Scheduled Meeting with client name`,
    text: `I hope this email finds you well. This is just a gentle reminder regarding your scheduled meeting with ${clientName} on ${meetDate} at ${meetTime}.

    Agenda:
    Crack This Deal 
    
    Please ensure you are well-prepared for the meeting and have ready all necessary materials/documents. If you have any questions or need assistance before the meeting, feel free to contact me.
    
    Best regards,
    DOAGuru Infotech
    Sales Team `,
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Email sending failed:', error);
    } else {
        console.log('Email sent:', info.response); 
    }
  });

}

const gotUsers = () => {
  const qry = 'SELECT u_Id, email from users';
  db.query(qry, (err, res) => {
    if(err) {
      console.log('err');
      res.status(400).json({ err: 'This is error' });
    }
    console.log('SUCCESFUULY')
    console.log(res);
    getAll(res);
  })
}
      const getAll = (user) => {
        // console.log('line numebr  333');
        // console.log(user);
        const qry = 'SELECT nextFollowDate, u_Id, fullName from leads';
        db.query(qry, (err, res) => {
          if (err) {
            res.status(400).json({ err: 'This is error' });
          }
            // console.log('line numebr 26');
            // console.log(user);
            // const currentDate = new Date();
            const now = new Date();
            let utctime = now.toUTCString();
            let utcTime = new Date(utctime);
        
            const ISTOffset = 5 * 60 + 30; // IST is UTC + 5:30
            const currentDate = new Date(utcTime.getTime() + ISTOffset * 60 * 1000);
            // console.log(arr);
            res.forEach((data) => {
            // arr.forEach((data) => {
              // console.log(data);
                const date = new Date(data.nextFollowDate); 
                const oneDayBefore = new Date(date.getTime() - (1 * 24 * 60 * 60 * 1000)); // 1 day before
                const sevenDaysBefore = new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7 days before

                const foundUser = user.find((userData) => userData.u_Id === data.u_Id);
                
                if (sevenDaysBefore.getDate() === currentDate.getDate() && sevenDaysBefore.getMonth() === currentDate.getMonth() && sevenDaysBefore.getFullYear() === currentDate.getFullYear()) {
                      console.log('Next follow-up date is exactly 7 days before the current date.');
                      if (foundUser) {
                          // console.log(foundUser);
                          go(foundUser.email, data.fullName, date);
                      }
                }
                // console.log();
                
                if (oneDayBefore.getDate() === currentDate.getDate() && oneDayBefore.getMonth() === currentDate.getMonth() && oneDayBefore.getFullYear() === currentDate.getFullYear()) {
                  console.log('Next follow-up date is exactly 1 day before the current date.');
                      if (foundUser) {
                          // console.log(foundUser);
                          go(foundUser.email, data.fullName, date);

                      }
                }
                // console.log();
                if(date.getTime() > currentDate.getTime()){
                if (date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
                  console.log('Next follow-up date is the current date.');
                  if (foundUser) {
                      // console.log(foundUser);
                      go(foundUser.email, data.fullName, date);    
                      const halfHourBefore = new Date(date.getTime() - (30 * 60000)); // 30 minutes before
                      const oneHourBefore = new Date(date.getTime() - (60 * 60000));// 1 hour before

                      const halfHourBeforeCron = `${halfHourBefore.getMinutes()} ${halfHourBefore.getHours()} ${halfHourBefore.getDate()} ${halfHourBefore.getMonth() + 1} *`;
                      const oneHourBeforeCron = `${oneHourBefore.getMinutes()} ${oneHourBefore.getHours()} ${oneHourBefore.getDate()} ${oneHourBefore.getMonth() + 1} *`;
               
                      cron.schedule(oneHourBeforeCron, () => {
                        go(foundUser.email, data.fullName, date);    
                      },{
                        timezone: "Asia/Kolkata"
                      });

                      cron.schedule(halfHourBeforeCron, () => {
                        go(foundUser.email, data.fullName, date);    
                      }, {
                        timezone: "Asia/Kolkata"
                      });


                  }
                }
              }
            });
        });
    };

module.exports = {gotUsers}