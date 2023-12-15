import { useEffect, useState } from "react";
import { Question, Recommendation, Section } from "../../Types";
import Header from "../../components/header";
import {
  deleteQuestion,
  getQuestionsBySectionId,
} from "../../helpers/questions";
import { getSectionById } from "../../helpers/sections";
import Button from "../../components/ui/Button";
import { MdDelete, MdEdit } from "react-icons/md";
import Modal from "../../components/ui/Modal";
import DeleteModal from "../../components/ui/Modals/DeleteModal";
import CreateQuestion from "../../components/ui/Modals/Questions/CreateQuestion";
import EditQuestion from "../../components/ui/Modals/Questions/EditQuestion";
import CreateRecommendation from "../../components/ui/Modals/Recommendations/CreateRecommendation";
import EditRecommendation from "../../components/ui/Modals/Recommendations/EditRecommendation";
import { collection, doc, getDocs, getFirestore } from "firebase/firestore";

const SectionDetail = () => {
  const [questions, setQuestions] = useState<Array<Question>>();
  const [questionId, setQuestionId] = useState<string>();
  const [section, setSection] = useState<Section>();
  const [question, setQuestion] = useState<Question>();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateRecoOpen, setIsCreateRecoOpen] = useState(false);
  const [isEditRecoOpen, setIsEditRecoOpen] = useState(false);
  const [recommendations, setRecommendations] =
    useState<Recommendation | null>();

  const pathname = window.location.pathname;
  const surveyId = pathname.split("/")[3];
  const sectionId = pathname.split("/")[4];

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      await getSectionById(surveyId, sectionId, setSection);
      getQuestionsBySectionId(surveyId, sectionId, setQuestions, setIsLoading);
    };
    fetchData();
  }, [surveyId, sectionId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const surveyDocRef = doc(collection(db, "surveys"), surveyId);
        const sectionDocRef = doc(surveyDocRef, "sections", sectionId);
        const recommendationsCollectionRef = collection(
          sectionDocRef,
          "recommendations"
        );

        const querySnapshot = await getDocs(recommendationsCollectionRef);

        const recommendationsData = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() } as Recommendation;
        });

        setRecommendations(recommendationsData[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setRecommendations(null);
      }
    };

    fetchData();
  }, [surveyId, sectionId]);

  const handelClick = () => {
    if (!sectionId) return;
    deleteQuestion(surveyId, sectionId, questionId!);
    setIsDeleteOpen(false);
    setQuestionId("");
  };

  return (
    <div className="mb-20">
      <Header heading="Dashboard" />
      <div className="flex items-center justify-between me-10">
        <h2 className="text-2xl text-primary font-semibold my-4 capitalize">
          {section?.title}
        </h2>
        <div className="flex justify-center items-center">
          <Button
            className="bg-primary text-sm text-white h-8 md:px-3 px-3 me-3"
            onClick={() => {
              if (recommendations) {
                setIsEditRecoOpen(true);
              } else {
                setIsCreateRecoOpen(true);
              }
            }}
          >
            {recommendations ? "Edit Recommendation" : "Create Recommendation"}
          </Button>
          <Button
            className="bg-primary text-sm text-white w-[152px] h-8 md:px-3 px-3"
            onClick={() => setIsOpen(true)}
          >
            Create Question
          </Button>
        </div>
      </div>
      {!isLoading &&
        questions?.map((val: Question, index) => {
          return (
            <div key={index}>
              <div className="flex justify-between py-4">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="font-bold text-lg w-12">Q{index + 1}: </h3>
                    <h3 className="text-md font-medium">{val?.text}</h3>
                  </div>
                  <ul className="list-disc ms-16">
                    <li>{val?.options?.option1}</li>
                    <li>{val?.options?.option2}</li>
                    <li>{val?.options?.option3}</li>
                    <li>{val?.options?.option4}</li>
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
          setIsOpen={setIsOpen}
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
          setIsOpen={setIsEditOpen}
          question={question!}
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
      <Modal
        isOpen={isCreateRecoOpen}
        title="Create Recommendation"
        onChange={() => setIsCreateRecoOpen(false)}
      >
        <CreateRecommendation
          surveyId={surveyId}
          sectionId={sectionId}
          setIsCreateOpen={setIsCreateRecoOpen}
        />
      </Modal>
      {recommendations && (
        <Modal
          isOpen={isEditRecoOpen}
          title="Edit Recommendation"
          onChange={() => setIsEditRecoOpen(false)}
        >
          <EditRecommendation
            surveyId={surveyId}
            sectionId={sectionId}
            setIsOpen={setIsEditRecoOpen}
            recommendation={recommendations}
          />
        </Modal>
      )}
    </div>
  );
};

export default SectionDetail;
