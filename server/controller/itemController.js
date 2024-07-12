const { db } = require("../config/db");
const { getAllAssociates } = require("./sheduler/email");

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
    let defaultData = {"week":"false","yesterday":"false","today":"false","onehour":"false","halfhour":"false"};
    let defaultJson = JSON.stringify(defaultData);

  const updateLeadQuery = `
        UPDATE leads 
        SET
            nextFollowDate = ?,
            nextFollowPhase = ?,
            remind = ?
        WHERE lead_Id = ? 
    `;
  db.query(
    updateLeadQuery,
    [Str_nextFollowDate, nextFollowPhase, defaultJson, lead_Id],
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

const mailTest = (req, res) => {
  try {
    getAllAssociates();
    res.status(200).json({messaages: 'SUccessfully'});
  } catch (err) {
    res.status(400).json({messaages: 'Error'});
  }
}

const excel = require('exceljs');

// Route to add-Task data 
const AddData = (req, res) => {
  console.log('here');
  const { user_id,user_full_name, ProjectOrClientName, Category, subCategory, TaskDescription, ConsumingTimeInMin } = req.body;

  if (!user_id || !user_full_name || !ProjectOrClientName || !Category || !subCategory || !TaskDescription || !ConsumingTimeInMin) {
    return res.status(400).send('All fields are required');
  }
  const taskDate = new Date().toISOString().split('T')[0]; // current date 
  console.log(user_id, user_full_name, ProjectOrClientName, Category, subCategory, TaskDescription, ConsumingTimeInMin)

  const query = 'INSERT INTO tasks (user_id, name, ProjectOrClientName, Category, SubCategory, TaskDescription, ConsumingTimeInMin, task_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [user_id, user_full_name, ProjectOrClientName, Category, subCategory, TaskDescription, ConsumingTimeInMin, taskDate], (err, result) => {
    console.log(result)
    if (err) {
      return res.status(500).send(err);
    }
    res.send('Data saved successfully');
  });
}
// Route to fetch data by date to show user only by date
const FetchData = (req, res) => {
  const { date } = req.query
  const query = 'SELECT * FROM tasks WHERE task_date = ?';
  db.query(query, [date], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
};

// fetch full task data show full task details
const FetchFUllData = (req, res) => {
  const query = 'SELECT * FROM tasks ';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    console.log(results);
    res.json(results);
  });
};

// Route to update  task details 
const UpdateTask = (req, res) => {
  try {
    const { ProjectOrClientName, Category, SubCategory, TaskDescription, ConsumingTimeInMin, id } = req.body;
    console.log(ProjectOrClientName, Category, SubCategory, TaskDescription, ConsumingTimeInMin, id);

    const updateTask = `
      UPDATE tasks
      SET ProjectOrClientName = ?,
          Category = ?,
          SubCategory = ?,
          TaskDescription = ?,
          ConsumingTimeInMin = ?
      WHERE id = ?;
    `;

    db.query(updateTask, [ProjectOrClientName, Category, SubCategory, TaskDescription, ConsumingTimeInMin, id], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating task:', updateErr);
        return res.status(500).json({ error: 'Internal server error' });
      }
      // Success Response 
      console.log(updateResult);
      return res.status(200).json({
        message: "Task updated successfully",
        result: updateResult
      });
    });
  } catch (e) {
    console.error('Caught error:', e);
    res.status(500).json({ error: e.message });
  }
};
// Route to delete Task 
const DeleteTask = (req, res) => {
  const { id } = req.body;

  const deleteTaskData = 'DELETE FROM tasks WHERE id = ?';

  db.query(deleteTaskData, [id], (deleteErr, deleteResult) => {
    if (deleteErr) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200).json({ message: 'Task deleted successfully' });
  });
};
// Route to fetch options for selects filed (Add task)
const ProjectsList = (req, res) => {
  const query = 'SELECT * FROM projects';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching projects:', err);
      res.status(500).send('Error fetching projects', err);
      return;
    }
    res.json(result);
  });
};

const CategoryList = (req, res) => {
  const { projects_id } = req.query;
  const query = 'SELECT * FROM category ';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching categories:', err);
      res.status(500).send('Error fetching categories', err);
      return;
    }
    res.json(result);
    console.log(result)
  });
};

const SubCategoryList = (req, res) => {
  const { category_id } = req.query;
  console.log(category_id)
  const query = 'SELECT * FROM subcategory WHERE category_id = ?';

  db.query(query, [category_id], (err, result) => {
    if (err) {
      console.error('Error fetching sub-categories:', err);
      res.status(500).json({ message: 'Error fetching sub-categories', error: err });
      return;
    }
    console.log('sub category ', result)
    res.json(result);
  });
};

