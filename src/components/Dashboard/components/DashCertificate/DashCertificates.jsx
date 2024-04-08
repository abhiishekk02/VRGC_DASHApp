import { useState, useEffect } from "react";

import useUser from "../../../../private/UseUser"
import { Button, Modal, Form } from "react-bootstrap";
import "./DashCertificate.css"
export default function Certificates(params) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    standard: "",
    status: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [message, setMessage] = useState(["", ""]);
  const [cDetails, setC_Details] = useState([]);
  const { setStatusMessage } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
   
    fetchCertificateDetails(); 
  }, []);
  useEffect(() => {
    let timerId;
    if (message !== "") {
      timerId = setTimeout(() => {
        setMessage("");
      }, 4000);
    }
    return () => clearTimeout(timerId);
  }, [message]);

 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};


  const handleEditClick = (certificate) => {
    setSelectedCertificate(certificate);
    setShowModal(true);
  };

  const handleSaveChanges = async (id) => {
    try {
      console.log("formData before fetch:", formData);
      const response = await fetch(`http://localhost:3006/certificate/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedCertificate),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save changes");
      }
      fetchCertificateDetails(); 
      setShowModal(false);
      setStatusMessage(["Certificate changes saved", "success", true]);
    } catch (error) {
      console.error("Error saving changes:", error);
      setMessage(["Failed to save changes. Please try again later.", "error"]);
    }
  };
  

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (formData.name==="" ){
      setMessage(["Please fill in all fields before submitting", "error"]);
      return; 
    }

    
    try {
      const response = await fetch("http://localhost:3006/certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to post certificate details");
      }
      fetchCertificateDetails(); 
      setMessage(["Certificate details posted successfully", "success"]);
      setStatusMessage(["Certificate added", "success", true]);
      setFormData({
        name: "",
        email: "",
        number: "",
        standard: "",
        status: "",
      });
      console.log(formData)
    } catch (error) {
      console.error("Error posting certificate details:", error);
      setMessage([
        "Failed to post certificate details. Please try again later.",
        "error",
      ]);
    
  }
  };

  const fetchCertificateDetails = async () => {
    try {
      const response = await fetch("http://localhost:3006/certificate");
      if (!response.ok) {
        throw new Error("Failed to fetch certificate details");
      }
      const data = await response.json();
      setC_Details(data);

    } catch (error) {
      console.error("Error fetching certificate details:", error);
      setMessage([
        "Failed to fetch certificate details. Please try again later.",
        "error",
      ]);
    }
  };

  const deleteCertificateDetail = async (id) => {
    try {
      const response = await fetch(`http://localhost:3006/certificate/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete certificate detail");
      }
      fetchCertificateDetails(); 
      setShowModal(false);
      setStatusMessage(["Certificate deleted", "success", true]);
    } catch (error) {
      console.error("Error deleting certificate detail:", error);
      setMessage([
        "Failed to delete certificate detail. Please try again later.",
        "error",
      ]);
    }
  };

  return (
    <>
      <div className="container">
        <p className="headline">Upload your certificate details here.</p>
        <form onSubmit={handleSubmit} className="form-group">
          <div className="row certificate-form form-group">
            <div className="col-md-4">
              <label>Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                className="form-control"
                placeholder="Enter name:"
              />
            </div>
            <div className="col-md-4">
              <label>Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="form-control"
                placeholder="Enter email:"
              />
            </div>
            <div className="col-md-4">
              <label>Certificate Number</label>
              <input
                name="number"
                value={formData.number}
                onChange={handleChange}
                type="number"
                className="form-control"
                placeholder="Enter certificate number:"
              />
            </div>
            <div className="col-md-4">
              <label>Standard:</label>
              <input
                name="standard"
                value={formData.standard}
                onChange={handleChange}
                type="text"
                className="form-control"
                placeholder="Enter standard:"
              />
            </div>
            <div className="col-md-4">
              <label>Status</label>
              <input
                name="status"
                value={formData.status}
                onChange={handleChange}
                type="text"
                className="form-control"
                placeholder="Enter status:"
              />
            </div>
          </div>
          <div className="certificate-upload">
            <button
              className="col-md-1 certificate-upload-btn btn btn-primary"
              type="submit"
            >
              Submit
            </button>
          </div>
          </form>

<div className="row">

<div className="col-md-4">
{message && <p className={`${message[1]}`}>{message[0]}</p>}

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
          
        {/* Certificate details table */}
        <div
          className="table-responsive"
          style={{ maxHeight: "550px", overflowY: "scroll" }}
        >
          <table className="table">
            <thead className="sticky-top bg-light thead">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Certificate Number</th>
                <th>Standard</th>
                <th>Status</th>
                {/* <th>Time</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="tbody">
           
              {cDetails && cDetails.filter((data) => data.name.toLowerCase().includes(searchTerm.toLowerCase())).map((data) => (
                <tr key={data.certificate_id}>
                  <td>{data.certificate_id}</td>

                  <td>{data.name}</td>
                  <td>{data.certificate_number}</td>
                  <td>{data.standard}</td>
                  <td>{data.status}</td>
                  {/* <td>{data.time}</td> */}
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleEditClick(data)}
                    >
                    Edit
                    </Button>
                   

                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {selectedCertificate && (
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Edit Certificate</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form.Group>
      <Form.Label className="modal-label">Name</Form.Label>
      <Form.Control
        type="text"
        value={selectedCertificate ? selectedCertificate.name : ""}
        onChange={(e) =>
          setSelectedCertificate({
            ...selectedCertificate,
            name: e.target.value,
          })
        }
      />
    </Form.Group>
    <Form.Group>
      <Form.Label className="modal-label">Email</Form.Label>
      <Form.Control
        type="email"
        value={selectedCertificate ? selectedCertificate.email : ""}
        onChange={(e) =>
          setSelectedCertificate({
            ...selectedCertificate,
            email: e.target.value,
          })
        }
      />
    </Form.Group>
    <Form.Group>
      <Form.Label className="modal-label">Certificate Number</Form.Label>
      <Form.Control
        type="number"
        value={selectedCertificate ? selectedCertificate.certificate_number : ""}
        onChange={(e) =>
          setSelectedCertificate({
            ...selectedCertificate,
            number: e.target.value,
          })
        }
        
      />
    </Form.Group>
    <Form.Group>
      <Form.Label className="modal-label">Standard</Form.Label>
      <Form.Control
        type="text"
        value={selectedCertificate ? selectedCertificate.standard : ""}
        onChange={(e) =>
          setSelectedCertificate({
            ...selectedCertificate,
            standard: e.target.value,
          })
        }
      />
    </Form.Group>
    <Form.Group>
      <Form.Label className="modal-label">Status</Form.Label>
      <Form.Control
        type="text"
        value={selectedCertificate ? selectedCertificate.status : ""}
        onChange={(e) =>
          setSelectedCertificate({
            ...selectedCertificate,
            status: e.target.value,
          })
        }
      />
    </Form.Group>
  </Modal.Body>
  <Modal.Footer>
    <Button
      variant="danger"
      onClick={() => deleteCertificateDetail(selectedCertificate.certificate_id)}
    >
      Delete
    </Button>
    <Button
      variant="primary"
      onClick={() =>
        handleSaveChanges(
          selectedCertificate.certificate_id,
          selectedCertificate.name,
          selectedCertificate.email,
          selectedCertificate.number,
          selectedCertificate.standard,
          selectedCertificate.status
        )
      }
    >
      Save Changes
    </Button>
        </Modal.Footer>
</Modal>
          )}

      </div>
    </>
  );
}