import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const MainLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet /> {/* Тут рендеритимуться ваші сторінки */}
    </main>
  </>
);

export default MainLayout;
