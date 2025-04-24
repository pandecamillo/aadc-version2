import { useNavigate } from "react-router-dom";
import Actualite from "../components/actualite";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import connection from "../data/connection";
import Header from "../components/header";
import MainLayout from "../layout/mainlayout";
import io from "socket.io-client";

const socket = io.connect(connection);

function PageAdhesionEnLigne() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)

    const fetchMembres = async () => {
      try {
        const res = await axios.get(connection + "/lire-adhesion-en-ligne");
        setData(res.data);
        setLoading(false);
      } catch (error) {
        setServerError(true);
      }
    };

    useEffect(() => {
      fetchMembres();
    }, []);
  

  let listeMembres = [];
  listeMembres = [];
  data &&
    data.forEach((membre) => {
      if (membre.id) {
        listeMembres.push(
          <div
            className="membre"
            key={membre.id}
            onClick={() => {
              navigate("/info-adhesion/" + membre.id);
            }}
          >
            <img src={membre.photo || "../img/profile.png"} alt="" />
            <div className="membre-informations">
              <h4 className="nom">
                {membre.id == user.id
                  ? "Vous"
                  : membre.nom + " " + membre.prenom}
              </h4>
              <small>{membre.dateAdhesion}</small>
             
            </div>
          </div>
        );
      }
    });

 

  const goToHome = () => {
    navigate("/");
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
     
        <section className="header-list-membre">
        <h2 style={{ marginTop: "0.1em", textTransform: "uppercase" }}>
                Adhésions en ligne
              </h2>
        </section>
        <section className="list-membres">
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
            ) :listeMembres.length > 0 ? (
              <>{listeMembres}</>
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
              Aucun membre
            </div>
              </>
            )}

         
        </section>
      </MainLayout>
    </>
  );
}

export default PageAdhesionEnLigne;
