import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Heading from "../components/Heading";
import { AiOutlineSearch, AiOutlineUserAdd } from "react-icons/ai";
import DoctorItem from "../components/DoctorItem";
import { AppContext } from "../context";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";

// const DoctorItem = React.lazy(() => import("./../components/DoctorItem"));

export default function Home() {
  const { doctorList } = useContext(AppContext);
  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    if (doctorList.length > 0) {
      setDoctors(doctorList);
    }
  }, [doctorList]);
  // const handleChange = (e) => {
  //   const keyword = e.target.value.toLowerCase();
  //   setSearchText(keyword);
  // };
  // const filterText = useCallback((keyword) => {
  //   if (keyword !== "") {
  //     const newDocs = doctorList.filter((doc) => {
  //       return doc.doctor_name.toLowerCase().includes(keyword);
  //     });
  //     setDoctors(newDocs);
  //   } else {
  //     setDoctors(doctorList);
  //   }
  // }, []);
  // useEffect(() => {
  //   filterText(searchText);
  // }, [searchText]);
  const sendQuery = useCallback(
    (value) => {
      if (value !== "") {
        const newDocs = doctorList.filter((doc) => {
          return doc.doctor_name.toLowerCase().includes(value);
        });
        setDoctors(newDocs);
        // console.log(newDocs);
      } else {
        setDoctors(doctorList);
      }
    },
    [doctorList]
  );
  const debouncedSendQuery = useMemo(() => {
    return debounce(sendQuery, 500);
  }, [sendQuery]);
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSendQuery(value);
  };

  return (
    <>
      <div className="max-w-lg mx-auto w-full flex-grow space-y-8 px-4">
        <Heading title="Select Doctor" />
        <div className="flex flex-col space-y-4 w-full">
          <div className="card space-y-4 shadow">
            <div className="form-group">
              <AiOutlineSearch className="text-primary text-2xl" />
              <input
                type="text"
                className="form-control"
                placeholder={`Search doctor by name`}
                onChange={handleChange}
              />
            </div>
            <div className="divide-y-2 max-h-full md:max-h-[calc(100dvh-20rem)] overflow-auto">
              {doctors?.length ? (
                doctors.map((doc) => {
                  return <DoctorItem doc={doc} key={doc.doctor_code} />;
                })
              ) : (
                <div className="text-gray-500">No Doctor Found</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Link
        to="/add-doctor"
        className="btn fixed bottom-6 right-6 flex items-center gap-2 !font-normal"
      >
        <AiOutlineUserAdd /> Add Doctor
      </Link>
    </>
  );
}
