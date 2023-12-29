;
import Button from "../Button";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  handelClick: () => void;
  handleClose: () => void;
}

const DeleteModal: React.FC<Props> = ({ handelClick, handleClose }) => {

  return (
    <div>
      <h6 className="text-lg font-normal mb-3 text-center">
        Are you sure to want to delete this ?
      </h6>
      <div className="flex justify-center mt-6 w-full">
        <Button className="text-md h-10 bg-primary  font-normal w-full max-w-[100px]" onClick={handelClick}>
          Yes
        </Button>
        <Button
          className="text-md h-10 bg-primary ms-3 w-full max-w-[100px] font-normal"
          onClick={() => handleClose()}
        >
          No
        </Button>
      </div>
    </div>
  );
};

export default DeleteModal;
