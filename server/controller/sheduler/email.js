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

const schedulingMail = (clientName, date) => {
  const meetDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const meetTime = `${date.getHours()}-${date.getMinutes() + 1}-${date.getSeconds()}`;

  let mailOptions = {
    from: 'alternatedotme@gmail.com',
    to: 'siddhartha.marko.3@gmail.com',
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

function gettingUsers() {
  const qry = 'SELECT u_Id, email from users';
  db.query(qry, (err, res) => {
    if(err) {
      console.log('Error : - ', err);   
      return;
    }
    // console.log(res);
    checkTimeToEmail(res);
  })
}
const checkTimeToEmail = (user) => {
  const qry = "SELECT nextFollowDate, u_Id, fullName from leads";
  db.query(qry, (err, res) => {
    if (err) {
      console.log("Err : - ", err);
      return;
    }
    const currentDate = new Date();
    const oneDayBefore = new Date(
      date.getTime() - 1 * 24 * 60 * 60 * 1000
    );
    const sevenDaysBefore = new Date(
      date.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    res.forEach((data) => {
      const date = new Date(data.nextFollowDate);
      const foundUser = user.find(
        (userData) => userData.u_Id === data.u_Id
      );

      if (foundUser) {
        if (isSameDate(sevenDaysBefore, currentDate)) {
          console.log(
            "Next follow-up date is exactly 7 days before the current date."
          );
          schedulingMail(foundUser.email, data.fullName, date);
        }

        if (isSameDate(oneDayBefore, currentDate)) {
          console.log(
            "Next follow-up date is exactly 1 day before the current date."
          );
          schedulingMail(foundUser.email, data.fullName, date);
        }

        if (isSameDate(oneDayBefore, currentDate)) {
          console.log("Next follow-up date is the current date.");
          schedulingMail(foundUser.email, data.fullName, date);

          const halfHourBeforeCron = getFormattedTime(date, 30);
          const oneHourBeforeCron = getFormattedTime(date, 60);

          cronScheduling(halfHourBeforeCron);
          cronScheduling(oneHourBeforeCron);

          // function for setting time in hour and minute
          function getFormattedTime(date, minutesBefore) {
          const adjustedDate = new Date(
            date.getTime() - minutesBefore * 60000
          );
          return `${adjustedDate.getMinutes()} ${adjustedDate.getHours()} ${adjustedDate.getDate()} ${
            adjustedDate.getMonth() + 1
          } *`;
        }
        
        // Function for cron schedule
        function cronScheduling() {
          cron.schedule(expressions, () => {
            schedulingMail(foundUser.email, data.fullName, date);
          });
        }
        }
      }
    });

    function isSameDate(date1, date2) {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    }
  });
};

module.exports = {gettingUsers}