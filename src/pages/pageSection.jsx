import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import connection from "../data/connection";
import MainLayout from "../layout/mainlayout";
import io from "socket.io-client";
const socket = io.connect(connection);



function PageSection() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [niveaux, setNiveaux] = useState([]);
  const [loading, setLoading] = useState(true);
  let locationNiveau = useLocation().pathname.split("/")[2];
  let locationInterFederation = locationNiveau.split("-")[0];
  let locationFederation = locationNiveau.split("-")[1];
  const [sectionFormData, setSectionFormData] = useState({
    id: "",
    libelle: "",
    adresse: "",
    type: "section",
    idFederation: locationFederation,
  });

  const fetchNiveaux = async () => {
    setLoading(true);
    try {
      let res = await axios.get(
        connection + "/lire-section/" + locationFederation
      );
      setNiveaux(res.data);
      setLoading(false);
    } catch (error) {
      setServerError(true);
    }
  };

  const handleChange = (event) => {
    setSectionFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const closeDialog = () => {
    setSectionFormData((prev) => ({
      ...prev,
      libelle: "",
      adresse: "",
    }));
    document.getElementById("modal").close();
    document.getElementById("modal").style.opacity = '0'; 
    document.getElementById("modal").style.transform = 'scale(0.7)'; 
  };

  const openDialog = () => {
    document.getElementById("modal").showModal();
    document.getElementById("modal").style.opacity = '1'; 
    document.getElementById("modal").style.transform = 'scale(1)'; 
  };

  const closeDialog2 = () => {
    setSectionFormData((prev) => ({
      ...prev,
      libelle: "",
      adresse: "",
    }));
    document.getElementById("modal2").close();
    document.getElementById("modal2").style.opacity = '0'; 
    document.getElementById("modal2").style.transform = 'scale(0.7)'; 
  };

  const openDialog2 = (idNiveau) => {
    let niveau = niveaux.find((niveau) => niveau.idNiveau == idNiveau);
    setSectionFormData((prev) => ({
      ...prev,
      id: idNiveau,
      libelle: niveau.libelle,
      adresse: niveau.adresse,
    }));
    document.getElementById("modal2").showModal();
    document.getElementById("modal2").style.opacity = '1'; 
    document.getElementById("modal2").style.transform = 'scale(1)'; 
  };

  const closeDialog3 = () => {
    setSectionFormData((prev) => ({
      ...prev,
      libelle: "",
      adresse: "",
    }));
    document.getElementById("modal3").close();
    document.getElementById("modal3").style.opacity = '0'; 
    document.getElementById("modal3").style.transform = 'scale(0.7)'; 
  };

  const openDialog3 = (idNiveau) => {
    let niveau = niveaux.find((niveau) => niveau.idNiveau == idNiveau);
    setSectionFormData((prev) => ({
      ...prev,
      id: idNiveau,
      libelle: niveau.libelle,
      adresse: niveau.adresse,
    }));
    document.getElementById("modal3").showModal();
    document.getElementById("modal3").style.opacity = '1'; 
    document.getElementById("modal3").style.transform = 'scale(1)'; 
  };

  const add = async (event) => {
    if (sectionFormData.libelle == "") {
      return;
    }
    event.target.disabled = true;
    try {
      let res = await axios.post(
        connection + "/ajouter-section",
        sectionFormData
      );
    } catch (error) {
      setServerError(true);
    }
    closeDialog();
    fetchNiveaux();
    socket.emit('niveau');
    event.target.disabled = false;
  };

  const edit = async (event) => {
    if (sectionFormData.libelle == "") {
      return;
    }
    event.target.disabled = true;
    try {
      let res = await axios.put(
        connection + "/modifier-niveau",
        sectionFormData
      );

      fetchNiveaux();
      socket.emit('niveau');
    } catch (error) {
      setServerError(true);
    }
    event.target.disabled = false;
    closeDialog2();
  };

  const remove = async (event) => {
    event.target.disabled = true;
    try {
      let res = await axios.delete(
        connection + "/supprimer-niveau/" + sectionFormData.id
      );
      fetchNiveaux();
      socket.emit('niveau');

    } catch (error) {
      setServerError(true);
    }
    event.target.disabled = false;
    closeDialog3();
  };

  useEffect(() => {
    if(!user || user && user.idFonction == null){
      alert("AADC : vous n'êtes pas autorisé à accèder à cette information")
      navigate("/home");
      return
    }
    fetchNiveaux();
    socket.on('niveau', () => {fetchNiveaux()})
  }, []);

  let listNiveaux = [];
  niveaux &&
    niveaux.forEach((niveau) => {
      if (niveau.idNiveau) {
        let nombre;
        if (niveau.nombreNiveaux == 1) {
          nombre = "1 sous section";
        } else if (niveau.nombreNiveaux > 1) {
          nombre = niveau.nombreNiveaux + " sous sections";
        } else {
          nombre = "Aucune sous section";
        }
        listNiveaux.push(
          <div className="niveau" key={niveau.idNiveau}  >
            <div
            onClick={() => {
              navigate(`/sous-section/${locationInterFederation}-${locationFederation}-${niveau.idNiveau}`);
            }}
              style={{
                padding: "0.5em",
                borderRadius: "13px",
              }}
              className="content"
            >
              <h3>{niveau.libelle}</h3>
              
              <strong>{nombre}</strong>
            </div>
            <div className="controls">
              <img
                src="../icon/delete.png"
                onClick={() => {
                  openDialog3(niveau.idNiveau);
                }}
              />
              <img
                src="../icon/edit.png"
                onClick={() => {
                  openDialog2(niveau.idNiveau);
                }}
              />
            </div>
          </div>
        );
      }
    });

  const goBack = () => {
    navigate("/federation/"+locationInterFederation);
  };

  const goToHome = () => {
    navigate("/home");
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
          justifyContent: "space-evenly",
        }}
      >
      <div className="header-title">
            <img
              src="../icon/back.png"
              className="back-btn"
              onClick={goBack}
            />
            {listNiveaux.length > 1 && (
              <h4
                style={{
                  textAlign: "right",
                  width: "100%",
                  paddingRight: "2em",
                }}
              >
                {listNiveaux.length} sections
              </h4>
            )}
          </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
 
          }}
        >
              <div  style={{ height:"80vh", overflowY:"scroll" }}>
          <div className="add" onClick={openDialog} style={{marginTop:"1.5em"}}>
            <h3>SECTION</h3>
            <img src="../icon/ajouter.png" width="40px" />
          </div>
          <section
            className="actualite"
            style={{
              alignItems: "center",
              width: "100%",
              margin: "auto",
              paddingBottom:"2em",
            }}
          >
            {loading ? (
              <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "40vh",
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
            ) : listNiveaux.length > 0 ? (
              <>{listNiveaux}</>
            ) : (
              <>
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
                  Aucune section
                </div>
              </>
            )}
          </section>
          </div>
          </div>
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
            marginTop:"0.5em"
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
              <label htmlFor="libelle">Libelle :</label>
              <input
                type="text"
                name="libelle"
                autoComplete="off"
                value={sectionFormData.libelle}
                onChange={handleChange}
                maxlength={15}
              />
            </div>
         
            <button
            style={{
              fontSize:"1rem",
              fontWeight:"bold"
            }}
              onClick={add}
            >
              ENREGISTRER
            </button>
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
              <label htmlFor="libelle">Libelle :</label>
              <input
                type="text"
                name="libelle"
                autoComplete="off"
                value={sectionFormData.libelle}
                onChange={handleChange}
                maxlength={15}
              />
            </div>
        
            <button
            style={{
              fontSize:"1rem",
              fontWeight:"bold"
            }}
              onClick={edit}
            >
              MODIFIER
            </button>
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
export default PageSection;
