import { memo } from "react";

const Heading = ({ title }) => {
  return (
    <h4 className="uppercase text-primary font-bold text-2xl md:text-4xl sm:text-3xl text-center mt-4 md:mt-2 drop-shadow ">
      {title}
    </h4>
  );
};
export default memo(Heading);
