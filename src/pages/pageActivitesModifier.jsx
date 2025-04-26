import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import default_evenement from "../data/default_evenement";
import axios from "axios";
import connection from "../data/connection";
import data_actualite from "../data/data_actualite";
import imageCompression from "browser-image-compression";
import MainLayout from "../layout/mainlayout";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Actualite from "../components/actualite";
import io from "socket.io-client";

const socket = io.connect(connection);

function PageActivitesModifier() {
  
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  let locationActualiteId = parseInt(location.pathname.split("/")[2]);
  const {user} = useContext(AuthContext);
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
    idPublicateur: 0,
    titre: "",
    image: "",
    contenu: "",
    date: dateNaturel,
    valide: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          connection + "/lire-evenement/" + locationActualiteId
        );
        setEvenement(res.data);
        setLoading(false);
      } catch (error) {
        setServerError(true);
      }
    };
    fetchData();
  }, []);
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/activites");
  };
  const goToEvent = () => {
    navigate("/actualite/" + locationActualiteId);
  };
  const handleSubmit = async (event) => {
    if (evenement.titre == "" || evenement.contenu == "") {
      openDialog()
      return;
    }
    evenement.valide = user.idFonction != null ? "oui" : "non";
    evenement.date = dateNaturel;
    event.target.disabled = true;
    try {
      await axios.put(
        connection + "/modifier-evenement/" + locationActualiteId,
        evenement
      );
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
        setEvenement((prev) => ({ ...prev, image: reader.result }));
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
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <center
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "30vh",
            }}
          >
            <img className="wait" src="../img/wait.gif" alt="wait" />
          </center>
        </div>
      ) : (
        <>
          <div className="header-controls">
            <img
              src="../icon/back.png"
              className="back-btn"
              onClick={goToEvent}
            />
          </div>
          <div  style={{ height:"80vh", overflowY:"scroll" }}>
            <section
              className="form-adhesion form-evenement"
              style={{
                overflowY: "scroll", margin:"auto",
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
              src={evenement.image || "../img/photo.png"}
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
                    name="titre"
                    onChange={handleChange}
                    value={evenement.titre}
                    maxlength={25}
                    autoComplete="off"
                  />
                </div>
                <div className="zone">
                  <label htmlFor="nom" style={{ textAlign: "left" }}>
                    Contenu :
                  </label>
                  <textarea
                    name="contenu"
                    autoComplete="off"
                    value={evenement.contenu}
                    onChange={handleChange}
                    style={{
                      fontSize: "1.2rem",
                      width: "100%",
                      borderColor: "black",
                      fontWeight: "bold",
                    }}
                    cols="32"
                    rows="6"
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
        </>
      )}
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

export default PageActivitesModifier;
