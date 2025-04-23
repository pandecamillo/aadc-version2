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


function PageNotification() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState([]);
  const [adhesions, setAdhesions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("adhesions");
  const [firstLoad, setFirstLoad] = useState(true);

  const fetchCommandes = async () => {
    try {
      let res = await axios.get(connection + "/lire-commandes");
      setCommandes(res.data);
    } catch (error) {
      setServerError(true);
    }
  };

  const fetchAdhesions = async () => {
    try {
      let res = await axios.get(connection + "/lire-adhesions");
      setAdhesions(res.data);
      setFirstLoad(false)
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
    fetchCommandes();
    fetchAdhesions();
    setLoading(false);
    socket.on('commande', () => {
      fetchCommandes();
    })
    socket.on('membre', () => {
      fetchAdhesions();
    })
  }, []);

  let listeCommandes = [];
  listeCommandes =
    commandes &&
    commandes.map((commande) => {
      if (commande.id) {
        return (
          <div className="commande">
            <div>
              <h4>
                {commande.libelle} 
              </h4>
              <h6>
              ({commande.type})
              </h6>
              <small>
                Membre :{" "}
                <strong>
                  {" "}
                  {commande.nom} {commande.prenom}
                </strong>
              </small>
              <p>{commande.date}</p>
            </div>
          </div>
        );
      }
    });

  let listeAdhesions = [];
  listeAdhesions =
    adhesions &&
    adhesions.map((adhesion) => {
      if (adhesion.id) {
        return (
          <div className="commande">
            <div>
              <h4>
                Nom : {adhesion.nom} {adhesion.prenom}
              </h4>
              <p>Tel : {adhesion.telephone}</p>
              <p>Date : {adhesion.dateAdhesion}</p>
              <center>
                {" "}
                <button
                  onClick={() => {
                    navigate("/membre-info/" + adhesion.id);
                  }}
                  className="voir-plus"
                  style={{ padding: "0.2em 1em", fontSize: "1.1rem" }}
                >
                  Voir plus
                </button>
              </center>
            </div>
          </div>
        );
      }
    });

  const selectAdhesion = () => {
    setSelected("adhesions");
  };

  const selectCommande = () => {
    setSelected("commandes");
  };

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
        {selected == "adhesions" && (
          <section className="actualite" style={{ paddingBottom: "8em" }}>
            {loading || firstLoad ? (
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
            ) : listeAdhesions.length > 0 ? (
              <>{listeAdhesions}</>
            ) : (
              <>
                 <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              Aucune adhésion
            </div>
              </>
            )}
          </section>
        )}
        {selected == "commandes" && (
          <section className="actualite" style={{ paddingBottom: "8em" }}>
                  {loading || firstLoad  ? (
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
            ) : listeCommandes.length > 0 ? (
              <>{listeCommandes}</>
            ) : (
              <>
                 <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              Aucune commande
            </div>
              </>
            )}
          </section>
        )}
        <center>
          <div
            className="header-notification"
            style={{
              justifyContent: "center",
              margin:"auto",
              display:"none"
            }}
          >
            <div
              className={selected == "adhesions" ? "active" : ""}
              onClick={selectAdhesion}
            >
              <div className="circle">
                <img src="../icon/adhesion.png" width="40px" />
              </div>
              <p>Adhésions</p>
            </div>
            <div
              className={selected == "commandes" ? "active" : ""}
              onClick={selectCommande}
              name="commandes"
              style={{marginLeft:"3em"}}
            >
              <div className="circle" >
                <img src="../icon/dollars.png" width="40px" />
              </div>
              <p>Commandes</p>
            </div>
          </div>
        </center>
      </MainLayout>
    </>
  );
}

export default PageNotification;
