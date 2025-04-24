import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/mainlayout";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
function PageAbout() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
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




  return (
    <MainLayout>
      <main>
        <section className="apropos">
          <div className="container">
            <div className="autorite-morale">
              <h2>Autorité morale :</h2>
              <div className="autorite">
                <img src="../img/mamama.PNG" alt="" />
                <p>Honorable Adèle KABENA MUAUKA</p>
              </div>
              <small>{"<< AADC >> "}</small>
            </div>
            <div className="information">
              <h2> C'est quoi AADC ? </h2>
              <p>
              L’Alliance pour les Actions de Développement du Congo (AADC) est un mouvement citoyen engagé pour le progrès et le bien-être de la population congolaise. L’AADC se veut une plateforme de rassemblement des forces vives du pays, œuvrant pour un développement durable, équitable et participatif.
              </p>
            </div>
          </div>
        </section>
        <section className="plus-info">
          <h2 style={{margin:"0.4em 0em",}}>Notre slogan</h2>
          <p>
            AADC, victoire ! <br /> AADC, victoire ! <br /> AADC, victoire, victoire, victoire !
         </p> 
          <h2 style={{margin:"0.8em 0em",}}>Il a comme objectif</h2>
          <ul>
            <li>Conquérir et conserver le pourvoir d'Etat par les voies démocratiques</li>
         <li>Lutter contre les antivaleurs, les inégalités sociales qui constituent un frein considérable au développement de nos communautés et par conséquent de la société toute entière</li>
         <li>Encourager et soutenir des projets de dévéloppement au niveau de nos communautés et au niveau national</li>  
         <li>Apporter une expertise politique adéquate afin de permettre aux congolais de se sentir chez soi et de développer les valeurs patriotiques</li>
          </ul>
        </section>
          <section className="apropos deux">
            <div className="information">
              <h2>Comment utiliser ?</h2>
              <p>
                Si vous ne savez pas comment utiliser cette application web,
                vous pouvez telecharger le manuel utilisateur. C'est un fichier PDF avec des explications qui vous aide à comprendre comment utiliser cette application.
              </p>
            </div>
            <center>
             <a href="#" download onClick={(event)=>{event.preventDefault();openDialog()}}>
             <button className="voir-plus" style={{ padding: "0.5em 1em", fontSize: "1.2rem", fontWeight: "bolder"}}>Télécharger le manuel</button>
             </a>
            </center>
          </section>
          <footer>
           <center> <p>
              <strong> Crée par : </strong>
              <br />
              <br />
              <div>
              <a href="https://wa.me/+243826114378">André Amundala</a>{" "}
              <span
                style={{
                  backgroundColor: "green",
                  color: "white",
                  padding: "0.3em",
                  fontWeight: "bold",
                  marginLeft: "1em",
                  fontSize: "0.8rem",
                }}
              >
                Analyste
              </span></div>{" "}
             {/* <!--  <div>
              <a href="https://wa.me/+243812879044">Jésus Crhist</a>{" "}
              <span
                style={{
                  backgroundColor: "orange",
                  color: "white",
                  padding: "0.3em",
                  fontWeight: "bold",
                  marginLeft: "1em",
                  fontSize: "0.8rem",
                }}
              >
                Concepteur
              </span></div>{" "} --> */}
              <div>
              <a href="https://wa.me/+243898652101">Camille Pande</a>{" "}
              <span
                style={{
                  backgroundColor: "orange",
                  color: "white",
                  padding: "0.3em",
                  fontWeight: "bold",
                  marginLeft: "1em",
                  fontSize: "0.8rem",
                }}
              >
                Programmeur
              </span>
              </div>
            </p></center>
            <br />
            <br />
            <br />
<center style={{marginBottom:"1em"}}>            <strong > Télécharger : </strong></center>
          <div style={{textAlign:"right", width:"90%", margin:"auto", }}> 
           <a href="../data/AADC.apk" download style={{border:"none"}}> <img src="../icon/android.png" width="80px" /></a>
            <a href="#" style={{border:"none"}}><img onClick={(event)=>{event.preventDefault();openDialog2()}} src="../icon/ios.png" width="80px" style={{marginLeft:"1em"}}/> </a>
           <a href="#" download style={{border:"none"}}> <img onClick={(event)=>{event.preventDefault();openDialog2()}} src="../icon/windows.png" width="80px" style={{marginLeft:"1em"}}/></a>
            </div>
          </footer>
      </main>
      <dialog
          id="modal"
          style={{
            fontWeight: "bold",
            width: "90%",
            maxWidth: "500px",
          }}
        >
          <h3 style={{textAlign: "center" }}>
            Le manuel utilisateur n'est pas encore disponible
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
          <h3 style={{textAlign: "center" }}>
           L'application n'est pas encore disponible pour cette version.
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

export default PageAbout;
