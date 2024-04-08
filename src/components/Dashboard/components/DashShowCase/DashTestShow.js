import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

export default function Certificates() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const handleEditClick = (certificate) => {
    setSelectedCertificate(certificate);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Remove modal-open class and backdrop
    document.body.classList.remove("modal-open");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  };

  const handleSaveChanges = () => {
    // Handle saving changes here
    // Example: Update certificate data and close modal
    console.log("Saving changes...");
    handleCloseModal();
  };

  return (
    <>
      {/* Your other components */}
      <Button onClick={() => handleEditClick(/* pass certificate data here */)}>
        Open Modal
      </Button>

      {/* Modal component */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Certificate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Simplified form inside the modal */}
          <Form>
            {/* Example form fields */}
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>
            {/* Add other form fields as needed */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
