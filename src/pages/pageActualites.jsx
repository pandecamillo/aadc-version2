import { useNavigate } from "react-router-dom";
import Actualite from "../components/actualite";
import data_actualite from "../data/data_actualite";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import connection from "../data/connection";
import MainLayout from "../layout/mainlayout";
import io from "socket.io-client";

const socket = io.connect(connection);

function PageActualites() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get(connection + "/lire-evenements");
      setData(res.data);
      setLoading(false);
    } catch (error) {

      setServerError(true);
    }
  };

  useEffect(() => {
    fetchData();
    socket.on('evenement', () => {
      fetchData();
    })
  }, []);

  let listEvenements = [];
  listEvenements =
    data &&
    data.map((evenement) => {
      if (evenement.id) {
        if(user &&
          evenement.valide == "non" &&
          evenement.idPublicateur != user.id &&
          user.idFonction == null){
            return;
          }
        return <Actualite key={evenement.id} {...evenement} />;
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
        <div className="add-evenement" onClick={goToNewEvent}>
          <h3>PUBLIER</h3>
          <img src="../icon/ajouter.png" width="40px" />
        </div>
        <section className="actualite">
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "40vh",
                width:"100%"
              }}
            >
              <center>
              <img style={{width:'50px', height:'50px'}} className="wait" src="../img/wait.gif" alt="wait" />
              </center>
            </div>
          ) : listEvenements.length ? (
            listEvenements
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
              Aucun evenement
            </div>
          )}
        </section>
      </MainLayout>
    </>
  );
}

export default PageActualites;
