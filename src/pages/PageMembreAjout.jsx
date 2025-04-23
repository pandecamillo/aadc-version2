import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import default_image from "../data/default_profile";
import axios from "axios";
import connection from "../data/connection";
import imageCompression from "browser-image-compression";
import MainLayout from "../layout/mainlayout";
import io from "socket.io-client";
import { AuthContext } from "../context/authContext";

const socket = io.connect(connection);

function PageMembreAjout(props) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [typeMembreSelect, setTypeMembreSelect] = useState([]);
  const [fonctionSelect, setFonctionSelect] = useState([]);
  const [niveauSelect, setNiveauSelect] = useState([]);
  const niveauId = useLocation().pathname.split("/")[2];
  let date = new Date();
  let dateNaturel = date.toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const closeDialog = () => {
    document.getElementById("modal").close();
    document.getElementById("modal").style.opacity = '0'; 
    document.getElementById("modal").style.transform = 'scale(0.7)';
  };

  const openEndDialog = () => {
    document.getElementById("modal2").showModal();
    document.getElementById("modal2").style.opacity = '1'; 
    document.getElementById("modal2").style.transform = 'scale(1)';
  };

  const nonFinalise = () => {
    navigate("/home");
  };

  const [membre, setMembre] = useState({
    nom: "",
    postnom: "",
    prenom: "",
    sexe: "",
    lieuNaiss: "",
    dateNaiss: "",
    adresse: "",
    profession: "",
    telephone: "",
    idNiveau: niveauId,
    idFonction: "",
    idTypeMembre: "",
    photo: default_image,
    dateAdhesion: dateNaturel,
  });

  const pushButton = () => {
    if (
      membre.nom == "" ||
      membre.postnom == "" ||
      membre.prenom == "" ||
      membre.sexe == "" ||
      membre.lieuNaiss == "" ||
      membre.dateNaiss == "" ||
      membre.adresse == "" ||
      membre.profession == "" ||
      membre.telephone == ""
    ) {
      openDialog();
    } else {
      openEndDialog();
    }
  };

  const openDialog = () => {
    document.getElementById("modal").showModal();
    document.getElementById("modal").style.opacity = '1'; 
    document.getElementById("modal").style.transform = 'scale(1)'; 
  };

  const handleSubmit = async (event) => {
    if (
      membre.nom == "" ||
      membre.postnom == "" ||
      membre.prenom == "" ||
      membre.sexe == "" ||
      membre.lieuNaiss == "" ||
      membre.dateNaiss == "" ||
      membre.adresse == "" ||
      membre.profession == "" ||
      membre.telephone == ""
    ) {
      openDialog();
      return;
    }
    event.target.disabled = true;
    try {
      await axios.post(connection + "/ajouter-membre", membre);
      socket.emit('membre');
      navigate("/membres");
    } catch (error) {
      setServerError(true);
    }
  };

  useEffect(() => {
    if(!user || user && user.idFonction == null){
      alert("AADC : vous n'êtes pas autorisé à accèder à cette information")
      navigate("/home");
      return
    }
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
          <option
            key={value.id}
            value={value.id}
          >
            {value.libelle}
          </option>
        );
      }
    });
  const goToHome = () => {
    navigate("/");
  };

  const goToMembre = () => {
    navigate("/membres");
  };

  const goToCarte = () => {
    navigate("/paiement");
  };

  const handleChange = (event) => {
    setMembre((prev) => ({ ...prev, [event.target.name]: event.target.value }));
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
          <div style={{fontWeight:"bold", fontSize:"1.2rem"}}>
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
      <section className="form-adhesion pc" style={{paddingTop: "2em" }}>
          <center>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "230px",
                margin: 0,
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
            <input type="text" name="nom" autoComplete="off" onChange={handleChange}   maxlength={15} />
          </div>
          <div className="zone">
            <label htmlFor="prenom">Postnom :</label>
            <input type="text" name="postnom" autoComplete="off" onChange={handleChange}   maxlength={15} />
          </div>
          <div className="zone">
            <label htmlFor="prenom">Prenom :</label>
            <input type="text" name="prenom" autoComplete="off" onChange={handleChange}   maxlength={15} />
          </div>
          <div className="zone">
            <label htmlFor="sexe">Sexe :</label>
            <select name="sexe" onChange={handleChange}>
              <option value=""></option>
              <option value="M">Homme</option>
              <option value="F">Femme</option>
            </select>
          </div>
          <div className="zone">
            <label htmlFor="lieu">Lieu de naissance :</label>
            <input type="text" autoComplete="off" name="lieuNaiss" onChange={handleChange}   maxlength={15} />
          </div>
          <div className="zone">
            <label htmlFor="lieu">Date de naissance :</label>
            <input type="date" name="dateNaiss" max="2007-12-31" onChange={handleChange} />
          </div>
          <div className="zone">
            <label htmlFor="lieu">Adresse :</label>
            <input type="text" autoComplete="off" name="adresse" onChange={handleChange}   maxlength={45} />
          </div>
          <div className="zone">
            <label htmlFor="lieu">Profession :</label>
            <input type="text" autoComplete="off" name="profession" onChange={handleChange}   maxlength={15}/>
          </div>
          <div className="zone">
            <label htmlFor="lieu">Telephone :</label>
            <input type="text" autoComplete="off" name="telephone" onChange={handleChange}   maxlength={15} />
          </div>
          <div className="zone">
            <label htmlFor="sexe">Type membre :</label>
            <select name="idTypeMembre" onChange={handleChange}>
              <option value=""></option>
              {listTypeMembreSelect}
            </select>
          </div>
          <div className="zone">
            <label htmlFor="sexe">Niveau :</label>
            <select name="idNiveau" onChange={handleChange} value={membre.idNiveau}>
              <option value=""></option>
              {listNiveauSelect}
            </select>
          </div>
          <div className="zone">
            <label htmlFor="">Fonction:</label>
            <select
              name="idFonction"
              value={membre.idFonction}
              onChange={handleChange}
            >
              <option value=""></option>
              {listFonctionSelect}
            </select>
          </div>
        </section>
        <center>
        <div
          className="confirm-btn"
          style={{
            width: "100%",
            margin: "auto",
            bottom: "0",
            marginBottom:"1em",
          }}
        >
          <button onClick={handleSubmit}>ENREGISTRER</button>
          <br />
          <br />
        </div>
      </center>
      </div>
      </div>
     
      <dialog
          id="modal"
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
              onClick={closeDialog}
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
      <dialog
        id="modal2"
        style={{
          fontWeight: "bold",
          width: "90%",
          maxWidth: "500px",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", textAlign: "center" }}>
          La carte coûte 10$
        </h1>
        <center>
          {" "}
          <h3>Esque le membre a payé ?</h3>
        </center>
        <div
          className="choices"
          style={{ display: "flex", justifyContent: "space-evenly" }}
        >
          <button
            onClick={nonFinalise}
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              marginTop: "1em",
              padding: "0.2em 1em",
            }}
          >
            NON
          </button>
          <button
            onClick={handleSubmit}
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              marginTop: "1em",
              padding: "0.2em 1em",
              backgroundColor:"green", 
              color:"white",
              filter:"none"
            }}
          >
            OUI
          </button>
        </div>
      </dialog>
    </MainLayout>
  );
}

export default PageMembreAjout;
