const express = require("express");
const router = express.Router();
const {
  test,
  addLead,
  updateLead,
  createFollowUpReport,
  getLeadDetails,
  updateMeeting,
  updateFollowReport,
  mailTest,
  AddData,
  DeleteTask,
  FetchData,
  UpdateTask,
  FetchFUllData,
  ProjectsList,
  CategoryList,
  SubCategoryList,
  myTask,
  AddCategory,
  AddSubcategory,
  AddProject,
  UserData,
  projectFromAssign,
  assignProject,
  getUserTasks,
  DownloadUserTaskReport,
} = require("../controller/itemController.js");

router.get("/test", test);
router.post("/lead", addLead);
router.post("/insertfollowup", createFollowUpReport);
router.get("/getlead/:user_id", getLeadDetails);
router.post("/updateLead", updateLead);
router.put("/updateMeeting", updateMeeting);
router.put("/updateFollowReport", updateFollowReport);
router.get("/mailTest", mailTest);
// Route to add data
router.post("/api/add-data", AddData);
// Route to fetch data
router.get("/api/fetch-data", FetchData);
// this route for fetch full all user  task report
router.get("/api/fetch-full-data", FetchFUllData);
//  Update Task Details
router.post("/api/update-task", UpdateTask);
// Route to delete a task
router.post("/api/delete-task", DeleteTask);


// Router to Logout user
// router.post('/api/logout', UserLogout);
// Route for user show only self add task
router.get("/api/mytask/:id", myTask);

// Route for  Add project and categeory
router.post("/api/projects", AddProject);

router.post("/api/categories", AddCategory);

router.post("/api/subcategories", AddSubcategory);

// slect filed routes
router.get("/api/projects", ProjectsList);
router.get("/api/category-list", CategoryList);
router.get("/api/sub-category-list", SubCategoryList);


//User Data Fetch

router.get("/api/users", UserData);
router.get("/api/getProject/:user_id", projectFromAssign);

router.post("/api/assignProject", assignProject);

// Employee Task Show to admin
router.get("/api/getUserTasks/:userId", getUserTasks);

// Downnload User task in excel

router.get("/api/downloadUserTasks/:userId", DownloadUserTaskReport);

module.exports = router;
