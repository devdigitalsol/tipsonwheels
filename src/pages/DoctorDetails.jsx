import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Heading from "../components/Heading";
import { AiFillIdcard } from "react-icons/ai";
import { FaUserAlt, FaMedal, FaCity, FaMapMarkedAlt } from "react-icons/fa";
import { TbCodePlus } from "react-icons/tb";
import Modal from "../components/Modal";
import { toast } from "react-hot-toast";
import { AppContext } from "../context";
import { states } from "../utils";
export default function DoctorDetails() {
  const [isUpdated, setIsUpdated] = useState(false);
  const navigate = useNavigate();
  const {
    doctorList,
    setDocInfo,
    updateDoctor,
    actionUploadPhoto,
    fetchDoctors,
    user,
  } = useContext(AppContext);
  const [modalOpen, setModalOpen] = useState(false);
  const { doctor_code } = useParams();
  const [terms, setTerms] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [imgFile, setImgFile] = useState();
  const [docDetails, setDocDetails] = useState({
    doctor_name: "",
    doctor_code: "",
    speciality: "",
    city_region: "",
    state: "",
    media_path: "",
  });
  useEffect(() => {
    if (doctor_code && doctorList.length) {
      const docInfo = doctorList.find(
        (doc) => Number(doc.doctor_code) === Number(doctor_code)
      );
      if (docInfo) {
        setDocDetails(docInfo);
      }
    }
  }, [doctor_code, doctorList]);

  const cansave = [
    docDetails.doctor_name?.trim().length,
    docDetails.doctor_code?.trim().length,
    docDetails.speciality?.trim().length,
    docDetails.city_region?.trim().length,
    docDetails.state?.trim().length,
    imgFile,
    terms,
  ].every(Boolean);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !docDetails.doctor_name?.trim().length ||
      !docDetails.doctor_code.trim().length ||
      !docDetails.speciality.trim().length ||
      !docDetails.city_region.trim().length ||
      !docDetails.state.trim().length ||
      !terms
    ) {
      toast.error("Please enter all required information");
      return false;
    }

    if (!docDetails?.media_path.trim().length) {
      const { media_path } = await actionUploadPhoto(photo);
      if (media_path) {
        const uploadAllDocData = await updateDoctor({
          ...docDetails,
          media_path: media_path,
        });
        setDocInfo({ ...docDetails, media_path: media_path });
        setIsUpdated(uploadAllDocData);
      }
    } else {
      const uploadAllDocData = await updateDoctor({
        ...docDetails,
      });
      setIsUpdated(uploadAllDocData);
      setDocInfo(docDetails);
    }
  };
  useEffect(() => {
    if (isUpdated && docDetails?.tips_submitted) {
      toast.success("Doctor updated successfully");
      fetchDoctors(user?.tm_id);
    }
    if (isUpdated && !docDetails?.tips_submitted) {
      navigate(`/select-tips/${doctor_code}`);
      fetchDoctors(user?.tm_id);
    }
  }, [isUpdated]);
  const selectImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocDetails((prev) => {
        return { ...prev, media_path: "" };
      });
      setPhoto(file);
      setImgFile(URL.createObjectURL(e.target.files[0]));
    }
  };
  useEffect(() => {
    if (docDetails?.media_path?.trim().length) {
      setPhoto(docDetails?.media_path);
      setImgFile(docDetails?.media_path);
    }
  }, [docDetails]);

  return (
    <>
      <div className="max-w-lg mx-auto w-full flex-grow space-y-8 px-4 pb-4">
        <Heading title="Doctor Details" />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 w-full"
        >
          <div className="card space-y-3 shadow">
            <div className="form-group">
              <FaUserAlt className="text-primary text-2xl" />
              <input
                type="text"
                className="form-control"
                placeholder="Doctor Name"
                value={docDetails?.doctor_name}
                onChange={(e) =>
                  setDocDetails({ ...docDetails, doctor_name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <TbCodePlus className="text-primary text-2xl" />
              <input
                type="text"
                className="form-control"
                placeholder="Doctor Code"
                value={docDetails?.doctor_code}
                disabled
                onChange={(e) =>
                  setDocDetails({ ...docDetails, doctor_code: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <FaMedal className="text-primary text-2xl" />
              <input
                type="text"
                className="form-control"
                placeholder="Speciality"
                value={docDetails?.speciality}
                onChange={(e) =>
                  setDocDetails({ ...docDetails, speciality: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <FaCity className="text-primary text-2xl" />
              <input
                type="text"
                className="form-control"
                placeholder="City/Region"
                value={docDetails?.city_region}
                onChange={(e) =>
                  setDocDetails({ ...docDetails, city_region: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <FaMapMarkedAlt className="text-primary text-2xl shrink-0" />
              <select
                value={docDetails?.state}
                name=""
                id=""
                className="form-control w-full"
                onChange={(e) =>
                  setDocDetails({ ...docDetails, state: e.target.value })
                }
              >
                <option value="">Select State</option>
                {states.map((item, i) => {
                  return <option key={i}>{item}</option>;
                })}
              </select>
            </div>
            <div className="form-group !py-1 items-center">
              <AiFillIdcard className="text-primary text-2xl" />
              <label
                htmlFor="photo"
                className="bg-primary form-control text-white text-sm items-center justify-start flex rounded-md py-1"
              >
                Browse Photo
                <input
                  id="photo"
                  type="file"
                  className="hidden"
                  onChange={selectImg}
                />
              </label>
            </div>
            <span className="text-xs">
              Note: Browse photo of Visiting Card of Blank Rx Pad of Doctor
            </span>
            {imgFile && (
              <div className="w-40 mx-auto">
                <img src={imgFile} alt="photo" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 justify-center">
            <input
              type="checkbox"
              value={terms}
              onChange={() => setTerms(!terms)}
            />
            <span>
              I have read and agree to the{" "}
              <span
                className="underline text-blue-700"
                onClick={() => setModalOpen(true)}
              >
                terms and conditions.
              </span>
            </span>
          </div>
          <button type="submit" className="btn self-center" disabled={!cansave}>
            Submit
          </button>
        </form>
      </div>
      {modalOpen && (
        <Modal setModalOpen={setModalOpen}>
          <h4 className="text-primary font-semibold text-xl mb-1">
            Terms & Conditions:
          </h4>
          <p className="text-sm">
            I have opted to use the “Acidity while on wheels” activity web link
            of my own volition and agree to upload my personal details therein
            for participating in the activity. I state that the personal details
            shared by me are true and accurate and the Company shall not have
            any liability arising from its reliance on the same. I understand
            that no data will be retained by the Company post the event. I agree
            that the all contents used for promotion of the event shall be the
            property of Dr. Reddy's, and meant for its use only.
          </p>
        </Modal>
      )}
    </>
  );
}
