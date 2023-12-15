;
import Button from "../Button";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  handelClick: () => void;
  handleClose: () => void;
}

const DeleteModal: React.FC<Props> = ({ handelClick, handleClose }) => {

  return (
    <div>
      <h6 className="text-lg font-semibold mb-3 text-center">
        Are you sure to want to delete this ?
      </h6>
      <div className="flex justify-center">
        <Button className="text-md h-10 bg-green-600" onClick={handelClick}>
          Yes
        </Button>
        <Button
          className="text-md h-10 bg-red-600 ms-3"
          onClick={() => handleClose()}
        >
          No
        </Button>
      </div>
    </div>
  );
};

export default DeleteModal;
