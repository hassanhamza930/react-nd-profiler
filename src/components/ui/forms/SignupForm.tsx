import React, { useState } from "react";
import Input from "../Input";
import Button from "../Button";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { handleSignUp } from "../../../helpers/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignupForm = () => {
  const [child, setChild] = useState(false);
  const [employee, setEmployee] = useState(false);
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  return (
    <form className="w-full">
      <div className="overflow-hidden">
        <div className="md:flex flex-col">
          <div className="flex-1">
            <h6 className="text-lg font-semibold my-2">First Name</h6>
            <Input
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <h6 className="text-lg font-semibold my-2">Last Name</h6>
            <Input
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="flex-1">
            <h6 className="text-lg font-semibold my-2">Email</h6>
            <Input
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <h6 className="text-lg font-semibold my-2">Password</h6>
            <label className="relative">
              <Input
                required
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute top-3 right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {" "}
                {showPassword ? (
                  <IoEye className="text-2xl" />
                ) : (
                  <IoEyeOff className="text-2xl" />
                )}
              </span>
            </label>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <h6 className="text-lg font-semibold md:mb-5 mb-3 md:mt-0 mt-3">
          Select User
        </h6>
        <div className="flex">
          <div
            className={
              child
                ? "border-primary border-2 w-[120px] h-[100px] rounded-sm shadow-lg flex flex-col items-center justify-center me-5 cursor-pointer"
                : "w-[120px] h-[100px] rounded-sm shadow-lg border flex flex-col items-center justify-center me-5 cursor-pointer"
            }
            onClick={() => {
              setChild(true);
              setRole("child");
              setEmployee(false);
            }}
          >
            <img
              src="/assets/images/child.svg"
              width={30}
              height={64}
              alt="background"
            />
            <p className="text-base mt-1">Child</p>
          </div>
          <div
            className={
              employee
                ? "border-primary border-2 w-[120px] h-[100px] rounded-sm shadow-lg flex flex-col items-center justify-center me-5 cursor-pointer"
                : "w-[120px] h-[100px] rounded-sm shadow-lg border flex flex-col items-center justify-center me-5 cursor-pointer"
            }
            onClick={() => {
              setEmployee(true);
              setRole("employee");
              setChild(false);
            }}
          >
            <img
              src="/assets/images/employee.svg"
              width={33}
              height={67}
              alt="background"
            />
            <p className="text-base mt-1">Employee</p>
          </div>
        </div>
      </div>
      <div className="flex  justify-center md:mt-0 mt-5">
        <Button
          onClick={(e) =>
            handleSignUp(
              e,
              firstName,
              lastName,
              email,
              password,
              role,
              navigate,
              setIsLoading
            )
          }
          className="mt-7 w-[240px] "
        >
          {loading ? (
            <svg
              aria-hidden="true"
              className="w-7 h-7 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            "Signup"
          )}
        </Button>
      </div>
      <p className="text-base text-center mt-4 text-lightgray">
        {"Already have an account? "}
        <button
          className="text-primary font-semibold text-md cursor-pointer"
          onClick={() => { navigate("/auth/login") }}
        >
          Login
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
