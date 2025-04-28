import React, { useState, useRef, useEffect, useContext } from 'react';
import './AdhesionForm.css'; // Importez le fichier CSS global - à commenter ou supprimer si problème
import profilePlaceholder from './profile.png'; // Placeholder pour la photo de profil
import axios from 'axios';
import connection from '../data/connection';
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import imageCompression from "browser-image-compression";
import MainLayout from '../layout/mainlayout';
import { AuthContext } from '../context/authContext';
const socket = io.connect(connection);



const EtapeSexe = ({ nextStep, updateFormData, formData }) => {
  const handleSexeChange = (sexe) => {
    updateFormData({ sexe });
  };


  return (
    <div className="etape-container etape-sexe slide-in-right">
      <h3>Quel est son sexe ?</h3>
      <div className="sexe-selection">
        <button type="button" onClick={() => handleSexeChange('M')} className={`sexe-button ${formData.sexe == "M" && 'selected'}`}>
          <img src="../img/male.png" alt="Homme"  className="sexe-image" /> <p>Homme</p>
        </button>
        <button type="button" onClick={() => handleSexeChange('F')} className={`sexe-button ${formData.sexe == "F" && 'selected'}`}>
          <img src="../img/female.png" alt="Femme" className="sexe-image" /> <p>Femme</p>
        </button>
      </div>
    </div>
  );
};


