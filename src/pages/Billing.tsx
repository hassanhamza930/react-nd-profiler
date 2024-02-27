import { useEffect, useState } from "react";
import Header from "../components/header";
import { FaHandHoldingDollar } from "react-icons/fa6";
import BuyButtonComponent from "../components/ui/Buttons/BuyButtonComponent";
import { Link } from "react-router-dom";
import useGetUser from "../helpers/getUser";

const Billing = () => {
  const [selected, setSelected] = useState(0);
  const { user } = useGetUser();

  const onClickPlan = (index: number) => {
    setSelected(index);
  };

  return (
    <>
      <Header heading="Billing" />
      <div className="mt-8">
        <button
          onClick={() => {
            window.open(
              "https://billing.stripe.com/p/login/eVa7vm5EDeAl3a8cMM"
            );
          }}
          className="px-4 py-4 bg-blue-600 text-white text-sm rounded-md"
        >
          Manage Subscription
        </button>
      </div>

      <div className="flex w-full gap-x-6 flex-wrap justify-center sm:justify-start">
        {user.package !== "premium" ? (
          <div className="flex flex-col justify-start items-start">
            <p className="mt-6 text-md font-regular capitalize">
              Choose a plan to upgrade your package and experience best.
            </p>
            <BillingBox
              title="Premium"
              price={1000}
              details={[]}
              index={1}
              onClick={onClickPlan}
              selected={selected}
            />
          </div>
        ) : (
          <div className="mt-5">
            You are currently on the paid plan for <b>1000 USD per month</b>
          </div>
        )}
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

const BillingBox = ({ title, price }: BillingProp) => {
  const ref_id = localStorage.getItem("uid");
  const email = localStorage.getItem("email");
  console.log(ref_id, "ref_id");
  return (
    <div className="relative z-0 bg-[url('https://img.freepik.com/free-vector/dynamic-gradient-grainy-background_23-2148963687.jpg')] bg-cover bg-end w-full h-full max-w-[325px] mt-5 rounded-xl text-white font-medium flex flex-col justify-between items-start overflow-hidden shadow-md">
      <div className="absolute z-10 bg-blue-600/50 backdrop-blur-lg h-full w-full"></div>
      <div className="relative h-full w-full z-20 flex-col flex justify-between items-center p-5 ">
        <p className="text-lg font-normal mb-4">{title}</p>
        <FaHandHoldingDollar size={40} className="w-16" />
        <p className="text-md font-normal mt-6">$10 / Month</p>
        <div className="mt-5">
          <BuyButtonComponent
            buttonId="buy_btn_1OmvBLHMk6dSdO1wPJ1Xczbj"
            publishable_key="pk_test_51MyR7yHMk6dSdO1wlKzjSLGUKNvZODKUOY9gdFA0AWPIQ070CAU15FkaD2drkFa93xOjffJP2nfq8Kyr8bWSU3RH00qMrz1GUb"
            clientRefId={ref_id}
            customerEmail={email}
          />
        </div>
      </div>
    </div>
  );
};
