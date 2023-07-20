import { IoClose } from "react-icons/io5";
export default function Modal({ children, setModalOpen }) {
  return (
    <div
      className="bg-primary/60 fixed top-0 left-0 w-full h-full flex items-center justify-center"
      onClick={() => setModalOpen(false)}
    >
      <div className=" max-w-lg w-full mx-auto p-4 relative ">
        <div className="relative bg-white p-6 !pb-10 rounded-2xl shadow-lg">
          {children}

          <div
            className="border-2 border-white btn absolute shadow-lg !p-3 left-[50%] translate-x-[-50%] -bottom-5"
            onClick={() => setModalOpen(false)}
          >
            <IoClose className="text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
