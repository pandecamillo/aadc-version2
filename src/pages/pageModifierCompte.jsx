import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import default_image from "../data/default_profile";
import axios from "axios";
import connection from "../data/connection";
import imageCompression from "browser-image-compression";
import { AuthContext } from "../context/authContext";
import MainLayout from "../layout/mainlayout";
import io from "socket.io-client";

const socket = io.connect(connection);

function PageModifierCompte(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, update } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [typeMembreSelect, setTypeMembreSelect] = useState([]);
  const [fonctionSelect, setFonctionSelect] = useState([]);
  const [niveauSelect, setNiveauSelect] = useState([]);
  const convertirEnHtml = (dateSql) => {
    const date = dateSql.split("T")[0];
    return date;
  };
  const [membre, setMembre] = useState({
    nom: "",
    postnom: "",
    prenom: "",
    sexe: "",
    lieuNaiss: "",
    dateNaiss: "",
    province: "",
    pays: "",
    commune: "",
    avenue: "",
    numero: "",
    profession: "",
    telephone: "",
    idTypeMembre: "",
    idNiveau: "",
    idFonction: "",
    adresse: "",
    photo: default_image,
  });

  membre.dateNaiss = convertirEnHtml(membre.dateNaiss);

  let locationActualiteId = parseInt(location.pathname.split("/")[2]);

  useEffect(() => {
    if(!user || user && user.idFonction == null){
      alert("AADC : vous n'êtes pas autorisé à accèder à cette information")
      navigate("/home");
      return
    }
    const fetchData = async () => {
      try {
        const res = await axios.get(
          connection + "/lire-membre/" + locationActualiteId
        );
        setMembre(res.data);
        setLoading(false);
      } catch (error) {
        setServerError(true);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    if (
      membre.nom == "" ||
      membre.postnom == "" ||
      membre.prenom == "" ||
      membre.sexe == "" ||
      membre.lieuNaiss == "" ||
      membre.profession == "" ||
      membre.telephone == ""
    ) {
      openDialog2()
      return;
    }
    event.target.disabled = true;
    try {
      await axios.put(
        connection + "/modifier-membre/" + locationActualiteId,
        membre
      );
      socket.emit('membre');
      goToMembre();
    } catch (error) {
      setServerError(true);
    }
  };

  const goToHome = () => {
    navigate("/membres");
  };

  const goToMembre = () => {
    navigate("/home");
  };

  const handleChange = (event) => {
    if (event.target.name == "idFonction" && event.target.value == "") {
      openDialog();
      return;
    }
    setMembre((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  useEffect(() => {
    const fetchSelect = async () => {
      try {
        let typeMembreValues = await axios.get(
          connection + "/lire-type-membre"
        );
        let fonctionValues = await axios.get(connection + "/lire-fonction");
        let niveauValues = await axios.get(connection + "/lire-niveau");
        setTypeMembreSelect(typeMembreValues.data);
        setFonctionSelect(fonctionValues.data);
        setNiveauSelect(niveauValues.data);
      } catch (error) {
        setServerError(true);
      }
    };
    fetchSelect();
  }, []);

  let listTypeMembreSelect = [];
  typeMembreSelect &&
    typeMembreSelect.forEach((value) => {
      if (value.id) {
        listTypeMembreSelect.push(
          <option key={value.id} value={value.id}>
            {value.libelle}
          </option>
        );
      }
    });

  let listFonctionSelect = [];
  fonctionSelect &&
    fonctionSelect.forEach((value) => {
      if (value.id) {
        listFonctionSelect.push(
          <option key={value.id} value={value.id}>
            {value.libelle}
          </option>
        );
      }
    });

  const goToCarte = () => {
    navigate("/paiement");
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

  const openDialog2 = () => {
    document.getElementById("modal2").showModal();
    document.getElementById("modal2").style.opacity = '1'; 
    document.getElementById("modal2").style.transform = 'scale(1)'; 
  };
  const closeDialog2 = () => {
    document.getElementById("modal2").close();
    document.getElementById("modal2").style.opacity = '0'; 
    document.getElementById("modal2").style.transform = 'scale(0.7)'; 
  };

  function convertToBase64(file, event) {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        setMembre((prev) => ({ ...prev, photo: reader.result }));
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  let listNiveauSelect = [];
  let sw = 0;
  let group = "";
  let groupKey = 999;
  niveauSelect &&
    niveauSelect.forEach((value) => {
      groupKey += 1;
      if (value.type == group && sw == 1) {

      } else {
        sw = 0;
        group = value.type;
        sw = 1;
        listNiveauSelect.push(
          <optgroup key={groupKey} label={group}></optgroup>
        );
      }
      if (value.id) {
        listNiveauSelect.push(
          <option key={value.id} value={value.id}>
            {value.libelle}
          </option>
        );
      }
    });

  function importData(event) {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = (_) => {
      // you can use this method to get file and perform respective operations
      let files = Array.from(input.files)[0];
      const options = {
        maxSizeMB: 0,
        maxWidthOrHeight: 100,
        useWebWorker: true,
        fileType: "image/png",
      };
      imageCompression(files, options).then((img) => {
        convertToBase64(img, event);
      });
    };
    input.click();
  }
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
    
      {loading ? (
        <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "40vh",
        }}
        >
          <center>
            <img
              src="../img/wait.gif"
              className="wait"
              width="100%"
              alt="wait"
            />
          </center>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
       
            }}
          >
              <div className="header-controls">
        <img src="../icon/back.png" className="back-btn" onClick={goToMembre} />
      </div>
          <div  style={{ height:"80vh", overflowY:"scroll" }}>
          <section className="form-adhesion" style={{ overflowY: "scroll" }}>
            <center>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    maxWidth: "230px",
                  }}
                >
                  <img
               onClick={importData}
                src={membre.photo || "../img/profile.png"}
                width={"100%"}
                height={150}
                style={{ border: "black 2px solid" }}
                alt="profile"
              />
               <img
               onClick={importData}
              src="../icon/camera.png"
              alt="camera"
              style={{
                backgroundColor: "white",
                position: "absolute",
                width: "20%",
                borderRadius: "50%",
                padding: "0.3em",
                right: 0,
                bottom: 0,
                margin: "0.2em",
              }}
            />
                </div>
              </center>
              <div className="zone">
                <label htmlFor="nom">Nom :</label>
                <input
                  type="text"
                  autoComplete="off"
                  name="nom"
                  value={membre.nom}
                  onChange={handleChange}
                  maxlength={15}
                />
              </div>
              <div className="zone">
                <label htmlFor="prenom">Postnom :</label>
                <input
                  type="text"
                  autoComplete="off"
                  name="postnom"
                  value={membre.postnom}
                  onChange={handleChange}
                  maxlength={15}
                />
              </div>
              <div className="zone">
                <label htmlFor="prenom">Prenom :</label>
                <input
                  type="text"
                  autoComplete="off"
                  name="prenom"
                  value={membre.prenom}
                  onChange={handleChange}
                  maxlength={15}
                />
              </div>
              <div className="zone">
                <label htmlFor="sexe">Sexe :</label>
                <select name="sexe" value={membre.sexe} onChange={handleChange}>
                  <option value=""></option>
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                </select>
              </div>
              <div className="zone">
                <label htmlFor="lieu">Lieu de naissance :</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={membre.lieuNaiss}
                  name="lieuNaiss"
                  onChange={handleChange}
                  maxlength={15}
                />
              </div>
              <div className="zone">
                <label htmlFor="lieu">Date de naissance :</label>
                <input
                  type="date"
                  value={membre.dateNaiss}
                  name="dateNaiss"
                  onChange={handleChange}
                />
              </div>
              <div className="zone">
                <label htmlFor="lieu">Adresse :</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={membre.adresse}
                  name="adresse"
                  onChange={handleChange}
                  maxlength={45}
                />
              </div>
              <div className="zone">
                <label htmlFor="lieu">Profession :</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={membre.profession}
                  name="profession"
                  onChange={handleChange}
                  maxlength={25}
                />
              </div>
              <div className="zone">
                <label htmlFor="lieu">Telephone :</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={membre.telephone}
                  name="telephone"
                  onChange={handleChange}
                  maxlength={15}
                />
              </div>
              <div className="zone">
                <label htmlFor="sexe">Type membre :</label>
                <select
                  name="idTypeMembre"
                  value={membre.idTypeMembre}
                  onChange={handleChange}
                >
                  <option value=""></option>
                  {listTypeMembreSelect}
                </select>
              </div>
              <div className="zone">
                <label htmlFor="sexe">Niveau :</label>
                <select
                  name="idNiveau"
                  value={membre.idNiveau}
                  onChange={handleChange}
                >
                  <option value="">Aucun niveau</option>
                  {listNiveauSelect}
                </select>
              </div>
             {user && user.id != "35253" &&  <div className="zone">
                <label htmlFor="">Fonction:</label>
                <select
                  name="idFonction"
                  value={membre.idFonction}
                  onChange={handleChange}
                >
                  <option value="">Aucune fonction</option>
                  {listFonctionSelect}
                </select>
              </div>}
            </section>
            <center>
            <div
              className="confirm-btn"
              style={{
                width: "100%",
                margin: "auto",
                bottom: "0",
              }}
            >
              <button onClick={handleSubmit}>MODIFIER</button>
              <br />
              <br />
            </div>
          </center>
          </div>
          </div>
         
        </>
      )}
      <dialog
        id="modal"
        style={{
          fontWeight: "bold",
          width: "90%",
          maxWidth: "500px",
        }}
      >
        <h2 style={{ fontSize: "1.3rem", textAlign: "center" }}>
          Voulez vous retirer votre fonction ?
        </h2>
        <br />
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

            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              marginTop: "1em",
              padding: "0.2em 1em",
              backgroundColor: "red",
              color: "white",
              filter:"none"
            }}
            onClick={() => {
              setMembre((prev) => ({ ...prev, idFonction: "" }));
              closeDialog();
            }}
          >
            Oui
          </button>
        </div>
      </dialog>
      <dialog
          id="modal2"
          style={{
            fontWeight: "bold",
            width: "90%",
            maxWidth: "500px",
          }}
        >
          <h3 style={{ textAlign: "center" }}>
            Veuillez remplir tous les champs
          </h3>
          <div
            className="choices"
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <button
              onClick={closeDialog2}
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginTop: "1em",
                padding: "0.2em 1em",
              }}
            >
              OK
            </button>
          </div>
        </dialog>
    </MainLayout>
  );
}

export default PageModifierCompte;
