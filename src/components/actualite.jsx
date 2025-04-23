import { useNavigate } from "react-router-dom";
import axios from "axios";
import connection from "../data/connection";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";

function Actualite(props) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const goToActualite = () => {
    navigate("/actualite/" + props.id);
  };
  const confirmerEvenement = async () => {
    await axios.put(connection + "/confirmer-evenement/" + props.id);
    window.location.reload();
  };
  const supprimerEvenement = async () => {
    await axios.delete(connection + "/supprimer-evenement/" + props.id);
    window.location.reload();
  };
  const enCours =
    (user && props.valide == "non" && props.idPublicateur == user.id) ||
    (user && props.valide == "non" && user.idFonction != null)
      ? "enCours"
      : "";
  const publicateur =
    user && props.idPublicateur == user.id
      ? "Vous"
      : props.membrePrenom + " " + props.membreNom;
  return (
    <div className={`activites ${enCours}`}>
      <div className="image">
        <img
          src={props.image || "../img/photo.png"}
          alt="actualite"
          style={{ width: "100%" }}
        />
        {user &&
          props.valide == "non" &&
          props.idPublicateur == user.id &&
          user.idFonction == null && (
            <h5 className="info-publication">
              En attente de l'autorisation...
            </h5>
          )}
        {user && user.idFonction != null && props.valide == "non" && (
          <h5 className="info-publication">En attente de l'autorisation...</h5>
        )}
        {props.valide == "oui" && (
          <small className="info-publication">
            Publié par <strong>{publicateur}</strong>
          </small>
        )}
      </div>
      <div className="content">
        <h2 style={{ textTransform: "uppercase" }}>{props.titre}</h2>
        <small>{props.date}</small>
      </div>
      <center>
        <button onClick={goToActualite} >Lire la suite</button>
      </center>
    </div>
  );
}

export default Actualite;
