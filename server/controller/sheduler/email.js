const cron = require('node-cron');
const nodemailer = require('nodemailer');
const {db} = require('../../config/db')

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

const sendingMail = (userEmail, clientName, date) => {

  let mailOptions = {
    from: 'alternatedotme@gmail.com',
    to: `${userEmail}`,
    subject: `Reminder: Scheduled Meeting with client name`,
    text: `I hope this email finds you well. This is just a gentle reminder regarding your scheduled meeting with ${clientName} on ${date.toGMTString()}.

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

const getAllAssociates = () => {
  const qry = 'SELECT u_Id, email from users';
  db.query(qry, (err, res) => {
    if(err) res.status(400).json({ err: 'This is error' });
    
    console.log('Successfully get all user');
    nextLeadsToMeet(res)
  })
}

const nextLeadsToMeet = (user) => {
  const qry = 'SELECT nextFollowDate, u_Id, fullName from leads';
  db.query(qry, (err, res) => {
    if (err) res.status(400).json({ err: 'This is error' });
    
    const localTime = new Date();
    let UTC_STRING = localTime.toUTCString();
    let universalTime = new Date(UTC_STRING);
    
      const ISTOffset = 5 * 60 + 30; 
      const currentDate = new Date(universalTime.getTime() + ISTOffset * 60 * 1000);
      
      res.forEach((data) => {
          universalTime = new Date(data.nextFollowDate);
          const nextDate = new Date(universalTime.getTime() + ISTOffset * 60 * 1000);
          const oneDayBefore = new Date(nextDate.getTime() - (1 * 24 * 60 * 60 * 1000)); // 1 day before
          const sevenDaysBefore = new Date(nextDate.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7 days before

          // Finding user
          const foundUser = user.find((userData) => userData.u_Id === data.u_Id);

        if(foundUser){

          nextDaySchedule(sevenDaysBefore, '7 day before');
          nextDaySchedule(oneDayBefore, '1 day before');

          if(nextDate.getTime() > currentDate.getTime()){
          if (
              nextDate.getDate() === currentDate.getDate() && 
              nextDate.getMonth() === currentDate.getMonth() && 
              nextDate.getFullYear() === currentDate.getFullYear()
            ) {
                console.log('Next follow-up date is the current date.');
                sendingMail(foundUser.email, data.fullName, nextDate);
                    
                const halfHourBefore = new Date(nextDate.getTime() - (30 * 60000)); // 30 minutes before
                const oneHourBefore = new Date(nextDate.getTime() - (60 * 60000));// 1 hour before
  
                scheduleMail(oneHourBefore, '1 hour before');
                scheduleMail(halfHourBefore, '30 minutes before'); 

                function scheduleMail (scheduleDate, label) {
                  console.log(scheduleDate)
                  const cronTime = `${scheduleDate.getMinutes()} ${scheduleDate.getHours()} ${scheduleDate.getDate()} ${scheduleDate.getMonth() + 1} *`;
                  cron.schedule(cronTime, () => {
                      console.log(`Sending email ${label} the follow-up time.`);
                      sendingMail(foundUser.email, data.fullName, nextDate);    
                  }, {
                      timezone: "Asia/Kolkata"
                  });
              };
          }}
          
          function nextDaySchedule (checkDate, label) {
            if (
              checkDate.getDate() === currentDate.getDate() &&
              checkDate.getMonth() === currentDate.getMonth() &&
              checkDate.getFullYear() === currentDate.getFullYear()
            ) {
              console.log(`Next follow-up date is exactly ${label} the current date.`);
              sendingMail(foundUser.email, data.fullName, nextDate);
            }};
        }}
      );
  });
};

module.exports = {getAllAssociates}