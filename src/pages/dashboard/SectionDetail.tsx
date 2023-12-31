import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Question, Section } from "../../Types";
import Header from "../../components/header";
import {
  deleteQuestion,
  getQuestionsBySubsectionId,
} from "../../helpers/questions";
import { getSubsectionById } from "../../helpers/sections";
import Button from "../../components/ui/Button";
import { MdDelete, MdEdit } from "react-icons/md";
import Modal from "../../components/ui/Modal";
import DeleteModal from "../../components/ui/Modals/DeleteModal";
import CreateQuestion from "../../components/ui/Modals/Questions/CreateQuestion";
import EditQuestion from "../../components/ui/Modals/Questions/EditQuestion";

const SectionDetail = () => {
  const [questions, setQuestions] = useState<Array<Question>>();
  const [questionId, setQuestionId] = useState<string>();
  const [section, setSection] = useState<Section>();
  const [question, setQuestion] = useState<Question>();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [render, setRender] = useState<boolean>(false);

  const pathname = window.location.pathname;
  const surveyId = pathname.split("/")[3];
  const sectionId = pathname.split("/")[4];
  const subsectionId = pathname.split("/")[5];
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      await getSubsectionById(surveyId, sectionId, subsectionId, setSection);
      getQuestionsBySubsectionId(
        surveyId,
        sectionId,
        subsectionId,
        setQuestions,
        setIsLoading
      );
      setRender(false);
    };
    fetchData();
  }, [surveyId, sectionId, subsectionId, render]);

  const handelClick = () => {
    if (!sectionId) return;
    deleteQuestion(surveyId, sectionId, subsectionId, questionId!, setRender);
    setIsDeleteOpen(false);
    setQuestionId("");
  };

  return (
    <>
      {render ? (
        <div className="w-full min-h-[100vh] justify-center items-center flex">

        <ClipLoader
          color={"#3b82f6"}
          loading={render}
          // cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
          />
          </div>
      ) : (
        <div className="mb-20">
          <Header heading="Dashboard" />
          <div className="flex items-center justify-between me-10">
            <h2 className="text-2xl text-primary font-semibold my-4 capitalize">
              {section?.title}
            </h2>
            <Button
              className="bg-primary text-sm text-white w-[152px] h-8 md:px-3 px-3"
              onClick={() => setIsOpen(true)}
            >
              Create Question
            </Button>
          </div>
          {!isLoading &&
            questions?.map((val: any, index) => {
              return (
                <div key={index}>
                  <div className="flex justify-between py-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="font-bold text-lg w-12">
                          Q{index + 1}:{" "}
                        </h3>
                        <h3 className="text-md font-medium">{val?.title}</h3>
                      </div>
                      <ul className="list-disc ms-16">
                        <li>{val?.option1}</li>
                        <li>{val?.option2}</li>
                        <li>{val?.option3}</li>
                        <li>{val?.option4}</li>
                      </ul>
                    </div>
                    <div className="flex me-10">
                      <Button
                        className="bg-green-600 text-[16px] h-7 md:px-[6px] px-[6px]"
                        onClick={() => {
                          setIsEditOpen(true);
                          setQuestion(val);
                        }}
                      >
                        <MdEdit />
                      </Button>
                      <Button
                        className="bg-red-600 ms-3 text-[16px] h-7 md:px-[6px] px-[6px]"
                        onClick={() => {
                          setIsDeleteOpen(true);
                          setQuestionId(val.id);
                        }}
                      >
                        <MdDelete />
                      </Button>
                    </div>
                  </div>
                  <hr />
                </div>
              );
            })}
          <Modal
            isOpen={isOpen}
            title="Create Question"
            onChange={() => setIsOpen(false)}
          >
            <CreateQuestion
              surveyId={surveyId}
              sectionId={sectionId}
              subsectionId={subsectionId}
              setIsOpen={setIsOpen}
              setRender={setRender}
            />
          </Modal>
          <Modal
            isOpen={isEditOpen}
            title="Edit Question"
            onChange={() => setIsEditOpen(false)}
          >
            <EditQuestion
              surveyId={surveyId}
              sectionId={sectionId}
              subsectionId={subsectionId}
              setIsOpen={setIsEditOpen}
              question={question!}
              setRender={setRender}
            />
          </Modal>
          <Modal
            isOpen={isDeleteOpen}
            title="Delete Question"
            onChange={() => setIsDeleteOpen(false)}
          >
            <DeleteModal
              handelClick={handelClick}
              handleClose={() => {
                setIsDeleteOpen(false);
                setQuestionId("");
              }}
            />
          </Modal>
        </div>
      )}
    </>
  );
};

export default SectionDetail;
