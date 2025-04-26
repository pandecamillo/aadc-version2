import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import default_evenement from "../data/default_evenement";
import axios from "axios";
import connection from "../data/connection";
import data_actualite from "../data/data_actualite";
import imageCompression from "browser-image-compression";
import { AuthContext } from "../context/authContext";
import MainLayout from "../layout/mainlayout";
import io from "socket.io-client";

const socket = io.connect(connection);

function PageActivitesAjout() {

  const { user } = useContext(AuthContext);
  let date = new Date();
  let dateNaturel = date.toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const openDialog = () => {
    document.getElementById("modal").showModal();
    document.getElementById("modal").style.opacity = '1'; 
    document.getElementById("modal").style.transform = 'scale(1)'; 
  };
  const closeDialog = () => {
    document.getElementById("modal").close();
    document.getElementById("modal").style.opacity = '0'; 
    document.getElementById("modal").style.transform = 'scale(0.7)'; 
  };

  const [evenement, setEvenement] = useState({
    idPublicateur: user.id,
    evenementTitre: "",
    evenementImage: default_evenement,
    evenementContenu: "",
    evenementDate: dateNaturel,
    valide: user && user.idFonction != null ? "oui" : "non",
  });

  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/activites");
  };
  const handleSubmit = async (event) => {
    if (evenement.evenementTitre == "" || evenement.evenementContenu == "") {
      openDialog()
      return;
    }
    event.target.disabled = true;
    try {
      await axios.post(connection + "/ajouter-evenement", evenement);
      socket.emit('evenement');
    } catch (error) {
      setServerError(true);
    }
    navigate("/activites");
  };

  const handleChange = (event) => {
    setEvenement((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  function convertToBase64(file, event) {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        setEvenement((prev) => ({ ...prev, evenementImage: reader.result }));
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function importData(event) {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = (_) => {
      // you can use this method to get file and perform respective operations
      let files = Array.from(input.files)[0];
      const options = {
        maxSizeMB: 0,
        maxWidthOrHeight: 180,
        useWebWorker: true,
        fileType: "image/png",
      };

      imageCompression(files, options).then((img) => {
        convertToBase64(img, event);
      });
    };
    input.click();
  }

  const [serverError, setServerError] = useState(false);
  if (serverError) {
    return (
      <div>
        <center style={{height:"80vh", display:"flex", flexDirection:"column", justifyContent:"center"}}>
          <h2>Vous etes hors ligne</h2>
          <br />
          <div  style={{fontWeight:"bold", fontSize:"1.2rem"}}>
            <button onClick={() => {
    navigate("/");
  }}>Réessayer</button>
          </div>
        </center>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="header-controls">
        <img src="../icon/back.png" className="back-btn" onClick={goToHome} />
      </div>
      <div  style={{ height:"80vh", overflowY:"scroll" }}>
        <section
          className="form-adhesion form-evenement"
          style={{
            overflowY: "scroll",
          }}
        >
          <center>
            <br />
            <div style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    maxWidth: "300px",
                  }}>
            {" "}
           
            <img
              onClick={importData}
              src={evenement.evenementImage || "../img/photo.png"}
              width={"100%"}
              style={{
                border: "black 2px solid",
                minHeight:"250px",
                maxHeight: "250px",
                objectFit:"cover",
                borderRadius:"0%"
              }}
              alt="profile"
              name="evenementImage"
            />
             <img
               onClick={importData}
              src="../icon/camera.png"
              alt="camera"
              style={{
                backgroundColor: "white",
                position: "absolute",
                width: "20%",
                height: "20%",
                borderRadius: "50%",
                padding: "0.3em",
                right: 0,
                bottom: 0,
                margin: "0.2em",
                border:"solid black"
              }}
            />
          </div></center>

          <div>
            <div className="zone">
              <label htmlFor="nom" style={{ textAlign: "left" }}>
                Titre :
              </label>
              <input
                type="text"
                name="evenementTitre"
                autoComplete="off"
                onChange={handleChange}
                maxLength={25}
              />
            </div>
            <div className="zone">
              <label htmlFor="nom" style={{ textAlign: "left" }}>
                Contenu :
              </label>
              <textarea
                name="evenementContenu"
                style={{
                  fontSize: "1.2rem",
                  width: "100%",
                  borderColor: "black",
                  fontWeight: "bold",
                }}
                autoComplete="off"
                cols="32"
                rows="6"
                onChange={handleChange}
                maxlength={500}
              ></textarea>
            </div>
          </div>
        </section>
        <center>
          <div
            className="confirm-btn"
            style={{
              width: "100%",
              margin: "auto",
              bottom: "0",
              marginBottom:"1em",
            }}
          >
            <button onClick={handleSubmit}>PUBLIER</button>
            <br />
            <br />
          </div>
        </center>
      </div>
      <dialog
          id="modal"
          style={{
            fontWeight: "bold",
            width: "90%",
            maxWidth: "500px",
          }}
        >
          <h3 style={{ textAlign: "center" }}>
            Veuillez remplir tous les champs
          </h3>
          <div
            className="choices"
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <button
              onClick={closeDialog}
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginTop: "1em",
                padding: "0.2em 1em",
              }}
            >
              OK
            </button>
          </div>
        </dialog>
    </MainLayout>
  );
}

export default PageActivitesAjout;

