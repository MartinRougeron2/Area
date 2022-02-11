import React from "react";
import DashHeader from "../../components/dashboard/DashHeader";
import DashBayPreview from "../../components/dashboard/DashBayPreview";
import DashSideBar from "../../components/dashboard/DashSideBar";
import MainButton from "../../components/utils/MainButton";
import {
  useQuery,
  gql
} from "@apollo/client";

const GET_MY_BAYS = gql`
  query {
    GetUserById(id: "${window.sessionStorage.USERID}") {
      name
      user_actions {
        action_effect
        action_trigger
        id
      }
    }
  }
`

const BaysPage = () => {
  return (
    <div className="w-screen h-screen flex flex-row">
      <DashSideBar />
      <div className="flex flex-col h-screen w-[82%] p-10">
        <DashHeader />
        <h2 className="text-lg font-bold">Mes Bays</h2>
        <div className="flex flex-col w-full h-[100%] mt-3">
          {MYBAYS.length === 0 ?
          <div className="flex flex-col w-[35%]">
            <h2>Oh no... you haven't setup bays<br/>Let's create some</h2>
            <MainButton color="dark" text="Make a Bay" action={() => {window.location.href = "/dashboard"}}/>
          </div> :
          <>
            {MYBAYS.map((elem, id) => {
              return(
                <DashBayPreview bay={elem} key={id}/>
                )
              })}
          </>
          }
        </div>
      </div>
    </div>
  );
};

export default BaysPage;
