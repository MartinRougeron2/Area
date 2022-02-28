import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import DashHeader from "../../components/dashboard/DashHeader";
import MainButton from "../../components/utils/MainButton";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import DropDown from "../../components/dashboard/DropDown";
import InputSimple from "../../components/utils/Input";
import TestBay from "../../components/create/TestBay";

import { Pagination, Navigation } from "swiper";

const DrawField = ({options, setTested, index, onChange, value}) => {
  const updateValue = (val, index) => {
    let old = {...value}
    old[index] = val;
    if (val == "")
      delete old[index]
    onChange(old)
    setTested(false)
  }
  return (
    <div className="pt-5">
      <InputSimple name={options.name} value={value[index]} onChange={(val) => updateValue(val, index)}></InputSimple>
      <span className="text-sm">{options.description}</span>
    </div>
  )
}

const DrawOptions = ({options, index, setTested, setIndex, first, valueSel, setValueSel}) => {
  const handleChange = (key) => {
    console.log(key)
    setIndex(key)
    setValueSel({[0]: "", [1]: "", [2]: "", [3]: ""})
    setTested(false)
  }
  console.log(options, index)
  return (
    <div className="flex flex-col items-start">
      <span className="text-sm italic font-bold">{first ? "When this happen..." : "Do this..."}</span>
      <DropDown actionlist={options} value={index} onChange={handleChange}/>
      {(index !== -1) && JSON.parse(options[index].options).map((elem, key) => {
        return (
          <DrawField key={key} index={key} options={elem} setTested={setTested} onChange={setValueSel} value={valueSel}/>
        )
      })}
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

const Connect = ({data, connected, setConnected, setTested, first, index, setIndex, value, setValue, slideTo, slide}) => {
  return (
    <div className="flex flex-col items-center p-5 h-full w-full">
      <h2 className="text-lg font-bold mt-6 mb-8">Connect your {data.name} account</h2>
      <div className="w-full drop-shadow-lg bg-white rounded p-5 mb-5">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center justify-center flex-nowrap">
            <img src={data.icon} className="w-20"/>
            <span className="text-md p-5">Connexion a {data.name}</span>
          </div>
          <div className="flex">
            <MainButton text={connected ? "Connected" : "Connection"} color='dark' action={() => {setConnected(true)}}></MainButton>
          </div>
        </div>
        {connected && (<DrawOptions options={GetActionsToShow(data, first)} setTested={setTested} index={index} setIndex={setIndex} first={first} valueSel={value} setValueSel={setValue}/>)}
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
  const [tested, setTested] = useState(false)
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
        <SwiperSlide><Connect slide={0} slideTo={slideTo} setTested={setTested} data={JSON.parse(window.sessionStorage.getItem("CREATE_BAY")).from.service} connected={connectedFrom} setConnected={setConnectedFrom} index={idFrom} setIndex={setIdFrom} first={true} value={valueFrom} setValue={setValueFrom}/></SwiperSlide>
        <SwiperSlide><Connect slide={1} slideTo={slideTo} setTested={setTested} data={JSON.parse(window.sessionStorage.getItem("CREATE_BAY")).to.service} connected={connectedTo} setConnected={setConnectedTo} index={idTo} setIndex={setIdTo} first={false} value={valueTo} setValue={setValueTo}/></SwiperSlide>
        <SwiperSlide><TestBay slide={2} trigger={triggerRefresh} BayData={JSON.parse(window.sessionStorage.getItem("CREATE_BAY"))} slideTo={slideTo} tested={tested} setTested={setTested}/></SwiperSlide>
      </Swiper>
      }
    </div>
  );
}
