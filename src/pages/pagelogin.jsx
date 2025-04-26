import { resolvePath, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useLocation } from "react-router-dom";
import MainLayout from "../layout/mainlayout";
import { Html5Qrcode } from "html5-qrcode";
import { useRef } from 'react';
import Header from "../components/header";

function PageLogin() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState();
  const [serverError, setServerError] = useState(false);
  const [qrError, setQrError] = useState(false);
  const [scannerError, setScannerError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(false);



  const handleScan = async (decodedText) => {
    try {
      //if(!qrError)document.getElementById("qr-reader").style.visibility= "hidden"
      openWait();

      const response = await login(decodedText);
      if (response.data.login) {
        setTimeout(() => {
          closeWait();
          openDialog();
        }, 2500);
        setData(response.data.membre);
      } else {
        closeWait();
        setQrError(true);
      }
    } catch (error) {
      console.log(error)
      setServerError(true);
    }
};


useEffect(() => {

  //(async()=>{await login("qr-value"); navigate("/")})()
 if(user){
  navigate("/home")
  return;
 }

 const html5QrCode = new Html5Qrcode("qr-reader");
  

  // Callback for successful QR scan
  const onScanSuccess = (decodedText, decodedResult) => {
    // Do something with decoded text (e.g., store it or take an action)
    handleScan(decodedText+"")
    html5QrCode.stop()
  };

  // Callback for QR scan errors
  const onScanError = (errorMessage) => {   
  };

  // Start QR scanning

  html5QrCode
    .start(
      { facingMode: "environment" }, // Use the rear camera
      {
        fps: 10, // Frames per second for the scanner
        qrbox: 250, // Scanning box size
      },
      onScanSuccess,
      onScanError
    )
    .then(() => {
      setLoading(false); // Set loading state to false when scanner starts
      setIsScanning(true);
    })
    .catch((err) => {
      setScannerError(true)
      setIsScanning(false);
      setLoading(false); // Stop loading even if there was an error
    });

  // Cleanup function: stop the scanner when the component is unmounted
  return () => {
    if(html5QrCode.getState() == 1)return
    html5QrCode.stop().then(() => {
      console.log("QR Scanner stopped.");
    }).catch((err) => {
      console.error("Error stopping the scanner: ", err);
    });
  };
}, []);


  const goToHome = () => {
    navigate("/home");
  };

  const openDialog = () => {
    document.getElementById("modal-qr").showModal();
    document.getElementById("modal-qr").style.opacity = '1'; 
    document.getElementById("modal-qr").style.transform = 'scale(1)';  
  };

  const openWait = () => {
    document.getElementById("modal-wait").showModal();
    document.getElementById("modal-wait").style.opacity = '1'; 
    document.getElementById("modal-wait").style.transform = 'scale(1)';  
  };

  const closeWait = () => {
    document.getElementById("modal-wait").close(); 
    document.getElementById("modal-wait").style.opacity = '0'; 
    document.getElementById("modal-wait").style.transform = 'scale(0.7)'; 
  };

  const closeDialogAndGo = () => {
    document.getElementById("modal-qr").close();
    document.getElementById("modal-qr").style.opacity = '0'; 
    document.getElementById("modal-qr").style.transform = 'scale(0.7)';

    navigate("/home");
  };
  
 

   const showScanner = () => {
    setQrError(false);
  };

  if (serverError) {
    return (
      <div>
        <center style={{height:"80vh", display:"flex", flexDirection:"column", justifyContent:"center"}}>
          <h2>Vous etes hors ligne</h2>
          <br />
          <div className="confirm-btn">
            <button onClick={() => {
    navigate("/");
  }}>Réessayer</button>
          </div>
        </center>
      </div>
    );
  }

  return ( 
      <div  className="no-dark">
      <Header />  
      <main style={{height:"90vh"}}>
        <section style={{ position: "relative" }}>
          <img
            onClick={goToHome}
            src="../icon/back.png"
            style={{
              backgroundColor: "white",
              filter: "invert(100%)",
              position: "absolute",
              top: 0,
              left: 0,
              margin: "0.8em",
            }}
          />
          <div className="zoneqr">
            <center>
              <h2>Scannez Carte :</h2>
            </center>
            <br />
            {qrError && (
              <center
                style={{
                  height: "250px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px black solid",
                  maxWidth:"400px",
                  margin:"auto"
                }}
              >
                <h3>Le code QR est incorrect </h3>
                <br />
                <br />
                <img
                  className="qr-error"
                  src="../icon/retry.png"
                  width={"20%"}
                  alt="réesayer"
                  onClick={()=>{window.location.reload()}}
                />
              </center>
            )}

{scannerError && (
              <center
                style={{
                  height: "250px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px black solid",
                  maxWidth:"400px",
                  margin:"auto"
                }}
              >
                <h2>Autorisez la camera</h2>
                <br />
                <h3>L'application n'a pas pu à accéder votre camera.</h3>
                <br />
                <br />
                <img
                  src="../icon/no-camera.png"
                  width={"20%"}
                  style={{cursor:"default"}}
                />
              </center>
            )}

            {loading && !scannerError && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
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
                    <img src="../img/wait.gif" className="wait" alt="wait" />
                  </center>
                </div>
              </>
            )}
            <center>
           {!qrError && <div id="qr-reader" style={{ width: "90%", height: "auto", margin:"auto", maxWidth:"500px"}} />}
            </center>
          </div>
          <dialog
              id="modal-qr"
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                maxWidth: "250px"
              }}
            >
              {data && 
                <center>
                  <img
                    id="membre_image_qr"
                    src={data.photo}
                    alt="profile"
                    style={{
                      borderRadius: "50%",
                      width: "90px",
                      height: "90px",
                    }}
                  />
                  <br />
                  <h3>
                    {data.nom} {data.prenom}
                  </h3>
                  <br />
                  <button
                    onClick={closeDialogAndGo}
                    style={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      marginTop: "1em",
                      padding: "0.2em 1em",
                    }}
                  >
                    Continuer
                  </button>
                </center>
              }
            </dialog>
            <dialog
              id="modal-wait"
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                maxWidth: "250px"
              }}
            >
              <div
                  style={{
                    display: "flex",
                    padding: "0em 1.5em",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0em",
                    
                  }}
                >
                  <img
                    src="../img/wait.gif"
                    style={{ width: "20%", marginRight:"1.5em" }}
                    alt="wait"
                  />{" "}
                  <h3>Connexion</h3>
                </div>
            </dialog>
        </section>
      </main>
      </div>
  );
}

export default PageLogin;
