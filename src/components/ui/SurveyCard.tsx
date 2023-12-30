import { useEffect, useState } from "react";
import Button from "./Button";
import { Question, Survey } from "../../Types/index";
import { getQuestionsById } from "../../helpers/questions";
import Modal from "./Modal";
import EditSurvey from "./Modals/Surveys/EditSurvey";
import { useNavigate } from "react-router-dom";
import DeleteSurvey from "./Modals/DeleteModal";
import { deleteSurvey } from "../../helpers/surveys";
import { Link } from "react-router-dom";
import { getResultsData } from "../../helpers/result";

const SurveyCard = ({ survey }: { survey: Survey }) => {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState<Array<Question>>();
  const [results, setResults] = useState<any>(); // eslint-disable-line
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [loading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setRole(localStorage.getItem("role")!);
    const uid = localStorage.getItem("uid")!;
    const fetchData = async () => {
      setQuestions(await getQuestionsById(survey?.id));
      getResultsData(uid, survey?.id, setResults);
    };
    fetchData().finally(() => {
      setIsLoading(false);
    });
  }, [survey?.id]);

  useEffect(() => {
    const percentage =
      (results?.length / (questions?.length ? questions?.length : 1)) * 100;
    setProgress(percentage ? percentage : 0);
  }, [results, questions]);

  const handelClick = () => {
    deleteSurvey(survey?.id);
    setIsDeleteOpen(false);
  };

  return loading ? (
    <div className="relative bg-gray-300 text-white rounded-2xl w-[300px] h-[235px] p-5 mt-5 flex flex-col justify-between animate-pulse"></div>
  ) : (
    <>
      {role !== "admin" ? (
        questions &&
        questions?.length > 0 && (
          <div className="relative z-0 bg-[url('https://img.freepik.com/free-vector/dynamic-gradient-grainy-background_23-2148963687.jpg')] bg-cover bg-end mt-5 rounded-xl w-[300px] h-[235px] text-white font-medium flex flex-col justify-between items-start overflow-hidden">
            <div className="absolute z-10 bg-blue-600/50 backdrop-blur-lg h-full w-full"></div>
            <div className="relative h-full w-full z-20 flex-col flex justify-between items-start p-5 ">
              <div>
                {/* {role !== "admin" && (
                <div className="h-1 w-full bg-black rounded-full mb-3">
                  <div
                    className="h-1 bg-white rounded-full"
                    style={{ width: progress + "%" }}
                  ></div>
                </div>
              )} */}
                <Link
                  to={`/dashboard/survey/${survey.id}`}
                  className="text-2xl font-normal cursor-pointer uppercase"
                >
                  {survey?.title}
                </Link>
                <p className="text-sm my-3 normal-case font-normal">
                  {survey?.description}
                </p>
                {role == "admin" ? (
                  <p className="text-sm font-normal">
                    {questions && questions?.length} questions
                  </p>
                ) : (
                  <p className="text-sm font-normal">
                    Completed {results && results?.length} questions
                  </p>
                )}
              </div>
              <div className="flex justify-end mb-3">
                {results && results?.length == questions?.length ? (
                  <Button
                    className={`bg-white text-sm font-normal  p-4 whitespace-nowrap ${
                      results?.length == questions?.length
                        ? "text-blue-600"
                        : "text-blue-600"
                    } w-[104px] h-[24px]`}
                    onClick={() => navigate(`/dashboard/result/${survey.id}`)}
                  >
                    Results
                  </Button>
                ) : results &&
                  results?.length !== 0 &&
                  results?.length < questions?.length ? (
                  <Button
                    className={`bg-white text-sm p-4 whitespace-nowrap ${
                      results?.length == questions?.length
                        ? "text-blue-600"
                        : "text-blue-600"
                    } w-[104px] h-[24px]`}
                    onClick={() => navigate(`/dashboard/question/${survey.id}`)}
                  >
                    Resume
                  </Button>
                ) : (
                  <Button
                    className={`bg-white text-sm p-4 whitespace-nowrap font-regular ${
                      results?.length == questions?.length
                        ? "text-blue-600"
                        : "text-blue-600"
                    } w-[104px] h-[24px]`}
                    onClick={() => navigate(`/dashboard/question/${survey.id}`)}
                  >
                    Start
                  </Button>
                )}
              </div>
              <Modal
                isOpen={isOpen}
                title="Edit Survey"
                onChange={() => setIsOpen(false)}
              >
                <EditSurvey
                  survey={survey}
                  handleClose={() => setIsOpen(false)}
                />
              </Modal>
              <Modal
                isOpen={isDeleteOpen}
                title="Delete Survey"
                onChange={() => setIsDeleteOpen(false)}
              >
                <DeleteSurvey
                  handelClick={handelClick}
                  handleClose={() => setIsDeleteOpen(false)}
                />
              </Modal>
            </div>
          </div>
        )
      ) : (
        <div
          className={`relative z-0 bg-[url('https://img.freepik.com/free-vector/dynamic-gradient-grainy-background_23-2148963687.jpg')] bg-cover bg-end mt-5 rounded-xl w-[300px] h-[235px] text-white font-medium flex flex-col justify-between items-start overflow-hidden`}
        >
          <div className="absolute z-10 bg-blue-600/50 backdrop-blur-lg h-full w-full"></div>
          <div className="relative h-full w-full z-20 flex-col flex justify-between items-start p-5 ">
            <div>
              {role !== "admin" && (
                <div className="h-1 w-full bg-black rounded-full mb-3">
                  <div
                    className="h-1 bg-white rounded-full"
                    style={{ width: progress + "%" }}
                  ></div>
                </div>
              )}
              <Link
                to={`/dashboard/survey/${survey.id}`}
                className="text-2xl font-normal cursor-pointer uppercase"
              >
                {survey?.title}
              </Link>
              <p className="text-sm my-3 font-normal">{survey?.description}</p>
              {role == "admin" ? (
                <p className="text-sm font-normal">
                  {questions && questions?.length} questions
                </p>
              ) : (
                <p className="text-sm font-normal">
                  Completed {results && results?.length}/
                  {questions && questions?.length} questions
                </p>
              )}
            </div>
            <div className="flex justify-end mb-3">
              <div className="flex">
                <Button
                  className={`bg-white p-4 md:p-4 text-sm font-normal text-blue-600 w-[60px] h-[24px] whitespace-nowrap`}
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  className={`bg-white p-4 md:p-4 ms-3 text-sm text-blue-600 font-normal w-[60px] h-[24px] whitespace-nowrap`}
                  onClick={() => {
                    setIsDeleteOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
          <Modal
            isOpen={isOpen}
            title="Edit Survey"
            onChange={() => setIsOpen(false)}
          >
            <EditSurvey survey={survey} handleClose={() => setIsOpen(false)} />
          </Modal>
          <Modal
            isOpen={isDeleteOpen}
            title="Delete Survey"
            onChange={() => setIsDeleteOpen(false)}
          >
            <DeleteSurvey
              handelClick={handelClick}
              handleClose={() => setIsDeleteOpen(false)}
            />
          </Modal>
        </div>
      )}
    </>
  );
};

export default SurveyCard;
