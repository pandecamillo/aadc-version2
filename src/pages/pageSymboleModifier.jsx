import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import default_evenement from "../data/default_evenement";
import axios from "axios";
import connection from "../data/connection";
import data_actualite from "../data/data_actualite";
import imageCompression from "browser-image-compression";
import { AuthContext } from "../context/authContext";
import MainLayout from "../layout/mainlayout";
import io from "socket.io-client";

const socket = io.connect(connection);

function PageSymboleModifier() {

  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [typeMembreSelect, setTypeMembreSelect] = useState([]);
  let locationActualiteId = parseInt(location.pathname.split("/")[2]);

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

  const [symbole, setSymbole] = useState({
    libelle: "",
    idTypeMembre: "",
    montant: "",
  });


  const fetchSymbole = async () => {
    try {
      const res = await axios.get(connection + "/lire-symbole/"+ locationActualiteId);
      setSymbole(res.data);
      setLoading(false);
    } catch (error) {
      setServerError(true);
    }
  };


  const fetchTypeMembres = async () => {
    try {
      const res = await axios.get(connection + "/lire-type-membre");
      setTypeMembreSelect(res.data);
      setLoading(false);
    } catch (error) {
      setServerError(true);
    }
  };


  useEffect(() => {
    fetchTypeMembres();
    fetchSymbole();
  }, []);

  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/symboles");
  };
  const handleSubmit = async (event) => {
    if (symbole.libelle == "" || symbole.idTypeMembre == "" || symbole.montant == "") {
      openDialog()
      return;
    }
    event.target.disabled = true;
    try {
      let response = await axios.post(connection + "/modifier-symbole", symbole);
      setSymbole(response.data)
    } catch (error) {
      setServerError(true);
    }
    socket.emit('symbole');
    navigate("/symboles");
  };

  const handleChange = (event) => {
    setSymbole((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  let listTypeMembreSelect = [];
  typeMembreSelect &&
    typeMembreSelect.forEach((value) => {
      if (value.id) {
        listTypeMembreSelect.push(
          <option key={value.id} value={value.id}>
            {value.libelle}
          </option>
        );
      }
    });

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

  console.log(symbole)

  return (
    <MainLayout>
        <div className="header-controls">
        <img src="../icon/back.png" className="back-btn" onClick={goToHome} />
      </div>
     {loading ?(
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
     ):(<>
      <div style={{ display: "flex", flexDirection: "column", height: "78vh" }}>
        <section
          className="form-adhesion form-evenement"
          style={{
            overflowY: "scroll",
          }}    
      >
        <div className="zone">
              <label htmlFor="libelle">Libelle :</label>
              <input
                type="text"
                name="libelle"
                autoComplete="off"
                onChange={handleChange}
                value={symbole.libelle}
                maxlength={20}
              />
            </div>
            <div className="zone">
              <label htmlFor="adresse">Type de membre :</label>

              <select
                name="idTypeMembre"
                id="typeMembre"
                onChange={handleChange}
                value={symbole.idTypeMembre}
              >
                <option value=""></option>
                {listTypeMembreSelect}
              </select>
            </div>
            <div className="zone">
              <label htmlFor="adresse">Montant en FC :</label>
              <input
                type="number"
                name="montant"
                onChange={handleChange}
                value={symbole.montant}
                min="0"
                max="100000"
              />
            </div>
        </section>
        <center>
          <div
            className="confirm-btn"
            style={{
              width: "100%",
              margin: "auto",
              bottom: "0",
            }}
          >
            <button onClick={handleSubmit}>MODIFIER</button>
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
     </>)}
    </MainLayout>
  );
}

export default PageSymboleModifier;

// <center>
//           <div className="actualite-header">
//             <div className="title">
//               <img src="../icon/back.png" alt="back" onClick={goToHome} />
//               <h1>Nouveau</h1>
//             </div>
//           </div>
//           <br />
//           <section className="form-adhesion">
//             <center>
//               <div
//                 style={{
//                   position: "relative",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   width: "80%",
//                 }}
//               >
//                 <img
//                   onClick={importData}
//                   src={evenement.evenementImage}
//                   alt="evenement"
//                   width={"100%"}
//                   height={150}
//                   style={{ border: "black solid 2px" }}
//                 />
//                 <img
//                   src="../icon/camera.png"
//                   alt="camera"
//                   style={{
//                     backgroundColor: "white",
//                     position: "absolute",
//                     width: "20%",
//                     maxWidth: "50px",
//                     borderRadius: "50%",
//                     padding: "0.3em",
//                     right: 0,
//                     bottom: 0,
//                     border: "black solid",
//                     margin: "0.2em",
//                   }}
//                 />
//               </div>
//             </center>
//             <br /> <br />
//             <input
//               type="text"
//               style={{ fontSize: "1.2rem", width: "80%", borderColor: "black" }}
//               placeholder="Entrez le titre"
//               name="evenementTitre"
//               onChange={handleChange}
//             />
//             <br /> <br />

//             <br /> <br />
//             <center>
//               <button
//                 style={{
//                   fontSize: 30,
//                   padding: "0em 1em",
//                   fontWeight: "bold",
//                   border: "black 2px solid",
//                 }}
//                 onClick={handleSubmit}
//               >
//                 PUBLIER
//               </button>
//             </center>