// // Route to add new option(project name category subcat) by Admin side 



// route for user only show user data 
const myTask = (req, res) => {
  console.log('OKAY');
  const { id } = req.params;
  console.log(id);
  const query = 'SELECT * from tasks WHERE user_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send('Internal Server Error')
    };
    console.log(result);
    if (result.length < 1) {
      return res.status(404).send('No Data Available')
    };
    res.status(200).json(result);
  })
}


// Add new project
const AddProject = (req, res) => {
  const { name } = req.body;
  const query = 'INSERT INTO projects (name) VALUES (?)';
  db.query(query, [name], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ message: 'Project added successfully', id: results.insertId });
  });
};

// Add new category
const AddCategory = (req, res) => {
  const { name } = req.body;
  const query = 'INSERT INTO category (name) VALUES (?)';
  db.query(query, [name], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ message: 'Category added successfully', id: results.insertId });
  });
};

// Add new subcategory
const AddSubcategory = (req, res) => {
  const { name, category_id } = req.body;
  const query = 'INSERT INTO subcategory (name, category_id) VALUES (?, ?)';
  db.query(query, [name, category_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ message: 'Subcategory added successfully', id: results.insertId });
  });
};


// New endpoint to get all users
const UserData = (req, res) => {
  const sql = 'SELECT id, full_name, mobile_number, email_id, designation, password FROM task_users';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ error: 'Database error', details: err });
    }
    res.send(results);
  });
};
//  fetch from asing task
const projectFromAssign = (req, res) => {
  const user_id = req.params.user_id; // Assuming user_id is a parameter in the request
  const query = 'SELECT * FROM assigned_projects WHERE user_id = ?'; // Adjusted query to filter by user_id
  db.query(query, [user_id], (err, result) => {
    if (err) {
      console.error('Error fetching projects:', err);
      res.status(500).json({ error: 'Failed to fetch projects' });
    } else {
      res.status(200).json(result); // Assuming result contains the fetched projects
    }
  });
}

const assignProject = (req, res) => {
  const { projectId, categoryId, userId } = req.body;
  const assignCategoryQuery = 'INSERT INTO assigned_projects (project_id, category_id, user_id) VALUES (?, ?, ?)';
  db.query(assignCategoryQuery, [projectId, categoryId, userId], (err, assignResults) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ message: 'Project added and assigned to category successfully', projectId });
  });
};

// User task show to admin side 
const getUserTasks = (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT user_id, name, ProjectOrClientName, Category, SubCategory, TaskDescription, ConsumingTimeInMin, task_date
    FROM tasks
    WHERE user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.status(200).json(results);
  });
};

// Define the route to download user tasks as an Excel file
const DownloadUserTaskReport = (req, res) => {
  const { userId } = req.params;
  const { userName } = req.params;
   

  const query = `
    SELECT user_id, name, ProjectOrClientName, Category, SubCategory, TaskDescription, ConsumingTimeInMin, task_date
    FROM tasks
    WHERE user_id = ?
  `;

  db.query(query, [userId, userName], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('User Tasks');


    worksheet.columns = [
      { header: 'User ID', key: 'user_id', width: 10 },
      { header: 'User Name', key: 'name', width: 20 },
      { header: 'Project or Client Name', key: 'ProjectOrClientName', width: 30 },
      { header: 'Category', key: 'Category', width: 20 },
      { header: 'SubCategory', key: 'SubCategory', width: 20 },
      { header: 'Task Description', key: 'TaskDescription', width: 30 },
      { header: 'Consuming Time (Min)', key: 'ConsumingTimeInMin', width: 20 },
      { header: 'Task Date', key: 'task_date', width: 15 }
    ];

    worksheet.addRows(results);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=user_${userId}_tasksReport.xlsx`);

    workbook.xlsx.write(res)
      .then(() => {
        res.end();
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
};


module.exports = {
  test,
  addLead,
  updateLead,
  createFollowUpReport,
  getLeadDetails,
  updateMeeting,
  updateFollowReport,
  mailTest,
  AddData,
  FetchData,
  UpdateTask,
  DeleteTask,
  FetchFUllData,
  ProjectsList,
  CategoryList,
  SubCategoryList,
  myTask,
  AddProject,
  AddCategory,
  AddSubcategory,
  UserData,
  projectFromAssign,
  assignProject,
  getUserTasks,
  DownloadUserTaskReport,
};
