;
import React, { useState } from "react";
import Input from "../../Input";
import Button from "../../Button";
import { Section } from "../../../../Types";
import { updateSection } from "../../../../helpers/sections";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  surveyId: string;
  setIsOpen: (args: boolean) => void;
  setRender: (args: boolean) => void;
  section: Section;
}

const EditSection: React.FC<Props> = ({ surveyId, setIsOpen, section,setRender }) => {
  const [title, setTitle] = useState<string>(section?.title);

  const handleUpdate = () => {
    const data = {
      title,
    };
    updateSection(surveyId!, section?.id, data,setRender);
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

export default EditSection;
