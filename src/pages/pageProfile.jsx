import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import MainLayout from "../layout/mainlayout";
function PageProfile() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  const goToHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
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

  const goToCarte = () => {
    navigate("/carte-membre/" + user.id);
  };

  const goToEdit = () => {
    navigate("/compte-modifier/" + user.id);
  };

  return (
    <MainLayout>
      <section>
        <div className="my-profile">
          <div className="profile">
            <img src={user.photo || "../img/profile.png"} alt="profile" />
            <h3 style={{cursor:'default'}}>{user.nom + " " + user.prenom}</h3>
            {user.type && <i>Membre {user.type.toLowerCase()}</i>}

            {user.libelle && user.niveauType != "secretariat general" && (
              <small style={{ textTransform: "capitalize" }}>
                {user.libelle}
              </small>
            )}
            {user.idFonction != null && <i>{`Vous etes ${user.fonction}${user.sexe == "F" ? "e":""}`}</i>}
           <center>
           {user.idFonction != null && (
              <button onClick={() => {
                navigate("/ma-carte/" + user.id);
              }} >Voir Carte</button>
            )}
             {user.idFonction != null && (
              <button style={{marginTop:"0.2em"}} onClick={goToEdit}>Modifier</button>
            )}
            <br />
            <br />
            <br />
            <button style={{marginTop:"0.2em"}} className="disconnect" onClick={openDialog}>
              Deconnecter
            </button>
           </center>
          </div>
        </div>
      </section>
      <dialog
        id="modal"
        style={{
          fontWeight: "bold",
          width: "90%",
          maxWidth: "500px",
        }}
      >
        <p style={{ fontSize: "1.1rem", textAlign: "center" }}>
          Voulez vous deconnecter ?
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
            onClick={handleLogout}
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

export default PageProfile;
