import React, {useState, useEffect} from "react";
import GoogleLogin from "react-google-login";
import LoginRight from "../../components/login/LoginRight";
import InputSimple from "../../components/utils/Input";
import LinkText from "../../components/utils/Link";
import MainButton from "../../components/utils/MainButton";
import { gql, useMutation } from '@apollo/client';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const CREATE_ACCOUNT = gql`
  mutation CreateAccount($password: String!, $username: String!, $email: String!) {
    CreateUser(data: {name: $username, email: $email, password: $password}) {
      jwt_token
      is_new
    }
  }
`;

const SignInPage = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [create_acc, { data, loading, error, reset }] = useMutation(CREATE_ACCOUNT);

  const isDisable = () => {
    if (username == "" || email == "" || password == "")
      return true;
    return false;
  }

  const processCreation = () => {
    reset()
    create_acc({variables: {password: password, email: email, username: username}})
  }

  useEffect(() => {
    if (data && data.CreateUser) {
      if (data.CreateUser.is_new === true) {
        cookies.set('x-token', data.CreateUser.jwt_token, {path: '/'})
        window.location.href = "/dashboard"
      }
    }
  }, [data])

  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="flex flex-col w-1/2 h-screen p-10">
        <h1 className="text-dark font-semibold text-xl">AreaBay</h1>
        <div className="flex flex-col items-center mt-10 h-screen">
          <h2 className="text-xl font-bold">Création de mon compte AreaBay</h2>
          <div className="flex flex-col h-[55%] justify-between mt-14 mb-14">
            <InputSimple name="Username" value={username} onChange={setUsername}/>
            <InputSimple name="E-mail" value={email} onChange={setEmail}/>
            <InputSimple name="Mot de passe" value={password} onChange={setPassword}/>
            <GoogleLogin className="cursor-pointer" />
            <MainButton disable={isDisable()} text={"Créez mon compte"} action={processCreation}/>
            {
              (data && data.CreateUser.is_new === false) &&
              <div className="flex items-center justify-center bg-red opacity-75">
                Account already registered
              </div>
            }
          </div>
          <LinkText
            text="Vous avez déjà un compte?"
            linktext={"Connectez vous"}
            link={"/login"}
          />
        </div>
      </div>
      <LoginRight />
    </div>
  );
};

export default SignInPage;