const EtapeFonction = ({ nextStep, prevStep, updateFormData, formData }) => {
  const handleTypeChange = (e) => {
    updateFormData({ fonction : e.target.value });
    const selectElement = e.target;
    const selectedIndex = selectElement.selectedIndex;
    const selectedText = selectElement.options[selectedIndex].text;
    updateFormData({ fonctionLibelle: selectedText});
  };

  const handleNext = () => {
    if (formData.typeMembre) {
      nextStep();
    } else {
      alert('Veuillez sélectionner une fonction.');
    }
  };


  const [typeMembreSelect, setTypeMembreSelect] = useState([]);

  
  
  useEffect(() => {
    const fetchSelect = async () => {
      try {
        let values = await axios.get(connection + "/lire-fonction/");
        setTypeMembreSelect(values.data);
      } catch (error) {
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

  return (
    <div className="etape-container etape-type-membre">
      <h3>Quel est sa fonction ?</h3>
      <div className="form-group">
        <label htmlFor="typeMembre">Sélectionnez la fonction:</label>
        <select id="typeMembre" name="typeMembre" value={formData.fonction || ''} onChange={handleTypeChange} required>
          <option value="">-- Choisir --</option>
          <option value='0'>Aucun</option>
          {listTypeMembreSelect}
        </select>
      </div>
    </div>
  );
};

const EtapePresentation = ({ nextStep, prevStep, updateFormData, formData }) => {
  const handleChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="etape-container etape-presentation">
      <h3>Quel est son nom complet ?</h3>
      <div className="form-group">
        <label htmlFor="nom">Nom:</label>
        <input autocomplete="off" type="text" id="nom" name="nom" value={formData.nom || ''} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="postnom">Postnom:</label>
        <input autocomplete="off" type="text" id="postnom" name="postnom" value={formData.postnom || ''} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="prenom">Prénom:</label>
        <input autocomplete="off" type="text" id="prenom" name="prenom" value={formData.prenom || ''} onChange={handleChange} required />
      </div>
    </div>
  );
};

const EtapeAdresse = ({ nextStep, prevStep, updateFormData, formData }) => {
  const handleChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleNiveau = (e) =>{
    updateFormData({ niveau: e.target.value });
    const selectElement = e.target;
    const selectedIndex = selectElement.selectedIndex;
    const selectedText = selectElement.options[selectedIndex].text;
    updateFormData({ province: selectedText});
  }

  
  

  const [interFederationSelect, setInterFederationSelect] = useState([]);

  
  
  useEffect(() => {
    const fetchSelect = async () => {
      try {
        let values = await axios.get(connection + "/lire-interfederations/");
        setInterFederationSelect(values.data);
      } catch (error) {
      }
    };
    fetchSelect();
  }, []);

  
  let listInterfederations = [];
  interFederationSelect &&
    interFederationSelect.forEach((value) => {
      if (value.id) {
        listInterfederations.push(
          <option key={value.id} value={value.id}>
            {value.libelle}
          </option>
        );
      }
    });

  return (
    <div className="etape-container etape-adresse">
      <h3>Où {formData.sexe == "M" ? 'il' : 'elle'} habite ?</h3>
      <div className="form-group">
        <label htmlFor="typeMembre">Province:</label>
        <select id="typeMembre" name="typeMembre" value={formData.niveau || ''} onChange={handleNiveau} required>
          <option value="">-- Choisir --</option>
          {listInterfederations}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="commune">Commune:</label>
        <input autocomplete="off" type="text" id="commune" name="commune" value={formData.commune || ''} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="avenue">Avenue:</label>
        <input autocomplete="off" type="text" id="avenue" name="avenue" value={formData.avenue || ''} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="numero">N°:</label>
        <input autocomplete="off" type="text" id="numero" name="numero" value={formData.numero || ''} onChange={handleChange} />
      </div>
    </div>
  );
};

const EtapeOrigine = ({ nextStep, prevStep, updateFormData, formData }) => {
  const handleChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleProvinceOrigine = (e) =>{
    updateFormData({ provinceOrigineCode: e.target.value});
    const selectElement = e.target;
    const selectedIndex = selectElement.selectedIndex;
    const selectedText = selectElement.options[selectedIndex].text;
    updateFormData({ provinceOrigine: selectedText});
  }

  const [interFederationSelect, setInterFederationSelect] = useState([]);
  useEffect(() => {
    const fetchSelect = async () => {
      try {
        let values = await axios.get(connection + "/lire-interfederations/");
        setInterFederationSelect(values.data);
      } catch (error) {
      }
    };
    fetchSelect();
  }, []);

  
  let listInterfederations = [];
  interFederationSelect &&
    interFederationSelect.forEach((value) => {
      if (value.id) {
        listInterfederations.push(
          <option key={value.id} value={value.id}>
            {value.libelle}
          </option>
        );
      }
    });

  return (
    <div className="etape-container etape-origine">
      <h3>Où et quand est {formData.sexe == "M" ? 'il' : 'elle'} né{formData.sexe == "M" ? '' : 'e'} ?</h3>
      <div className="form-group">
        <label htmlFor="lieuNaissance">Lieu de Naissance:</label>
        <input autocomplete="off" type="text" id="lieuNaissance" name="lieuNaissance"  value={formData.lieuNaissance || ''} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="dateNaissance">Date de Naissance:</label>
        <input autocomplete="off" type="date" id="dateNaissance" name="dateNaissance" min="1900-01-01" max="2010-12-31" value={formData.dateNaissance || ''} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="typeMembre">Province:</label>
        <select id="typeMembre" name="typeMembre" value={formData.provinceOrigineCode || ''} onChange={handleProvinceOrigine} required>
          <option value="">-- Choisir --</option>
          {listInterfederations}
        </select>
      </div>
    </div>
  );
};

const EtapeVieSociale = ({ nextStep, prevStep, updateFormData, formData }) => {
  const handleChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="etape-container etape-vie-sociale">
      <h3>Quel est sa Vie Sociale ?</h3>
      <div className="form-group">
        <label htmlFor="etatCivil">État Civil:</label>
        <select id="etatCivil" name="etatCivil" value={formData.etatCivil || ''} onChange={handleChange} required>
          <option value="">-- Choisir --</option>
          <option value="celibataire">Célibataire</option>
          <option value="marie">Marié{formData.sexe == "F" && 'e'}</option>
          <option value="divorce">Divorcé{formData.sexe == "F" && 'e'}</option>
          <option value="veuf">Veu{formData.sexe == "M" ? 'f' : 've'}</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="profession">Profession:</label>
        <input autocomplete="off" type="text" id="profession" name="profession" value={formData.profession || ''} onChange={handleChange} required />
      </div>
    </div>
  );
};

const EtapeContact = ({ nextStep, prevStep, updateFormData, formData }) => {
  const handleChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="etape-container etape-contact">
      <h3>Comment on peut {formData.sexe == "M" ? 'le' : 'la'} contacter ?</h3>
      <div className="form-group">
        <label htmlFor="telephone">Téléphone:</label>
        <input autocomplete="off" type="tel" id="telephone" name="telephone" value={formData.telephone || ''} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Adresse Email:</label>
        <input autocomplete="off" type="text" id="email" name="email" value={formData.email || ''} onChange={handleChange} required />
      </div>
    </div>
  );
};

const EtapePhoto = ({ nextStep, prevStep, updateFormData, formData }) => {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(formData.photo ? formData.photo : profilePlaceholder);

function convertToBase64(file, event) {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        setPreviewImage(reader.result);
        updateFormData({ photo: reader.result});
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
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: "image/png",
        quality: 0.8
      };
      imageCompression(files, options).then((img) => {
        convertToBase64(img, event);
      });
    };
    input.click();
  }


  return (
    <div className="etape-container etape-photo">
      <h3>La photo de son visage ?</h3>
      <div className="form-group">
        <div className="profile-image-container" onClick={importData}>
          <img src={previewImage} alt="Votre Profil" className="profile-image" />
          <div className="upload-icon"></div>
        </div>
        <input autocomplete="off"
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          onChange={importData}
          ref={fileInputRef}
          style={{ display: 'none' }}
          required
        />
      </div>
    </div>
  );
};

