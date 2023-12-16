
import React, { useState } from "react";
import Input from "../../Input";
import Button from "../../Button";
import { Subsection } from "../../../../Types";
import { updateSubsection } from "../../../../helpers/sections";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  surveyId: string;
  sectionId: string;
  setIsOpen: (args: boolean) => void;
  subsection: Subsection;
}

const EditSubSection: React.FC<Props> = ({ surveyId,sectionId, setIsOpen, subsection }) => {
  const [title, setTitle] = useState<string>(subsection?.title);

  const handleUpdate = () => {
    const data = {
      title,
    };
    updateSubsection(surveyId!,sectionId, subsection?.id, data);
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
