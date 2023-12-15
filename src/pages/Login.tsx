
import LoginForm from "../components/ui/forms/LoginForm";

const Login = () => {
  return (
    <>
      <div className="lg:flex lg:py-0 py-20 items-center justify-center w-full h-[100vh]">
        <div className="lg:w-1/2 w-full flex justify-center items-center">
          <div className="lg:flex items-center justify-start h-full">
            <div className="w-full lg:max-w-md">
              <img
                src="/assets/images/logo.svg"
                width={98}
                height={124}
                alt="logo"
              />
              <h5 className="text-[26px] font-semibold mb-3 mt-10">
                Login To Your Account
              </h5>
              <p className="text-md mb-8 text-lightgray">
                Please enter your login credentials below to login
              </p>
              <LoginForm />
            </div>
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
    </>
  );
};

export default Login;
