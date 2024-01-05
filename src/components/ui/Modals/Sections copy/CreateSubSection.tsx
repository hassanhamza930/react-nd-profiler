
import React, { useState } from "react";
import Input from "../../Input";
import Button from "../../Button";
import { createSubsection } from "../../../../helpers/sections";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  setIsOpen: (args:boolean) => void;
  setRender: (args:boolean) => void;
  surveyId:string,
  sectionId:string
  
}

const CreateSubSection: React.FC<Props> = ({ setRender,setIsOpen,surveyId,sectionId }) => {
  const [title, setTitle] = useState<string>();

  const handleCreate = () => {
    createSubsection(sectionId, title!,setIsOpen,setRender)
    setTitle("")
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
          <Button className="text-md h-10" onClick={handleCreate}>
            Create
          </Button>
        </div>
    </div>
  );
};

export default CreateSubSection;
