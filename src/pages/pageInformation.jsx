import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/mainlayout";
import { useLocation } from 'react-router-dom';
import url_du_site from "../data/url_du_site";

function PageInformation(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const {idMembre, nomMembre, prenomMembre, niveauMembre, telephoneMembre } = location.state || {};
  const goToHome = () => {
    let message = `Salut, président interfederal Adida Maseki, je m'appelle ${nomMembre} ${prenomMembre}, j'ai fait l'adhésion en ligne dans l'interfederation de ${niveauMembre}. Je souhaite obtenir la carte et finaliser mon adhésion.\n\n${url_du_site}/#/membre-info/${idMembre}`;
    if(!nomMembre || !prenomMembre){
      message = `Salut, président interfederal Adida Maseki, j'ai fait l'adhésion en ligne. Je souhaite obtenir la carte et finaliser mon adhésion`;
    }
    const url = "https://wa.me/243896019088?text=" + encodeURIComponent(message);
    
    window.open(url, "_blank");
    navigate("/home");
  };

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
          <div
             style={{
              margin: "1.5em",
              backgroundColor: "rgb(235, 235, 235)",
              color: "black",
              padding: "1.3em",
              border: "white solid 3px",
              borderRadius:"18px" 
            }}
          >
            <h3   style={{
              fontSize:"1.5rem",
              color: "green" 
            }}>Adhésion en cours </h3> <br />{" "}
            <p style={{ textAlign: "left", paddingLeft:"0.5em", fontSize:"1.2rem"}}>
              Vous allez discuter sur whatsapp avec le président interfederal afin de prendre votre carte et finaliser votre adhésion. 
              <br />
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
          </div>
        </center>
      </div>
    </MainLayout>
  );
}

export default PageInformation;
