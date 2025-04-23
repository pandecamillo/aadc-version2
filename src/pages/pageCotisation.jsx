import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/mainlayout";

function PageCotisation() {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/home");
  };
  return (
    <MainLayout>
      <br />
      <br />
      <center>
        <h2 style={{padding:"0.5em", maxWidth:"600px"}}>La cotisation en ligne n'est pas encore disponible.</h2>
        <br /> 
        <img src="../icon/money.png" width="80%" style={{maxWidth:"350px"}}/>
      </center>
    </MainLayout>
  );
}
export default PageCotisation;
