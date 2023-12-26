
import React from 'react'
import{Link}from 'react-router-dom';
import { IconType } from "react-icons";

interface SidebarItemProps {
    icon: IconType,
    name:string,
    route:string,
    iconSize:number
  }

const SidebarItem: React.FC<SidebarItemProps> = (props) => {
    const pathname = window.location.pathname;
    return (
      <Link
        to={props.route}
        className={`flex flex-row justify-start items-center w-full hover:scale-105 transition-all duration-300 rounded-lg ${
          pathname?.toLowerCase().includes(props?.route?.toLowerCase().split("/")[1]) == true
            ? "bg-[#7360DF] text-white"
            : "text-white"
        } px-5 py-2 text-base font-regular gap-6`}
      >
        <props.icon size={props.iconSize}/>
        <div>{props.name}</div>
      </Link>
    );
  };

export default SidebarItem