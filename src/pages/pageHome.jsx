import MainLayout from "../layout/mainlayout";
import { useNavigate } from "react-router-dom";
import React, { useRef, useEffect } from "react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function PageHome() {
  const navigate = useNavigate();
  const navRef = useRef(null);
  const navToggleRef = useRef(null);
  const sectionsRef = useRef([]);
    const { user } = useContext(AuthContext);

  useEffect(() => {
    const nav = navRef.current;
    const navToggle = navToggleRef.current;

    if (!nav || !navToggle) return;

    const handleNavToggle = () => {
      nav.classList.toggle("open");
      navToggle.classList.toggle("open");
    };

    navToggle.addEventListener("click", handleNavToggle);

    const navLinks = nav.querySelectorAll("a");

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.classList.remove("open");
      });
    });

    const checkVisibility = () => {
      sectionsRef.current.forEach((section) => {
        if (!section) return;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        const breakpoint = sectionTop + sectionHeight / 4 - windowHeight;

        if (scrollPosition > breakpoint) {
          section.classList.add("show");
        }
      });
    };

    window.addEventListener("scroll", checkVisibility);
    checkVisibility();

    navLinks.forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    return () => {
      if (navToggle) {
        navToggle.removeEventListener("click", handleNavToggle);
      }
      window.removeEventListener("scroll", checkVisibility);
    };
  }, []);

  const goToWhatsapp = () => {
    window.location.href = "https://chat.whatsapp.com/HT00ve4gxYcFDkcNW5wH6p";
  };

  const goToFacebook = () => {
    window.location.href =
      "https://www.facebook.com/Particommuniste/?locale=fr_FR";
  };

  const goToYoutube = () => {
    window.location.href = "https://www.youtube.com/@publicsenat";
  };

  const goToAdhesion = () => {
    navigate("/formulaire");
  };
  const goToForum = () => {
    navigate("/forum");
  };

  const goToMembres = () => {
    navigate("/membres");
  };

  return (
    <MainLayout>
      <style>
        {`
          /* Styles CSS de base - Mobile First */
body {
  font-family: "Arial", sans-serif; /* Police moderne et lisible */
  margin: 0;
  padding: 0;
  background: linear-gradient(
    to bottom,
    #f8f9fa,
    #ffffff
  ); /* Léger gradient */
  color: #343a40; /* Gris foncé */
  line-height: 1.6;
  overflow-x: hidden; /* Empêche le défilement horizontal indésirable */
}

/* En-tête */


.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #28a745; /* Vert plus moderne */
}


/* Section Héros */
.hero {
  background-color: #28a745;
  color: #fff;
  padding: 4rem 1rem;
  text-align: center;
  opacity: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 75vh;
}

@keyframes heroFadeIn {
  to {
    opacity: 1;
  }
}

@keyframes textShow {
  to{
    top:0px;
  }
}

.hero h1 {
  position: relative;
  top:-1000px;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  margin-top: 0;
  text-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.2);
  animation:1s ease-in-out forwards textShow;
}

.hero p {
  opacity: 0;
  font-size: 1.1rem;
  line-height: 1.8;
  animation: 1s ease-in-out forwards heroFadeIn;
  animation-delay: 0.9s;
}

/* Sections de Contenu */
.section {
  padding: 3rem 1rem;
  background-color: #fff;
  margin-bottom: 1.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.03);
  border-radius: 0.5rem;
  opacity: 1;
  transform: translateY(30px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
  scroll-margin-top: 30px;
}

.section.show {
  opacity: 1;
  transform: translateY(0);
}

.section h2 {
  color: #28a745;
  margin-bottom: 1.2rem;
  text-align: center;
  font-size: 2rem;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-content img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.07);
}

.president-picture{
  margin-top: 1rem;
}

.section-content p {
  line-height: 1.7;
}

.section-content ul {
  padding-left: 1.5rem;
}

.section-content li {
  margin-bottom: 0.5rem;
}

/* Section Adhésion */
.adhesion-section {
  background-color: #e9ecef; /* Gris clair */
  padding: 2rem 1rem;
  text-align: center;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 3rem 1rem;
  scroll-margin-top: 50px;
  min-height: 70vh;
}

.adhesion-section h2 {
  color: #28a745;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.adhesion-button {
  display: inline-block;
  background-color: #28a745;
  color: #fff;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 0.25rem;
  font-weight: bold;
  transition: background-color 0.3s ease-in-out;
}

.adhesion-button:hover {
  background-color: #1e7e34; /* Vert plus foncé */
}

/* Infos de Contact */
.contact-info {
  background-color: #fff;
  padding: 2rem 1rem;
  text-align: center;
  box-shadow: 0 -0.125rem 0.25rem rgba(0, 0, 0, 0.03);
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.contact-info h3 {
  color: #28a745;
  margin-bottom: 1rem;
  font-size: 1.75rem;
}

.contact-info p {
  margin: 0.5rem 0;
}

/* Pied de Page */
footer {
  background-color: #343a40;
  color: #fff;
  text-align: center;
  padding: 1rem 0;
  font-size: 0.9rem;
}

#presentation, #objectifs, #adhesion{
  background-color: #e9ecef;;
}

/* Styles pour les écrans plus grands (Ordinateur) */
@media (min-width: 992px) {

  .hero {
    padding: 2rem 3rem;
  }

  .hero h1 {
    font-size: 3.5rem;
  }

  .section {
    padding: 4rem 3rem;
  }

  .section-content {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap:5vw;
    align-items: flex-start;
    width: 80%;
    margin:auto;
  }

  .section-content > div {

    padding-right: 2rem;
  }

  .section-content img {
    max-width: 40%;
    height: auto;

  }


  /* Inverser l'ordre pour certaines sections pour varier la mise en page */
  #vision .section-content,
  #ideologie .section-content, #organisation .section-content {
    flex-direction: row-reverse;
  }

  #vision .section-content > div,
  #ideologie .section-content > div, #organisation .section-content > div {
    padding-right: 0;

  }

  #vision .section-content img,
  #ideologie .section-content img, #organisation .section-content {
    margin-left: 0;

    margin:auto;
  }

  .adhesion-section {
    padding: 3rem;
  }

  .adhesion-section .section-content {
    flex-direction: row; /* Afficher l'image et le texte côte à côte */
    align-items: center;
    text-align: left; /* Aligner le texte à gauche */
  }

  .adhesion-section .section-content img {
    max-width: 300px;
    margin-right: 0rem;
    margin-bottom: 0;
  }

  .contact-info {
    padding: 3rem;
    margin: auto;
    width: fit-content;
  }

}

/* Animations de défilement améliorées */
.fade-in-scroll {
  opacity: 1;
  transform: translateY(30px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}

.fade-in-scroll.show {
  opacity: 1;
  transform: translateY(0);
}
/* Styles pour la section hero */
.hero {
  background-color: #28a745; /* Couleur verte du parti */
  color: #fff;
  padding: 4rem 1rem;
  text-align: center;
  animation: heroFadeIn 1s ease-in-out forwards;
  opacity: 1;
  display: flex; /* Utilisation de flexbox pour l'alignement */
  flex-direction: column; /* Empiler les éléments verticalement */
  align-items: center; /* Centrer les éléments horizontalement */
  justify-content: center; /* Centrer les éléments verticalement (facultatif, dépend de la hauteur de la section) */

}

@keyframes heroFadeIn {
  to {
    opacity: 1;
  }
}

@keyframes heroFadeInLogo {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem; /* Espacement entre le titre et le logo */
  text-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.2);
}
.logo-container{
  min-width: 300px;
  min-height: 300px;
}
.hero-logo {
  max-width: 300px; /* Ajustez la taille maximale du logo selon vos besoins */
  height: auto;
  margin-bottom: 1rem; /* Espacement entre le logo et le slogan */
  animation: heroFadeInLogo 1s ease-in-out forwards;;
  transform: scale(0.0);
}

.hero p {
  font-size: 1.1rem;
  line-height: 1.8;
}

/* Styles pour les écrans plus grands (Ordinateur) */
@media (min-width: 992px) {
  .hero {
    padding: 6rem 3rem;
  }

  .section-content .maman-image{
    width: 100%;
    height: 350px;
    object-fit: cover;
    object-position: top center;
  }

  .hero h1 {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
  }

  .hero-logo {
    max-width: 300px; /* Taille maximale du logo sur ordinateur */
    margin-bottom: 1.5rem;
  }

  .hero p {
    font-size: 1.3rem;
  }
 .president-picture{
    min-width: 500px;
    margin-top: 2rem;
  }

}
.app-link:link, .app-link:visited{
  text-decoration: none;
  color:#30ca54;
  font-weight: bold;
  border-bottom: #30ca54 1px solid;
  padding-bottom: 0.3em;
}

        `}
      </style>
      <section className="hero" id="acceuil">
        <h1>AADC</h1>
        <div className="logo-container">
          <img src="../img/logo.png" alt="Logo de l'AADC" className="hero-logo" />
        </div>
        <p>UNITE - TRAVAIL - EQUITE</p>
      </section>
      <section id="presentation" className="section fade-in-scroll" ref={(el) => (sectionsRef.current[0] = el)}>
        <h2>Présentation</h2>
        <div className="section-content">
          <img
            className="maman-image"
            src="../img/maman.jpg"
            alt="Présentation de l'AADC - Groupe de personnes diverses travaillant ensemble"
          />
          <div>
            <p>
            AADC est un parti politique en République Démocratique
            du Congo. Il est créé le 22 février 2022
            </p>
            <p>
              <strong>Présidente Nationale:</strong> Honorable Adèle KABENA MUAUKA
            </p>
            <p><strong>Secrétaire Générale:</strong> Isabelle TSHIBUABUA</p>
            <p>
              <strong>Siège National:</strong> 1232, Petit Boulevard, Quartier
              Résidentiel, Commune de Limete/KINSHASA
            </p>
            <p><strong>Idéologie:</strong> Social Démocratie</p>
            <p><strong>Couleurs:</strong> Rouge - jaune - verte</p>
          </div>
        </div>
      </section>
      <section id="vision" className="section" ref={(el) => (sectionsRef.current[1] = el)}>
        <h2>Notre Vision</h2>
        <div className="section-content">
          <img
            src="../img/photo-en-groupe.jpg"
            alt="Vision de l'AADC - Paysage urbain futuriste et prospère"
          />
          <div>
            <p>
              La vision de l'Alliance pour les Actions de Développement du Congo
              est de bâtir <strong>un Congo fort et prospère</strong>, un pays où il fait beau
              vivre.
            </p>
            <p>
              Cette vision de développement intégral proclame la nécessité de
              fédérer les initiatives de développement, améliorer ce qui est déjà
              fait, corriger ce qui est mal fait, réaliser ce qui n'est pas encore
              fait, perfectionner et construire l'excellence pour le social du
              peuple congolais.
            </p>
          </div>
        </div>
      </section>
      <section id="objectifs" className="section fade-in-scroll" ref={(el) => (sectionsRef.current[2] = el)}>
        <h2>Nos Objectifs</h2>
        <div className="section-content">
          <img
            src="../img/acceuil/3.jpg" alt="Objectifs de l'AADC - Flèches atteignant une cible"
          />
          <div>
            <p>L'alliance pour les actions de développement du
Congo a pour objectifs de :
</p>
            <ul>
              <li>
                Conquérir et conserver le pouvoir d'Eta par les voies
                démocratiques;
              </li>
              <li>
                Lutter contre les antivaleurs, les inégalités sociales qui
                constituent un frein considérable au développement de nos
                communautés et par conséquent de la société toute entière;
              </li>
              <li>
                Encourager et soutenir des projets de développement au niveau de
                nos communautés et au niveau national;
              </li>
              <li>
                Apporter une expertise politique adéquate afin de permettre aux
                congolais de se sentir chez soi et de développer les valeurs
                patriotiques.
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section id="ideologie" className="section" ref={(el) => (sectionsRef.current[1] = el)}>
        <h2>Idéologie</h2>
        <div className="section-content">
          <img
            src="../img/acceuil/4.jpg"
            alt="Vision de l'AADC - Paysage urbain futuriste et prospère"
          />
          <div>
            <p>
            L'idéologie du Parti est « SOCIAL-DEMOCRATIE >»
qui est l'ensemble des idées forces et des valeurs
qui constituent le fondement des actions du parti
en vue de faire participer le citoyen congolais à
l'établissement des règles de jeu dans tous les
domaines de la vie nationale, et libérer l'homme
de toutes les contraintes qui l'étouffent.
            </p>
          </div>
        </div>
      </section>
      <section id="doctrine" className="section" ref={(el) => (sectionsRef.current[1] = el)}>
        <h2>Doctrine et idéaux</h2>
        <div className="section-content">
          <img
            src="../img/acceuil/5.jpg"
            alt="Vision de l'AADC - Paysage urbain futuriste et prospère"
          />
          <div>
            <p>
            La doctrine du parti est le patriotisme qui consacre
la défense des intérêts supérieurs de la Nation. La
souveraineté de la République Démocratique du
Congo, l'engagement de tout citoyen du
reconstruire le Congo.
            </p>
            <p>L'AADC attend de ses militants qu'ils cultivent dans
leur comportement quotidien, les vertus
patriotiques ci-après:</p>
<ul><li>Le patriotisme</li>
<li>La transparence</li>
<li>Le courage</li>
<li>L'intégrité</li>
<li>La modestie</li>
<li>L'engagement solidaire</li>
<li>La fidélité</li>
<li>La non-violence</li></ul>
          </div>
        </div>
      </section>
      <section id="organisation" className="section fade-in-scroll" ref={(el) => (sectionsRef.current[3] = el)}>
        <h2>Organisation du Parti</h2>
        <div className="section-content">
          <div>
            <h3>Les Organes du parti sont :
            </h3>
            <p>Au niveau national</p>
            <ul>
              <li>Le congrès</li>
              <li>Le bureau politique</li>
              <li>Le conseil National</li>
              <li>Le Secrétariat Général</li>
            </ul>
            <p>Au Niveau Provincial</p>
            <ul>
              <li>Comité Interfédéral</li>
              <li>Comité Fédéral</li>
              <li>Comité Sectionnaire</li>
              <li>Comité Sous-sectionnaire</li>
              <li>Comité Cellulaire</li>
            </ul>
            <p>Le Secrétariat Général est l'organe d'exécution et
de coordination des activités et des programmes
du parti. Il assure la gestion quotidienne du parti
et Prépare les dossiers destinés au Conseil
National, au Bureau Politique et au Congrès.</p>
<p>Il est dirigé par un Secrétaire Général assisté de
deux adjoints
</p>
<img src="../img/maman2.jpg" className="maman-image" alt="" />
<center><p><strong>Isabelle TSHIBUABUA</strong> <br /> Secrétaire Générale AADC</p></center>
          </div>
        </div>
      </section>
     {!user &&  <section className="adhesion-section section fade-in-scroll" id="adhesion" ref={(el) => (sectionsRef.current[4] = el)}>
        <h2>Rejoignez l'AADC</h2>
        <div className="section-content adhesion" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img
            src="../img/president.jpg"
            alt="Organisation de l'AADC - Organigramme ou réseau"
            className="president-picture"
          />
          <Link
            onClick={(event)=>{event.preventDefault(); navigate("/adhesion-en-ligne")}} 
            className="adhesion-button"
          >Cliquez pour s'adhérer</Link>
        </div>
      </section>}
      <section id="contact" className="section fade-in-scroll" ref={(el) => (sectionsRef.current[5] = el)}>
      <h2>Pour plus d'info</h2>
        <div className="section-content" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p><strong>Téléphone:</strong>  (+243) 973 951 270</p>
          <p><strong>Email:</strong>  aadcnewsofficiel@gmail.com
          </p>
        </div>
      </section>
      <footer>
        <p> <a href="AADC.apk" className="app-link">Telecharger l'Application</a>
          <small style={{display:"none"}}>Powered by Congosoft</small></p>
      </footer>
    </MainLayout>
  );
}

export default PageHome;
