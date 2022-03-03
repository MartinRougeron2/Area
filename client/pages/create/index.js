import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import DashHeader from "../../components/dashboard/DashHeader";
import MainButton from "../../components/utils/MainButton";
import Popup from "../../components/create/Popup";


// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import DropDown from "../../components/dashboard/DropDown";
import InputSimple from "../../components/utils/Input";
import TestBay from "../../components/create/TestBay";

import { Pagination, Navigation } from "swiper";

const DrawField = ({options, index, onChange, value}) => {
  const updateValue = (val, index) => {
    let old = {...value}
    old[index] = val;
    onChange(old)
  }
  return (
      <div className="pt-5">
        <InputSimple name={options.name} value={value[index]} onChange={(val) => updateValue(val, index)}></InputSimple>
        <span className="text-sm">{options.description}</span>
      </div>
  )
}

const DrawOptions = ({options, index, setIndex, first, valueSel, setValueSel, connected, setConnected}) => {
  const [isConnecting, setConnecting] = useState(false)
  const [url, setUrl] = useState(null)

  const handleChange = (key) => {
    setIndex(key)
    setValueSel({[0]: "", [1]: "", [2]: "", [3]: ""})
  }

  useEffect(() => {
    if (index === -1)
      return;
    const url = (new URL(`https://localhost:5001${options[index].auth_url}`))
    url.searchParams.append("id", index)
    if (options[index].options !== "") {
      JSON.parse(options[index].options).forEach((elem, key) => url.searchParams.append(elem.name, valueSel[key]))
    }
    setUrl(url)
  }, [valueSel, index])

  const doConnect = () => {
    if (connected)
      return;
    setConnecting(true)
    setTimeout(() => {
      setConnecting(false)
      setConnected(false)
    }, 1500);
  }

  const isArgs = () => {
    if (index === -1) return false;
    if (options[index].options === "") return true
    const nbr = JSON.parse(options[index].options).length;
    var res = true;
    for (var i = 0; i != nbr; i++) {
      if (valueSel[i] === "") {
        res = false
        break;
      }
    }
    return res
  }

  return (
    <div className="flex flex-col items-start">
      <span className="text-sm italic font-bold">{first ? "When this happen..." : "Do this..."}</span>
      <div className="flex w-full justify-between">
        <DropDown actionlist={options} value={index} onChange={handleChange}/>
        {index !== -1 && (
          <div className="flex">
              <Popup
                url={url}
                onClick={(e) => console.log(e)}
              >
              <MainButton text={connected ? "Connected" : "Connection"} disable={isConnecting || !isArgs()} color='dark' action={() => {doConnect()}}></MainButton>
            </Popup>
          </div>
        )}
      </div>
      {(index !== -1) &&
      <div className="flex row w-full">
        <div className="flex col w-[50%]">
          {options[index].options !== "" && JSON.parse(options[index].options).map((elem, key) => {
            return (
              <DrawField key={key} index={key} options={elem} onChange={setValueSel} value={valueSel}/>
            )
            })
          }
        </div>
      </div>
      }
    </div>
  )
}

const GetActionsToShow = (service, first) => {
  const actions = {}

  service.actions.forEach(action => {
    if (action.type === "BOTH")
      actions[action.id] = (action)
    if (!first && action.type == "EFFECT")
      actions[action.id] = (action)
    if (first && action.type == "TRIGGER")
      actions[action.id] = (action)
  })
  return actions;
}

const Connect = ({data, connected, setConnected, first, index, setIndex, value, setValue, slideTo, slide}) => {
  return (
    <div className="flex flex-col items-center p-5 h-full w-full">
      <h2 className="text-lg font-bold mt-6 mb-8">{data.name} services</h2>
      <div className="w-full drop-shadow-lg bg-white rounded p-5 mb-5">
        <div className="flex flex-row items-center justify-between">
        </div>
        <DrawOptions options={GetActionsToShow(data, first)} index={index} setIndex={setIndex} first={first} valueSel={value} setValueSel={setValue} connected={connected} setConnected={setConnected}/>
      </div>
      <div className="flex w-full pt-7">
        {
        slide != 0 &&
        <div className="flex w-full justify-start">
          <MainButton text={"Back"} color='light' action={() => {slideTo(slide - 1)}}></MainButton>
        </div>
        }
        <div className="flex w-full justify-end">
          <MainButton text={"Next"} color='light' action={() => {slideTo(slide + 1)}}></MainButton>
        </div>
      </div>
    </div>
  )
}

