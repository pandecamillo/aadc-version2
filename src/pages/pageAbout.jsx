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
                <img src="../img/mamama.jpg" alt="" />
                <p>Honorable Adèle KABENA MUAUKA</p>
              </div>
              <small>{"<< AADC >> "}</small>
            </div>
            <div className="information">
             
            </div>
          </div>
        </section>
        <section className="plus-info">
          <h2 style={{margin:"0.4em 0em",}}> L'hymne du parti ? </h2> <br />
              <p>
              1) Alliance pour les actions du développement du Congo, unis comme un seul homme pour la liberté.
Construire l'excellence pour le social d'un Congo fort dans le patriotisme et l'intégrité.<br /> <br />
<strong>Victoire victoire AADC victoire, dans l'unité, le travail, l'équité nous vaincrons. X2 </strong> <br /> <br /> <br />

2) levons-nous patriotes pour la prospérité du Congo contre les ennemis de notre héritage, contre le tribalisme, contre les anti-valeurs dans l'unité nous vaincrons. <br /> <br />
<strong>Victoire victoire AADC victoire, dans l'unité, le travail, l'équité nous vaincrons. X2
</strong>
              </p>
              <br /> <br />
              <audio id="audioPlayer" controls>
  <source src="../img/hymne.mp3" type="audio/mpeg"/>
  Your browser does not support the audio element.
</audio>
<br /> <br />
       
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
           
             {/* <center> <p>
              <strong> Developpé par : </strong>
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
              </span></div>{" "}<!--  <div>
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
              </span></div>{" "}
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
            </p></center> --> */}
              
<center style={{marginBottom:"1em"}}>            <strong > Télécharger Application : </strong></center>
          <div style={{textAlign:"right", width:"90%", margin:"auto", }}> 
           <a href="../img/AADC.apk" download style={{border:"none"}}> <img src="../icon/android.png" width="80px" /></a>
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
