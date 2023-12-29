import { useState } from "react";
import Header from "../components/header";
import { FaHandHoldingDollar } from "react-icons/fa6";
import BuyButtonComponent from "../components/ui/Buttons/BuyButtonComponent";

const Billing = () => {
  const [selected, setSelected] = useState(0);
  const onClickPlan = (index: number) => {
    setSelected(index);
  };
  return (
    <>
      <Header heading="Billing" />
      <p className="mt-6 text-md font-regular capitalize">
        Choose a plan to upgrade your package and experience best.
      </p>
      <div className="flex w-full gap-x-6 flex-wrap justify-center sm:justify-start">
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
          price={1000}
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
  const ref_id = localStorage.getItem("uid");
  console.log(ref_id, "ref_id");
  return (
    <div className="relative z-0 bg-[url('https://img.freepik.com/free-vector/dynamic-gradient-grainy-background_23-2148963687.jpg')] bg-cover bg-end w-full h-full max-w-[325px] mt-5 rounded-xl text-white font-medium flex flex-col justify-between items-start overflow-hidden shadow-md">
      <div className="absolute z-10 bg-blue-600/50 backdrop-blur-lg h-full w-full"></div>
      <div className="relative h-full w-full z-20 flex-col flex justify-between items-center p-5 ">
        <p className="text-lg font-normal mb-4">{title}</p>
        <FaHandHoldingDollar size={40} className="w-16" />
        <p className="text-md font-normal mt-6">$ {price}</p>
        <div className="mt-5">
          {index === 0 && (
            <BuyButtonComponent
              buttonId="buy_btn_1OReYQAfze7OsrlF7NeYpcfY"
              publishable_key="pk_test_51ORGMMAfze7OsrlFNTMJifKHBm8B69cLJ5ORYtK2UBrxyV0Gkbqt2RuxpvzxJcKMoGmoUelXUVrCxE8K9or5wOlE000SctPe4q"
              clientRefId={ref_id}
            />
          )}
          {index === 1 && (
            <BuyButtonComponent
              buttonId="buy_btn_1OSDlQAfze7OsrlF2L1XBG86"
              publishable_key="pk_test_51ORGMMAfze7OsrlFNTMJifKHBm8B69cLJ5ORYtK2UBrxyV0Gkbqt2RuxpvzxJcKMoGmoUelXUVrCxE8K9or5wOlE000SctPe4q"
              clientRefId={ref_id}
            />
          )}
        </div>
      </div>
    </div>
  );
};
