import React from "react";
import { Recommendation } from "../../../../Types";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  recommendation: Recommendation;
}

const ViewRecommendation: React.FC<Props> = ({ recommendation }) => {
  return (
    <div>
      <h6 className="text-md text-primary font-semibold mb-2 mt-5">
        From 25% to 50% results
      </h6>
      <div dangerouslySetInnerHTML={{ __html: recommendation?.from25to50 }} />
      <h6 className="text-md text-primary font-semibold mb-2 mt-5">
        From 51% to 75% results
      </h6>
      <div dangerouslySetInnerHTML={{ __html: recommendation?.from50to75 }} />
      <h6 className="text-md text-primary font-semibold mb-2 mt-5">
        From 76% to 100% results
      </h6>
      <div
        dangerouslySetInnerHTML={{ __html: recommendation?.from75to100 }}
        className="mb-5"
      />
    </div>
  );
};

export default ViewRecommendation;
