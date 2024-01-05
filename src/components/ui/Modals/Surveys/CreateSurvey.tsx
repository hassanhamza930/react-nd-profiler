import React, { useState } from "react";
import Input from "../../Input";
import Button from "../../Button";
import { createSurvey } from "../../../../helpers/surveys";
import { toast } from "react-toastify";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  handleClose: () => void;
  setRender: (args: boolean) => void;
}

const CreateSurvey: React.FC<Props> = ({ handleClose, setRender }) => {
  const [title, setTitle] = useState<string>();
  const [tagline, setTagline] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [role, setRole] = useState<string>();

  const handelClick = () => {
    const data = {
      title,
      tagline,
      description,
      role,
      status: "pending",
    };
    if (!title) {
      return toast.error("title cannot be empty");
    } else if (!tagline) {
      return toast.error("tagline cannot be empty");
    } else if (!description) {
      return toast.error("description cannot be empty");
    } else if (!role) {
      return toast.error("role is not selected");
    } else {
      createSurvey(data, setRender);
      handleClose();
    }
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
        onChange={(e) => setRole(e.target.value)}
      >
        <option selected>Select Role</option>
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
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateSurvey;
