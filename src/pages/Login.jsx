import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import { AppContext } from "../context";
import { useLocation, useNavigate } from "react-router-dom";
import Heading from "../components/Heading";
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { user, actionLogin } = useContext(AppContext);
  const [userInfo, setUserInfo] = useState({
    empCode: "",
    empPassword: "",
  });
  const cansave = [
    userInfo.empCode?.trim().length,
    userInfo.empPassword?.trim().length,
  ].every(Boolean);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !userInfo.empCode?.trim().length ||
      !userInfo.empPassword.trim().length
    ) {
      toast.error("Please enter all required information");
      return false;
    }
    await actionLogin(userInfo.empCode, userInfo.empPassword);
  };
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, from, navigate]);
  return (
    <div className="max-w-lg mx-auto w-full flex-grow space-y-8 px-4">
      <Heading title="Login" />
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full">
        <div className="card space-y-8 shadow">
          <div className="form-group">
            <AiOutlineUser className="text-primary text-2xl" />
            <input
              type="text"
              className="form-control"
              placeholder={`Your employee code without "P000"`}
              value={userInfo.empCode}
              onChange={(e) =>
                setUserInfo({ ...userInfo, empCode: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <AiOutlineLock className="text-primary text-2xl" />
            <input
              type="password"
              className="form-control"
              placeholder={`Your password`}
              value={userInfo.empPassword}
              onChange={(e) =>
                setUserInfo({ ...userInfo, empPassword: e.target.value })
              }
            />
          </div>
        </div>
        <button type="submit" className="btn self-center" disabled={!cansave}>
          Enter
        </button>
      </form>
    </div>
  );
}
