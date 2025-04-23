import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import connection from "../data/connection";
import Header from "../components/header";
import MainLayout from "../layout/mainlayout";
import io from "socket.io-client";


const socket = io.connect(connection);

function PageActualite() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState();
  let locationActualiteId = parseInt(location.pathname.split("/")[2]);
  const [changes, setChanges] = useState();
  const [loading, setLoading] = useState(true);

  const confirmerEvenement = async () => {
    await axios.put(connection + "/confirmer-evenement/" + locationActualiteId);
    socket.emit('evenement');
    navigate("/activites");
  };
  const supprimerEvenement = async () => {
    await axios.delete(
      connection + "/supprimer-evenement/" + locationActualiteId
    );
    socket.emit('evenement');
    navigate("/activites");
  };

  const goToActualites = () => {
    navigate("/activites");
  };

  const goToHome = () => {
    navigate("/");
  };
  const goToEdit = () => {
    navigate("/activites-modifier/" + locationActualiteId);
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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          connection + "/lire-evenement/" + locationActualiteId
        );
        setData(res.data);
        setLoading(false);
      } catch (error) {
        
        setServerError(true);
      }
    };
    fetchData();
  }, []);

  const publicateur =
    user && data && data.idPublicateur == user.id
      ? "Vous"
      : data && data.membrePrenom + " " + data.membreNom;

  const handleDelete = () => {
    const deleteData = async () => {
      try {
        await axios.delete(
          connection + "/supprimer-evenement/" + locationActualiteId
        );
        socket.emit('evenement');
        navigate("/activites");
      } catch (error) {
        
        setServerError(true);
      }
    };
    deleteData();
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
    <MainLayout>
      <div className="header-controls">
        <img
          src="../icon/back.png"
          className="back-btn"
          onClick={goToActualites}
        />
        {(data && data.idPublicateur == user.id) ||
        (data && user.idFonction != null && data.valide == "oui") ? (
          <div className="operation">
            <img src="../icon/delete.png" onClick={openDialog} />
            <img src="../icon/edit.png" onClick={goToEdit} />
          </div>
        ) : (
          <div></div>
        )}
        {data && data.valide == "non" && user.idFonction != null && (
          <div className="operation">
            <img src="../icon/accept.png" style={{cursor:'pointer'}} onClick={confirmerEvenement} />
            <img src="../icon/refuse.png" style={{cursor:'pointer'}} onClick={supprimerEvenement} />
          </div>
        )}
      </div>
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
      ) : data ? (
        <div
          className={`actualite-content`}
          style={{ overflowY: "scroll", height: "75vh" }}
        >
         <div className="contents">
         <div className="actualite-title">
            <h2 style={{ textTransform: "uppercase" }}>{data.titre}</h2>
            <div className="date">{data.date}</div>
          </div>
          <img src={data.image || "../img/photo.png"} alt="actualite" />
          <small>
            Publié par <strong>{publicateur}</strong>
          </small>
          <p style={{ width: "100%", wordWrap: "break-word" }}>
            {data.contenu.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ))}
          </p>
        </div>
         </div>
      ) : (
        <div></div>
      )}

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
            onClick={handleDelete}
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
  );
}
export default PageActualite;
