import React, { useState } from "react";
import Button from "../Button";
import html2pdf from "html2pdf.js";
import emailJs from "@emailjs/browser";
import toast from "react-hot-toast";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  elementId: string;
  emailId: string;
  graphElementId: string;
}

const DownloadPdf: React.FC<Props> = ({
  elementId,
  emailId,
  graphElementId,
}) => {
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const handleClick = () => {
    setDownloadLoading(true);

    const container = document.createElement("div");

    container.style.width = "100%";

    const graphElement = document.getElementById(graphElementId);
    if (graphElement) {
      const clonedGraphElement = graphElement.cloneNode(true) as HTMLElement;
      clonedGraphElement.style.padding = "20px";
      container.appendChild(clonedGraphElement);
    }

    container.appendChild(document.createElement("div")).style.pageBreakBefore =
      "always";

    const contentElement = document.getElementById(elementId);
    if (contentElement) {
      const clonedContentElement = contentElement.cloneNode(
        true
      ) as HTMLElement;
      clonedContentElement.style.padding = "30px 50px";
      container.appendChild(clonedContentElement);
    }

    html2pdf(container);

    setDownloadLoading(false);
  };

  const handleSendEmail = () => {
    setLoading(true);
    const element = document.getElementById(elementId);

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
    <div className="flex justify-center items-center gap-x-3 z-50">
      <Button
        className="bg-[#3C3C3C] text-md font-normal text-white w-[182px] h-[49px]"
        onClick={handleSendEmail}
        disabled={loading}
      >
        Send Email
      </Button>
      <Button
        className="bg-[#3C3C3C] text-md font-normal text-white w-[182px] h-[49px]"
        onClick={handleClick}
        disabled={downloadLoading}
      >
        Download
      </Button>
    </div>
  );
};

export default DownloadPdf;
