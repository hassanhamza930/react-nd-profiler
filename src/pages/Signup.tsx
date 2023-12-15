import SignupForm from "../components/ui/forms/SignupForm";

const Signup = () => {
  return (
    <div className="flex justify-center items-center w-full h-[100vh]">
      <div className="lg:w-1/2 flex  justify-center items-start p-20">
        <div className="w-[70%]">
          <img
            src="/assets/images/logo.svg"
            width={80}
            height={104}
            alt="logo"
          />
          <h5 className="text-[24px] font-semibold mb-3 mt-5">
            Create Your Account
          </h5>
          <p className="text-md mb-3 text-lightgray">
            Enter Your Information Below to Create Your Account
          </p>
          <SignupForm />
        </div>
      </div>
      <div className="w-1/2 h-[100vh] lg:flex hidden items-center p-10">
        <div className="w-full h-full bg-[#FFF8E1] shadow-lg rounded-lg  p-5">
          <div className="flex items-start justify-center">
            <img
              src="/assets/images/login-vector.svg"
              alt="background"
              className="object-fill h-full w-"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
