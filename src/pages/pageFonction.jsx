import { useNavigate } from "react-router-dom";
import Actualite from "../components/actualite";
import data_actualite from "../data/data_actualite";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import connection from "../data/connection";
import MainLayout from "../layout/mainlayout";
import default_evenement from "../data/default_evenement";
import io from "socket.io-client";

const socket = io.connect(connection);

function PageFonction() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [symboles, setSymboles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fonctionFormData, setFonctionFormData] = useState({
    id: 0,
    libelle: "",
  });

  const handleChange = (event) => {
    setFonctionFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const openDialog = () => {
    document.getElementById("modal").showModal();
    document.getElementById("modal").style.opacity = '1'; 
    document.getElementById("modal").style.transform = 'scale(1)'; 
  };

  const closeDialog = () => {
    setFonctionFormData((prev) => ({
      ...prev,
      id: 0,
      libelle: "",
    }));
    document.getElementById("modal").close();
  };

  const closeDialog2 = () => {
    setFonctionFormData((prev) => ({
      ...prev,
      id: 0,
      libelle: "",
    }));
    document.getElementById("modal2").close();
    document.getElementById("modal2").style.opacity = '0'; 
    document.getElementById("modal2").style.transform = 'scale(0.7)'; 
  };

  const openDialog2 = (idSymbole) => {
    let symbole = symboles.find((symbole) => symbole.id == idSymbole);
    setFonctionFormData((prev) => ({
      ...prev,
      photo: default_evenement,
      id: symbole.id,
      libelle: symbole.libelle,
    }));
    document.getElementById("modal2").showModal();
    document.getElementById("modal2").style.opacity = '1'; 
    document.getElementById("modal2").style.transform = 'scale(1)'; 
  };

  const closeDialog3 = () => {
    setFonctionFormData((prev) => ({
      ...prev,
      id: 0,
      libelle: "",
    }));
    document.getElementById("modal3").close();
    document.getElementById("modal3").style.opacity = '0'; 
    document.getElementById("modal3").style.transform = 'scale(0.7)'; 
  };

  const openDialog3 = (symboleId) => {
    let symbole = symboles.find((symbole) => symbole.id == symboleId);
    setFonctionFormData((prev) => ({
      ...prev,
      id: symbole.id,
      libelle: "",
    }));
    document.getElementById("modal3").showModal();
    document.getElementById("modal3").style.opacity = '1'; 
    document.getElementById("modal3").style.transform = 'scale(1)'; 
  };

  const add = async (event) => {
    if (fonctionFormData.libelle == "") {
      return;
    }
    event.target.disabled = true;
    try {
      // tester si la fonction là existe à partir du libelle
      let response = await axios.post(
        connection + "/ajouter-fonction",
        fonctionFormData
      );
    } catch (error) {
      setServerError(true);
    }
    closeDialog();
    fetchSymboles();
    socket.emit('fonction');
    event.target.disabled = false;
  };

  const edit = async (event) => {
    if (
      fonctionFormData.libelle == "" ||
      fonctionFormData.montant == "" ||
      fonctionFormData.idTypeMembre == ""
    ) {
   
      return;
    }
    event.target.disabled = true;
    try {
      let response = await axios.post(
        connection + "/modifier-fonction",
        fonctionFormData
      );
    } catch (error) {
      setServerError(true);
    }
    event.target.disabled = false;
    closeDialog2();
    fetchSymboles();
    socket.emit('fonction');
  };

  const remove = async (event) => {
    event.target.disabled = true;
    try {
      let res = await axios.delete(
        connection + "/supprimer-fonction/" + fonctionFormData.id
      );
    } catch (error) {
      setServerError(true);
    }
    event.target.disabled = false;
    closeDialog3();
    fetchSymboles();
    socket.emit('fonction');
  };

  const fetchSymboles = async () => {
    try {
      const res = await axios.get(connection + "/lire-fonction");
      setSymboles(res.data);
      setLoading(false);
    } catch (error) {
      setServerError(true);
    }
  };

  useEffect(() => {
    if(!user || user && user.idFonction == null){
      alert("AADC : vous n'êtes pas autorisé à accèder à cette information")
      navigate("/home");
      return
    }
    fetchSymboles();
  }, []);

  socket.on("fonction", () => {
    fetchSymboles();
  });

  let listeSymboles = [];
  listeSymboles =
    symboles &&
    symboles.map((symbole) => {
      if (symbole.id) {
        if (
          user.idFonction == null &&
          user.idTypeMembre != symbole.idTypeMembre
        )
          return;
        return (
          <div className="symbole fonction">
            <h2 className="libelle" style={{ textTransform: "capitalize" }}>
              {symbole.libelle}
            </h2>
            <div className="controls">
            {user?(<div className="edit-delete">
                <img
                  onClick={() => {
                    openDialog3(symbole.id);
                  }}
                  src="../icon/delete.png"
                />
                <img
                  onClick={() => {
                   openDialog2(symbole.id);
                  }}
                  src="../icon/edit.png"
                />
              </div>):(<div></div>)}
            </div>
          </div>
        );
      }
    });

  const goToHome = () => {
    navigate("/parametres");
  };
  const goToNewEvent = () => {
    navigate("/activites-ajout");
  };

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
    <>
      <MainLayout>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            maxHeight: "90vh",
          }}
        >
          <div className="header-title">
            <img
              src="../icon/back.png"
              className="back-btn"
              onClick={goToHome}
            />
            {listeSymboles.length > 1 && (
              <h4
                style={{
                  textAlign: "right",
                  width: "100%",
                  paddingRight: "2em",
                }}
              >
                {listeSymboles.length} fonctions
              </h4>
            )}
          </div>
          <div className="add" onClick={openDialog}>
            <h3>FONCTION</h3>
            <img src="../icon/ajouter.png" width="40px" />
          </div>
          <section className="liste-niveaux ">
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "80vh",
                }}
              >
                <center>
                  <img
                    src="../img/wait.gif"
                    className="wait"
                    width="100%"
                    alt="wait"
                  />
                </center>
              </div>
            ) : listeSymboles.length ? (
              listeSymboles
            ) : (
              <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width:"100%",
                height: "50vh",
              }}
              >
                Aucune fonction
              </div>
            )}
          </section>
        </div>
        <dialog
          id="modal"
             className="modal-form"
             style={{
              fontWeight: "bold",
              width: "90%",
              maxWidth: "500px",
              padding: "1.2em 2em",
              position:"fixed",
              top:"0",
              margin:"0em auto",
              marginTop:"2em"
            }}
        >
          <div className="form">
            <img
              src="../icon/close.png"
              width="25px"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                margin: "0.5em",
              }}
              onClick={closeDialog}
            />
            <center>
              <h4>NOUVEAU</h4>
            </center>
            <div className="zone">
              <label htmlFor="libelle"  style={{marginBottom:"0.6em"}}>Libelle :</label>
              <input
                type="text"
                name="libelle"
                autoComplete="off"
                value={fonctionFormData.libelle}
                onChange={handleChange}
                maxlength={20}
              />
            </div>
            <button
              className="dialog-btn"
              style={{
                fontSize:"1rem",
                fontWeight:"bold"
              }}
              onClick={add}
            >
              ENREGISTRER
            </button>
            <br />
          </div>
        </dialog>
        <dialog
          id="modal2"
          className="modal-form"
          style={{
            fontWeight: "bold",
            width: "90%",
            maxWidth: "500px",
            padding: "1.2em 2em",
            position:"fixed",
            top:"0",
            margin:"0em auto",
            marginTop:"2em"
          }}
        >
          <div className="form">
            <img
              src="../icon/close.png"
              width="25px"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                margin: "0.5em",
              }}
              onClick={closeDialog2}
            />
            <center>
              <h4>MODIFIER</h4>
            </center>
            <div className="zone">
              <label htmlFor="libelle"  style={{marginBottom:"0.6em"}}>Libelle :</label>
              <input
                type="text"
                name="libelle"
                autoComplete="off"
                value={fonctionFormData.libelle}
                onChange={handleChange}
                maxlength={20}
              />
            </div>
            <button
              className="dialog-btn"
              style={{
                fontSize:"1rem",
                fontWeight:"bold",
              }}
              onClick={edit}
            >
              MODIFIER
            </button>
            <br />
          </div>
        </dialog>
        <dialog
          id="modal3"
          style={{
            fontWeight: "bold",
            width: "90%",
            maxWidth: "500px",
          }}
        >
          <p style={{ fontSize: "1.1rem", textAlign: "center" }}>
            Voulez vous supprimer ?
          </p>
          <div
            className="choices"
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <button
              onClick={closeDialog3}
              className="dialog-btn"
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginTop: "1em",
                padding: "0.2em 1em",
                    filter:"none"
              }}
            >
              Non
            </button>
            <button
              onClick={remove}
              className="dialog-btn"
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginTop: "1em",
                padding: "0.2em 1em",
                backgroundColor: "red",
                color: "white",
                    filter:"none"
              }}
            >
              Oui
            </button>
          </div>
        </dialog>
      </MainLayout>
    </>
  );
}

export default PageFonction;
