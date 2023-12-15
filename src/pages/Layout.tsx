import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

const Layout = () => {
  return (
    <div>
      <Sidebar>
        <Outlet />
      </Sidebar>
    </div>
  );
};

export default Layout;
