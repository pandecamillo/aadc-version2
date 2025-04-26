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
  const [changement, setChangement] = useState(false);

  const removeAccents = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const openDialog = () => {
    document.getElementById("modal").showModal();
    document.getElementById("modal").style.opacity = "1";
    document.getElementById("modal").style.transform = "scale(1)";
  };

  const closeDialog = () => {
    document.getElementById("modal").close();
    document.getElementById("modal").style.opacity = "0";
    document.getElementById("modal").style.transform = "scale(0.7)";
  };

  const handleClear = () => {
    document.getElementById("txtSearch").value = "";
    setSearch("");
  };

  const handleNiveauType = (event) => {
    let clickedButton = event.target.name;
    setCurrentTab(clickedButton);
    closeDialog();
  };

  const handleSelectNiveau = () => {
    setCurrentInterfederation(document.getElementById("selectNiveau").value);
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
                  <small>{membre.libelle}</small>
                ) : membre.enLigne == "oui" && niveauType == "" ? (
                  <small style={{ color: "rgb(28, 175, 28)" }}>
                    Adhésion en cours
                  </small>
                ) : (
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

  const fetchAllMembre = async () => {
    setLoading(true);
    document.getElementById("txtSearch").value = "";
    setSearch("");
    let res = await axios.get(connection + "/lire-membres/");
    setData(res.data);
    setLoading(false);
  };

  const fetchAdhesions = async () => {
    setLoading(true);
    document.getElementById("txtSearch").value = "";
    setSearch("");
    let res = await axios.get(connection + "/lire-membres-en-ligne");
    setData(res.data);
    setLoading(false);
  };

  
  const fetchNiveauType = async () => {
    setLoading(true);
    setFirsLoad(true);
    document.getElementById("txtSearch").value = "";
    setSearch("");
    niveauType && console.log("niveau : " + niveauType);
    try {
      let res;
      if (niveauType == "") {
        setNiveauId(firstInterfederation);
        res = await axios.get(connection + "/lire-membres/");
        setFirsLoad(false);
        setData(res.data);
        setLoading(false);
        setFirsLoad(false);
        console.log("tout");
        return;
      }

      if (niveauType == "interfederation" && niveauId) {
        setSearch("");
        res = await axios.get(
          connection + "/lire-membres-niveauId/" + niveauId
        );
        setData(res.data);
        setLoading(false);
        setFirsLoad(false);
        console.log("inter");
        return;
      }
      if (niveauType == "enligne") {
        setNiveauId(firstInterfederation);
        res = await axios.get(connection);
        setData(res.data);
        setLoading(false);
        setFirsLoad(false);
        console.log("en ligne");
        return;
      }
      setLoading(false);
      setFirsLoad(false);
    } catch (error) {
      setServerError(true);
    }
  };
  const [interfederations, setInterfederations] = useState([]);
  const [firstInterfederation, setFirstInterfederation] = useState(0);

  const [currentInterfederation, setCurrentInterfederation] = useState();
  const fetchSelect = async () => {
    let values = await axios.get(connection + "/lire-tous-interfederation/");
    setInterfederations(values.data);
    setCurrentInterfederation(values.data[0].id);
  };

  useEffect(() => {
    fetchNiveauType();
    setChangement(false);
  }, [niveauType, changement, niveauId]);

  const [currentTab, setCurrentTab] = useState("tous")

  useEffect(() => {
    fetchAllMembre();
    fetchSelect();
  }, []);

  const renderTab = ()=>{
    if(currentTab == 'tous'){
         fetchAllMembre();
    }else if(currentTab == 'interfederation'){
         document.getElementById("selectNiveau").value = currentInterfederation;
         fetchInterfederation(currentInterfederation);
    }else{
        fetchAdhesions();
    }
  }

  const fetchInterfederation = async(interfederation)=>{
    setSearch("");
    let res = await axios.get(
          connection + "/lire-membres-niveauId/" + interfederation
        );
        setData(res.data);
        setLoading(false);
        setFirsLoad(false);
  }

  const makeChangementOnAdhesion = async()=>{
       console.log(currentTab)
       if(currentTab == 'adhesion'){
          fetchAdhesions();
       }
  }

  
  socket.on("membre", makeChangementOnAdhesion);

  useEffect(() => {
    renderTab();
  }, [currentTab, currentInterfederation]);

  useEffect(() => {
    if (!user || (user && user.idFonction == null)) {
      alert("AADC : vous n'êtes pas autorisé à accèder à cette information");
      navigate("/home");
      return;
    }

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
                <small>{membre.libelle}</small>
              ) : membre.enLigne == "oui" && niveauType == "" ? (
                <small style={{ color: "rgb(28, 175, 28)" }}>
                  Adhésion en cours
                </small>
              ) : (
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
  interfederations &&
    interfederations.forEach((value) => {
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
    navigate("/membre-ajout");
  };

  const [serverError, setServerError] = useState(false);
  if (serverError) {
    return (
      <div>
        <center
          style={{
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2>Vous etes hors ligne</h2>
          <br />
          <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
            <button
              onClick={() => {
                navigate("/");
              }}
            >
              Réessayer
            </button>
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
          style={{ margin: "1.2em" }}
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
                <h4 className="nbr-membre">
                  {data.length}{" "}
                  {niveauType == "enligne" ? "adhesions" : "membres"}
                </h4>
              ) : data.length == 1 ? (
                <h4 className="nbr-membre">
                  1 {niveauType == "enligne" ? "adhesion" : "membre"}
                </h4>
              ) : (
                <h4 className="nbr-membre"></h4>
              )}
            </p>
            {currentTab == "interfederation" && (
              <div>
                {selectValues && (
                  <div className="selectNiveau">
                    <label htmlFor="selectNiveau">
                      Choisir l'interfederation :{" "}
                    </label>

                    <select
                      name="selectNiveau"
                      id="selectNiveau"
                      onChange={handleSelectNiveau}
                    >
                      {listeSelectValues}
                    </select>
                  </div>
                )}
              </div>
            )}
            {currentTab == "tous" && (
              <h2 style={{ marginTop: "0.1em", textTransform: "uppercase" }}>
                Tous les membres
              </h2>
            )}
          
            {currentTab == "adhesion" && (
              <h2 style={{ marginTop: "0.1em", textTransform: "uppercase" }}>
                ADHESIONS
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
          ) : search.length > 3 ? (
            <>{searchResult}</>
          ) : listeMembres.length > 0 ? (
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
                margin: "0.3em",
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
                  filter: "none",
                }}
                name="tous"
                onClick={handleNiveauType}
                className="dialog-btn"
              >
                Tous les membres
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
                  filter: "none",
                }}
                className="dialog-btn"
                name="interfederation"
                onClick={handleNiveauType}
              >
                Interfederations
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
                  filter: "none",
                }}
                name="adhesion"
                onClick={handleNiveauType}
              >
                Adhésions
              </button>
            </div>
          </dialog>
        </section>
      </MainLayout>
    </>
  );
}

export default PageMembres;
