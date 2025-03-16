import "../components/PageHome.css";

import { Outlet } from "react-router-dom";
const LayoutPublic = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default LayoutPublic;
