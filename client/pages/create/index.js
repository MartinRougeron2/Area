import React, { useRef, useState } from "react";
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

const DATA =   {
  from: {
    service: {
      id: 0,
      name: "Youtube",
      icon: "/assets/Images/youtube.svg",
      happens: [{
        name: "New video",
        options: [{
          name: "Username",
          type: "textfield",
          description: "Watch for new videos by this username",
          required: true
        }, {
          name: "Username",
          type: "textfield",
          description: "Watch for new videos by this username",
          required: true
        }]
      }, {
        name: "New video",
        options: [{
          name: "Username",
          type: "textfield",
          description: "Watch for new videos by this username",
          required: true
        }]
      }],
      actions: [{}]
    }
  },
  to: {
    service: {
      id: 2,
      name: "Twitter",
      icon: "/assets/Images/youtube.svg",
      actions: [{
        name: "New video",
        options: [{
          name: "Username",
          type: "textfield",
          description: "Watch for new videos by this username",
          required: true
        }]
      }]
    }
  },
  data: {
    active: true,
    description: "Upload vidéo on comment"
  }
}

// service: {
//   id: 0,
//   name: "Youtube",
//   icon: "/assets/Images/youtube.svg",
//   happens: [{
//     name: "New video",
//     options: [{
//       name: "Username",
//       type: "textfield",
//       description: "Watch for new videos by this username",
//       required: true
//     }, {
//       name: "Username",
//       type: "textfield",
//       description: "Watch for new videos by this username",
//       required: true
//     }]
//   }, {
//     name: "New video",
//     options: [{
//       name: "Username",
//       type: "textfield",
//       description: "Watch for new videos by this username",
//       required: true
//     }]
//   }],
//   actions: [{}]
// }

// {
//   from: {
//     service: {},
//     connected: false,
//     happens: {
//       index: 0,
//       value: {}
//     }
//   },
//   to: {
//     service: {},
//     connected: false,
//     happens: {
//       index: 0,
//       value: {}
//     }
//   }
//   data: {
//     active: true,
//     description: "Upload vidéo on comment"
//   }
// }

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
  const evt = first ? DATA.from.service.happens : DATA.to.service.actions

  const handleChange = (key) => {
    setIndex(key)
    setValueSel({[0]: ""})
    setTested(false)
  }

  return (
    <div className="flex flex-col items-start">
      <span className="text-sm italic font-bold">When this happen...</span>
      <DropDown actionlist={options} value={index} onChange={handleChange}/>
      {(index !== -1) && evt[index].options.map((elem, key) => {
        return (
          <DrawField key={key} index={key} options={elem} setTested={setTested} onChange={setValueSel} value={valueSel}/>
        )
      })}
    </div>
  )
}

const Connect = ({data, connected, setConnected, setTested, first, index, setIndex, value, setValue, slideTo, slide}) => {
  return (
    <div className="flex flex-col items-center p-5 h-full w-full">
      <h2 className="text-lg font-bold mt-6 mb-8">Connect your {data.service.name} account</h2>
      <div className="w-full drop-shadow-lg bg-white rounded p-5 mb-5">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center justify-center flex-nowrap">
            <img src={data.service.icon} className="w-20"/>
            <span className="text-md p-5">Connexion a {data.service.name}</span>
          </div>
          <div className="flex">
            <MainButton text={connected ? "Connected" : "Connection"} color='dark' action={() => {setConnected(true)}}></MainButton>
          </div>
        </div>
        {connected && (<DrawOptions options={first ? data.service.happens : data.service.actions} setTested={setTested} index={index} setIndex={setIndex} first={first} valueSel={value} setValueSel={setValue}/>)}
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
  const [indexFrom, setIndexFrom] = useState(-1)
  const [connectedTo, setConnectedTo] = useState(false)
  const [indexTo, setIndexTo] = useState(-1)
  const [valueFrom, setValueFrom] = useState({})
  const [valueTo, setValueTo] = useState({})
  const [tested, setTested] = useState(false)

  const slideTo = (index) => {
    swiperRef.slideTo(index, 50);
  };

  const createBayData = () => {
    let obj = {
      from: {
        service: DATA.from.service,
        connected: connectedFrom,
        happens: {
          index: indexFrom,
          value: valueFrom
        }
      },
      to: {
        service: DATA.to.service,
        connected: connectedTo,
        actions: {
          index: indexTo,
          value: valueTo
        }
      },
      data: {
        active: false,
        description: "Default title"
      }
    }
    return obj;
  }

  return (
    <div className="flex flex-col h-screen w-[100%] p-10">
      <DashHeader />
      <Swiper
        onSwiper={setSwiperRef}
        pagination={{clickable: true}}
        modules={[Pagination, Navigation]}
        cssMode={true}
        className="mySwiper"
      >
        <SwiperSlide><Connect slide={0} slideTo={slideTo} setTested={setTested} data={DATA.from} connected={connectedFrom} setConnected={setConnectedFrom} index={indexFrom} setIndex={setIndexFrom} first={true} value={valueFrom} setValue={setValueFrom}/></SwiperSlide>
        <SwiperSlide><Connect slide={1} slideTo={slideTo} setTested={setTested} data={DATA.to} connected={connectedTo} setConnected={setConnectedTo} index={indexTo} setIndex={setIndexTo} first={false} value={valueTo} setValue={setValueTo}/></SwiperSlide>
        <SwiperSlide><TestBay slide={2} slideTo={slideTo} BayData={createBayData()} tested={tested} setTested={setTested}/></SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
      </Swiper>
    </div>
  );
}
