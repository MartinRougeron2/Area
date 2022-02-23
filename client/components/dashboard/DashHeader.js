import React from "react";
import {
  useQuery,
  gql
} from "@apollo/client";

const GET_USER = gql`
  query FetchUser {
    GetUser {
      name
      id
      email
    }
  }
`

const DashHeader = () => {
  const {data} = useQuery(GET_USER)
  return (
    <div className="flex flex-row w-full justify-between items-center">
      <p className="text-lg font-bold">DashBoard</p>
      {data && <div className="flex flex-col">
        <p className="font-semibold">{data.GetUser.name}</p>
        <p className="text-black opacity-50">{data.GetUser.email}</p>
      </div>}
    </div>
  );
};

export default DashHeader;
