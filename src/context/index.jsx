import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { apiService } from "../services/apiService";

export const AppContext = createContext();

export const AppState = ({ children }) => {
  const info = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(info || null);
  const [docInfo, setDocInfo] = useState(null);
  const [tips, setTips] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [doctorList, setDoctorList] = useState([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // user authentication
  const actionLogin = async (tm_id, password) => {
    setIsLoading(true);
    if (password !== "omez") {
      setIsLoading(false);
      toast.error("Please enter valid password");
      return false;
    }
    try {
      const resp = await apiService.post("", {
        tm_id,
        operation: "authenticate",
        show_tips_details: false,
      });
      if (resp?.data?.status === 404) {
        setIsLoading(false);
        toast.error(resp?.data?.message);
        return false;
      }
      if (resp?.data?.status === 200) {
        localStorage.setItem("user", JSON.stringify(resp?.data?.employee));
        setUser(resp?.data?.employee);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
      console.log(error);
    }
  };

  // fetch all the doctors
  const fetchDoctors = useCallback(async (tm_id) => {
    setIsLoading(true);
    try {
      const resp = await apiService.post("", {
        tm_id,
        operation: "authenticate",
        show_tips_details: false,
      });
      if (resp?.data?.status === 404) {
        setIsLoading(false);
        toast.error(resp?.data?.message);
        return false;
      }
      if (resp?.data?.status === 200) {
        setDoctorList(resp?.data?.doctors.reverse());
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
      console.log(error);
    }
  }, []);

  // upload file
  const actionUploadPhoto = useCallback(async (photo) => {
    setIsLoading(true);
    const config = {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json, */*",
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      let formData = new FormData();
      formData.append("upload_file", photo);
      const resp = await apiService.post("/file_upload.php", formData, config);
      if (resp?.data?.status === 200) {
        setIsLoading(false);
        return {
          media_path: resp?.data?.filename,
        };
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
      console.log(error);
    }
  }, []);

  // update doctor
  const updateDoctor = async (docinfo) => {
    setIsLoading(true);
    try {
      const resp = await apiService.post("", {
        operation: "update_doctor",
        tm_id: user?.tm_id,
        doctor_code: docinfo.doctor_code,
        doctor_name: docinfo.doctor_name,
        speciality: docinfo.speciality,
        city_region: docinfo.city_region,
        state: docinfo.state,
        media_path: docinfo.media_path,
        status: "pending",
      });
      if (resp?.data?.status === 200) {
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
      console.log(error);
    }
  };

  // upload tips
  const actionUploadTips = async (tips) => {
    setIsLoading(true);
    try {
      const resp = await apiService.post("", {
        operation: "submit_tips",
        tm_id: user?.tm_id,
        doctor_code: docInfo.doctor_code,
        tips,
      });
      if (resp?.data?.status === 200) {
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
      console.log(error);
    }
  };

  // create doctor
  const createDoctor = async (docinfo) => {
    setIsLoading(true);
    try {
      const resp = await apiService.post("", {
        operation: "create_doctor",
        tm_id: user?.tm_id,
        doctor_code: docinfo.doctor_code,
        doctor_name: docinfo.doctor_name,
        speciality: docinfo.speciality,
        city_region: docinfo.city_region,
        state: docinfo.state,
      });
      if (resp?.data?.status === 200) {
        setIsLoading(false);
        toast.success("Doctor created successfully");
        return true;
      }
      if (resp?.data?.status === 404) {
        setIsLoading(false);
        toast.error(resp?.data?.message);
        return false;
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDoctors(user?.tm_id);
    }
  }, [user]);

  const store = {
    user,
    setUser,
    docInfo,
    setDocInfo,
    isLoading,
    setIsLoading,
    tips,
    setTips,
    actionLogin,
    doctorList,
    setDoctorList,
    fetchDoctors,
    updateDoctor,
    actionUploadPhoto,
    actionUploadTips,
    createDoctor,
  };
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};
