import React, { useContext, useEffect, useState } from "react";
import data_actualite from "../data/data_actualite";
import Actualite from "../components/actualite";
import MainLayout from "../layout/mainlayout";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { Link } from "react-router-dom";
import connection from "../data/connection";
import Header from "../components/header";

function PageChargement() {
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const verifyUser = async () => {
    if (user) {
      login(user.id);
    }
  };

  const [information, setInformation] = useState("La version gratuite est lente");

  const wakeFreeServer = async () => {
    try {
      // fausse requete pour reveiller le serveur gratuit
      
      await axios.get(connection);
      verifyUser();
      setLoading(false);
      navigate("/home");
    } catch (error) {
      setServerError(true);
    }
  };

  const images = [
    "../img/male.png",
    "../img/female.png",
    "../img/maman.jpg",
    "../img/mamama.png",
    "../img/maman2.jpg",
    "../img/photo-en-groupe.jpg",
    "../img/kinshasa.png",
    "../img/acceuil/1.jpg",
    "../img/acceuil/2.jpg",
    "../img/acceuil/3.jpg",
    "../img/acceuil/4.jpg",
    "../img/acceuil/5.jpg",
    "../img/background.jpg",
    "../img/logo.png",
    "../img/nadine.jpg",
    "../img/photo.png",
    "../img/profile.png",
    "../img/wait.gif",
    "../icon/about.png",
    "../icon/accept.png",
    "../icon/add.png",
    "../icon/adhesion.png",
    "../icon/ajouter.png",
    "../icon/android.png",
    "../icon/back.png",
    "../icon/camera.png",
    "../icon/chat.png",
    "../icon/clear.png",
    "../icon/close.png",
    "../icon/construction.png",
    "../icon/dark.png",
    "../icon/delete.png",
    "../icon/dollars.png",
    "../icon/edit.png",
    "../icon/event.png",
    "../icon/facebook.png",
    "../icon/flag.png",
    "../icon/home.png",
    "../icon/ios.png",
    "../icon/light.png",
    "../icon/membres.png",
    "../icon/menu.png",
    "../icon/money.png",
    "../icon/niveaux.png",
    "../icon/no-camera.png",
    "../icon/notification.png",
    "../icon/refresh.png",
    "../icon/refuse.png",
    "../icon/remove.png",
    "../icon/retry.png",
    "../icon/search.png",
    "../icon/sendMessage.png",
    "../icon/settings.png",
    "../icon/symboles.png",
    "../icon/user.png",
    "../icon/wait.gif",
    "../icon/whatsapp.png",
    "../icon/windows.png",
    "../icon/youtube.png",
  ];

  // ajouter nouveaux images

  const preloadImages = (imageUrls) => {
    return new Promise((resolve, reject) => {
      let loadedCount = 0;
      const totalImages = imageUrls.length;

      imageUrls.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            resolve(); // Resolve when all images are loaded
          }
        };
        img.onerror = reject; // Reject if any image fails to load
      });
    });
  };

  useEffect(() => {
    preloadImages(images)
      .then(() => wakeFreeServer())
      .catch((error) => {
        console.error("Error preloading images", error);
        setImagesLoaded(false);
      });
  }, []);

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
          <div>
            <button
              style={{ fontWeight: "bold", fontSize: "1.2rem" }}
              onClick={() => {
                window.location.reload();
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
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "2em",
        margin: "auto",
        background:
          "linear-gradient(120deg,  rgba(13, 201, 0, 0.7), rgba(138, 210, 209, 0.452),rgba(13, 201, 0, 0.7))",
      }}
    >
      <center>
        <img
          style={{ width: "100%", maxWidth: "300px" }}
          src="../img/logo.png"
        />
        <br />
        <img
          style={{ width: "100%", maxWidth: "200px" }}
          src="../img/loader.gif"
          alt=""
        />
        <p>{information}</p>
      </center>
    </div>
  );
}

export default PageChargement;
