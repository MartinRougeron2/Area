import React, { useState } from "react";
import Switch from "react-switch";
import { AiFillDelete } from "react-icons/ai";
import InputSimple from "../../components/utils/Input";
import {
  useMutation,
  gql
} from "@apollo/client";

const UPDATE_BAYS = gql`
  mutation UpdateBays($id: String!, $name: String, $active: Boolean) {
    UpdateBayAction(id: $id, data: {name: $name, active: $active}) {
      id
    }
  }
`

const DashBayPreview = ({ bay, onDelete }) => {
  const { active, action_effect, action_trigger, name } = bay;
  const [bayName, setBayName] = useState(name)
  const [activated, setActive] = useState(active);
  const [updateBay] = useMutation(UPDATE_BAYS)

  const switchClick = (check) => {
    setActive(check);
    updateBay({variables: {id: bay.id, active: check}})
  };

  const changeName = (value) => {
    setBayName(value)
    updateBay({variables: {id: bay.id, name: value}})
  };

  return (
    <div className="flex flex-row w-full h-[15%] drop-shadow-lg bg-white rounded p-5 mb-5 justify-between">
      <div className="flex flex-row items-center w-[15%]">
        <img className="w-full" src={action_trigger.service.icon} />
        <div className="flex bg-dark rounded-full w-[50%] items-center justify-center">
          <img src={"/assets/Images/arrow-right.svg"} />
        </div>
        <img className="w-full" src={action_effect.service.icon} />
      </div>
      <div className="flex items-center" style={{whiteSpace: 'nowrap'}}>
        <span className="text-sm">
          <InputSimple
            value={bayName}
            onChange={changeName}
          />
        </span>
      </div>
      <div className="flex justify-center items-center content-center">
        <div className="flex mr-2">
          <Switch
            checked={activated}
            onChange={switchClick}
            uncheckedIcon={false}
          />
        </div>
        <div className="flex cursor-pointer" onClick={() => onDelete()}>
          <AiFillDelete />
        </div>
      </div>
    </div>
  );
};

export default DashBayPreview;
