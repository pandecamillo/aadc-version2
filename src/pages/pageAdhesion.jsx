import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import default_image from "../data/default_profile";
import axios from "axios";
import connection from "../data/connection";
import imageCompression from "browser-image-compression";
import MainLayout from "../layout/mainlayout";
import io from "socket.io-client";

const socket = io.connect(connection);

function PageAdhesion(props) {
  const navigate = useNavigate();
  let date = new Date();
  let dateNaturel = date.toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
    photo: default_image,
    idTypeMembre: "",
    dateAdhesion: dateNaturel,
  });

  const [typeMembreSelect, setTypeMembreSelect] = useState([]);

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
      membre.telephone == "" ||
      membre.idTypeMembre == ""
    ) {
      openDialog();
      return;
    }

    event.target.disabled = true;
    try {
      let response = await axios.post(connection + "/adhesion-en-ligne", membre);
      let nomMembre = membre.nom;
      let prenomMembre = membre.prenom;
      let idMembre = response.data.insertedId;

      navigate('/information', {
        state: { idMembre,nomMembre, prenomMembre }
      });
      socket.emit('membre');
    } catch (error) {
      setServerError(true);
    }
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
      membre.telephone == "" ||
      membre.idTypeMembre == ""
    ) {
      openDialog();
    } else {
      openEndDialog();
    }
  };
  const openEndDialog = () => {
    document.getElementById("modal2").showModal();
    document.getElementById("modal2").style.opacity = '1'; 
    document.getElementById("modal2").style.transform = 'scale(1)'; 
  };

  
  const nonFinalise = () => {
    navigate("/home");
  };

  const goToPaiement = () => {
    navigate("/paiement");
  };

 

  const goToHome = () => {
    navigate("/");
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

  useEffect(() => {
    const fetchSelect = async () => {
      try {
        let values = await axios.get(connection + "/lire-type-membre/");
        setTypeMembreSelect(values.data);
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
      <div style={{ display: "flex", flexDirection: "column"}}>
        <section
          className="form-adhesion pc"
          style={{
            paddingTop:"2em"
          }}
        >
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
            <input
              type="text"
              name="nom"
              autoComplete="off"
              onChange={handleChange}
              maxLength={15}
            />
          </div>
          <div className="zone">
            <label htmlFor="prenom">Postnom :</label>
            <input type="text" name="postnom" autoComplete="off" onChange={handleChange}   maxLength={15} />
          </div>
          <div className="zone">
            <label htmlFor="prenom">Prenom :</label>
            <input type="text" name="prenom" autoComplete="off" onChange={handleChange}   maxLength={15} />
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
            <input type="text" name="lieuNaiss" autoComplete="off" onChange={handleChange}   maxLength={15} />
          </div>
          <div className="zone">
            <label htmlFor="lieu">Date de naissance :</label>
            <input type="date" name="dateNaiss" max="2007-12-31" onChange={handleChange} />
          </div>
          <div className="zone">
            <label htmlFor="lieu">Adresse :</label>
            <input type="text" name="adresse" autoComplete="off" onChange={handleChange}   maxLength={45} />
          </div>
          <div className="zone">
            <label htmlFor="lieu">Profession :</label>
            <input type="text" name="profession" autoComplete="off" onChange={handleChange}   maxLength={25} />
          </div>
          <div className="zone">
            <label htmlFor="lieu">Telephone :</label>
            <input type="text" autoComplete="off" name="telephone" onChange={handleChange}   maxLength={15} />
          </div>
          <div className="zone">
            <label htmlFor="sexe">Type membre :</label>
            <select name="idTypeMembre" onChange={handleChange}>
              <option value=""></option>
              {listTypeMembreSelect}
            </select>
          </div>
        </section>
        <center>
          <div
            className="confirm-btn"
            style={{
              width: "100%",
              margin: "auto",
              marginBottom:"1em",
              bottom: "0",
            }}
          >
            <button onClick={handleSubmit}>CONFIRMER</button>
            <br />
            <br />
          </div>
        </center>
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
           <br />
        <center
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
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
            }}>Adhésion en cours !</h3> <br />{" "}
            <p style={{ textAlign: "left", padding: "0.5em", paddingLeft:"2em" }}>
              Vous allez discuter sur whatsapp avec le président interfederal afin de prendre votre carte et finaliser votre adhésion. 
              <br />
              <br />
            </p>
            <div onClick={goToHome} className="user-profile inter">
              <img src="../img/profile.png"/>
              <p>Président Adida Maseki</p>
            </div>
            <br />
            <br />
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
        </dialog>
      </div>
    </MainLayout>
  );
}

export default PageAdhesion;
