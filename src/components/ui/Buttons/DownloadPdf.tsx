;
import React, { useState } from "react";
import Button from "../Button";
import html2pdf from "html2pdf.js";
import emailJs from "@emailjs/browser";
import toast from "react-hot-toast";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  elementId: string;
  emailId: string;
}

const DownloadPdf: React.FC<Props> = ({ elementId, emailId }) => {
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleClick = () => {
    setDownloadLoading(true);
    const element = document.getElementById(elementId);
    html2pdf(element);
    setDownloadLoading(false);
  };
  const handleSendEmail = () => {
    setLoading(true);
    const element = document.getElementById("recommendations");

    const emailParams = {
      to_email: emailId,
      subject: "Result of Survey at ND_PROFILER",
      my_html: element?.innerHTML,
    };
    emailJs
      .send(
        "service_7bdfwib",
        "template_g559y7g",
        emailParams,
        "uYjKFrNrAqnfXg6qf"
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        toast.success("Email Sent Successfully");
      });
  };
  return (
    <div className="flex justify-center items-center gap-x-3">
      <Button
        className="bg-[#3C3C3C] text-lg font-medium text-white w-[182px] h-[49px]"
        onClick={handleSendEmail}
        disabled={loading}
      >
        Send Email
      </Button>
      <Button
        className="bg-[#3C3C3C] text-lg font-medium text-white w-[182px] h-[49px]"
        onClick={handleClick}
        disabled={downloadLoading}
      >
        Download
      </Button>
    </div>
  );
};

export default DownloadPdf;
