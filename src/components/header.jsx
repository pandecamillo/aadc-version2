import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function Header() {
  const { logout } = useContext(AuthContext);
  const { user, login } = useContext(AuthContext);
  const [showing, setShowing] = useState(false);
  const navigate = useNavigate();
  const currentPage = useLocation().pathname.split("/")[1];

  useEffect(() => {
    let resizeTimeout;
    function onWindowResize() {
      // Clear any previous timeout
      clearTimeout(resizeTimeout);

      // Set a new timeout to run after 200ms (or any other delay you prefer)
      resizeTimeout = setTimeout(function () {
        if (window.innerWidth >= 1020) {
          document.getElementById("navBar").style.width = "90%";
          setShowing(true);
        }
      }, 200); // Adjust the debounce delay as needed
    }

    // Attach the resize event listener to the window object
    window.addEventListener("resize", onWindowResize);
  }, []);
  const goToLogin = () => {
    navigate("/login");
  };
  const toggleMenu = (event) => {
    document.getElementById("navBar").style.width = showing ? "0%" : "80%";
    setShowing(!showing);
  };

  const handleLogout = () => {
    navigate("/");
    logout();
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <header>
      <div className="flex-it">
        <img
          src="../img/logo.png"
          width="60"
          alt="logo"
          id="logo"
        />
      </div>
      <img
        className="menu-icon"
        src={"../icon/" + (showing ? "close.png" : "menu.png")}
        alt="menu"
        id="btnMenu"
        width="30px"
        onClick={toggleMenu}
      />
      <nav id="navBar">
        {user && user.idFonction != null && (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              color: "white",
              backgroundColor: "green",
              padding: "0.2em 0.5em",
              margin: "0.5em",
              fontWeight: "bold",
            }}
          >
            Admin
          </span>
        )}
        {user ? (
          <div className="user-profile"  onClick={(event)=>{event.preventDefault();toggleMenu(); navigate("/profile")}}>
            <img src={user.photo || "../img/profile.png"} alt="profile" />
            <p
              style={{
                color: user.theme == "sombre" ? "white" : "black",
                textWrap: "nowrap",
              }}
            >
              {user.nom + " " + user.prenom}
            </p>
          </div>
        ) : (
          <center>
            <img
              src="../img/logo.png"
              id="header-profile"
              style={{
                width: "70%",
                minWidth:"220px",
                maxWidth: "220px",
                paddingBottom: "1em",
              }}
              alt=""
            />
          </center>
        )}
        <ul>
          <div className="nav-link">
            <img src="../icon/home.png" alt="" />
            <Link  onClick={(event)=>{event.preventDefault();toggleMenu(); navigate("/home")}} className="link">
              Acceuil
            </Link>
          </div>
          {!user && (
            <div className="nav-link">
              <img src="../icon/user.png" alt="" />
              <Link onClick={(event)=>{event.preventDefault();toggleMenu(); navigate("/adhesion")}}  className="link">
                S'adhérer
              </Link>
            </div>
          )}
          {user && user.idFonction != null && (
            <div className="nav-link">
              <img src="../icon/membres.png" alt="" />
              <Link onClick={(event)=>{event.preventDefault();toggleMenu(); navigate("/membres")}}  className="link">
                Membres
              </Link>
            </div>
          )}
          {user && user.idFonction != null && (
            <div className="nav-link">
              <img src="../icon/niveaux.png" alt="" />
              <Link onClick={(event)=>{event.preventDefault();toggleMenu(); navigate("/interfederation")}}  className="link">
                Niveaux
              </Link>
            </div>
          )}
          {user && (
            <div className="nav-link">
              <img src="../icon/event.png" alt="" />
              <Link onClick={(event)=>{event.preventDefault();toggleMenu(); navigate("/activites")}}  className="link">
                Communiqués
              </Link>
            </div>
          )}
          {user && (
            <div className="nav-link">
              <img src="../icon/chat.png" alt="" />
              <Link onClick={(event)=>{event.preventDefault();toggleMenu(); if(currentPage != "forum")navigate("/forum")}}  className="link">
                Forum
              </Link>
            </div>
          )}
          {user && (
            <div className="nav-link">
              <img src="../icon/settings.png" alt="" />
              <Link onClick={(event)=>{event.preventDefault();toggleMenu(); navigate("/parametres")}}  className="link">
                Parametres
              </Link>
            </div>
          )}
          <div className="nav-link">
            <img src="../icon/about.png" alt="" />
            <Link onClick={(event)=>{event.preventDefault();toggleMenu(); navigate("/about")}}  className="link">
              Apropos
            </Link>
          </div>
        </ul>
        <center>
          {!user && (
            <button className="connect" style={{textWrap:"nowrap"}} onClick={goToLogin}>
              Se connecter
            </button>
          )}
        </center>
      </nav>
    </header>
  );
}

export default Header;
