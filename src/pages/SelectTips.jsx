import parse from "html-react-parser";
import { tipsoptions } from "./../utils/tipsoptions";
import Heading from "../components/Heading";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AppContext } from "../context";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

export default function SelectTips() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { docInfo, setTips } = useContext(AppContext);

  useEffect(() => {
    if (!docInfo) {
      navigate("/");
    }
  }, [docInfo, navigate]);

  const [fiveTips, setFiveTips] = useState([]);
  const [customText, setCustomText] = useState("");

  const handleSubmit = async () => {
    if (fiveTips.length === 5) {
      setTips(fiveTips);
      navigate("/preview");
    }
  };

  return (
    <>
      <div className="md:px-10 w-full flex flex-col flex-grow px-4 py-4">
        <div className="spriteIcon mx-auto"></div>
        <Heading title="Select tips to control acidity while on wheels" />
        <div className="grid gap-x-8 gap-y-2 md:grid-cols-2 my-6 grid-cols-1">
          {tipsoptions.map((tip) => {
            return (
              <SingleTip
                key={tip.id}
                tip={tip}
                fiveTips={fiveTips}
                setFiveTips={setFiveTips}
                customText={customText}
                setCustomText={setCustomText}
              />
            );
          })}
        </div>
        <button
          type="button"
          className="btn self-center"
          onClick={handleSubmit}
          disabled={fiveTips?.length !== 5}
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="refModal bg-[url('assets/images/sprite.png')]"
        ></button>
      </div>
      {modalOpen && (
        <Modal setModalOpen={setModalOpen}>
          <h4 className="text-primary font-semibold text-xl mb-1">
            References:
          </h4>
          <div className="space-y-2">
            <p className="text-sm">
              1. 5 ways to reduce bloating and acidity when you’re traveling.
              Available at:
              https://www.vogue.in/wellness/content/how-to-reduce-bloating
              -acidity-during-travel-food-airplane-what-to-eat Accessed on: 21st
              February 2023.
            </p>
            <p className="text-sm">
              2. Follow these 5 health tips and you can prevent all digestive
              problems this summer. Available at:
              https://www.indiatoday.in/lifestyle/wellness/story/follow-5-health-tips-could-prevent-digestive-problems-acidity-drink-water-proteins-exercise-in-summer-323056-2016-05-12
              Accessed on: 20th April, 2023.
            </p>
            <p className="text-sm">
              3. Higher Acid Reflux During Winters? Yeah, You Heard That Right!,
              Available at: https://pharmeasy.in/blog/higher-acid-reflux-during
              -winters-yeah-you-heard -that-right/ Accessed on: 20th April,
              2023.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}

export const SingleTip = ({
  tip,
  fiveTips,
  setFiveTips,
  customText,
  setCustomText,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  useEffect(() => {
    if (!customText.trim().length && checkCustomEl) {
      const newtip = fiveTips.filter((i) => i.id !== 12);
      setFiveTips(newtip);
    }
  }, [customText]);

  const checkCustomEl = fiveTips.some((element) => {
    if (element.id === 12) {
      return true;
    }
    return false;
  });
  const handleCheck = () => {
    if (isSelected) {
      const newtip = fiveTips.filter((i) => i.id !== tip.id);
      setFiveTips(newtip);
      setIsSelected(false);
    } else {
      if (fiveTips.length === 5) {
        toast.error("You can select only 5 tips");
        return false;
      }
      setIsSelected(true);
      if (!isSelected) {
        setFiveTips((prev) => [...prev, { ...tip }]);
      }
    }
  };

  const handleChange = (e) => {
    setCustomText(e.target.value);
    if (checkCustomEl) {
      const newTip = fiveTips.map((p) =>
        p.id === 12 ? { ...p, text: e.target.value } : p
      );
      setFiveTips(newTip);
    } else {
      setFiveTips((prev) => [
        ...prev,
        { id: 12, icon: tip.icon, text: e.target.value },
      ]);
    }
  };

  return (
    <div className="flex gap-2" key={tip.id} onClick={handleCheck}>
      <div
        className={`w-16 h-16 shrink-0 bg-white shadow-md rounded-md flex items-center justify-center border-2 border-white ${
          isSelected && "!border-primary"
        }`}
      >
        <div className={`w-[60px] h-[60px] flex items-center justify-center`}>
          <img src={tip.icon} alt="icon" className="w-[42px]" />
        </div>
      </div>
      {tip.id === 12 ? (
        <div
          className={`flex-grow bg-white shadow-md rounded-md px-3 py-1 items-center flex justify-start relative border-2 border-white ${
            checkCustomEl && "!border-primary"
          }`}
        >
          <textarea
            className="w-full h-full outline-0 border-0"
            placeholder="Type your tip here"
            value={customText}
            onChange={handleChange}
            maxLength={65}
            disabled={fiveTips.length === 5 && !checkCustomEl}
          ></textarea>
          <span
            className={`text-xs text-gray-300 absolute bottom-0 right-2 ${
              customText.length > 65 && "text-red-700"
            } ${customText.length === 65 && "text-green-700 font-semibold"}`}
          >
            {customText.length}/65
          </span>
        </div>
      ) : (
        <div
          className={`flex-grow bg-white shadow-md rounded-md px-3 items-center flex justify-start border-2 border-white ${
            isSelected && "!border-primary"
          }`}
        >
          <p>{parse(tip.previewText)}</p>
        </div>
      )}
    </div>
  );
};
