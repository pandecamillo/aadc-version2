import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useRef, useState } from "react";
import connection from "../data/connection";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import io from "socket.io-client";
import MainLayout from "../layout/mainlayout";

const socket = io.connect(connection);

function PageForum() {
  const navigate = useNavigate();
  const [scroll, setScroll] = useState(false);
  const [data, setData] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const sending = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    socket.on('typing', (nom) => {
      setIsTyping(true);
       showTyping(nom);
      // Clear previous timeout if any
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      // Set a new timeout to hide the typing indicator after 2 seconds
      setTypingTimeout(setTimeout(() => {
        setIsTyping(false);
           hideTyping()
      }, 2000)); // Adjust as needed
    });

    return () => {
      socket.off('typing');
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  const handleTyping = () =>{
    if(document.getElementById("txt_message").value == "")return;
    socket.emit('typing', user.nom);
    // Clear previous timeout for hiding typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    // Hide the typing indicator after 1 second of inactivity
    setTypingTimeout(setTimeout(() => {
      setIsTyping(false);
    hideTyping();
    }, 2000)); // Adjust the delay as needed
  }

  let currentId = 0;

  const openDialog = (id, contenu) => {
    currentId = id;
    try {
      document.getElementById("contenu").value = contenu;
    document.getElementById("contenu").setSelectionRange(0, 0);
    document.getElementById("modal").showModal();
    document.getElementById("modal").style.opacity = '1'; 
    document.getElementById("modal").style.transform = 'scale(1)'; 
    } catch (error) {
      
    }
  };

  const closeDialog = () => {
    currentId = 0;
   try {
    document.getElementById("contenu").value = "";
    document.getElementById("modal").close();
    document.getElementById("modal").style.opacity = '0'; 
    document.getElementById("modal").style.transform = 'scale(0.7)'; 
   } catch (error) {
    
   }
  };

  const openDialog2 = (id) => {
    currentId = id;
  try {
    document.getElementById("modal2").showModal();
    document.getElementById("modal2").style.opacity = '1'; 
    document.getElementById("modal2").style.transform = 'scale(1)'; 
  } catch (error) {
    
  }
  };

  const closeDialog2 = () => {
    currentId = 0;
   try{
    document.getElementById("modal2").close();
    document.getElementById("modal2").style.opacity = '0'; 
    document.getElementById("modal2").style.transform = 'scale(0.7)'; 
   }catch (error){
    
   }
  };

  const showTyping = (nom)=>{
try {
  document.getElementById("typing").textContent= `${nom} est entrain d'ecrire...`
  document.getElementById("typing-container").style.opacity = "1";
  document.getElementById("typing-container").style.transform = "translateY(0%)";
} catch (error) {

}
  }
  const hideTyping = ()=>{
   try {
    document.getElementById("typing").value= ""
    document.getElementById("typing-container").style.opacity = "0";
    document.getElementById("typing-container").style.transform = "translateY(-300%)";
   } catch (error) {

   }
  
  }

  const edit = async (event) => {
    if (document.getElementById("contenu").value == "") {
      return;
    }
    event.target.disabled = true;
    try {
      let res = await axios.put(connection + "/modifier-message", {
        id: currentId,
        contenu: document.getElementById("contenu").value,
      });
      event.target.disabled = false;
      closeDialog();
      setScroll(true);
      fetchData();
      socket.emit("send_message");
    } catch (error) {
      setServerError(true);
      closeDialog();
    }
  };

  const remove = async (event) => {
    event.target.disabled = true;
    try {
      let res = await axios.delete(
        connection + "/supprimer-message/" + currentId
      );
      event.target.disabled = false;
      closeDialog2();
      setScroll(true);
      fetchData();
      socket.emit("send_message");
    } catch (error) {
      setServerError(true);
      closeDialog2();
    }
  };

  const pushData = () => {
    if (sending && !loading) sending.current.style.display = "block";
    (async () => {
      setScroll(true);
      try {
        await axios.post(connection + "/ajouter-message", {
          idEmetteur: user && user.id,
          contenu: document.getElementById("txt_message").value,
        });
        fetchData();
        socket.emit("send_message");
      } catch (error) {
        setServerError(true);
      }
    })();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(connection + "/lire-messages");
      setData(res.data);
      setScroll(true);
    } catch (error) {
      setServerError(true);
    }
    setLoading(false);

    if (sending && !loading) sending.current.style.display = "none";
  };

  socket.on("receive_message", () => {
    fetchData();
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    goDown();
  }, [scroll]);

  const goToHome = () => {
    navigate("/");
  };

  const goToSettings = () => {
    navigate("/parametres");
  };

  const handleSubmit = () => {
    if (document.getElementById("txt_message").value == "") {
      return;
    }

    document.getElementById("btn_send").disabled = true;
    document.getElementById("txt_message").disabled = true;
    pushData();
    document.getElementById("txt_message").value = "";
    document.getElementById("btn_send").disabled = false;
    document.getElementById("txt_message").disabled = false;
  };

  const goDown = () => {
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
    setScroll(false);
  };

  let listMessages = [];
  listMessages =
    data &&
    data.map((message) => {
      if (message.id) {
        let classPosition =
          user && message.idEmetteur == user.id ? "right" : "left";
        let messageNom =
          user && message.idEmetteur == user.id ? "Vous" : message.nom;
        let visible =
          message.modification == "oui" ? "visible" : "hidden";
          const formattedValue = message.contenu.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
        return (
          <div key={message.id} className={`message ${classPosition}`}>
            <div className="sender-info">
              {messageNom != "Vous" && (<img
                className="sender-photo"
                src={message.photo || "../img/profile.png"}
              />)}
              {message.idFonction != null && <p className="user-type">Admin</p>}
              <p className="name">{messageNom}</p>
            </div>
            <p className="contenu">{formattedValue}</p>
            
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.5em"}}>
               <small style={{visibility:visible}}>Modifié</small>
                {messageNom == "Vous" || user.idFonction != null ? (<div className="edit-delete">
                <img
                  src="../icon/edit.png"
                  onClick={() => {
                    openDialog(message.id, message.contenu);
                  }}
                />
                <img
                  src="../icon/delete.png"
                  onClick={() => {
                    openDialog2(message.id);
                  }}
                />
                </div>
                    ):(<div></div>)}
              </div>
        
          </div>
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
      <center>
        <div className="main-forum">
        <center>

        </center>
          <br />
          <div className="message-list">
            {listMessages.length ? (
              <>
              {listMessages}
              <div className="typing" id="typing-container">
     <p id='typing'></p>
     </div>
              </>
            ) : loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
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
                  <img className="wait" src="../img/wait.gif" alt="wait" />
                </center>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height:"30vh"
                }}
              >
                Aucun message
              </div>
            )}
          </div>

          <center
            ref={sending}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "15vh",
              display: "none",
            }}
          >
            <img className="wait" src="../img/wait.gif" alt="wait" style={{maxWidth:"90px"}} />
          </center>
          {user && (
            <div className="txt_message">
            <textarea
              name=""
              placeholder="Ecrit un message"
              id="txt_message"
              autoComplete="off"
              onChange={handleTyping}
              maxlength={300}
              style={{
                fontSize: "1.2rem",
                width: "100%",
                borderColor: "black",
                fontWeight: "bold",
              }}
              rows="1"
            ></textarea>
              <img
                className="send-button"
                onClick={handleSubmit}
                src="../icon/sendMessage.png"
                alt="send"
                id="btn_send"
              />
            </div>
          )}
        </div>
      </center>
      <dialog
        id="modal"
        className="modal-form"
        style={{
          fontWeight: "bold",
          width: "90%",
          maxWidth: "500px",
          padding: "1.2em 2em",
          position:"fixed",
          top:"0",
          margin:"0em auto",
          marginTop:"2em"
        }}
      >
        <div className="form">
          <img
            src="../icon/close.png"
            width="25px"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              margin: "0.5em",
            }}
            onClick={closeDialog}
          />
          <center>
            <h4 style={{marginBottom:"0.6em"}}>MESSAGE</h4>
          </center>
          <div className="zone">
            <textarea
              id="contenu"
              style={{
                fontSize: "1.1rem",
                width: "100%",
                borderColor: "black",
                fontWeight: "bold",
              }}
              cols="32"
              rows="5"
              maxlength={300}
              autoComplete="off"
            ></textarea>
          </div>
          <button 
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              padding: "0.2em 1em",
              color: "black",
              width: "50%",
              maxWidth: "300px",
              margin:0,
            }}
            onClick={edit}
          >
            MODIFIER
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
        <p style={{ fontSize: "1.1rem", textAlign: "center" }}>
          Voulez vous supprimer ?
        </p>
        <div
          className="choices"
          style={{ display: "flex", justifyContent: "space-evenly" }}
        >
          <button
            onClick={closeDialog2}
            className="dialog-btn"
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
            onClick={remove}
            className="dialog-btn"
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              marginTop: "1em",
              padding: "0.2em 1em",
              backgroundColor: "red",
              color: "white",
                  filter:"none"
            }}
          >
            Oui
          </button>
        </div>
      </dialog>
    </MainLayout>
  );
}

export default PageForum;
