;
import React, { useState } from "react";
import Input from "../../Input";
import Button from "../../Button";
import { Survey } from "../../../../Types";
import { updateSurvey } from "../../../../helpers/surveys";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  survey: Survey;
  handleClose: () => void;
  setRender?:React.Dispatch<React.SetStateAction<boolean>>;
}

const EditSurvey: React.FC<Props> = ({ handleClose, survey,setRender }) => {
  const [title, setTitle] = useState(survey?.title);
  const [tagline, setTagline] = useState(survey?.tagline);
  const [description, setDescription] = useState(survey?.description);
  const [role,setRole]=useState(survey?.role)

  const handelClick = () => {
    const data = {
      title,
      tagline,
      description,
      role
    };
    updateSurvey(survey?.id, data,setRender);
    handleClose();
  };

  return (
    <div>
      <h6 className="text-lg font-semibold mb-3">Title</h6>
      <Input
        placeholder="Enter email"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-7"
      />
      <h6 className="text-lg font-semibold mb-3">Tagline</h6>
      <Input
        placeholder="Enter tagline"
        value={tagline}
        onChange={(e) => setTagline(e.target.value)}
        className="mb-7"
      />
      <h6 className="text-lg font-semibold mb-3">Select Role</h6>
      <select
        id="role"
        className="h-12 w-full mt-1 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none mb-7"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option>Select Role</option>
        <option value="child">Child</option>
        <option value="employee">Employee</option>
      </select>
      <h6 className="text-lg font-semibold mb-3">Description</h6>
      <textarea
        className={
          "h-12 w-full mt-1 mb-7 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        }
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex justify-end">
        <Button className="text-md h-10" onClick={handelClick}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditSurvey;
