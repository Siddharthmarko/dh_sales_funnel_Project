import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const defaultLead = [
  {
    lead_Id: "1234",
    date: "01/01/2024",
    fullName: "Demo singh",
    mobileNo: "12345678",
    email: "demo@gmail.com",
    address: "Demopur",
    status: "pending",
    inquiryType: "Demo type",
  },
];
const defaultLeadForm = {
  fullName: "",
  mobileNo: "",
  email: "",
  address: "",
  inquiryType: "",
  nextFollowDate: "",
  nextFollowPhase: "",
};
function UserHome() {
  const [leadDetails, setLeadDetails] = useState(defaultLead);
  const [leadForm, setLeadForm] = useState(defaultLeadForm);
  const [updateForm, setUpdateForm] = useState(defaultLeadForm);
  const [nowUseEffect, setNowUseEffect] = useState(true);
  const [error, setError] = useState(false);
  const [sliced, setSliced] = useState([]);
  // -*------------------------------

  let user = localStorage.getItem("user");
  user = JSON.parse(user);
  console.log(user);

  const handleSearch = (e) => {
    let value = e.target.value.toLowerCase();
    let filterData = leadDetails.filter((item) => {
      for (let key in item) {
        if (typeof item[key] === "string") {
          let word = item[key].toLowerCase();
          if (word.includes(value)) {
            return true;
          }
        }
      }
      return false;
    });
    console.log(filterData);
    setSliced(filterData);
    if (value === "") {
      setNowUseEffect(!nowUseEffect);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLeadForm(defaultLeadForm);
    console.log(leadForm);
    // ref.current[0].click();
    let modalHeader = e.target.closest(".modal").querySelector(".modal-header");
    if (modalHeader) {
      // Find the close button within the modal header
      let btn = modalHeader.querySelector(".btn-close");
      console.log(btn);
      btn.click();
    } else {
      console.log("Modal header not found");
    }
    // console.dir(curr.current[0]);
    // console.log(curr.current[0].click());
    axios
      .post("http://localhost:8080/lead", { u_Id: user.u_Id, ...leadForm })
      .then((res) => {
        console.log(res.data);
        setNowUseEffect(!nowUseEffect);

        alert("Lead successfully added.");
        return res.data;
      })
      .catch((err) => {
        console.log(err, "err in user home");
      });
  };
  const handleUpdateLead = (e, lead) => {
    e.preventDefault();
    console.log(lead);
    setLeadForm({
      ...defaultLeadForm,
      fullName: lead.fullName,
      lead_Id: lead.lead_Id,
    });
    // ref.current[1].click();
    let modalHeader = e.target.closest(".modal").querySelector(".modal-header");
    if (modalHeader) {
      // Find the close button within the modal header
      let btn = modalHeader.querySelector(".btn-close");
      console.log(btn);
      btn.click();
    } else {
      console.log("Modal header not found");
    }
    axios
      .post("http://localhost:8080/updateLead", { ...leadForm })
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .catch((err) => {
        console.log(err, "err in user home");
      });
    setNowUseEffect(!setNowUseEffect);
  };
  const hanldefollowUp = (e) => {
    e.preventDefault();
    console.log(leadForm);
    setLeadForm(defaultLeadForm);
    // ref.current[2].click();

    // console.log(curr.current[2].click());
    console.log(user.email);
    axios
      .put("http://localhost:8080/updateMeeting", {
        u_Id: user.u_Id,
        userName: user.name,
        emails: user.email,
        ...leadForm,
      })
      .then((res) => {
        console.log(res.data);
        alert("Meeting scheduled successfully.");
        return res.data;
      })
      .catch((err) => {
        console.log(err, "err in user home");
      });
    setNowUseEffect(!nowUseEffect);
    let modalHeader = e.target.closest(".modal").querySelector(".modal-header");
    if (modalHeader) {
      // Find the close button within the modal header
      let btn = modalHeader.querySelector(".btn-close");
      console.log(btn);
      btn.click();
    } else {
      console.log("Modal header not found");
    }
  };
  const handleLeadForm = (e, prop) => {
    
    let value = e.target.value;
    if(e.target.name == 'date'){
      const dateToCompare = new Date(value);
      const currentDate = new Date();
      if (dateToCompare.getTime() < currentDate.getTime()) {
            alert('Please select valid date and time');
            return    
      } 
    }
    // prop ko hata kar e.target.name bhi kar sakte hai
    if (e.target.name == "Mobile") {
      if (value.length !== 10) {
        setError(true);
        if (value.length > 10) {
          setError(false);
          // Correct this Logic
          return;
        }
      } else {
      }
    }
    setLeadForm({ ...leadForm, [prop]: value });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/getlead/${user.u_Id}`)
      .then((responce) => {
        // console.log(responce.data);
        if (responce.data.lead) {
          const leadArray = [...responce.data.lead];
          const followUpArray = [...responce.data.followUp];
          let arr = leadArray.map((item) => {
            let follow = followUpArray.find(
              (followItem) => followItem.lead_Id == item.lead_Id
            );
            if (follow) {
              item.status = follow.status;
              // return { ...item, status: follow.status };
            }
            return { ...item, searched: false };
          });
          console.log(arr);
          setLeadDetails(arr);
          setSliced(arr);
          console.log(leadDetails);
        }
        return responce.data;
      })
      .catch((err) => {
        console.log(err, "this is err form home page");
      });
  }, [nowUseEffect]);
  return (
    <Wrapper>
      <div className="m-3 px-1 ">
        <div className="  my-4 ">
          <div>
            <div className="m-1 pb-4">
              <br />
              <div className="d-flex justify-content-between flex-wrap">
                <button
                  className="btn btn-info "
                  data-bs-toggle="modal"
                  data-bs-target="#1AddLeadsModal"
                >
                  Add Lead
                </button>
                <div className="d-flex">
                  {/* <input value={search} onChange={(e) => setSearch(e.target.value)} className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                    <button onClick={handleSearch} className="btn btn-outline-success me-2" type="submit">Search</button> */}
                  <input
                    onChange={handleSearch}
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                </div>
              </div>
              {/* Model Box to Add Leads Details  */}
              <div className="rounded-3 shadow-lg">
                <div
                  className="modal fade rounded shadow-lg"
                  id="1AddLeadsModal"
                  tabindex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          Add Lead
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body m-1">
                        <div className="Model_content d-flex flex-column  py-3 px-5">
                          <div>
                            {/* <div className="mb-3">
                              <label for="exampleFormControlInput1" className="form-label">Genrate Clien ID</label>
                              <input type="ClienID" className="form-control" id="exampleFormControlInput1" placeholder="Auto Genrate Client ID" />
                            </div> */}
                            <form onSubmit={handleSubmit}>
                              {/* <div className="mb-3">
                              <label for="LeadDateFormControlInput1" className="form-label">Lead Generation Date</label>
                              <input type="date" className="form-control" id="LeadDateFormControlInput1" />
                            </div> */}
                              <div className="mb-3">
                                <label
                                  for="exampleFormControlInput1"
                                  className="form-label"
                                >
                                  Client Name
                                </label>
                                <input
                                  type="text"
                                  value={leadForm.fullName}
                                  onChange={(e) =>
                                    handleLeadForm(e, "fullName")
                                  }
                                  className="form-control"
                                  id="exampleFormControlInput1"
                                  placeholder="Clien Name"
                                  required
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  for="exampleFormControlInput1"
                                  className="form-label"
                                >
                                  Mobile No.
                                </label>
                                <input
                                  required
                                  type="number"
                                  name="Mobile"
                                  value={leadForm.mobileNo}
                                  onChange={(e) =>
                                    handleLeadForm(e, "mobileNo")
                                  }
                                  className="form-control"
                                  id="exampleFormControlInput1"
                                  placeholder="Client Number"
                                />
                                {error && (
                                  <p>Please enter a valid 10 digit number.</p>
                                )}
                              </div>
                              <div className="mb-3">
                                <label
                                  for="exampleFormControlInput1"
                                  className="form-label"
                                >
                                  Email ID
                                </label>
                                <input
                                  required
                                  type="Email"
                                  value={leadForm.email}
                                  defaultValue={"myemail@gmail.com"}
                                  onChange={(e) => handleLeadForm(e, "email")}
                                  className="form-control"
                                  id="exampleFormControlInput1"
                                  placeholder="Client Email ID"
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  for="exampleFormControlInput1"
                                  className="form-label"
                                >
                                  Address
                                </label>
                                <input
                                  required
                                  type="address"
                                  value={leadForm.address}
                                  onChange={(e) => handleLeadForm(e, "address")}
                                  className="form-control"
                                  id="exampleFormControlInput1"
                                  placeholder="Client Address"
                                />
                              </div>
                              <div>
                                <label
                                  for="exampleDataList"
                                  className="form-label"
                                >
                                  Inquiry type
                                </label>
                                <select
                                  required
                                  value={leadForm.inquiryType}
                                  onChange={(e) =>
                                    handleLeadForm(e, "inquiryType")
                                  }
                                  className="form-select form-select-sm"
                                  aria-label="form-select-sm example"
                                >
                                  <option disabled value="">
                                    Open this select menu
                                  </option>
                                  <option value="Web Development">
                                    Web Development
                                  </option>
                                  <option value="Digital Marketing">
                                    Digital Marketing
                                  </option>
                                  <option value="Whatsapp Marketing">
                                    Whatsapp Marketing
                                  </option>
                                  <option value="SMM">SMM</option>
                                  <option value="SMO">SMO</option>
                                  <option value="SEO">SEO</option>
                                  <option value="GMD">GMD</option>
                                </select>
                              </div>
                              <div className="mt-3">
                                <input type="submit" className="btn btn-dark" />
                              </div>
                              {/* <Link to='' className='btn btn-dark mt-3 '> Add Lead </Link> */}
                            </form>
                          </div>
                        </div>
                      </div>
                      {/* <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                              <button type="button" className="btn btn-primary">Save changes</button>
                            </div> */}
                    </div>
                  </div>
                </div>
              </div>
              {/* Model Close  */}
            </div>
            <div>
              <div className="table-responsive">
                <table className="table text-decoration-none table-hover">
                  <thead className="table-dark">
                    <tr className="text-center ">
                      {/* <th scope="col">S.no.</th>
                      <th scope="col">Client ID</th> */}
                      <th className="align-middle" scope="col">
                        Lead Generation Date
                      </th>
                      <th className="align-middle" scope="col">
                        Client Name{" "}
                      </th>
                      <th className="align-middle" scope="col">
                        Mobile No.
                      </th>
                      <th className="align-middle" scope="col">
                        Email ID
                      </th>
                      <th className="align-middle" scope="col">
                        Address
                      </th>
                      <th className="align-middle" scope="col">
                        Upcoming Meeting{" "}
                      </th>
                      <th className="align-middle" scope="col">
                        Status
                      </th>
                      <th className="align-middle" scope="col">
                        Service(s)
                      </th>
                      <th className="align-middle" scope="col" colspan="3">
                        Action
                      </th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider ">
                    {/* <td scope="row">1</td>
                      <td>GOAG001</td>
                      <td>01/01/2024</td>
                      <td>Loren Singh</td>
                      <td>+917047490032</td>
                      <td>Demo@Gmail.com</td>
                      <td>00, Wright Town Jabalpur 482002</td>
                      <td>28-04-2024</td>
                      <td className='bg-warning'>Pending</td>
                      <td>Digital Marketing</td> */}
                    {sliced.map((lead, index) => {
                      // setUpdateForm(lead)
                      return (
                        <>
                          <tr className="text-center">
                            {/* <td scope="row">{index+1}</td> */}
                            {/* <td>{lead.lead_Id}</td> */}
                            <td className="align-middle">{lead.date}</td>
                            <td className="align-middle">{lead.fullName}</td>
                            <td className="align-middle">{lead.mobileNo}</td>
                            <td className="align-middle">{lead.email}</td>
                            <td className="align-middle ">
                              {" "}
                              <span
                                className="btn ViewAddress"
                                data-bs-toggle="modal"
                                data-bs-target={`#ViewAddressModal${index}idx`}
                              >
                                View Address
                              </span>
                              <div className="rounded-3 shadow-lg text-start">
                                <div
                                  className="modal fade rounded shadow-lg"
                                  id={`ViewAddressModal${index}idx`}
                                  tabindex="-1"
                                  aria-labelledby="ViewAddressModalLabel"
                                  aria-hidden="true"
                                >
                                  <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h1
                                          className="modal-title fs-5"
                                          id="exampleModalLabel"
                                        >
                                          Client Address Details
                                        </h1>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                        ></button>
                                      </div>
                                      <div className="modal-body m-1">
                                        <div className="Model_content d-flex flex-column  py-3 px-5">
                                          <div>{lead.address}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                            {/* {lead.address} */}
                            <td className="align-middle">
                              {lead.nextFollowDate}
                            </td>
                            <td className="align-middle">{lead.status}</td>
                            <td className="align-middle">{lead.inquiryType}</td>
                            <td className="align-middle">
                              <span
                                onClick={() =>
                                  setLeadForm({
                                    ...leadForm,
                                    lead_Id: lead.lead_Id,
                                    ...lead,
                                  })
                                }
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target={`#example${index}Modal`}
                              >
                                Update
                              </span>
                            </td>
                            <td className="align-middle">
                              <span
                                onClick={() =>
                                  setLeadForm({
                                    ...leadForm,
                                    lead_Id: lead.lead_Id,
                                  })
                                }
                                className="btn btn-dark"
                                data-bs-toggle="modal"
                                data-bs-target={`#addFollowle${index}Modal`}
                              >
                                Schedule Next Meeting{" "}
                              </span>
                            </td>
                            <td className="align-middle">
                              <Link
                                to={`/HomePage/FollowUpPage/${lead.lead_Id}`}
                                className="btn btn-warning"
                              >
                                MOM
                              </Link>
                            </td>

                            {/* Modals */}

                            {/* Table Leads Data Update Model  */}
                            <div className="rounded-3 shadow-lg text-start">
                              <div
                                className="modal fade rounded shadow-lg"
                                id={`example${index}Modal`}
                                tabindex="-1"
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                              >
                                <div className="modal-dialog modal-dialog-centered">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h1
                                        className="modal-title fs-5"
                                        id="exampleModalLabel"
                                      >
                                        Update Leads Details
                                      </h1>
                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      ></button>
                                    </div>
                                    <div className="modal-body m-1">
                                      <div className="Model_content d-flex flex-column  py-3 px-5">
                                        <div>
                                          <form
                                            onSubmit={(e) =>
                                              handleUpdateLead(e, lead)
                                            }
                                          >
                                            {/* <div className="mb-3" >
                                      <label for="exampleFormControlInput1" className="form-label">Update Client Id</label>
                                      <input required value={lead.lead_Id}  type="text" className="form-control" id="exampleFormControlInput1" placeholder="Update Client Client Name" />
                                    </div> */}
                                            <div className="mb-3">
                                              <label
                                                for="exampleFormControlInput1"
                                                className="form-label"
                                              >
                                                Update Client Name
                                              </label>
                                              <input
                                                required
                                                type="text"
                                                value={lead.fullName}
                                                className="form-control"
                                                id="exampleFormControlInput1"
                                                placeholder="Update Client Name"
                                              />
                                            </div>
                                            <div className="mb-3">
                                              <label
                                                for="exampleFormControlInput1"
                                                className="form-label"
                                              >
                                                Update Mobile No.
                                              </label>
                                              <input
                                                required
                                                type="number"
                                                name="Mobile"
                                                value={leadForm.mobileNo}
                                                onChange={(e) =>
                                                  handleLeadForm(e, "mobileNo")
                                                }
                                                className="form-control"
                                                id="exampleFormControlInput1"
                                                placeholder="Update Client Number"
                                              />
                                              {error && (
                                                <p style={{ color: "red" }}>
                                                  Please enter a valid 10 digit
                                                  number.
                                                </p>
                                              )}
                                            </div>
                                            <div className="mb-3">
                                              <label
                                                for="exampleFormControlInput1"
                                                className="form-label"
                                              >
                                                Email ID
                                              </label>
                                              <input
                                                required
                                                type="Email"
                                                value={leadForm.email}
                                                onChange={(e) =>
                                                  handleLeadForm(e, "email")
                                                }
                                                className="form-control"
                                                id="exampleFormControlInput1"
                                                placeholder="Update Client Email ID"
                                              />
                                            </div>
                                            <div className="mb-3">
                                              <label
                                                for="exampleFormControlInput1"
                                                className="form-label"
                                              >
                                                Address
                                              </label>
                                              <input
                                                required
                                                type="address"
                                                value={leadForm.address}
                                                onChange={(e) =>
                                                  handleLeadForm(e, "address")
                                                }
                                                className="form-control"
                                                id="exampleFormControlInput1"
                                                placeholder="Update Client Address"
                                              />
                                            </div>
                                            <div>
                                              <label
                                                for="exampleDataList"
                                                className="form-label"
                                              >
                                                Update Inquiry type
                                              </label>
                                              <select
                                                required
                                                value={leadForm.inquiryType}
                                                onChange={(e) => {
                                                  handleLeadForm(
                                                    e,
                                                    "inquiryType"
                                                  );
                                                }}
                                                className="form-select form-select-sm"
                                                aria-label=".form-select-sm example"
                                              >
                                                <option disabled value="">
                                                  Open this select menu
                                                </option>
                                                <option value="Web Development">
                                                  Web Development
                                                </option>
                                                <option value="Digital Marketing">
                                                  Digital Marketing
                                                </option>
                                                <option value="Digital Marketing">
                                                  Whatsapp Marketing
                                                </option>
                                                <option value="SMO">SMO</option>
                                                <option value="SEO">SEO</option>
                                                <option value="SMM">SMM</option>
                                              </select>
                                            </div>
                                            <div className="btn btn-dark mt-3">
                                              <input
                                                type="submit"
                                                className="btn btn-dark"
                                              />
                                            </div>
                                            {/* <Link to='' className='btn btn-dark mt-3 '>Update</Link> */}
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                    {/* <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                              <button type="button" className="btn btn-primary">Save changes</button>
                            </div> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/*Leade Update Model Use  Link to update Button close */}

                            {/* Table Leads Data Follow Up Upcoming Model  */}
                            <div className="rounded-3 shadow-lg text-start">
                              <div
                                className="modal fade rounded shadow-lg"
                                id={`addFollowle${index}Modal`}
                                tabindex="-1"
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                              >
                                <div className="modal-dialog modal-dialog-centered">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h1
                                        className="modal-title fs-5"
                                        id="exampleModalLabel"
                                      >
                                        Add Upcoming Meeting Date
                                      </h1>
                                      <button
                                        type="button"
                                        className="btn-close twch wala"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      ></button>
                                    </div>
                                    <div className="modal-body m-1">
                                      <div className="Model_content d-flex flex-column  py-3 px-5">
                                        <div>
                                          <form onSubmit={hanldefollowUp}>
                                            <div className="mb-3">
                                              <label
                                                htmlFor="addLeadFormControlInput1"
                                                className="form-label"
                                              >
                                                Select Upcoming Meeting Date and
                                                Time
                                              </label>
                                              <input
                                                required
                                                name="date"
                                                type="datetime-local"
                                                value={leadForm.nextFollowDate}
                                                onChange={(e) =>
                                                  handleLeadForm(
                                                    e,
                                                    "nextFollowDate"
                                                  )
                                                }
                                                className="form-control"
                                                id="addLeadFormControlInput1"
                                              />
                                            </div>
                                            <div className="mb-3">
                                              <label
                                                for="phaseDataList"
                                                className="form-label"
                                              >
                                                Select Upcoming Meeting Phase
                                              </label>
                                              <select
                                                required
                                                value={leadForm.nextFollowPhase}
                                                onChange={(e) =>
                                                  handleLeadForm(
                                                    e,
                                                    "nextFollowPhase"
                                                  )
                                                }
                                                className="form-select form-select-sm"
                                                aria-label=".form-select-sm status"
                                              >
                                                <option disabled value="">
                                                  Open this select phase
                                                </option>
                                                <option value="Phase 1">
                                                  Phase 1
                                                </option>
                                                <option value="Phase 2">
                                                  Phase 2
                                                </option>
                                                <option value="Phase 3">
                                                  Phase 3
                                                </option>
                                                <option value="Phase 4">
                                                  Phase 4
                                                </option>
                                                <option value="Phase 5">
                                                  Phase 5
                                                </option>
                                                <option value="Phase 6">
                                                  Phase 6
                                                </option>
                                              </select>
                                            </div>
                                            <div className="mt-3">
                                              <input
                                                type="submit"
                                                className="btn btn-dark"
                                              />
                                            </div>
                                          </form>
                                          {/* <Link to='' className='btn btn-dark mt-3 '>Add</Link> */}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/*Leade Add Follow up  Model Use  Link to update Button close */}
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {/* pagination add  */}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default UserHome;

//CSS Styled Section use only low css styled

const Wrapper = styled.section`
  .ViewAddress:hover {
    color: #0008ff;
    border: 0.5px solid #0008ff;
  }
`;
