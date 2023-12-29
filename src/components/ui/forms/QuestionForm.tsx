import React, { useEffect, useState } from "react";
import Button from "../Button";
import { Question } from "../../../Types";

import Modal from "../Modal";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { addResponse } from "../../../helpers/result";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  questions: Array<Question> | undefined;
}

const QuestionForm: React.FC<Props> = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  const [answer, setAnswer] = useState<string>();
  const [progress, setProgress] = useState(0);
  // const [results, setResults] = useState<any>();
  const [index, setIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState<string>("");
  const [color, setColor] = useState("");

  const pathname = window.location.pathname;
  const navigate = useNavigate();
  const surveyId = pathname.split("/")[3];

  useEffect(() => {
    // setIndex(Number(localStorage.getItem("responses")));
    // const uid = localStorage.getItem("uid")!;
    const responses = Number(localStorage.getItem("responses"));
    // getResultsData(uid, surveyId, setResults);

    if (responses > 0 && index == 0) {
      if (questions && questions?.length > 0) {
        setCurrentQuestion(questions[responses]);
        const percentage = (responses / questions?.length) * 100;
        setProgress(percentage);
      }
    } else {
      if (questions && questions?.length > 0) {
        setCurrentQuestion(questions[index]);
        const percentage = (index / questions?.length) * 100;
        setProgress(percentage);
      }
    }
  }, [questions, index, surveyId]);

  // eslint-disable-next-line
  const handleNext = (e: any) => {
    e.preventDefault();
    if (!answer) {
      return toast.error("Select any option");
    } else {
      setColor("n");
      setAnswer("");
      addResponse(
        localStorage.getItem("uid")!,
        currentQuestion!.sectionId!,
        currentQuestion.subsectionId,
        currentQuestion!.id!,
        surveyId,
        answer,
        option
      );
      if (questions && index + 1 < questions.length) {
        setIndex(index + 1);
      } else {
        setIsOpen(true);
        setProgress(100);
      }
    }
  };

  return (
    <div className="px-7">
      <div className="h-2 w-[255px] bg-gray-200 rounded-full mb-14 mt-12">
        <div
          className={`h-2 bg-primary rounded-full`}
          style={{ width: progress == 100 ? 99.99 + "%" : progress + "%" }}
        ></div>
      </div>
      {currentQuestion?.text ? (
        <h2 className="text-3xl font-medium pe-10 text-primary">
          {currentQuestion?.text}
        </h2>
      ) : (
        <div className="bg-gray-200 max-w-[50vw] h-10 rounded animate-pulse"></div>
      )}
      <div>
        <form className="mt-12">
          <div className="my-2">
            <input
              className="hidden"
              id="radio1"
              onClick={() => {
                setAnswer(currentQuestion?.options?.option1);
                setOption("A");
              }}
              type="radio"
              name="radio"
              required
            />
            {currentQuestion?.options?.option1 ? (
              <label
                className={`flex flex-col p-3 max-w-[40vw] border-2 rounded-lg border-primary ${
                  color === "a" && "bg-[#f0801037]"
                } cursor-pointer`}
                htmlFor="radio1"
                onClick={() => setColor("a")}
              >
                <span className="text-primary text-md">
                  <span className="rounded-md bg-primary py-1 px-2  text-white ms-2 me-3">
                    A
                  </span>
                  {currentQuestion?.options?.option1}
                </span>
              </label>
            ) : (
              <div className="bg-gray-200 max-w-[40vw] h-14 rounded animate-pulse"></div>
            )}
          </div>
          <div className="my-2">
            <input
              className="hidden"
              id="radio2"
              onClick={() => {
                setAnswer(currentQuestion?.options?.option2);
                setOption("B");
              }}
              type="radio"
              name="radio"
              required
            />
            {currentQuestion?.options?.option2 ? (
              <label
                className={`flex flex-col p-3 max-w-[40vw] border-2 rounded-lg border-primary ${
                  color === "b" && "bg-[#f0801037]"
                } cursor-pointer`}
                htmlFor="radio2"
                onClick={() => setColor("b")}
              >
                <span className="text-primary text-md">
                  <span className="rounded-md bg-primary py-1 px-2 text-white ms-2 me-3">
                    B
                  </span>
                  {currentQuestion?.options?.option2}
                </span>
              </label>
            ) : (
              <div className="bg-gray-200 max-w-[40vw] h-14 rounded animate-pulse"></div>
            )}
          </div>
          <div className="my-2">
            <input
              className="hidden"
              id="radio3"
              onClick={() => {
                setAnswer(currentQuestion?.options?.option3);
                setOption("C");
              }}
              type="radio"
              name="radio"
              required
            />
            {currentQuestion?.options?.option3 ? (
              <label
                className={`flex flex-col p-3 max-w-[40vw] border-2 rounded-lg border-primary ${
                  color == "c" && "bg-[#f0801037]"
                } cursor-pointer`}
                htmlFor="radio3"
                onClick={() => setColor("c")}
              >
                <span className="text-primary text-md">
                  <span className="rounded-md bg-primary py-1 px-2 text-white ms-2 me-3">
                    C
                  </span>
                  {currentQuestion?.options?.option3}
                </span>
              </label>
            ) : (
              <div className="bg-gray-200 max-w-[40vw] h-14 rounded animate-pulse"></div>
            )}
          </div>
          <div className="my-2">
            <input
              className="hidden"
              id="radio4"
              onClick={() => {
                setAnswer(currentQuestion?.options?.option4);
                setOption("D");
              }}
              type="radio"
              name="radio"
              required
            />
            {currentQuestion?.options?.option4 ? (
              <label
                className={`flex flex-col p-3 max-w-[40vw] border-2 rounded-lg border-primary ${
                  color === "d" && "bg-[#f0801037]"
                } cursor-pointer`}
                htmlFor="radio4"
                onClick={() => setColor("d")}
              >
                <span className="text-primary text-md">
                  <span className="rounded-md bg-primary py-1 px-2 text-white ms-2 me-3">
                    D
                  </span>
                  {currentQuestion?.options?.option4}
                </span>
              </label>
            ) : (
              <div className="bg-gray-200 max-w-[40vw] h-14 rounded animate-pulse"></div>
            )}
          </div>
          <div>
            <Button
              className="bg-[#3C3C3C] text-lg text-white my-20 w-[182px] h-[49px]"
              onClick={handleNext}
              type="submit"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
      <Modal
        isOpen={isOpen}
        title="Survey Completed"
        onChange={() => setIsOpen(false)}
      >
        <div className="text-center">
          <div className="flex justify-center mt-8">
            <IoMdCheckmarkCircleOutline size={70} color="#25b622" />
          </div>
          <h1 className="text-lg font-medium mt-5 mb-5">
            Congratulations! You have completed your survey.
          </h1>
          <Button
            className="bg-primary text-md text-white mb-5 w-[182px] h-[40px]"
            type="submit"
            onClick={() => navigate(`/dashboard/result/${surveyId}`)}
          >
            Show Result
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default QuestionForm;
