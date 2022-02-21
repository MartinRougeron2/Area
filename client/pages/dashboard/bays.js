import React, {useEffect, useState} from "react";
import DashHeader from "../../components/dashboard/DashHeader";
import DashBayPreview from "../../components/dashboard/DashBayPreview";
import DashSideBar from "../../components/dashboard/DashSideBar";
import MainButton from "../../components/utils/MainButton";
import {
  useLazyQuery,
  gql
} from "@apollo/client";

const GET_MY_BAYS = gql`
  query userId($userid: String!) {
    GetUserById (id: $userid) {
      name
      user_actions {
        name
        active
        action_effect {
          service {
            name
            icon
          }
        }
        action_trigger {
          service {
            name
            icon
          }
        }
      }
    }
  }
`

const BaysPage = () => {
  const [getBays, {loaded, error, data}] = useLazyQuery(GET_MY_BAYS)

  console.log(data)
  useEffect(() => {
    getBays({variables: {userid: window.sessionStorage.USERID}})
  }, [])

  return (
    <div className="w-screen h-screen flex flex-row">
      <DashSideBar />
      <div className="flex flex-col h-screen w-[82%] p-10">
        <DashHeader />
        <h2 className="text-lg font-bold">Mes Bays</h2>
        { data &&
        <div className="flex flex-col w-full h-[100%] mt-3">
          {data.length === 0 ?
          <div className="flex flex-col w-[35%]">
            <h2>Oh no... you haven't setup bays<br/>Let's create some</h2>
            <MainButton color="dark" text="Make a Bay" action={() => {window.location.href = "/dashboard"}}/>
          </div> :
          <>
            {data.map((elem, id) => {
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