const EtapeTypeMembre = ({ nextStep, prevStep, updateFormData, formData }) => {
  const handleTypeChange = (e) => {
    updateFormData({ typeMembre: e.target.value });
    const selectElement = e.target;
    const selectedIndex = selectElement.selectedIndex;
    const selectedText = selectElement.options[selectedIndex].text;
    updateFormData({ typeMembreLibelle: selectedText});
  };

  const handleNext = () => {
    if (formData.typeMembre) {
      nextStep();
    } else {
      alert('Veuillez sélectionner un type de membre.');
    }
  };


  const [typeMembreSelect, setTypeMembreSelect] = useState([]);

  
  
  useEffect(() => {
    const fetchSelect = async () => {
      try {
        let values = await axios.get(connection + "/lire-type-membre/");
        setTypeMembreSelect(values.data);
      } catch (error) {
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

  return (
    <div className="etape-container etape-type-membre">
      <h3>Quel type de membre ?</h3>
      <div className="form-group">
        <label htmlFor="typeMembre">Sélectionnez le type de membre:</label>
        <select id="typeMembre" name="typeMembre" value={formData.typeMembre || ''} onChange={handleTypeChange} required>
          <option value="">-- Choisir --</option>
          {listTypeMembreSelect}
        </select>
      </div>
    </div>
  );
};

const EtapeTermes = ({ nextStep, prevStep, updateFormData, formData }) => {
  const handleAcceptChange = (e) => {
    updateFormData({ accepte: e.target.checked });
  };

  const handleNext = () => {
    if (formData.accepte) {
      nextStep();
    } else {
      alert('Veuillez accepter les termes et conditions.');
    }
  };

  return (
    <div className="etape-container etape-termes">
      <h3>Termes et Conditions</h3>
      <div className="termes-texte">
      <p>Je déclare par la présente : 
          <ul>
            <li>Avoir adhéré librement à l'AADC, à ses valeurs et principes fondamentaux;</li>
            <li>Je m'engage à respecter et faire respecter les status, le règlement intérieur et les résolutions des organes du parti;</li>
            <li>Je m'engage à préserver la démocratie, à contribuer au fonctionnement harmonieux de l'AADC par mes prestations et mes cotisations;</li>
            <li>Je m'engage à assumer toutes les taches qui me seront confiées dans le respect des dispositions statuaires et des valeurs fondamentales du parti;</li>
            <li>Je m'engage à m'abstenir de tout acte et toute démarche contraire aux intérêts du parti.</li>
          </ul>
          </p>
      </div>
      <div className="form-group">
        <label className="checkbox-label" >
          <input autocomplete="off" type="checkbox" style={{marginLeft:"auto"}} name="accepte" checked={formData.accepte || false} onChange={handleAcceptChange} />
          {formData.sexe == "M" ? 'il' : 'elle'} accepte.
        </label>
      </div>
    </div>
  );
};

const Recapitulatif = ({ formData, prevStep, handleSubmit }) => {
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };


  return (
    <div className="etape-container recapitulatif">
      <br />
      <h3>Voici ses informations</h3>
      <div className="recap-item"><strong>Nom:</strong> {formData.nom}</div> <br />
      {formData.postnom && <div className="recap-item"><strong>Postnom:</strong> {formData.postnom}</div>} <br />
      <div className="recap-item"><strong>Prénom:</strong> {formData.prenom}</div> <br />
      {formData.sexe && <div className="recap-item"><strong>Sexe:</strong> {formData.sexe}</div>} <br />
      {formData.province && <div className="recap-item"><strong>Province:</strong> {formData.province}</div>} <br />
      {formData.commune && <div className="recap-item"><strong>Commune:</strong> {formData.commune}</div>} <br />
      {formData.avenue && <div className="recap-item"><strong>Avenue:</strong> {formData.avenue}</div>} <br />
      {formData.numero && <div className="recap-item"><strong>Numéro:</strong> {formData.numero}</div>} <br />
      {formData.lieuNaissance && <div className="recap-item"><strong>Lieu de Naissance:</strong> {formData.lieuNaissance}</div>} <br />
      {formData.dateNaissance && <div className="recap-item"><strong>Date de Naissance:</strong> {formData.dateNaissance}</div>} <br />
      {formData.provinceOrigine && <div className="recap-item"><strong>Province d'Origine:</strong> {formData.provinceOrigine}</div>} <br />
      {formData.etatCivil && <div className="recap-item"><strong>État Civil:</strong> {formData.etatCivil}</div>} <br />
      {formData.profession && <div className="recap-item"><strong>Profession:</strong> {formData.profession}</div>} <br />
      {formData.telephone && <div className="recap-item"><strong>Téléphone:</strong> {formData.telephone}</div>} <br />
      {formData.email && <div className="recap-item"><strong>Adresse Email:</strong> {formData.email}</div>} <br />
      {formData.typeMembre && <div className="recap-item"><strong>Type de Membre:</strong> {formData.typeMembreLibelle}</div>}
      {formData.fonction && <div className="recap-item"><strong>Type de Membre:</strong> {formData.fonctionLibelle}</div>}
    </div>
  );
};


const AdhesionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const formRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const appelation = formData.sexe == "M" ? "monsieur" : "madame";
  const nom = formData.nom;

  const nextStep = () => {
    if((currentStep == 1)&& (!formData.sexe)){alert(`AADC : Veuillez chosir le sexe, s'il vous plait!`);return}
    if((currentStep == 2)&& (!formData.nom || !formData.prenom || ! formData.postnom)){alert(`AADC : S'il vous plait, presentez ${formData.sexe == "M" ? 'le' : 'la'} ${appelation} !`);return}
    if((currentStep == 3) && (!formData.province || !formData.commune || ! formData.avenue || ! formData.numero)){alert(`AADC : Entrez l'adresse complet de ${appelation} ${nom}`);return}
    if((currentStep == 4)&& (!formData.lieuNaissance || !formData.dateNaissance || ! formData.provinceOrigine)){
      if(!formData.dateNaissance && formData.lieuNaissance && formData.provinceOrigine){
        alert(`AADC : Vous avez oubliez de donner la date de naissance de ${appelation} ${nom}`)
      }else{
        alert("AADC : Veuillez remplir tous ses champs pour " + appelation + " " + nom )
      }
      return}
    if((currentStep == 5) && (!formData.etatCivil || !formData.profession)){alert("AADC : Parlez de la vie social de " + appelation + " " + nom);return}
    if((currentStep == 6) && (!formData.telephone || !formData.email)){alert(`AADC : Donnez tous les contacts de ${appelation} ${nom}`);return}
    if(currentStep == 7 && !formData.photo){alert(`AADC : Nous avons besoin de savoir le visage de ${appelation} ${nom}`);return}
    if(currentStep == 8 && !formData.typeMembre){alert(`AADC : Veuillez choisir le type pour ${appelation} ${nom}`);return}
    if(currentStep == 9 && !formData.fonction){alert(`AADC : Veuillez choisir la fonction pour ${appelation} ${nom} sinon vous appuyez sur aucun`);return}
    if(currentStep == 10 && !formData.accepte){alert(`AADC : ${appelation} ${nom} doit d'abord accepter, avant de devenir membre.`);return}
    if (formRef.current && isMobile) {
      formRef.current.classList.add('slide-out-left');
      setTimeout(() => {
        setCurrentStep(prevStep => prevStep + 1);
        formRef.current.classList.remove('slide-out-left');
        formRef.current.classList.add('slide-in-right');
      }, 300);
    } else {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };

  const prevStep = (stepToGoBack = null) => {
    if (formRef.current && isMobile) {
      formRef.current.classList.add('slide-out-right');
      setTimeout(() => {
        setCurrentStep(stepToGoBack || (prevStep => prevStep - 1));
        formRef.current.classList.remove('slide-out-right');
        formRef.current.classList.add('slide-in-left');
      }, 300);
    } else {
      setCurrentStep(stepToGoBack || (prevStep => prevStep - 1));
    }
  };

  const updateFormData = (data) => {
    setFormData(prevData => ({ ...prevData, ...data }));
  };
  const handleSubmit = (event) => {
    event.preventDefault(); 
    let date = new Date();
  let dateNaturel = date.toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  formData.dateAdhesion = dateNaturel;
  formData.enLigne = 'oui'
  formData.fonction =  formData.fonction == 0 ? null : formData.fonction;
    event.target.disabled = true;
    try {
      let response = axios.post(connection + "/adhesion", formData);
      let nomMembre = formData.nom;
      let prenomMembre = formData.prenom;
      let niveauMembre = formData.niveau;
      let telephoneMembre = formData.telephone;
      let idMembre = response.data.insertedId;
      
      navigate('/information-ajouter');
      event.target.disabled = false;
      socket.emit('membre');
    } catch (error) {
    
    }
  };
  

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EtapeSexe nextStep={nextStep} updateFormData={updateFormData} formData={formData} />;
      case 2:
        return <EtapePresentation nextStep={nextStep} prevStep={() => prevStep(1)} updateFormData={updateFormData} formData={formData} />;
      case 3:
        return <EtapeAdresse nextStep={nextStep} prevStep={() => prevStep(2)} updateFormData={updateFormData} formData={formData} />;
      case 4:
        return <EtapeOrigine nextStep={nextStep} prevStep={() => prevStep(3)} updateFormData={updateFormData} formData={formData} />;
      case 5:
        return <EtapeVieSociale nextStep={nextStep} prevStep={() => prevStep(4)} updateFormData={updateFormData} formData={formData} />;
      case 6:
        return <EtapeContact nextStep={nextStep} prevStep={() => prevStep(5)} updateFormData={updateFormData} formData={formData} />;
      case 7:
        return <EtapePhoto nextStep={nextStep} prevStep={() => prevStep(6)} updateFormData={updateFormData} formData={formData} />;
      case 8:
        return <EtapeTypeMembre nextStep={nextStep} prevStep={() => prevStep(7)} updateFormData={updateFormData} formData={formData} />;
      case 9 :
        return <EtapeFonction nextStep={nextStep} prevStep={() => prevStep(8)} updateFormData={updateFormData} formData={formData} />;
        case 10:
        return <EtapeTermes nextStep={nextStep} prevStep={() => prevStep(9)} updateFormData={updateFormData} formData={formData} />;
      case 11:
        return <Recapitulatif formData={formData} prevStep={prevStep} handleSubmit={handleSubmit} />;
      default:
        return null;
    }
  };


    const navigate = useNavigate();

  return (
    <div className="adhesion-form-container">
      
      <h2 className="form-title">NOUVEAU MEMBRE</h2>
      <div className="progress-bar">
        <div className="progress-indicator" style={{ width: `${(currentStep - 1) * (100 / 9)}%` }}></div>
      </div>
      <div className="form-wrapper" ref={formRef}>
        {renderStep()}
      </div>
      {(currentStep < 11 && currentStep != 1) && (
        <div className="form-navigation">
          {currentStep > 1 && <button type="button" onClick={() => prevStep()} className="button prev-button">Précédent</button>}
          <button type="button" onClick={nextStep} className="button next-button">Suivant</button>
        </div>
      )}
      {currentStep === 11 && currentStep != 1 && (
        <div className="form-navigation">
          <button type="button" onClick={() => prevStep(1)} className="button prev-button">Modifier</button>
          <button type="submit" onClick={handleSubmit} className="button submit-button">Terminer</button>
        </div>  
      )}
            {currentStep === 1 && (
        <div className="form-navigation">
          <button type="button" onClick={() => navigate("/membres")} className="button prev-button">Anuller</button>
          <button type="submit" onClick={nextStep} className="button submit-button">Suivant</button>
        </div>  
      )}
    </div>
  );
};

const AjoutMultiStep = () => {
    const { user } = useContext(AuthContext);


  return (
    <MainLayout>
    <div className="app-container">
      <AdhesionForm />
    </div>
    </MainLayout>
  );
};

function useMediaQuery(query) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event) => setMatches(event.matches);
    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export default AjoutMultiStep;
