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
    <div className="bg-gray-300 text-white rounded-2xl w-[300px] h-[235px] p-5 mt-5 flex flex-col justify-between animate-pulse"></div>
  ) : (
    <>
      {role !== "admin" ? (
        questions &&
        questions?.length > 0 && (
          <div
            className={`${
              results?.length == questions?.length
                ? "bg-[#EE2F7BCC]"
                : "bg-primary"
            } text-white rounded-2xl w-[300px] h-[235px] p-5 mt-5 flex flex-col justify-between`}
          >
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
                className="text-3xl font-bold cursor-pointer"
              >
                {survey?.title}
              </Link>
              <p className="text-[10px] my-3">{survey?.tagline}</p>
              {role == "admin" ? (
                <p className="text-[12px]">
                  {questions && questions?.length} questions
                </p>
              ) : (
                <p className="text-[12px]">
                  Completed {results && results?.length} questions
                </p>
              )}
            </div>
            <div className="flex justify-end mb-3">
              {results && results?.length == questions?.length ? (
                <Button
                  className={`bg-white text-[10px] ${
                    results?.length == questions?.length
                      ? "text-[#EE2F7BCC]"
                      : "text-primary"
                  } w-[104px] h-[24px]`}
                  onClick={() => navigate(`/dashboard/result/${survey.id}`)}
                >
                  Results
                </Button>
              ) : results &&
                results?.length !== 0 &&
                results?.length < questions?.length ? (
                <Button
                  className={`bg-white text-[10px] ${
                    results?.length == questions?.length
                      ? "text-[#EE2F7BCC]"
                      : "text-primary"
                  } w-[104px] h-[24px]`}
                  onClick={() => navigate(`/dashboard/question/${survey.id}`)}
                >
                  Resume
                </Button>
              ) : (
                <Button
                  className={`bg-white text-[10px] ${
                    results?.length == questions?.length
                      ? "text-[#EE2F7BCC]"
                      : "text-primary"
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
        )
      ) : (
        <div
          className={`bg-primary text-white rounded-2xl w-[300px] h-[235px] p-5 mt-5 flex flex-col justify-between`}
        >
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
              className="text-3xl font-bold cursor-pointer"
            >
              {survey?.title}
            </Link>
            <p className="text-[10px] my-3">{survey?.tagline}</p>
            {role == "admin" ? (
              <p className="text-[12px]">
                {questions && questions?.length} questions
              </p>
            ) : (
              <p className="text-[12px]">
                Completed {results && results?.length}/
                {questions && questions?.length} questions
              </p>
            )}
          </div>
          <div className="flex justify-end mb-3">
            <div className="flex">
              <Button
                className={`bg-white px-4 md:px-3 text-[10px] text-primary w-[60px] h-[24px]`}
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                className={`bg-white px-4 md:px-3 ms-3 text-[10px] text-primary w-[60px] h-[24px]`}
                onClick={() => {
                  setIsDeleteOpen(true);
                }}
              >
                Delete
              </Button>
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
