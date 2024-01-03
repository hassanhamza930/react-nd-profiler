import React, { useEffect, useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { addResponse } from "../../../helpers/result";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Database } from "../../../Types/supabase";
import { useRecoilState } from "recoil";
import { surveyState } from "../../../recoil/recoil";
import { resultState } from "../../../recoil/recoil";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  questions: Database["public"]["Tables"]["questions"]["Row"][] | undefined;
}

const QuestionForm: React.FC<Props> = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] =
    useState<Database["public"]["Tables"]["questions"]["Row"]>();
  const [answer, setAnswer] = useState<string>();
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState<string>("");
  const [color, setColor] = useState("");
  const [survey, setSurvey] = useRecoilState(surveyState);
  const [results, setResults] = useRecoilState(resultState);
  const [points, setPoints] = useState<number>(0);

  const pathname = window.location.pathname;
  const navigate = useNavigate();
  const surveyId = pathname.split("/")[3];

  useEffect(() => {
    if (questions) {
      setCurrentQuestion(questions[index]);
    }
  }, [questions, index, surveyId]);

  const findSectionId = (subsectionId: number | string): string | undefined => {
    // Loop through sections and find the section ID based on the subsection ID
    for (const section of survey.sections) {
      const foundSubsection = section.subsections.find(
        (sub) => sub.id === subsectionId
      );
      if (foundSubsection) {
        return section.id;
      }
    }
    return undefined;
  };
  const handleNext = (e: any) => {
    e.preventDefault();
    if (!answer) {
      return toast.error("Select any option");
    } else {
      setColor("n");
      setAnswer("");
      const subsectionId = currentQuestion?.subsectionid;
      const sectionId = findSectionId(subsectionId);

      if (!sectionId) {
        console.error("Section ID not found for the current question.");
        return;
      }

      // Check if the surveyId matches the one in the resultState
      if (surveyId !== results.surveyId) {
        // If not, create a new state structure
        setResults({
          surveyId: surveyId,
          results: [
            {
              sectionId: sectionId || "", // Set the appropriate default value
              subsections: [
                {
                  subsectionId: subsectionId || "", // Set the appropriate default value
                  responses: [
                    {
                      questionId: currentQuestion?.id,
                      points: points,
                    },
                  ],
                },
              ],
            },
          ],
        });
      } else {
        // If surveyId matches, update the existing state
        setResults((prevResults) => {
          const updatedResults = [...prevResults.results];

          // Check if the sectionId matches the current question's section
          const sectionId = findSectionId(subsectionId);
          const existingSection = updatedResults.find(
            (result) => result.sectionId === sectionId
          );

          if (!existingSection) {
            // If the section doesn't exist, create a new section
            updatedResults.push({
              sectionId: sectionId || "", // Set the appropriate default value
              subsections: [
                {
                  subsectionId: subsectionId || "", // Set the appropriate default value
                  responses: [
                    {
                      questionId: currentQuestion?.id,
                      points: points,
                    },
                  ],
                },
              ],
            });
          } else {
            // If the section exists, check if the subsectionId matches the current question's subsection
            const existingSubsection = existingSection.subsections.find(
              (sub) => sub.subsectionId === subsectionId
            );

            if (!existingSubsection) {
              // If the subsection doesn't exist, create a new subsection
              existingSection.subsections.push({
                subsectionId: subsectionId || "", // Set the appropriate default value
                responses: [
                  {
                    questionId: currentQuestion?.id,
                    points: points,
                  },
                ],
              });
            } else {
              // If the subsection exists, push the response
              existingSubsection.responses.push({
                questionId: currentQuestion?.id,
                points: points,
              });
            }
          }

          return { ...updatedResults }; // Make sure to return a new object to maintain immutability
        });
      }
      console.log("option", points);
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
      {/* <div className="h-2 w-[255px] bg-gray-200 rounded-full mb-14 mt-12">
        <div
          className={`h-2 bg-primary rounded-full`}
          style={{ width: progress == 100 ? 99.99 + "%" : progress + "%" }}
        ></div>
      </div> */}
      {currentQuestion?.title ? (
        <h2 className="mt-14 text-3xl font-medium pe-10 text-primary">
          {currentQuestion?.title}
        </h2>
      ) : (
        <div className="bg-gray-200 max-w-[50vw] h-10 rounded animate-pulse mt-14"></div>
      )}
      <div>
        <form className="mt-12">
          <div className="my-2">
            <input
              className="hidden"
              id="radio1"
              onClick={() => {
                setAnswer(currentQuestion?.option1);
                setOption("A");
                setPoints(1);
              }}
              type="radio"
              name="radio"
              required
            />
            {currentQuestion?.option1 ? (
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
                  {currentQuestion?.option1}
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
                setAnswer(currentQuestion?.option2);
                setOption("B");
                setPoints(0.75);
              }}
              type="radio"
              name="radio"
              required
            />
            {currentQuestion?.option2 ? (
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
                  {currentQuestion?.option2}
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
                setAnswer(currentQuestion?.option3);
                setOption("C");
                setPoints(0.5);
              }}
              type="radio"
              name="radio"
              required
            />
            {currentQuestion?.option3 ? (
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
                  {currentQuestion?.option3}
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
                setAnswer(currentQuestion?.option4);
                setOption("D");
                setPoints(0.25);
              }}
              type="radio"
              name="radio"
              required
            />
            {currentQuestion?.option4 ? (
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
                  {currentQuestion?.option4}
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
