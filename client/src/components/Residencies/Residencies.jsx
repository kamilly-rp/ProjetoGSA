import React from "react";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "./Residencies.css";
import { sliderSettings } from "../../utils/common";
import PropertyCard from "../PropertyCard/PropertyCard";
import useProperties from "../../hooks/useProperties";
import {PuffLoader} from 'react-spinners'
import { NavLink } from "react-router-dom";
const Residencies = () => {

  const {data, isError, isLoading} = useProperties ()

  
    if(isError){
        return(
            <div className='wrapper'>
                <span>Erro. Por favor, aguarde.</span>
            </div>
        )
    }

    if(isLoading){
        return (
            <div className="wrapper flexCenter" style={{height:"60vh"}}>
                <PuffLoader
                height="80"
                width="80"
                radius={1}
                color="#4066ff"
                aria-label="puff-loading"
                />
            </div>
        )
    }

  return (
    <div id="residencies" className="r-wrapper">
      <div className="paddings innerWidth r-container">
        <div className="flexColStart r-head">
          <span className="orangeText">Melhores escolhas</span>
          <span className="primaryText">Melhores opções para você!</span>
        </div>
        <Swiper {...sliderSettings}>
          <SlideNextButton />
          {/* slider */}
          {data.slice(0, 8).map((card, i) => (
            <SwiperSlide key={i}>
              <PropertyCard card={card}/>
            </SwiperSlide>
          ))}
        </Swiper>
        <NavLink 
          to="/properties" 
          className="button" 
          style={{ float: "right", marginRight: "75px", margin: "40px" }}
          >
          Veja mais
        </NavLink>
      </div>
    </div>
  );
};

export default Residencies;

const SlideNextButton = () => {
  const swiper = useSwiper();
  return (
    <div className="flexCenter r-buttons">
      <button onClick={() => swiper.slidePrev()} className="r-prevButton">
        &lt;
      </button>
      <button onClick={() => swiper.slideNext()} className="r-nextButton">
        &gt;
      </button>
    </div>
  );
};
