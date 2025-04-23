import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import PageHome from "./pages/pageHome";
import PageActualite from "./pages/pageActualite";
import Page404 from "./pages/page404";
import PageAdhesion from "./pages/pageAdhesion";
import PageInformation from "./pages/pageInformation";
import PageAbout from "./pages/pageAbout";
import PageActualites from "./pages/pageActualites";
import ScrollToTop from "./components/scrolltotop";
import "./style.scss";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import AuthContextProvider, { AuthContext } from "./context/authContext";
import PageProfile from "./pages/pageProfile";

import PageMembres from "./pages/pageMembres";
import PageCarte from "./pages/pageCarte";
import PageMembreAjout from "./pages/PageMembreAjout";
import PageNotification from "./pages/pageNotification";
import PageForum from "./pages/PageForum";
import PageParametres from "./pages/PageParametres";
import PageMembreInfo from "./pages/pagemembreinfo";
import PageMembreModifier from "./pages/pageMembreModifier";
import PageActivitesModifier from "./pages/pageActivitesModifier";
import PageModifierCompte from "./pages/pageModifierCompte";
import Header from "./components/header";
import PageFederation from "./pages/pageFederation";
import PageSection from "./pages/pageSection";
import PageCellule from "./pages/pageCellule";
import PageLogin from "./pages/pagelogin";
import PageMembresNiveau from "./pages/pageMembreNiveau";
import PageSymboles from "./pages/pageSymboles";
import PageFonction from "./pages/pageFonction";
import PageTypeMembre from "./pages/pageTypeMembre";
import PageInformationCommande from "./pages/pageInformationCommande";
import PageChargement from "./pages/pageChargement";
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import PageSymboleAjout from "./pages/pageSymboleAjout";
import PageActivitesAjout from "./pages/pageActivitesAjout";
import PageSymboleModifier from "./pages/pageSymboleModifier";
import PageCotisation from "./pages/pageCotisation";
import PageInterfederation from "./pages/pageInterFederation";
import PageSousSection from "./pages/pageSousSection";
import PageMaCarte from "./pages/pageMaCarte";
import PageErreurPrivilege from "./pages/pageErreurPrivilege";

function PageRouter() {
  return (
    <HashRouter>
      <ScrollToTop>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<PageChargement />} />
            <Route path="home" element={<PageHome />} />
            <Route path="adhesion" element={<PageAdhesion />} />
            <Route path="login" element={<PageLogin />}></Route>
            <Route path="membres" element={<PageMembres />} />
            <Route path="erreur-privilege" element={<PageErreurPrivilege />} />
            <Route path="membre-ajout/:id" element={<PageMembreAjout />} />
            <Route path="interfederation" element={<PageInterfederation />} />
            <Route path="federation/:id" element={<PageFederation />} />
            <Route path="sous-section/:id" element={<PageSousSection />} />
            <Route path="section/:id" element={<PageSection />} />
            <Route path="cellule/:id" element={<PageCellule />} />
            <Route
              path="membre-modifier/:id"
              element={<PageMembreModifier />}
            />
            <Route
              path="compte-modifier/:id"
              element={<PageModifierCompte />}
            />
            <Route path="membre-info/:id" element={<PageMembreInfo />} />
            <Route path="membres-niveau/:id" element={<PageMembresNiveau />} />
            <Route path="carte-membre/:id" element={<PageCarte />} />
            <Route path="ma-carte/:id" element={<PageMaCarte />} />
            <Route path="activites" element={<PageActualites />} />
            <Route path="actualite/:id" element={<PageActualite />} />
            <Route path="activites-ajout" element={<PageActivitesAjout />} />
            <Route path="symboles" element={<PageSymboles />} />
            <Route path="symbole-ajout" element={<PageSymboleAjout />} />
            <Route path="symbole-modifier/:id" element={<PageSymboleModifier />} />
            <Route path="fonction" element={<PageFonction />} />
            <Route path="type-membre" element={<PageTypeMembre />} />
            <Route
              path="activites-modifier/:id"
              element={<PageActivitesModifier />}
            />
            <Route path="information" element={<PageInformation />} />
            <Route path="cotisation" element={<PageCotisation />} />
            <Route
              path="information-commande"
              element={<PageInformationCommande />}
            />
            <Route path="profile" element={<PageProfile />} />
            <Route path="forum" element={<PageForum />} />
            <Route path="notifications" element={<PageNotification />} />
            <Route path="parametres" element={<PageParametres />} />
            <Route path="about" element={<PageAbout />} />

            <Route path="*" element={<Page404 />} />
          </Routes>
        </AuthContextProvider>
      </ScrollToTop>
    </HashRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <PageRouter />
  </>
);
