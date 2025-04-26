import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/mainlayout";
import { useLocation } from 'react-router-dom';
import url_du_site from "../data/url_du_site";

function PageInformationAjouter(props) {
  const navigate = useNavigate();
  const goToHome = () => {
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
               Si vous télechargez ou imprimez la carte du membre, son adhésion sera considéré comme finalisé. 
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

export default PageInformationAjouter;
