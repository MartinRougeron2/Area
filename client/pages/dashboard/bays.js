import React, {useEffect, useState} from "react";
import DashHeader from "../../components/dashboard/DashHeader";
import DashBayPreview from "../../components/dashboard/DashBayPreview";
import DashSideBar from "../../components/dashboard/DashSideBar";
import MainButton from "../../components/utils/MainButton";
import {
  useQuery,
  gql
} from "@apollo/client";

const GET_MY_BAYS = gql`
  query FetchBay {
    GetUser {
      name
      user_actions {
        name
        active
        action_effect {
          service {
            name
          }
        }
        action_trigger {
          service {
            name
          }
        }
      }
    }
  }
`

const BaysPage = () => {
  const {loaded, error, data} = useQuery(GET_MY_BAYS)
  if (data)
    console.log(data.GetUser.user_actions)

  return (
    <div className="w-screen h-screen flex flex-row">
      <DashSideBar />
      <div className="flex flex-col h-screen w-[82%] p-10">
        <DashHeader />
        <h2 className="text-lg font-bold">Mes Bays</h2>
        { (data && data.GetUser.user_actions) &&
        <div className="flex flex-col w-full h-[100%] mt-3">
          {data.GetUser.user_actions.length === 0 ?
          <div className="flex flex-col w-[35%]">
            <h2>Oh no... you haven't setup bays<br/>Let's create some</h2>
            <MainButton color="dark" text="Make a Bay" action={() => {window.location.href = "/dashboard"}}/>
          </div> :
          <>
            {data.GetUser.user_actions.map((elem, id) => {
              return(
                <DashBayPreview bay={elem} key={id}/>
                )
              })}
          </>
          }
        </div>
        }
      </div>
    </div>
  );
};

export default BaysPage;