export default function CreateBay() {
  const [swiperRef, setSwiperRef] = useState(null);
  const [connectedFrom, setConnectedFrom] = useState(false)
  const [idFrom, setIdFrom] = useState(-1)
  const [connectedTo, setConnectedTo] = useState(false)
  const [idTo, setIdTo] = useState(-1)
  const [valueFrom, setValueFrom] = useState({[0]: "", [1]: "", [2]: "", [3]: ""})
  const [valueTo, setValueTo] = useState({[0]: "", [1]: "", [2]: "", [3]: ""})
  const [loaded, setLoaded] = useState(false)
  const [triggerRefresh, setTrigger] = useState(false)

  const slideTo = (index) => {
    swiperRef.slideTo(index, 50);
  };

  useEffect(() => {
    if (window.sessionStorage.getItem("CREATE_BAY")) {
      const storage = JSON.parse(window.sessionStorage.getItem("CREATE_BAY"))
      if (storage.from.actions && storage.from.actions.index !== undefined) {
        setIdFrom(storage.from.actions.index)
      }
      if (storage.to.actions && storage.to.actions.index != undefined) {
        setIdTo(storage.to.actions.index)
      }
      if (storage.from.actions && storage.from.actions.value !== undefined) {
        setValueFrom(storage.from.actions.value)
      }
      if (storage.to.actions && storage.to.actions.value != undefined) {
        setValueTo(storage.to.actions.value)
      }
      if (storage.from.connected !== undefined) {
        setConnectedFrom(storage.from.connected)
      }
      if (storage.to.connected != undefined) {
        setConnectedTo(storage.to.connected)
      }
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!window.sessionStorage.getItem("CREATE_BAY"))
      return;
    setTrigger(!triggerRefresh)
    window.sessionStorage.setItem("CREATE_BAY", JSON.stringify({
      from: {
        service: JSON.parse(window.sessionStorage.getItem("CREATE_BAY")).from.service,
        connected: connectedFrom,
        actions: {
          index: idFrom,
          value: valueFrom,
        }
      },
      to: {
        service: JSON.parse(window.sessionStorage.getItem("CREATE_BAY")).to.service,
        connected: connectedTo,
        actions: {
          index: idTo,
          value: valueTo,
        }
      },
      data: {
        active: false,
        description: "Default title"
      }
    }))
  }, [connectedFrom, connectedTo, idFrom, idTo, valueFrom, valueTo])

  return (
    <div className="flex flex-col h-screen w-[100%] p-10">
      <DashHeader />
      { (loaded) &&
      <Swiper
        onSwiper={setSwiperRef}
        pagination={{clickable: true}}
        modules={[Pagination, Navigation]}
        cssMode={true}
        className="mySwiper"
      >
        <SwiperSlide><Connect slide={0} slideTo={slideTo} data={JSON.parse(window.sessionStorage.getItem("CREATE_BAY")).from.service} connected={connectedFrom} setConnected={setConnectedFrom} index={idFrom} setIndex={setIdFrom} first={true} value={valueFrom} setValue={setValueFrom}/></SwiperSlide>
        <SwiperSlide><Connect slide={1} slideTo={slideTo} data={JSON.parse(window.sessionStorage.getItem("CREATE_BAY")).to.service} connected={connectedTo} setConnected={setConnectedTo} index={idTo} setIndex={setIdTo} first={false} value={valueTo} setValue={setValueTo}/></SwiperSlide>
        <SwiperSlide><TestBay slide={2} trigger={triggerRefresh} BayData={JSON.parse(window.sessionStorage.getItem("CREATE_BAY"))} slideTo={slideTo}/></SwiperSlide>
      </Swiper>
      }
    </div>
  );
}
