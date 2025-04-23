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

function PageSymboles() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [symboles, setSymboles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeMembreSelect, setTypeMembreSelect] = useState([]);
  let date = new Date();
  let dateNaturel = date.toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const [symboleFormData, setSymboleFormData] = useState({
    photo: default_evenement,
    id: 0,
    libelle: "",
    idTypeMembre: 0,
    montant: "",
  });

  const handleChange = (event) => {
    setSymboleFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const goToInformationCommande = () => {
    navigate("/information-commande");
  };

  const openDialog = () => {
    document.getElementById("modal").showModal();
    document.getElementById("modal").style.opacity = '1'; 
    document.getElementById("modal").style.transform = 'scale(1)'; 
  };

  const closeDialog = () => {
    setSymboleFormData((prev) => ({
      ...prev,
      id: 0,
      photo: default_evenement,
      libelle: "",
      idTypeMembre: 0,
      montant: "",
    }));
    document.getElementById("modal").close();
    document.getElementById("modal").style.opacity = '0'; 
    document.getElementById("modal").style.transform = 'scale(0.7)'; 
  };

  const closeDialog2 = () => {
    setSymboleFormData((prev) => ({
      ...prev,
      id: 0,
      photo: default_evenement,
      idTypeMembre: 0,
      montant: "",
      libelle: "",
    }));
    document.getElementById("modal2").close();
    document.getElementById("modal2").style.opacity = '0'; 
    document.getElementById("modal2").style.transform = 'scale(0.7)'; 
  };

  const openDialog2 = (idSymbole) => {
    let symbole = symboles.find((symbole) => symbole.id == idSymbole);
    setSymboleFormData((prev) => ({
      ...prev,
      photo: default_evenement,
      id: symbole.id,
      libelle: symbole.libelle,
      idTypeMembre: symbole.idTypeMembre,
      montant: symbole.montant,
    }));
    document.getElementById("modal2").showModal();
    document.getElementById("modal2").style.opacity = '1'; 
    document.getElementById("modal2").style.transform = 'scale(1)'; 
  };

  const closeDialog3 = () => {
    setSymboleFormData((prev) => ({
      ...prev,
      photo: default_evenement,
      id: 0,
      libelle: "",
      idTypeMembre: 0,
      montant: "",
    }));
    document.getElementById("modal3").close();
    document.getElementById("modal3").style.opacity = '0'; 
    document.getElementById("modal3").style.transform = 'scale(0.7)'; 
  };

  const openDialog3 = (symboleId) => {
    let symbole = symboles.find((symbole) => symbole.id == symboleId);
    setSymboleFormData((prev) => ({
      ...prev,
      photo: default_evenement,
      id: symbole.id,
      libelle: "",
      idTypeMembre: 0,
      montant: "",
    }));
    document.getElementById("modal3").showModal();
    document.getElementById("modal3").style.opacity = '1'; 
    document.getElementById("modal3").style.transform = 'scale(1)'; 
  };

  const closeDialog4 = () => {
    setSymboleFormData((prev) => ({
      ...prev,
      photo: default_evenement,
      id: 0,
      libelle: "",
      idTypeMembre: 0,
      montant: "",
    }));
    document.getElementById("modal4").close();
    document.getElementById("modal4").style.opacity = '0'; 
    document.getElementById("modal4").style.transform = 'scale(0.7)'; 
  };

  const openDialog4 = (symboleId) => {
    let symbole = symboles.find((symbole) => symbole.id == symboleId);
    setSymboleFormData((prev) => ({
      ...prev,
      photo: default_evenement,
      id: symbole.id,
      libelle: "",
      idTypeMembre: 0,
      montant: symbole.montant,
    }));
    document.getElementById("modal4").showModal();
    document.getElementById("modal4").style.opacity = '1'; 
    document.getElementById("modal4").style.transform = 'scale(1)'; 
  };

  const add = async (event) => {
    if (
      symboleFormData.libelle == "" ||
      symboleFormData.montant == "" ||
      symboleFormData.idTypeMembre == ""
    ) {
      return;
    }
    event.target.disabled = true;
    try {
      let response = await axios.post(
        connection + "/ajouter-symbole",
        symboleFormData
      );
    } catch (error) {
      setServerError(true);
    }
    closeDialog();
    fetchSymboles();
    socket.emit('symbole');
    event.target.disabled = false;
  };

  const commander = async (event) => {
    event.target.disabled = true;
    try {
      let response = await axios.post(connection + "/ajouter-commande", {
        idMembre: user.id,
        idSymbole: symboleFormData.id,
        date: dateNaturel,
      });
      socket.emit('commande');
    } catch (error) {
      setServerError(true);
    }
    goToInformationCommande();
    event.target.disabled = false;
  };

  const edit = async (event) => {
    if (
      symboleFormData.libelle == "" ||
      symboleFormData.montant == "" ||
      symboleFormData.idTypeMembre == ""
    ) {
      return;
    }
    event.target.disabled = true;
    try {
      let response = await axios.post(
        connection + "/modifier-symbole",
        symboleFormData
      );
    } catch (error) {
      setServerError(true);
    }
    event.target.disabled = false;
    closeDialog2();
    fetchSymboles();
    socket.emit('symbole');
  };

  const remove = async (event) => {
    event.target.disabled = true;
    try {
      let res = await axios.delete(
        connection + "/supprimer-symbole/" + symboleFormData.id
      );
    } catch (error) {
      setServerError(true);
    }
    event.target.disabled = false;
    closeDialog3();
    fetchSymboles();
    socket.emit('symbole');
  };

  const fetchSymboles = async () => {
    try {
      const res = await axios.get(connection + "/lire-symbo");
      setSymboles(res.data);
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
    fetchSymboles();
    fetchTypeMembres();
  }, []);

  socket.on("symbole", () => {
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
          <div className="symbole">
            <div className="main">
              <div className="content">
                <h2 className="libelle">{symbole.libelle}</h2>
                <p>{symbole.typemembre}</p>
                <h3>{symbole.montant} FC</h3>
              </div>
            </div>
            <div className="controls">
              <button
                onClick={() => {
                  openDialog4(symbole.id);
                }}
              >
                COMMANDER
              </button>
              <div
                className="edit-delete"
                style={{
                  visibility: user.idFonction != null ? "visible" : "hidden",
                }}
              >
                <img
                  onClick={() => {
                    openDialog3(symbole.id);
                  }}
                  src="../icon/delete.png"
                />
                <img
                  onClick={() =>navigate("/symbole-modifier/"+ symbole.id)}
                  src="../icon/edit.png"
                />
              </div>
            </div>
          </div>
        );
      }
    });

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

  const goToHome = () => {
    navigate("/");
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
        {user && user.idFonction != null &&  <div className="add-evenement" onClick={()=>navigate("/symbole-ajout")}>
          <h3>SYMBOLE</h3>
          <img src="../icon/ajouter.png" width="35px" />
        </div>}
        <section className="actualite">
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
                height: "50vh",
              }}
            >
              Aucun symbole
            </div>
          )}
        </section>
        <dialog
          id="modal"
          style={{
            fontWeight: "bold",
            width: "90%",
            maxWidth: "500px",
            padding: "1.2em 2em",
          }}
        >
          <div className="form">
            <img
              src="../icon/close.png"
              width="35px"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                margin: "0.5em",
              }}
              onClick={closeDialog}
            />
            <center>
              <h2>NOUVEAU</h2>
            </center>
            <div className="zone">
              <label htmlFor="libelle">Libelle :</label>
              <input
                type="text"
                name="libelle"
                autoComplete="off"
                value={symboleFormData.libelle}
                onChange={handleChange}
                maxlength={20}
              />
            </div>
            <div className="zone">
              <label htmlFor="adresse">Type de membre :</label>

              <select
                name="idTypeMembre"
                id="typeMembre"
                value={symboleFormData.idTypeMembre}
                onChange={handleChange}
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
                value={symboleFormData.montant}
                onChange={handleChange}
                min="0"
                max="100000"
              />
            </div>
            <br />
            <button
              className="dialog-btn"
              style={{
                fontSize: "1.6rem",
                fontWeight: "bold",
                marginTop: "1em",
                padding: "0.2em 1em",
                color: "black",
                width: "100%",
                maxWidth: "300px",
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
          style={{
            fontWeight: "bold",
            width: "90%",
            maxWidth: "500px",
            padding: "1.2em 2em",
          }}
        >
          <div className="form">
            <img
              src="../icon/close.png"
              width="35px"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                margin: "0.5em",
              }}
              onClick={closeDialog2}
            />
            <center>
              <h2>MODIFIER</h2>
            </center>
            <div className="zone">
              <label htmlFor="libelle">Libelle :</label>
              <input
                type="text"
                name="libelle"
                autoComplete="off"
                value={symboleFormData.libelle}
                onChange={handleChange}
                maxlength={20}
              />
            </div>
            <div className="zone">
              <label htmlFor="adresse">Type de membre :</label>

              <select
                name="idTypeMembre"
                id="typeMembre"
                value={symboleFormData.idTypeMembre}
                onChange={handleChange}
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
                value={symboleFormData.montant}
                onChange={handleChange}
                min="0"
                max="1000000"
              />
            </div>
            <br />
            <button
              className="dialog-btn"
              style={{
                fontSize: "1.6rem",
                fontWeight: "bold",
                marginTop: "1em",
                padding: "0.2em 1em",
                color: "black",
                width: "100%",
                maxWidth: "300px",
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
        <dialog
          id="modal4"
          style={{
            fontWeight: "bold",
            width: "90%",
            maxWidth: "500px",
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            ça coûte {symboleFormData.montant} FC
          </h2>
          <center>
            {" "}
            <br />
            <h3>Voulez vous payer ?</h3>
          </center>
          <div
            className="choices"
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <button
              onClick={closeDialog4}
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginTop: "1em",
                padding: "0.2em 1em",
                    filter:"none"
              }}
            >
              NON
            </button>
            <button
              onClick={commander}
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginTop: "1em",
                padding: "0.2em 1em",
                backgroundColor:"green",
                color:"white",
                    filter:"none"
              }}
            >
              ACCEPTER
            </button>
          </div>
        </dialog>
      </MainLayout>
    </>
  );
}

export default PageSymboles;
