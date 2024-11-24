import React from "react";
import Tilt from 'react-parallax-tilt';
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import { useNavigate } from 'react-router-dom'; 
import { Link } from "react-router-dom";

const ServiceCard = ({ index, title, icon }) => {
  const navigate = useNavigate(); 
  const handleButtonClick = () => {
    navigate(`/services/${title.replace(/\s+/g, '-').toLowerCase()}`); 
  };
  return (
    <Tilt className='xs:w-[250px] w-full'>
      <motion.div
        variants={fadeIn("right", "spring", index * 0.5, 0.75)}
        className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
      >
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
        >
          <img
            src={icon}
            alt={title}
            className='w-16 h-16 object-contain'
          />

          <h3 className='text-white text-[20px] font-bold text-center'>
            {title}
          </h3>

          <button
  className="mt-4 bg-transparent  border border-blue-500 py-2 px-4 text-lg rounded-lg hover:bg-[#4b2b8f] hover:text-white transition"
  onClick={handleButtonClick}
>
  View Details
</button>       
        </div>
      </motion.div>
    </Tilt>
  );
};

export default ServiceCard;

