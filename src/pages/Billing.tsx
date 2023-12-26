import { useState } from "react";
import Header from "../components/header";
import { FaHandHoldingDollar } from "react-icons/fa6";

const Billing = () => {
  const [selected, setSelected] = useState(0);
  const onClickPlan = (index: number) => {
    setSelected(index);
  };
  return (
    <>
      <Header heading="Billing" />
      <p className="mt-6 mb-10 text-[22px] font-[500] capitalize">
        Choose a plan to upgrade your package and experience best.
      </p>
      <div className="flex mt-4 w-full gap-x-6">
        <BillingBox
          title="Freemium"
          price={0}
          details={[]}
          index={0}
          onClick={onClickPlan}
          selected={selected}
        />
        <BillingBox
          title="Premium"
          price={99}
          details={[]}
          index={1}
          onClick={onClickPlan}
          selected={selected}
        />
      </div>
    </>
  );
};

export default Billing;
type BillingProp = {
  title: string;
  price: string | number;
  details: [];
  index: number;
  onClick: (index: number) => void;
  selected: number;
};

const BillingBox = ({
  title,
  price,
  details,
  onClick,
  index,
  selected,
}: BillingProp) => {
  return (
    <div className="bg-gradient-to-r from-[#00c6ff]  to-[#0072ff] w-full max-w-[300px] bg-blue flex flex-col items-center justify-center p-4 text-white rounded-xl shadow-lg">
      <p className="text-[20px] font-bold">{title}</p>
      <FaHandHoldingDollar size={40} className="w-24" />
      <p className="text-[18px] font-semibold mt-6">$ {price}/mo</p>
      <button
        disabled={selected === index}
        className={`bg-[#FFFFFF] mt-8 text-sm text-black w-full max-w-[150px] p-2 rounded-md font-bold ${
          selected === index && "opacity-[0.5]"
        }`}
        onClick={() => onClick(index)}
      >
        {selected === index ? "Subscribed" : "Upgrade"}
      </button>
    </div>
  );
};
