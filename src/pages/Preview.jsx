import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context";
import parse from "html-react-parser";
import POSTER420 from "./../assets/images/poster420.png";
import POSTER320 from "./../assets/images/poster320.png";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import PDFBG from "./../assets/images/tipbg.png";
import slugify from "slugify";
import { titleCase } from "../utils";

export default function Preview() {
  const navigate = useNavigate();
  const { user, docInfo, tips, actionUploadTips, fetchDoctors } =
    useContext(AppContext);
  useEffect(() => {
    if (!docInfo || !tips) {
      navigate("/");
    }
  }, [docInfo, tips, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const changeData = tips.map((item) => {
      return {
        id: item?.id,
        tip: item?.text,
      };
    });

    const updateSuccess = await actionUploadTips(changeData);

    if (updateSuccess) {
      toast.success("Data submitted successfully!");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "a5",
      });
      doc.addImage(PDFBG, "png", 0, 0, 5.8, 8.3);

      tips.map((tip, i) => {
        doc.setFont("helvetica", "", "normal");
        doc.setFontSize(15);
        doc.setTextColor(40, 40, 40);
        doc.addImage(tip.icon, "png", 0.62, 0.757 * i + 1.88, 0.58, 0.58);
        doc.text(tip.text, 1.5, 0.76 * i + 2.1, { maxWidth: 3.6 });
      });
      doc.setFontSize(18);
      doc.setFont("helvetica", "", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(
        "Dr " + titleCase(docInfo?.doctor_name),
        doc.internal.pageSize.getWidth() / 2,
        6.2,
        {
          align: "center",
        }
      );
      doc.setFontSize(14);
      doc.setFont("helvetica", "", "bold");
      doc.text(
        titleCase(docInfo?.speciality),
        doc.internal.pageSize.getWidth() / 2,
        6.45,
        {
          align: "center",
        }
      );
      doc.setFontSize(12);
      doc.setFont("helvetica", "", "normal");
      doc.text(
        `${titleCase(docInfo?.city_region)}, ${titleCase(docInfo?.state)}`,
        doc.internal.pageSize.getWidth() / 2,
        6.65,
        {
          align: "center",
        }
      );
      let pdfName = slugify(
        `${docInfo?.doctor_code}-${
          docInfo?.doctor_name
        }-${new Date().getDate()}-${
          new Date().getMonth() + 1
        }-${new Date().getFullYear()}`
      );
      doc.save(`${pdfName}.pdf`);
    }
    fetchDoctors(user?.tm_id);
  };

  return (
    <div className="md:px-10 w-full flex flex-col flex-grow items-center justify-center px-4 py-4">
      <div className="shadow-xl border-primary border">
        <div className="md:w-[384px] w-[320px] aspect-[1/1.414] bg-white relative">
          <div className="flex flex-col md:w-[302px] w-[254px]  mx-auto  left-0 right-0 absolute md:top-[120px] top-[100px] md:gap-[6px] gap-[4px]">
            {tips?.map((tip) => {
              return (
                <div
                  className="flex w-full md:h-[44px] h-[38px] gap-[3px]"
                  key={tip.id}
                >
                  <div className=" md:w-[42px] w-[36px] shrink-0 items-center justify-center flex">
                    <img src={tip.icon} alt="icon" className="w-[32px]" />
                  </div>
                  <div className="grow p-1 px-1.5 text-[11px] items-center flex justify-start leading-4">
                    <div>{parse(tip.text)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col items-center text-white absolute w-full md:top-[387px] top-[328px]">
            <div className="leading-5  md:text-base text-sm">
              Dr {titleCase(docInfo?.doctor_name)}
            </div>
            <div className="md:text-[13px] text-[11px] leading-4 mt-[-2px] ">
              {titleCase(docInfo?.speciality)}
            </div>
            <div className="md:text-[11px] text-[9px] leading-3">
              {titleCase(docInfo?.city_region)}, {titleCase(docInfo?.state)}
            </div>
          </div>
          <img src={POSTER420} alt="poster" className="hidden md:block" />
          <img src={POSTER320} alt="poster" className="md:hidden block" />
        </div>
      </div>
      <button type="button" className="btn mt-4" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
