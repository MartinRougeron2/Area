import React from "react";
import GoogleLogin from "react-google-login";
import LoginRight from "../../components/login/LoginRight";
import InputSimple from "../../components/utils/Input";
import LinkText from "../../components/utils/Link";
import MainButton from "../../components/utils/MainButton";

const SignInPage = () => {
  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="flex flex-col w-1/2 h-screen p-10">
        <h1 className="text-dark font-semibold text-xl">AreaBay</h1>
        <div className="flex flex-col items-center mt-10 h-screen">
          <h2 className="text-xl font-bold">Création de mon compte AreaBay</h2>
          <div className="flex flex-col h-[55%] justify-between mt-14 mb-14">
            <InputSimple name="Username" />
            <InputSimple name="E-mail" />
            <InputSimple name="Mot de passe" />
            <GoogleLogin className="cursor-pointer" />
            <MainButton text={"Créez mon compte"} />
          </div>
          <LinkText
            text="Vous n'avez pas de compte?"
            linktext={"Créez le"}
            link={"/"}
          />
        </div>
      </div>
      <LoginRight />
    </div>
  );
};

export default SignInPage;
