import { useState, useEffect } from "react";
import useUser from "../../../../private/UseUser";

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

  const [clientdetails, setClientDetails] = useState([]);
  const [message, setMessage] = useState(["", "display-none"]);
  const [requireFetch, setRequireFetch] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fetch client details on initial load and when requireFetch changes
  useEffect(() => {
    if (requireFetch) {
      getClientDetails();
      setRequireFetch(false);
    }
  }, [requireFetch]);

  // Effect to handle message display and timer
  useEffect(() => {
    let timerId;
    if (message !== "") {
      timerId = setTimeout(() => {
        setMessage("");
      }, 4000);
    }
    return () => clearTimeout(timerId);
  }, [message]);

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
        console.log(companyInfo);
      }
    }
  };

  const getClientDetails = async () => {
    try {
      const response = await fetch("http://localhost:3006/clientdetails");
      if (!response.ok) {
        alert("Error fetching client details");
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

      setRequireFetch(true);
    } catch (error) {
      console.error("Error deleting client:", error);
      setMessage(["Failed to delete client", "error"]);
    }
  };

  // Filter client details based on search term
  const filteredClients = clientdetails.filter((client) =>
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="container">
        <p className="headline">Upload your client details here.</p>
        <form className="form-group">
          {/* Your form inputs */}
          <input
            type="text"
            className="form-control"
            placeholder="Search by company name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div className="table-responsive" style={{ maxHeight: "550px", overflowY: "scroll" }}>
          <table className="table table-striped">
            {/* Table headers */}
            <tbody className="tbody">
              {filteredClients.map((details) => (
                <tr key={details.client_id}>
                  {/* Table rows */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
