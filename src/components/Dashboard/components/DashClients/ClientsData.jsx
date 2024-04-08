import React, { useState, useEffect, useContext } from "react";
import useUser from "../../../../private/UseUser";
// import { format } from "date-fns";
export default function Clients() {
  const { setStatusMessage } = useUser();
  const [clientDetails, setClientDetails] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    getClientDetails();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("date_")) {
      const [day, month, year] = value.split("/").map((val) => parseInt(val, 10));
      const dateValue = new Date(year, month - 1, day);
      const formattedDate = dateValue.toISOString().split("T")[0];
      setEditingData((prevData) => ({
        ...prevData,
        [name]: formattedDate,
      }));
    } else {
      setEditingData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const getClientDetails = async () => {
    try {
      const response = await fetch("http://localhost:3006/clientdetails");
      if (!response.ok) {
        throw new Error("Error getting client details");
      }
      const clientData = await response.json();
      setClientDetails(clientData);
    } catch (error) {
      console.log(error.message, error);
    }
  };

  const handleEdit = (id) => {
    const client = clientDetails.find((item) => item.client_id === id);
    setEditingData(client);
    setEditingId(id);
  };



  const handleUpdate = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3006/clientdetails/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update client details");
      }
      setStatusMessage(["Client details updated", "success", true]);
      setEditingData(null);
setEditingId(null);
      getClientDetails(); // Fetch updated data
    } catch (error) {
      console.log(error.message, error);
      setStatusMessage(["Failed to update client details", "error"]);
    }
  };

  const handleCancelEdit = () => {
    setEditingData(null);
    setEditingId(null);
  };

  return (
    <div className="container">
      <p className="headline">Upload your client details here.</p>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Company Name</th>
              <th>Accreditation Board</th>
              <th>Certificate Issue</th>
              <th>1st Surveillance</th>
              <th>2nd Surveillance</th>
              <th>Re-Certificate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clientDetails.map((details) => (
              <tr key={details.client_id}>
                <td>{details.client_id}</td>
                <td>
                  {editingId === details.client_id ? (
                    <form onSubmit={() => handleUpdate(details.client_id)}>
                      <input
                        type="text"
                        name="companyname"
                        value={editingData?.companyname || ""}
                        onChange={handleInputChange}
                      />
                    </form>
                  ) : (
                    details.companyname
                  )}
                </td>
                <td>
                  {editingId === details.client_id ? (
                    <form onSubmit={() => handleUpdate(details.client_id)}>
                      <input
                        type="text"
                        name="accreditationboard"
                        value={editingData?.accreditationboard || ""}
                        onChange={handleInputChange}
                      />
                    </form>
                 ) : (
                    details.accreditationboard
                  )}
                </td>
                <td>
                  {editingId === details.client_id ? (
                    <form onSubmit={() => handleUpdate(details.client_id)}>
                     <input
  type="date"
  name={`date_certificateissuedate`}
  value={editingData?.certificateissuedate || ""}
  onChange={handleInputChange}
/>
                    </form>
                  ) : (
                    details.certificateissuedate
                  )}
                </td>
                <td>
                  {editingId === details.client_id ? (
                    <form onSubmit={() => handleUpdate(details.client_id)}>
                      <input
                        type="date"
                        name="firstsurveillancedate"
                        value={editingData?.firstsurveillancedate || ""}
                        onChange={handleInputChange}
                      />
                    </form>
                  ) : (
                    details.firstsurveillancedate
                  )}
                </td>
                <td>
                  {editingId === details.client_id ? (
                    <form onSubmit={() => handleUpdate(details.client_id)}>
                      <input
                        type="date"
                        name="secondsurveillancedate"
                        value={editingData?.secondsurveillancedate || ""}
                        onChange={handleInputChange}
                      />
                    </form>
                  ) : (
                    details.secondsurveillancedate
                  )}
                </td>
                <td>
                  {editingId === details.client_id ? (
                    <form onSubmit={() => handleUpdate(details.client_id)}>
                      <input
                        type="date"
                        name="recertificationdate"
                        value={editingData?.recertificationdate || ""}
                        onChange={handleInputChange}
                      />
                    </form>
                  ) : (
                details.recertificationdate
                  )}
                </td>
                <td>
                  {editingId === details.client_id ? (
                    <>
                      <button type="submit" formMethod="post">
                        Save
                      </button>
                      <button type="button" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(details.client_id)}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}