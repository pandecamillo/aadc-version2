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

function PageMembres() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [niveauType, setNiveauType] = useState("");
  const [niveauId, setNiveauId] = useState("");
  const [dialogChoix, setDialogChoix] = useState(false);
  const [selectValues, setSelectValues] = useState([]);
  const [firstLoad, setFirsLoad] = useState(true);
  const [changement, setChangement] = useState(false)
 
  const removeAccents = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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

  const handleClear = () => {
    document.getElementById("txtSearch").value = "";
    setSearch("");
  };

  const handleNiveauType = (event) => {
    let clickedButton = event.target.name;
    setNiveauId("");
    setNiveauType(clickedButton);
    closeDialog();
  };

  const handleSelectNiveau = () => {
    setNiveauId(document.getElementById("selectNiveau").value);
  };

  const handleSearchChange = (e) => {
    setSearch(removeAccents(e.target.value.toUpperCase().replace(" ", "")));
    let listeSearch = [];
    search &&
      data &&
      data.forEach((membre) => {
        let nom = removeAccents(membre.nom.toUpperCase());
        let postnom = removeAccents(membre.postnom.toUpperCase());
        let prenom = removeAccents(membre.prenom.toUpperCase());
        let complet1 = nom + postnom + prenom;
        let complet2 = nom + prenom;
        let complet3 = prenom + nom;
        let complet4 = nom + postnom;
        let complet5 = nom;
        let complet6 = prenom;
        let complet7 = postnom;
        if (
          complet1.includes(search) ||
          complet2.includes(search) ||
          complet3.includes(search) ||
          complet4.includes(search) ||
          complet5.includes(search) ||
          complet6.includes(search) ||
          complet7.includes(search)
        ) {
          listeSearch.push(
            <div
            className="membre"
            key={membre.id}
            onClick={() => {
              navigate("/membre-info/" + membre.id);
            }}
          >
            <img src={membre.photo || "../img/profile.png"} alt="" />
            <div className="membre-informations">
              <h4 className="nom">
                {membre.id == user.id
                  ? "Vous"
                  : membre.nom + " " + membre.prenom}
              </h4>
              {membre.id_du_niveau ? (
                <small>
                  {membre.libelle}
                </small>
              ) : membre.enLigne == "oui" ? (<small style={{color:"rgb(28, 175, 28)"}}>Adhéré{membre.sexe == "F" ? "e":""} en ligne</small>) :(
                <small>Aucun niveau</small>
              )}
              {membre.fonction ? (
                <h5 className="auth">{membre.fonction}</h5>
              ) : (
                <h5 className="invisible-man">membre</h5>
              )}
            </div>
          </div>
          );
        }
      });
    setSearchResult(listeSearch);
  };

  const fetchNiveauType = async () => {
    setLoading(true);
    setFirsLoad(true)
    setSearch("");
    try {
      let res;
      if(niveauType == "enligne"){
        res = await axios.get(
          connection + "/lire-membres-en-ligne");
          setData(res.data);
          setLoading(false)
          setFirsLoad(false)
          return;
      }
      if (niveauType != "" && niveauId == "") {
        res = await axios.get(
          connection + "/lire-membres-niveauType/" + niveauType
        );
        setData(res.data);
        setLoading(false);
        setFirsLoad(false)
      } else if (niveauId != "") {
        res = await axios.get(
          connection + "/lire-membres-niveauId/" + niveauId
        );
        setData(res.data);
        setLoading(false);
      } else {
        res = await axios.get(connection + "/lire-membres/");
        setFirsLoad(false);
        setData(res.data);
        setLoading(false);
        setFirsLoad(false)
      }
      setFirsLoad(false)
    } catch (error) {
      setServerError(true);
    }
  };


  const fetchSelect = async () => {
    setNiveauId("");
    setSearch("");
    if (!loading) document.getElementById("txtSearch").value = "";
    try {
      let values;
      setLoading(true);
      if (niveauType != "") {
        values = await axios.get(
          connection + "/lire-tous-niveauType/" + niveauType
        );
        setSelectValues(values.data);
      }
      setLoading(false);
    } catch (error) {
      setServerError(true);
    }
  };

  
  useEffect(() => {
    fetchNiveauType();
    setChangement(false)
  }, [niveauType, niveauId, changement]);

  useEffect(() => {
    if(!user || user && user.idFonction == null){
      alert("AADC : vous n'êtes pas autorisé à accèder à cette information")
      navigate("/home");
      return
    }
    fetchSelect();
    socket.on('membre', () => {
      setChangement(true)
  })
 
  }, [niveauType]);


 

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
              navigate("/membre-info/" + membre.id);
            }}
          >
            <img src={membre.photo || "../img/profile.png"} alt="" />
            <div className="membre-informations">
              <h4 className="nom">
                {membre.id == user.id
                  ? "Vous"
                  : membre.nom + " " + membre.prenom}
              </h4>
              {membre.id_du_niveau ? (
                <small>
                  {membre.libelle}
                </small>
              ) : membre.enLigne == "oui" ? (<small style={{color:"rgb(28, 175, 28)"}}>Adhéré{membre.sexe == "F" ? "e":""} en ligne</small>) :(
                <small>Aucun niveau</small>
              )}
              {membre.fonction ? (
                <h5 className="auth">{membre.fonction}</h5>
              ) : (
                <h5 className="invisible-man">membre</h5>
              )}
            </div>
          </div>
        );
      }
    });

  let listeSelectValues = [];
  selectValues &&
    selectValues.forEach((value) => {
      if (value.id) {
        listeSelectValues.push(
          <option key={value.id} value={value.id}>
            {value.libelle}{" "}
            {value.type == "section"
              ? value.commune
              : value.type == "federation"
              ? value.province
              : ""}
            {value.nombre > 0 && value.nombre != 1
              ? " (" + value.nombre + " membres)"
              : value.nombre == 1
              ? " (" + value.nombre + " membre)"
              : ""}
          </option>
        );
      }
    });

  const goToHome = () => {
    navigate("/");
  };
  const goToNewEvent = () => {
    if (niveauId) {
      navigate("/membre-ajout/" + niveauId);
    } else {
      navigate("/membre-ajout/0");
    }
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
      <img
            src="../icon/add.png"
            className="add-button"
            onClick={goToNewEvent}
          />
        <section className="header-list-membre">
          <div>
            {user && (
              <button
                className="btn-dark"
                onClick={openDialog}
                style={{
                  fontWeight: "bold",
                  marginBottom: "1em",
                  padding: "0.2em 1em",
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                AFFICHER PAR
              </button>
            )}
            <p>
              {data.length > 0 ? (
                <h4
                  className="nbr-membre"
                >
                  {data.length} membres
                </h4>
              ) : data.length == 1 ? (
                <h4
                 className="nbr-membre"
                >
                  1 membre
                </h4>
              ) : (
                <h4
                 className="nbr-membre"
                ></h4>
              )}
            </p>
            {niveauType != "" && niveauType != "secretariat general" && niveauType != "enligne" && (
              <div>
                {selectValues && (
                  <div className="selectNiveau">
                    <label htmlFor="selectNiveau">
                      Choisir {niveauType} :{" "}
                    </label>

                    <select
                      name="selectNiveau"
                      id="selectNiveau"
                      onChange={handleSelectNiveau}
                    >
                      <option value="">Tous les {niveauType}s</option>
                      {listeSelectValues}
                    </select>
                  </div>
                )}
              </div>
            )}
            {niveauType == "Mon niveau" && (
              <h2 style={{ marginTop: "0.1em", textTransform: "uppercase" }}>
                {user.niveauType + " : " + user.libelle}
              </h2>
            )}
            {niveauType == "" && (
              <h2 style={{ marginTop: "0.1em", textTransform: "uppercase" }}>
                Tous les membres
              </h2>
            )}
            {niveauType == "aucun niveau" && (
              <h2 style={{ marginTop: "0.1em", textTransform: "uppercase" }}>
                Pas de niveau
              </h2>
            )}
            {niveauType == "secretariat general" && (
              <h2 style={{ marginTop: "0.1em", textTransform: "uppercase" }}>
                Secretariat
              </h2>
            )}
            {niveauType == "enligne" && (
              <h2 style={{ marginTop: "0.1em", textTransform: "uppercase" }}>
                ADHESIONS EN LIGNE
              </h2>
            )}
          </div>
          <div className="searchbar">
            <div className="search">
              <img src="../icon/search.png" alt="search" />
              <input
                type="text"
                autoComplete="off"
                placeholder="Rechercher membre"
                id="txtSearch"
                onKeyDown={handleSearchChange}
              />
              {search.length > 3 && (
                <img
                  src="../icon/clear.png"
                  alt="clear"
                  class="clear"
                  onClick={handleClear}
                />
              )}
            </div>
          </div>
        </section>
        <section className="list-membres">
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
            ) : search.length > 3 ? (<>{searchResult}</>) : listeMembres.length > 0 ? (
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

          <dialog
            id="modal"
            style={{
              fontWeight: "bold",
              width: "90%",
              maxWidth: "500px",
              padding: "1.2em 2em",
            }}
          >
            <img
              src="../icon/close.png"
              width="25px"
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                margin:"0.3em"
              }}
              onClick={closeDialog}
            />
            <p style={{ fontSize: "1.1rem", textAlign: "center" }}>
              Afficher par :
            </p>
            <div
              className="choices"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5em",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginTop: "1em",
                  padding: "0.2em 1em",
                  backgroundColor: "green",
                  color: "white",
                  width: "100%",
                  maxWidth: "300px",
                  filter:"none"
                }}
                name=""
                onClick={handleNiveauType}
                className="dialog-btn"
              >
                Tous les membres
              </button>
              <button
                className="dialog-btn"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginTop: "1em",
                  padding: "0.2em 1em",
                  backgroundColor: "green",
                  color: "white",
                  width: "100%",
                  maxWidth: "300px",
                                  filter:"none"
                }}
                name="secretariat general"
                onClick={handleNiveauType}
              >
                Secretariat General
              </button>
              <button
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginTop: "1em",
                  padding: "0.2em 1em",
                  backgroundColor: "green",
                  color: "white",
                  width: "100%",
                  maxWidth: "300px",
                                  filter:"none"
                }}
                className="dialog-btn"
                name="interfederation"
                onClick={handleNiveauType}
              >
                Interfederation
              </button>
              <button
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginTop: "1em",
                  padding: "0.2em 1em",
                  backgroundColor: "green",
                  color: "white",
                  width: "100%",
                  maxWidth: "300px",
                                  filter:"none"
                }}
                className="dialog-btn"
                name="federation"
                onClick={handleNiveauType}
              >
                Federation
              </button>
              <button
                className="dialog-btn"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginTop: "1em",
                  padding: "0.2em 1em",
                  backgroundColor: "green",
                  color: "white",
                  width: "100%",
                  maxWidth: "300px",
                                  filter:"none"
                }}
                name="section"
                onClick={handleNiveauType}
              >
                Section
              </button>
              <button
                className="dialog-btn"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginTop: "1em",
                  padding: "0.2em 1em",
                  backgroundColor: "green",
                  color: "white",
                  width: "100%",
                  maxWidth: "300px",
                                  filter:"none"
                }}
                name="sous section"
                onClick={handleNiveauType}
              >
                Sous Section
              </button>
              <button
                className="dialog-btn"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginTop: "1em",
                  padding: "0.2em 1em",
                  backgroundColor: "green",
                  color: "white",
                  width: "100%",
                  maxWidth: "300px",
                                  filter:"none"
                }}
                name="cellule"
                onClick={handleNiveauType}
              >
                Cellule
              </button>
              <button
                className="dialog-btn"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginTop: "1em",
                  padding: "0.2em 1em",
                  backgroundColor: "green",
                  color: "white",
                  width: "100%",
                  maxWidth: "300px",
                                  filter:"none"
                }}
                name="enligne"
                onClick={handleNiveauType}
              >
                Adhésions en ligne
              </button>
            </div>
          </dialog>
        </section>
      </MainLayout>
    </>
  );
}

export default PageMembres;
