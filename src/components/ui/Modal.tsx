import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";
import "../../index.css"

interface Props {
  isOpen: boolean;
  onChange: (isOpen: boolean) => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<Props> = ({
  isOpen,
  onChange,
  title,
  children,
}) => {
  return (
    <Dialog.Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="
                  bg-neutral-900/90
                  backdrop-blur-sm
                  fixed
                  inset-0
                  z-20"
        >
          <Dialog.Content
            className="
          fixed 
          drop-shadow-md
          border
          border-neutral-700
          top-[50%]
          left-[50%]
          max-h-full
          h-full
          overflow-y-scroll
          md:h-auto
          md:max-h-[85vh]
          w-full
          md:w-[90vw]
          md:max-w-[550px]
          translate-x-[-50%]
          translate-y-[-50%]
          rounded-lg
          bg-white
          p-[25px]
          focus:outline-none
          z-10"
          >
            <Dialog.Title
              className="
              text-2xl
              font-bold
              text-center
              mb-4"
            >
              {title}
            </Dialog.Title>
            <div>{children}</div>

            <Dialog.Close asChild>
              <button
                className="
                text-black
                absolute
                top-[10px]
                right-[10px]
                inline-flex
                h-[25px]
                w-[25px]
                appearance-none
                items-center
                justify-center
                rounded-full
                focus:outline-none
              "
              >
                <IoMdClose />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
