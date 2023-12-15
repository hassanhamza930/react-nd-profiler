import React from "react";
import Button from "../Button";
// import { sendEmail } from "/helpers/email";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  elementId: string;
}

const SendMail: React.FC<Props> = ({ elementId }) => {
  const handleClick = () => {
    const element = document.getElementById(elementId);

    if (element) {
      console.log(element);
      const pdfData = element.getAttribute("data-pdf"); // replace 'data-pdf' with the actual attribute name

      if (pdfData) {
        // sendEmail(pdfData);
      } else {
        console.error("PDF data not found in the element.");
      }
    } else {
      console.error(`Element with id ${elementId} not found.`);
    }
  };
  return (
    <div>
      <Button
        className="bg-[#3C3C3C] text-lg font-medium text-white w-[182px] h-[49px]"
        onClick={handleClick}
      >
        Send to Email
      </Button>
    </div>
  );
};

export default SendMail;
