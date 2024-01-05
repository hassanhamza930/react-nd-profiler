
import React, { useState } from "react";
import Input from "../../Input";
import Button from "../../Button";
import { Subsection } from "../../../../Types";
import { updateSubsection } from "../../../../helpers/sections";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  surveyId: string;
  sectionId: string;
  setIsOpen: (args: boolean) => void;
  setRender: (args: boolean) => void;
  subsection: any;
  
}

const EditSubSection: React.FC<Props> = ({ setRender,surveyId,sectionId, setIsOpen, subsection }) => {
  const [title, setTitle] = useState<string>(subsection?.title);
  console.log("sectionId",subsection)


  const handleUpdate = () => {
    const data = {
      title,
    };
    updateSubsection(surveyId!,subsection.sectionid, subsection.id, data,setRender);
    setIsOpen(false);
  };

  return (
    <div>
      <h6 className="text-lg font-semibold mb-3">Title</h6>
      <Input
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-7"
      />
      <div className="flex justify-end">
        <Button className="text-md h-10" onClick={handleUpdate}>
          Update
        </Button>
      </div>
    </div>
  );
};

export default EditSubSection;
