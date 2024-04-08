import { useState, useEffect } from "react";
// import AppContext from "../../AppContext";
import useUser from "../../../../private/UseUser";
import "./DashClients.css";
import { Modal, Button } from "react-bootstrap";
export default function Clients(params) {
  const { setStatusMessage } = useUser();

  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    accreditationBoard: "",
    certificateIssueDate: "",
    firstSurveillanceDate: "",
    secondSurveillanceDate: "",
    reCertificationDate: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [clientdetails, setClientDetails] = useState("");
  const [message, setMessage] = useState(["", "display-none"]);
  const [requireFetch, setRequireFetch] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editedCompanyInfo, setEditedCompanyInfo] = useState({
    companyName: "",
    accreditationBoard: "",
    status: "",
    id: "",
  });

  const handleSaveChanges = async (
    companyName,
    accreditationBoard,
    status,
    id
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3006/clientdetails/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName,
            accreditationBoard,
            status,
            id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }
      getClientDetails();
      setShowModal(false);
      setStatusMessage(["Client details changes saved", "success", true]);
      // setShowModal(false);
    } catch (error) {
      console.error("Error saving changes:", error);
      setMessage(["Failed to save changes. Please try again later.", "error"]);
    }
  };

  const handleEditModalOpen = (company) => {
    setShowModal(true);
    setEditedCompanyInfo({
      companyName: company.companyName,
      accreditationBoard: company.accreditationBoard,
      status: company.status,
      id: company.client_id,
    });
  };

  const handleEditModalClose = () => {
    setShowModal(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedCompanyInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    let timerId;
    if (message !== "") {
      timerId = setTimeout(() => {
        setMessage("");
      }, 4000);
    }
    return () => clearTimeout(timerId);
  }, [message]);
  useEffect(() => {
    if (requireFetch) {
      getClientDetails();
      setRequireFetch(false);
    }
  }, [requireFetch]);

  const postClientDetails = async (e) => {
    e.preventDefault();
    if (companyInfo.companyName === "") {
      setMessage(["Please fill the details before submitting.", "error"]);
    } else {
      try {
        const response = await fetch("http://localhost:3006/clientdetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },

          body: JSON.stringify(companyInfo),
        });
        if (!response.ok) {
          setMessage(["Failed to post client details", "error"]);
          throw new Error("Failed to post client details.");
        }
        const data = await response.json();
        setMessage(["Client details entered successfully", "success"]);
        setStatusMessage(["Client details entered", "success", true]);
        setRequireFetch(true);
        setCompanyInfo({
          companyName: "",
          accreditationBoard: "",
          certificateIssueDate: "",
          firstSurveillanceDate: "",
          secondSurveillanceDate: "",
          reCertificationDate: "",
        });
      } catch (error) {
        console.log(error.message, error);
      }
    }
  };

  const getClientDetails = async () => {
    try {
      const response = await fetch("http://localhost:3006/clientdetails");
      if (!response.ok) {
        alert("Error to get client details");
      }
      const clientData = await response.json();
      setClientDetails(clientData);
    } catch (error) {
      console.log(error.message, error);
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this client?"
      );

      if (!confirmDelete) {
        return;
      }

      const response = await fetch(
        `http://localhost:3006/clientdetails/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ client_id: id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete client");
      }

      setStatusMessage(["Client deleted", "success", true]);
      setMessage(["Client deleted successfully", "success"]);
      setShowModal(false);
      setRequireFetch(true);
    } catch (error) {
      console.error("Error deleting client:", error);

      setMessage(["Failed to delete client", "error"]);
    }
  };

  return (
    <>
      <div className="container">
        <p className="headline">Upload your client details here.</p>
        <form className="form-group">
          <div className="row clients-form  d-flex ">
            <div className="col-md-4">
              <label>Company Name:</label>
              <input
                type="text"
                name="companyName"
                className="form-control"
                value={companyInfo.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>

            <div className="col-md-4">
              <label>Accreditation Board:</label>

              <input
                type="text"
                name="accreditationBoard"
                value={companyInfo.accreditationBoard}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter board"
              />
            </div>

            <div className="col-md-4">
              <label>Certificate Issue Date:</label>
              <input
                type="date"
                name="certificateIssueDate"
                value={companyInfo.certificateIssueDate}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-4">
              <label>1st Surveillance Date:</label>
              <input
                type="date"
                name="firstSurveillanceDate"
                value={companyInfo.firstSurveillanceDate}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-4">
              <label>2nd Surveillance Date:</label>
              <input
                type="date"
                name="secondSurveillanceDate"
                value={companyInfo.secondSurveillanceDate}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-4">
              <label>Re-Certification Date:</label>
              <input
                type="date"
                name="reCertificationDate"
                value={companyInfo.reCertificationDate}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="certificate-upload">
              <button
                onClick={postClientDetails}
                className="col-md-1 certificate-upload-btn btn btn-primary"
                type="submit"
              >
                Submit
              </button>
            </div>
            {message && <p className={`${message[1]} `}>{message[0]}</p>}
          </div>
        </form>

        <form className="form-group d-flex">
          <div className="row w-100">
            <div className="col-md-4">
              {/* <p className="drop-down">Search</p> */}
              {/* <select
                className="form-select"
                value={searchOption}
                onChange={(e) => setSearchOption(e.target.value)}
              >
                <option value="companyName">Company Name</option>
                <option value="reCertificationDate">
                  Re-Certification Date
                </option>
              </select> */}
            </div>
            <div className="col-md-8  mx-0 px-0 justify-content-end d-flex">
              <div className="input-group  w-50">
                <span className="input-group-text" id="basic-addon1">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control search-bar"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </form>

        <div
          className="table-responsive"
          style={{ maxHeight: "550px", overflowY: "scroll" }}
        >
          <table className="table table-striped ">
            <thead className="sticky-top bg-light thead">
              <tr>
                <th>ID</th>
                <th>Company Name</th>
                <th>Accreditation Board</th>
                <th>Certificate Issue</th>
                <th>1st Surveillance</th>
                <th>2nd Surveillance</th>
                <th>Re-Certificate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {clientdetails &&
                clientdetails
                  .filter((client) =>
                    client.companyName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((details) => (
                    <tr key={details.client_id}>
                      <td>{details.client_id}</td>
                      <td>{details.companyName}</td>
                      <td>{details.accreditationBoard}</td>
                      <td>{details.certificateIssueDate}</td>
                      <td>{details.firstSurveillanceDate}</td>
                      <td>{details.secondSurveillanceDate}</td>
                      <td>{details.reCertificationDate}</td>
                      <td>{details.status}</td>

                      <td>
                        {/* <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteClient(details.client_id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button> */}
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEditModalOpen(details)}
                          >
                            Edit
                          </button>
                        </td>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleEditModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Company Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Company Name:</label>
              <input
                type="text"
                name="companyName"
                value={editedCompanyInfo.companyName}
                onChange={handleEditChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Accreditation Board:</label>
              <input
                type="text"
                name="accreditationBoard"
                value={editedCompanyInfo.accreditationBoard}
                onChange={handleEditChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select
                name="status"
                value={editedCompanyInfo.status}
                onChange={handleEditChange}
                className="form-select"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteClient(editedCompanyInfo.id)}
          >
            Delete
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              handleSaveChanges(
                editedCompanyInfo.companyName,
                editedCompanyInfo.accreditationBoard,
                editedCompanyInfo.status,
                editedCompanyInfo.id
              )
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
