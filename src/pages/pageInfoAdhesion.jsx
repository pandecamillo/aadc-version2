import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import default_image from "../data/default_profile";
import axios from "axios";
import connection from "../data/connection";
import MainLayout from "../layout/mainlayout";
import io from "socket.io-client";
import { AuthContext } from "../context/authContext";

const socket = io.connect(connection);

function PageInfoAdhesion(props) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [membre, setMembre] = useState();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  let locationActualiteId = parseInt(location.pathname.split("/")[2]);

  const convertirEnDateNaturel = (dateSql) => {
    let date = new Date(dateSql);
    let dateNaturel = date.toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return dateNaturel;
  };

  useEffect(() => {
    if(!user || user && user.idFonction == null){
      navigate("/erreur-privilege");
      return
    }
    const fetchData = async () => {
      try {
        const res = await axios.get(
          connection + "/lire-membre/" + locationActualiteId
        );
        setMembre(res.data);
        setLoading(false);
      } catch (error) {
        setServerError(true);
      }
    };
    fetchData();
  }, []);

  const convertirEnHtml = (dateSql) => {
    const date = dateSql.split("T")[0];
    const parts = date.split("-");
    return `Le ${parts[0]}`;
  };

  const handleDelete = async (event) => {
    try {
      await axios.delete(
        connection + "/supprimer-membre/" + locationActualiteId
      );
      socket.emit('membre');
      navigate("/membres");
    } catch (error) {

      setServerError(true);
    }
  };

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

  const goToHome = () => {
    navigate("/liste-adhesions");
  };

  const goToEdit = () => {
    navigate("/membre-modifier/" + locationActualiteId);
  };

  const handleChange = () => {};
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
        <div className="operation">
{user && membre && membre.id != user.id && <img src="../icon/delete.png" onClick={openDialog} />}
{user && membre && membre.id != user.id && <img src="../icon/edit.png" onClick={goToEdit} />}
          {user && membre && user.id == membre.id && <h3></h3>}
        </div>
      </div>
      <div  style={{ height:"80vh", overflowY:"scroll" }}>
      <section className="form-adhesion" style={{ overflowY: "scroll"}}>
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
                width:"100%"
              }}
            >
                 <img style={{width:'50px', height:'50px'}} className="wait" src="../img/wait.gif" alt="wait" />
            </center>
          </div>
        ) : (
          membre && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
              <section
                className="form-adhesion"
                style={{ overflowY: "scroll"}}
              >
                <center>
                  <img
                    src={membre.photo || "../img/profile.png"}
                    width={"80%"}
                    height={150}
                    style={{ border: "black 2px solid" }}
                    alt="profile"
                  />
                </center>

                <div className="zone">
                  <label htmlFor="nom">Nom : </label>
                  <h2 name="nom">{membre.nom}</h2>
                </div>
                <div className="zone">
                  <label htmlFor="prenom">Postnom : </label>
                  <h2 name="nom">{membre.postnom}</h2>
                </div>
                <div className="zone">
                  <label htmlFor="prenom">Prenom : </label>
                  <h2 name="nom">{membre.prenom}</h2>
                </div>
                <div className="zone">
                  <label htmlFor="sexe">Sexe : </label>
                  <h2 name="nom">{membre.sexe}</h2>
                </div>
                <div className="zone">
                  <label htmlFor="lieu">Lieu de naissance : </label>
                  <h2 name="nom">{membre.lieuNaissance}</h2>
                </div>
                <div className="zone">
                  <label htmlFor="lieu">Date de naissance : </label>
                  <h2 name="nom">
                    {convertirEnDateNaturel(membre.dateNaissance.split("T")[0])}
                  </h2>
                </div>
                <div className="zone">
                  <label htmlFor="lieu">Adresse : </label>
                  <h2 name="nom">c/{membre.commune} <br /> av/{membre.avenue} <br />n°{membre.numero}</h2>
                </div>

                <div className="zone">
                  <label htmlFor="lieu">Profession : </label>
                  <h2 name="nom">{membre.profession}</h2>
                </div>
                <div className="zone">
                  <label htmlFor="lieu">Telephone : </label>
                  <h2 name="nom">{membre.telephone}</h2>
                </div>
                <div className="zone">
                  <label htmlFor="sexe">Type membre : </label>
                  <h2 name="nom">{membre.type}</h2>
                </div>
                {membre.niveau && (
                  <div className="zone">
                    <label
                      htmlFor="sexe"
                      style={{ textTransform: "capitalize" }}
                    >
                      {membre.niveauType} :{" "}
                    </label>
                    <h2 name="nom">{membre.niveau}</h2>
                  </div>
                )}
                {membre.fonction && (
                  <div className="zone">
                    <label htmlFor="sexe">Fonction : </label>
                    <h2 name="nom">{membre.fonction}</h2>
                  </div>
                )}
                {membre.dateAdhesion && (
                  <div className="zone">
                    <label htmlFor="" style={{visibility:"hidden"}}>Date Adhesion :</label>
                    <small name="nom">Adhéré{membre.sexe == "F" ? "e": ""} {membre.dateAdhesion}</small>
                  </div>
                )}
              </section>
              <center>
                <div
                  className="confirm-btn"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: "0.5em",
                  }}
                >
                  <button
                    onClick={() => {
                      navigate("/carte-membre/" + locationActualiteId);
                    }}
                    style={{
                      width: "100%",
                      margin: "auto",
                      bottom: "0",
                      marginBottom:"1em",
                      marginTop:"1em"
                    }}
                  >
                    Voir la Carte
                  </button>
                  <br />
                  <br />
                </div>
              </center>
  
            </div>
          )
        )}
      </section>
      </div>
      <dialog
        id="modal"
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
            onClick={closeDialog}
            className="dialog-btn"
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              marginTop: "1em",
              padding: "0.2em 1em",
            }}
          >
            Non
          </button>
          <button
            onClick={handleDelete}
            className="dialog-btn"
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              marginTop: "1em",
              padding: "0.2em 1em",
              backgroundColor: "red",
              color: "white",
            }}
          >
            Oui
          </button>
        </div>
      </dialog>
    </MainLayout>
  );
}

export default PageInfoAdhesion;
