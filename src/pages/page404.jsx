import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/mainlayout";

function Page404() {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/home");
  };
  return (
    <MainLayout>
      <br />
      <br />
      <br />
      <center>
        <h2 style={{padding:"0.5em", maxWidth:"600px"}}>Cette page n'existe pas ou est en cours de construction.</h2>
        <br /> <br />
        <img src="../img/logo.png" width="80%" style={{maxWidth:"350px"}}/>
      </center>
    </MainLayout>
  );
}
export default Page404;
