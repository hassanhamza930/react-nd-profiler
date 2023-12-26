import { MdOutlineMail } from "react-icons/md";

export default function Header({ heading }: { heading: string }) {
  return (
    <div className="fixed md:relative z-10 bg-white flex flex-row w-full justify-between h-20 pt-4 pb-2 border-b-2 border-gray px-5 md:px-0">
      <div className="flex flex-row gap-2 justify-start items-center overflow-hidden">
        <h1 className="text-md md:text-2xl font-medium">{heading}</h1>
      </div>
      {/* <div className="flex flex-row justify-end items-center gap-6">
        <div className="relative">
          <MdOutlineMail size={27} />
          <div className="absolute bg-primary text-[10px] text-white rounded-full px-2 top-[-6px] right-[-6px] py-[3px]">
            1
          </div>
        </div>
        <img
          src="/assets/images/user.svg"
          alt="user"
          width={36}
          height={36}
          className="h-[30px] w-[30px] md:h-[40px] md:w-[40px] object-cover object-center rounded-full"
        />
      </div> */}
    </div>
  );
}
