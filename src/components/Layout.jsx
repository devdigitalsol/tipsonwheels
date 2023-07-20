import { Link, Outlet } from "react-router-dom";
import LOGOIRCTC from "./../assets/images/logo_irctc.png";
import LOGODRL from "./../assets/images/logo_drl.png";
import Loader from "./Loader";
import { useContext } from "react";
import { AppContext } from "../context";
import { AiOutlineLogout } from "react-icons/ai";
export default function Layout() {
  const { user, setUser, setDocInfo, isLoading, setIsLoading } =
    useContext(AppContext);
  const logoutHandle = () => {
    setIsLoading(true);
    localStorage.removeItem("user");
    setDocInfo(null);
    setUser(null);
    setIsLoading(false);
  };
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="px-4 md:py-3 py-2 flex justify-between items-center w-full">
        <Link to="/">
          <img src={LOGOIRCTC} alt="logo" className="md:h-[70px] h-[50px]" />
        </Link>
        <div className="flex items-center gap-4">
          <img
            src={LOGODRL}
            alt="logo"
            className="w-[160px] md:w-[183px] sm:w-[160px]"
          />
          {user && (
            <AiOutlineLogout
              className="text-3xl text-primary cursor-pointer"
              onClick={logoutHandle}
            />
          )}
        </div>
      </div>
      <Outlet />
      {isLoading && <Loader />}
    </div>
  );
}
