import { Link } from "react-router-dom";
// import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
export default function DoctorItem({ doc }) {
  return (
    <Link
      to={`doctor-details/${doc.doctor_code}`}
      className={`text-gray-500 py-3 block relative ${
        doc?.tips_submitted && doc?.status === "approved"
          ? "pointer-events-none"
          : "pointer-events-auto"
      }`}
    >
      <h4 className="uppercase text-lg md:text-xl leading-6 font-semibold">
        {doc.doctor_name}
      </h4>
      <p className="text-sm">{doc.speciality}</p>
      {doc?.tips_submitted && doc?.status === "pending" && (
        <>
          <div className="px-1 py-0.5 text-xs font-medium text-white transition-opacity duration-300 bg-gray-400 rounded shadow-sm inline-block">
            Tips Submitted
          </div>
        </>
      )}
      {doc?.tips_submitted && doc?.status === "approved" && (
        <>
          <div className="px-1 py-0.5 text-xs font-medium text-white transition-opacity duration-300 bg-green-700 rounded shadow-sm inline-block">
            Tips Approved
          </div>
        </>
      )}
      {/* {doc?.tips_submitted && doc?.status === "rejected-1" && (
        <>
          <div className="px-1 py-0.5 text-xs font-medium text-white transition-opacity duration-300 bg-red-600 rounded shadow-sm inline-block">
            Uploaded Image is not appropriate
          </div>
        </>
      )} */}
      {/* {doc?.tips_submitted && doc?.status === "rejected-1" && (
        <>
          <div className="px-1 py-0.5 text-xs font-medium text-white transition-opacity duration-300 bg-red-600 rounded shadow-sm inline-block">
            Entered data is not appropriate
          </div>
        </>
      )} */}
    </Link>
  );
}
