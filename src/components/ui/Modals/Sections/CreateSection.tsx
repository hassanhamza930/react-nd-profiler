;
import React, { useState } from "react";
import Input from "../../Input";
import Button from "../../Button";
import { createSection } from "../../../..//helpers/sections";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  setIsOpen: (args:boolean) => void;
  setRender: (args:boolean) => void;
  surveyId:string
}

const CreateSection: React.FC<Props> = ({ setIsOpen,surveyId,setRender }) => {
  const [title, setTitle] = useState<string>();

  const handleCreate = () => {
    createSection(surveyId!, title!,setIsOpen)
    setRender(true);
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

export default CreateSection;
