import React, { useState, useEffect } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { TbLogout2 } from "react-icons/tb";
// import { usePathname, useNavigate} from "react-router-dom";
import { handleLogout } from "../helpers/auth";
import SidebarItem from "./ui/SidebarItem";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
}

const Sidebar: React.FC<Props> = ({ children }) => {
  const [role, setRole] = useState<string>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    setIsAuthenticated(isLoggedIn === "true");
    setRole(localStorage.getItem("role")!);
  }, [children, pathname]);

  const routes = [
    {
      icon: HiMenuAlt2,
      iconSize: 21,
      name: "Dashboard",
      route: role == "admin" ? "/dashboard/admin" : "/dashboard/user",
    },
    {
      icon: HiMenuAlt2,
      iconSize: 21,
      name: "Billing",
      route: "/billing",
    },
  ];

  return pathname.includes("auth") == false ? (
    <div className={twMerge(`flex h-screen`)}>
      <div className="hidden md:flex bg-[#33186B] h-screen w-[294px]">
        <div className="flex flex-col justify-start center px-8 gap-2 w-full">
          <div className="my-16 w-full">
            <img
              src="/assets/images/logo.svg"
              alt="logo"
              className="h-24 w-24 mix-blend-lighten invert"
            />
          </div>

          {routes?.map((route, index) => {
            return (
              <div key={index}>
                <SidebarItem {...route} />
              </div>
            );
          })}

          <div className="bg-[#F0811080] h-[1px] my-2"></div>
          <button
            onClick={() => handleLogout(navigate)}
            className={`flex flex-row justify-start items-center w-full hover:scale-105 transition-all duration-300 rounded-lg text-white px-5 py-2 text-base gap-5`}
          >
            <TbLogout2 size={22} />
            <div className="font-regular">Logout</div>
          </button>
        </div>
      </div>
      <main className="h-full flex-1 overflow-y-auto px-8 py-2">
        {children}
      </main>
    </div>
  ) : (
    <div>{children}</div>
  );
};

export default Sidebar;
