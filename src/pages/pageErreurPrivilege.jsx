import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/mainlayout";
import { useLocation } from 'react-router-dom';
import url_du_site from "../data/url_du_site";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

function PageErreurPrivilege(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const {idMembre, nomMembre, prenomMembre } = location.state || {};
  const { user } = useContext(AuthContext);
  const goToLogin = () => {
    navigate("/login");
  };
const goToHome = ()=>{
  navigate("/home");
}
  return (
    <MainLayout>
      <div className="main">
        <br />
        <br/>
        <center
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            maxWidth:"500px",
            margin:"auto"
          }}
        >
           {!user && 
           <div
           style={{
            margin: "1.5em", 
             backgroundColor: "rgb(235, 235, 235)",
            color:"black",
            
            padding: "1.3em",
            border: "white solid 3px",
            borderRadius:"18px" 
          }}
        >
            <h3   style={{
              fontSize:"1.5rem",
              color: "white",
              background:"red",
              padding:"0.5em 1em"
            }}>Accès refusé</h3> <br />{" "}
            <p style={{ textAlign: "left", paddingLeft:"0.5em", fontSize:"1rem"}}>
              Uniquement les responsables du parti ont accès à ces types d'informations. <br /> <br /><center><strong>Authentifiez vous</strong></center>. 
              <br />
            </p>
            <button
              style={{
                fontSize: 30,
                padding: "0em 1em",
                fontWeight: "bold",
                border: "black 2px solid",
              }}
              onClick={goToLogin}
            >
              OK
            </button>
           </div>}
           {user && 
           <div
           style={{
            margin: "1.5em", 
             backgroundColor: "rgb(235, 235, 235)",
            color:"black",
            
            padding: "1.3em",
            border: "white solid 3px",
            borderRadius:"18px" 
          }}
          className="erreur-privilege"
        >
            <h3   style={{
              fontSize:"1.5rem",
              color: "white",
              background:"red",
              padding:"0.5em 1em"
            }}>Accès refusé</h3> <br />{" "}
            <p style={{ textAlign: "left", paddingLeft:"0.5em", fontSize:"1rem"}}>
              Uniquement les responsables du parti ont accès à ces types d'informations. <br /> <br /><center><strong>Vous n'etes pas autorisé</strong></center>. 
              <br />
            </p>
            <button
              style={{
                fontSize: 30,
                padding: "0em 1em",
                fontWeight: "bold",
                border: "black 2px solid",
              }}
              onClick={goToHome}
            >
              OK
            </button>
           </div>}
          
        </center>
      </div>
    </MainLayout>
  );
}

export default PageErreurPrivilege;
