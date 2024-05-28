const { db } = require("../config/db");

const test = async (req, res) => {
  res.send({ data: "Test Sucess Full" });
};

const addLead = (req, res) => {
  try {
    const { u_Id, fullName, mobileNo, email, address, inquiryType } = req.body;
    const insertLead = `INSERT INTO leads (
            u_Id, fullName, mobileNo, email, address, inquiryType) VALUES (?, ?, ?, ?, ?, ? )`;
    const insertLeadParams = [
      u_Id,
      fullName,
      mobileNo,
      email,
      address,
      inquiryType,
    ];
    db.query(insertLead, insertLeadParams, (err, result) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
      } else {
        // console.log(result);
        return res.status(200).json({
          success: true,
          data: result,
          message: "lead registered successfully",
        });
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
const updateLead = (req, res) => {
  try {
    const { lead_Id, fullName, mobileNo, email, address, inquiryType } =
      req.body;
    console.log(lead_Id, fullName, mobileNo, email, address, inquiryType);
    const updateLeadQuery = `
        UPDATE leads 
        SET fullName = ?, 
            mobileNo = ?, 
            email = ?, 
            address = ?, 
            inquiryType = ?
        WHERE lead_Id = ?
    `;
    db.query(
      updateLeadQuery,
      [fullName, mobileNo, email, address, inquiryType, lead_Id],
      (updateErr, updateResult) => {
        if (updateErr) {
          return res.status(500).json({ err: "Internal server error" });
        }

        // console.log(updateResult);
        return res.status(200).json({
          message: "Lead updated successfully",
          result: updateResult,
        });
      }
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
const updateFollowReport = (req, res) => {
  try {
    const { report_id, followUpDate, followUpPhase, followUpReport, status } =
      req.body;
    // console.log(report_id, followUpDate, followUpPhase, followUpReport, status);
    const updatefollowupQuery = `
        UPDATE followupreport 
        SET followUpDate = ?, 
            followUpPhase = ?, 
            followUpReport = ?, 
            status = ?
        WHERE report_id = ?
    `;
    db.query(
      updatefollowupQuery,
      [followUpDate, followUpPhase, followUpReport, status, report_id],
      (updateErr, updateResult) => {
        if (updateErr) {
          // console.log(updateErr);
          return res.status(500).json({ err: "Internal server error" });
        }
        // console.log(updateResult);
        return res.status(200).json({
          message: "Lead updated successfully",
          result: updateResult,
        });
      }
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const createFollowUpReport =  (req, res) => {
  try {
    const {
      lead_Id,
      u_Id,
      followUpDate,
      followUpPhase,
      followUpReport,
      status,
    } = req.body;

    const insertFollowUpReport =
      "INSERT INTO followupreport (lead_Id, u_Id, followUpDate, followUpPhase, followUpReport, status) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(
      insertFollowUpReport,
      [lead_Id, u_Id, followUpDate, followUpPhase, followUpReport, status],
      (err, result) => {
        if (err) {
          res.status(500).json({
            err: "Interval server error",
          });
        }
        res.status(200).json({
          result,
        });
      }
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  };
};

const getLeadDetails = (req, res) => {
  try {
    const u_Id = req.params.user_id;
    // console.log(u_Id);
    const getLead = "SELECT * FROM leads WHERE u_Id = ?";
    db.query(getLead, [u_Id], (leadErr, leadResult) => {
      if (leadErr) {
        return res.status(500).json({ error: "Internal server error" });
      }
      const getFollowUp = "SELECT * FROM followupreport WHERE u_Id = ?";

      db.query(getFollowUp, [u_Id], (followUpErr, followUpResult) => {
        if (followUpErr) {
          return res.status(500).json({ error: "Internal server error" });
        }
        if (followUpResult.length == 0 && leadResult.length == 0) {
          return res.status(400).json({ message: "not found" });
        }

        function convertUTCtoIST(utcDateTime) {
          const options = {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          };
          console.log(utcDateTime);
          const istDateTime = new Intl.DateTimeFormat("en-IN", options).format(
            utcDateTime
          );
          return istDateTime;
        }
        // Return the retrieved data
        leadResult.forEach((obj) => {
          let date = convertUTCtoIST(obj.date);
          obj.date = date.toString().substring(0, 10);
          if (obj.nextFollowDate) {
            obj.nextFollowDate = obj.nextFollowDate;
          }
          return obj;
        });

        followUpResult.forEach((obj) => {
          if (obj.followUpDate) {
            obj.followUpDate = obj.followUpDate;
          }
          let date = obj.followUpDate;
          obj.followUpDate = date.toString().substring(0, 10);
          return obj;
        });

        leadResult.reverse();
        followUpResult.reverse();

        return res.status(200).json({
          lead: leadResult,
          followUp: followUpResult,
        });
      });
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const updateMeeting = (req, res) => {
  const { lead_Id, nextFollowDate, nextFollowPhase } =
    req.body;

    const [datePart, timePart] = nextFollowDate.split('T');
    let Str_nextFollowDate = `${datePart} ${timePart}:00`;

  const updateLeadQuery = `
        UPDATE leads 
        SET
            nextFollowDate = ?,
            nextFollowPhase = ?
        WHERE lead_Id = ? 
    `;
  db.query(
    updateLeadQuery,
    [Str_nextFollowDate, nextFollowPhase, lead_Id],
    (updateErr, updateResult) => {
      if (updateErr) {
        return res.status(500).json({ err: "Internal server error" });
      }

      return res.status(200).json({
        message: "Lead updated successfully",
        result: updateResult,
      });
    }
  );
};
module.exports = {
  test,
  addLead,
  updateLead,
  createFollowUpReport,
  getLeadDetails,
  updateMeeting,
  updateFollowReport,
};
