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
import { Pagination, Navigation } from "swiper";

const DATA =   {
  from: {
    service: {
      id: 0,
      name: "Youtube",
      icon: "/assets/Images/youtube.svg",
    }
  },
  to: {
    service: {
      id: 2,
      name: "Twitter",
      icon: "/assets/Images/youtube.svg",
    }
  },
  data: {
    active: true,
    description: "Upload vidéo on comment"
  }
}

export default function CreateBay() {
  const [swiperRef, setSwiperRef] = useState(null);

  const slideTo = (index) => {
    swiperRef.slideTo(index - 1, 50);
  };

  const ConnectFirst = ({data}) => {
    return (
      <div className="flex flex-col items-center p-5 h-full w-full">
        <h2 className="text-lg font-bold mt-6 mb-8">Connect your {data.service.name} account</h2>
        <div className="flex flex-row w-full drop-shadow-lg bg-white rounded p-5 mb-5 items-center justify-between">
          <div className="flex flex-row items-center justify-center flex-nowrap">
            <img src={data.service.icon} className="w-20"/>
            <span className="text-md p-5">Connexion a {data.service.name}</span>
          </div>
          <div className="flex">
            <MainButton text="Connexion" color='light'></MainButton>
          </div>
        </div>
      </div>
    )
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
        <SwiperSlide><ConnectFirst data={DATA.from}/></SwiperSlide>
        <SwiperSlide><ConnectFirst data={DATA.to}/></SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
      </Swiper>
    </div>
  );
}
