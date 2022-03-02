import React, {useState, useEffect} from "react";
import GoogleLogin from "react-google-login";
import InputSimple from "../../components/utils/Input";
import MainButton from "../../components/utils/MainButton";
import LinkText from "../../components/utils/Link";
import LoginRight from "../../components/login/LoginRight";
import { gql, useLazyQuery } from '@apollo/client';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const LOGGING_CREATE = gql`
  query Login($password: String!, $email: String!) {
    LoginUser(data: {email: $email, password: $password}) {
      jwt_token
      is_new
    }
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [login, {data}] = useLazyQuery(LOGGING_CREATE)

  const isDisable = () => {
    if (email == "" || password == "")
      return true;
    return false;
  }

  useEffect(() => {
    if (data && data.LoginUser) {
      if (data.LoginUser.is_new === false && data.LoginUser.jwt_token !== "bad") {
        cookies.set('x-token', data.LoginUser.jwt_token, {path: '/'})
        window.location.href = "/dashboard"
      }
    }
  }, [data])

  const responseGoogle = (response) => {
    console.log(response);
  }

  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="flex flex-col w-1/2 h-screen p-10">
        <h1 className="text-dark font-semibold text-xl">Area Bay</h1>
        <div className="flex flex-col items-center mt-10 h-screen">
          <h2 className="text-xl font-bold">Connexion</h2>
          <div className="flex flex-col h-[50%] justify-between mt-14 mb-14">
            <InputSimple name="E-mail" value={email} onChange={setEmail}/>
            <InputSimple name="Mot de passe" value={password} onChange={setPassword}/>
            <GoogleLogin className="cursor-pointer"
              clientId="683963277714-ir8gsgu1qtbpmo0sdgnrno93majs4vpb.apps.googleusercontent.com"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
            />
            <MainButton disable={isDisable()} text={"Connexion"} action={() => login({variables: {email: email, password: password}})}/>
            {
              (data && data.LoginUser.is_new === true) &&
              <div className="flex items-center justify-center bg-red opacity-75">
                Account not found
              </div>
            }
            {
              (data && data.LoginUser.jwt_token === "bad") &&
              <div className="flex items-center justify-center bg-red opacity-75">
                Bad Password
              </div>
            }
          </div>
          <LinkText
            text="Vous n'avez pas de compte?"
            linktext={"Créez le"}
            link={"/login/create"}
          />
        </div>
      </div>
      <LoginRight />
    </div>
  );
};

export default LoginPage;
