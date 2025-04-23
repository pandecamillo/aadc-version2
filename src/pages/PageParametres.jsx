import { useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import connection from "../data/connection";
import MainLayout from "../layout/mainlayout";

function PageParametres(data) {
  const navigate = useNavigate();
  const { user, update } = useContext(AuthContext);
  const [userTheme, setUserTheme] = useState(user.theme);
    const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    setLoading(true);
    setUserTheme(event.target.name);
    try {
      await axios.put(connection + "/modifier-theme/" + user.id, {
        theme: event.target.name,
      });
      update(user.id);
      navigate("/parametres");
    } catch (error) {
    }
    setLoading(false);
  };

  const goToHome = () => {
    navigate("/");
  };

  const goToFonction = () => {
    navigate("/fonction");
  };

  const goToTheme = () => {
    navigate("/theme");
  };

  const goToTypeMembre = () => {
    navigate("/type-membre");
  };

  return (
    <MainLayout>
      <div className="form-adhesion">
        <center
          style={{
            width: "80%",
            margin: "auto",
          }}
        >
          <br />
          <br />
          <h2>PARAMETRES</h2>
          <br />
           <div className="choix-theme">
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
                  height: "65%",
                }}
              >
                <img className="wait" style={{backgroundColor:"white"}} src="../img/wait.gif" alt="wait" />
              </center>
            </div>
          ):(
          <>
          <img
              src="../icon/light.png"
              alt="light"
              className={userTheme != "sombre" ? "selected" : ""}
              name="clair"
              onClick={handleSubmit}
            />
            <img
              src="../icon/dark.png"
              alt="dark"
              className={userTheme == "sombre" ? "selected" : ""}
              name="sombre"
              style = {{marginLeft : "1.3em"}}
              onClick={handleSubmit}
            />
          </>
          )
             }
          </div>
         
         
          {user && user.idFonction != null && (
            <>
              <div className="confirm-btn">
                <button onClick={goToFonction}>Fonctions</button>
              </div>
              <div className="confirm-btn">
                <button onClick={goToTypeMembre}>Type membres</button>
              </div>
            </>
          )}
        </center>
      </div>
    </MainLayout>
  );
}

export default PageParametres;
