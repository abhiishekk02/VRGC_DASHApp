// import AppContext from "../../AppContext";
import { useMemo } from 'react';
import useUser from "../../../../private/UseUser";
import { useState, useEffect, useContext } from "react";
import "./DashShowCase.css";
import { Button, Modal, Form } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
export default function DashShowcase() {
  const [imgName, setImgName] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [message, setMessage] = useState(["",""]);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showcaseMode, setShowcaseMode] = useState(false);
  const [archiveData, setData] = useState([]);
  const [fetchData, setFetchData] = useState(false);
  const {setStatusMessage} = useUser()

  const handleToggle = () => {
    setShowcaseMode(!showcaseMode);
  };
// Fetching when data changed
  // useEffect(() => {
  //   fetchImages();
  //   fetchArchiveImages();

  //   setFetchData(false)
    
  // });
  useEffect(() => {
    let timeoutId;


    timeoutId = setTimeout(() => {
      setMessage('');
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message]); 

  // Upload
  const uploadImage = async (e) => {
    e.preventDefault();
    if (imgURL !== "" && imgURL.startsWith("https://")) {
      try {
        const urlExists = images.some((item) => item.img_url === imgURL);
        if (urlExists) {
          setMessage(["Image with this URL already exists.","error"]);
        } else {
          // const response = await fetch("http://localhost:3005/postImage", {
          const response = await fetch("http://localhost:3006/showcase", {

            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              img_name: imgName ? imgName : " ",
              img_url: imgURL,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to upload image");
          }

          setImgName("");
          setImgURL("");
          setStatusMessage(['Image Added','success', true])

          setMessage(["Image uploaded successfully","success"]);

          fetchImages();
        }
      } catch (error) {
        console.error("Error uploading image:", error.message);
        setMessage(["Failed to upload image. Please try again later.","error"]);
      }
    } else {
      setMessage(["Enter Valid Image URL","error"]);

    }
  };



// Fetching 
  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:3006/showcase");
      if (!response.ok) {
      setStatusMessage(['Failed to fetch images','error', true])

        throw new Error("Failed to fetch images");

      }
      const imageData = await response.json();
      setImages(imageData);

    } catch (error) {
      console.error("Error fetching images:", error);
      setMessage([["Failed to fetch images. Please try again later.","error"],"error"]);
    }
  };

  const fetchArchiveImages = async () => {
    try {
      const response = await fetch("http://localhost:3006/showcase/archive");
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const archiveData = await response.json();
      setData(archiveData);

    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

// Edit Image

  
const handleEditClick = (image) => {
  setSelectedImage(image);
  setShowModal(true); // Set showModal to true to open the modal
};


  const handleDelete = async (imageId) => {
    console.log(imageId);
    try {
      const response = await fetch(
        `http://localhost:3006/showcase/${imageId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      fetchImages();
      setStatusMessage(['Image deleted','success', true])
      setShowModal(false)


    } catch (error) {
      console.error("Error deleting image:", error);
      setMessage(["Failed to delete image. Please try again later.","error"]);
    }
  };

  const handleArchive = async (imageId) => {
    try {
      const response = await fetch(
        `http://localhost:3006/showcase/archive/${imageId}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to archive image");
      }else{
      setFetchData(true);

      }
      fetchImages();
      setStatusMessage(['Image archived','success', true])
      setShowModal(false)

    } catch (error) {
      console.error("Error archiving image:", error);
      setMessage(["Failed to archive image. Please try again later.","error"]);
    }
  };

  const handleSaveChanges = async (imageId, newName, newUrl) => {
    console.log(imageId, newName, newUrl)
    try {
      const response = await fetch(
        `http://localhost:3006/showcase/${imageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newName,
            newUrl,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save changes");
      }
      fetchImages();
      setShowModal([false, "close"]);
      setStatusMessage(['Image changes saved','success', true])
    setShowModal(false);


    } catch (error) {
      console.error("Error saving changes:", error);
      setMessage(["Failed to save changes. Please try again later.","error"]);
    }
  };

  

 

  // UnArchive
  const handleUnArchive = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3006/showcase/unarchive/${id}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        setShowModal(false);

        throw new Error("Failed to archive image");

      } else {
        // If un-archiving is successful, fetch the updated list of archived images
        setShowModal(false);

        fetchArchiveImages();
        setFetchData(true)
      setStatusMessage(['Image unarchived','success', true])

      }
    } catch (error) {
      console.error("Error archiving image:", error);
      setStatusMessage(['Error archiving image','error', true])

    }
  };
  useEffect(() => {
    fetchImages();
    fetchArchiveImages();
    setFetchData(false);
  }, [fetchData]);
  

  
// Truncate URL
  function truncateUrl(url) {
    const maxLength = 30;
    return url.length > maxLength
      ? url.substring(0, maxLength - 3) + "..."
      : url;
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null); // Reset selected image when modal is closed
  };
  
  

  return (
    <>
      <div className="container">
        <p className="headline ">Upload your showcase images here.</p>
        <Form className="imageUploadForm row" onSubmit={uploadImage}>
          <div className="">
            <input
              className="col-md-4 "
              onChange={(e) => setImgName(e.target.value)}
              value={imgName}
              type="text"
              placeholder="Image Name"
            />
            <input
              className="col-md-4 "
              onChange={(e) => setImgURL(e.target.value)}
              value={imgURL}
              type="text"
              placeholder="Image URL"
            />
            <button className="col-md-1 btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </Form>
        {/*  */}
        <div className="container">

        {message && <p className={`${message[1]} m-4`} >{message[0]}</p>}
        </div>

        <div className="modeSwitch col-md-12">
          <div className="form-switch-container">
            <label
              className="form-switch-label"
              style={{
                fontWeight: showcaseMode ? "normal" : "normal",
                color: showcaseMode ? "gray" : "black",
                padding: "0.5rem",
              }}
            >
              Showcase Images
            </label>
            <label
              className="form-switch form-switch-outer"
              style={{ justifyContent: "center" }}
            >
              <input
                className="form-check-input form-switch-input"
                type="checkbox"
                id="toggleSwitch"
                checked={showcaseMode}
                onChange={handleToggle}
              />
              <span className="form-switch-slider" />
            </label>
            <label
              className="form-switch-label"
              style={{
                fontWeight: showcaseMode ? "normal" : "normal",
                color: showcaseMode ? "black" : "gray",
                padding: "0.5rem",
              }}
            >
              Archived Images
            </label>
          </div>
        </div>
        {!showcaseMode ? (
          <div
          className="table-responsive"
          style={{ maxHeight: "550px", overflowY: "scroll" }}
        >
          <table className="table">
            <thead className="sticky-top bg-light thead">
              <tr>
                <th>ID</th>
                <th>Image Name</th>
                <th>Image Preview</th>
                <th>Image URL</th>
                <th>Date</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {images.map((image) => (
                <tr key={image.img_id}>
                  <td>{image.img_id}</td>

                  <td>{image.img_name}</td>
                  <td>
                    <img 
                      src={image.img_url}
                      alt={image.img_name}
                      style={{
                        width: "60px",
                        height: "auto",
                        aspectRatio: "3/2",
                        objectFit:'cover'
                      }}
                    />
                  </td>
                  <td>
                    <a
                      href={image.img_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={image.img_url}
                    >
                      {truncateUrl(image.img_url)}
                    </a>
                  </td>
                  <td>{image.date}</td>
                  <td>{image.time}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleEditClick(image)}
                    >
                      Edit
                    </Button>

                    <Modal
                      show={showModal}
                      className={`modal-backdrop-blur-${showModal} `}
                      onHide={handleCloseModal}
                      centered >
                      <Modal.Header closeButton>
                        <Modal.Title>Edit Image</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form.Group>
                          <Form.Label className="modal-label">Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={selectedImage ? selectedImage.img_name : ""}
                            onChange={(e) =>
                              setSelectedImage({
                                ...selectedImage,
                                img_name: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label className="modal-label">Image URL</Form.Label>
                          <Form.Control
                            type="text"
                            value={selectedImage ? selectedImage.img_url : ""}
                            onChange={(e) =>
                              setSelectedImage({
                                ...selectedImage,
                                img_url: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(selectedImage.img_id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="warning"
                          onClick={() => handleArchive(selectedImage.img_id)}
                        >
                          Archive
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleSaveChanges(
                              selectedImage.img_id,
                              selectedImage.img_name,
                              selectedImage.img_url
                            )
                          }
                        >
                          Save Changes
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       
        ):(
<div className="table-responsive"
style={{ maxHeight: "550px", overflowY: "scroll" }}
>
<table className="table">
  <thead className="sticky-top bg-light thead">
    <tr>
      <th>ID</th>
      <th>Image Name</th>
      <th>Image Preview</th>
      <th>Image URL</th>
      <th>Date</th>
      <th>Time</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {archiveData.map((image, index) => (
      <tr key={`${image.img_id}-${index}`}>
        <td>{image.img_id}</td>
        <td>{image.img_name}</td>
        <td>
          <img
            src={image.img_url}
            alt={image.img_name}
            style={{
              width: "60px",
              height: "auto",
              aspectRatio: "3/2",
              objectFit:'cover'
            }}
          />
        </td>
        <td>
          <a
            href={image.img_url}
            target="_blank"
            rel="noopener noreferrer"
            title={image.img_url}
          >
            {truncateUrl(image.img_url)}
          </a>
        </td>
        <td>{image.date}</td>
        <td>{image.time}</td>
        <td>
          <Button
            variant="success"
            onClick={() => handleUnArchive(image.img_id)}
          >
            <i className="bi bi-escape"></i>

          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>
        )}
      </div>

        
    </>
  );
}
