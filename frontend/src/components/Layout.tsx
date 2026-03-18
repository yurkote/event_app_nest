import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const MainLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
  </>
);

export default MainLayout;
