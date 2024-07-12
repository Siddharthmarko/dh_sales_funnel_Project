// const {users} = require('../data');
const {db} = require("../config/db");

const registerController = async (req, res, next) => {    
    try {
        const { name, number, email, password } = req.body;
        const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
        db.query(checkUserQuery, [email], (err, result) => {
            if (err) {
              res.status(500).json({ error: "Internal server error" });
            } else {
              if (result.length > 0) {      
                return res.status(201).json({
                  error: "User already exists.",
                });
              } else {
                const insertUserQuery = `INSERT INTO users (
                    name, number, email, password) VALUES (?, ?, ?, ?)`;
      
                const insertUserParams = [ name, number, email, password ];
      
                db.query(
                  insertUserQuery,
                  insertUserParams,
                  (err, result) => {
                    if (err) {
                      res.status(500).json({ error: "Internal server error" });
                    } else {
                      console.log("User registered successfully");
                      return res.status(200).json({
                        success: true,
                        data: result,
                        message: "User registered successfully",
                      });
                    }
                  }
                );
              }
            }
          });
    } catch (e) {
        console.log("error");
        res.status(500).json({ error: e.message });

    }
}

const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // console.log(email, password);
        if (!email || !password) {
          return res.status(404).send({
            success: false,
            message: "Invalid email or password",
          });
        }
        const qry = `SELECT * FROM users WHERE email = ?`;
        db.query(qry,[email], async(err, result) => {
          if(err){
            return res.status(500).json({
              success: false,
              message: "Internal server error",
            });
          }
          const user = result[0];
          const match = user.password == password;
          if(!match) {
            res.status(400).send({message: 'password invalid'});
          }
          res.status(200).send({
          success: true,
          message: "login successfully",
          user: {result},
        }); 
    });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// Router to Register New user By admin side 
const UserRegister = (req, res) => {
  const { fullName, mobileNumber, emailId, designation, password } = req.body;
  const sql = 'INSERT INTO task_users (full_name, mobile_number, email_id, designation, password) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [fullName, mobileNumber, emailId, designation, password], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ message: 'User register successfully' });
  });
}
// Route to login user 
const UserLogin = (req, res) => {
  // console.log('emailId, password');
  const { emailId, password } = req.body;
  const sql = 'SELECT * FROM task_users WHERE email_id = ? AND password = ?';
  db.query(sql, [emailId, password], (err, result) => {
    if (err) {
      return res.status(500).send(err);

    }
    if (result.length > 0) {
      res.send({ 
        message: `सफल लॉगिन

आपका लॉगिन सफल रहा है। आपका स्वागत है! 

धन्यवाद!

`, user: result[0] 
      });
    }
    else {
      res.status(401).send({ message: 'Invalid credentials' });
      
    }
  });
}


// Route to logout user 

const UserLogout = (req, res) => {
  //Clear the token 
  req.session.destroy((err) =>{
    if(err){
      return res.status(500).send('Failled to logout');
    }
    //clear cookies if used
    res.clearCookie('cookies');

    res.status(200).send('Logged out successfully');

  })
}

// Route to login Admin 
const AdminLogin = (req, res) => {
  const { emailId, password } = req.body;
  const sql = 'SELECT * FROM admin_users WHERE email_id = ? AND password = ?';
  db.query(sql, [emailId, password], (err, result) => {
    if (err) {
      return res.status(500).send(err);

    }
    if (result.length > 0) {
      res.send({ message: 'एडमिन का लॉगिन सफलतापूर्वक हो गया है।', user: result[0] });
    }
    else {
      res.status(401).send({ message: 'Invalid credentials' });
      
      console.log(message)
    }
  });
}

module.exports = {registerController, loginController, UserRegister, UserLogin, AdminLogin};