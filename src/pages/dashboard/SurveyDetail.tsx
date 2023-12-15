import Header from "../../components/header";
import Button from "../../components/ui/Button";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSurveyById } from "../../helpers/surveys";
import { deleteSection, getSections } from "../../helpers/sections";
import { getQuestionsById } from "../../helpers/questions";
import { Question, Section, Survey } from "../../Types";
import Modal from "../../components/ui/Modal";
import DeleteModal from "../../components/ui/Modals/DeleteModal";
import { MdDelete, MdEdit } from "react-icons/md";
import CreateSection from "../../components/ui/Modals/Sections/CreateSection";
import EditSection from "../../components/ui/Modals/Sections/EditSection";
import { getResultsData } from "../../helpers/result";
import { useNavigate } from "react-router-dom";
import Loading from "./loading";

const SurveyDetail = () => {
  const [questions, setQuestions] = useState<Array<Question>>();
  const [sections, setSections] = useState<Array<Section>>();
  const [survey, setSurvey] = useState<Survey>();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [sectionId, setSectionId] = useState<string>();
  const [section, setSection] = useState<Section>();
  const [role, setRole] = useState<string>();
  const [loading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>();

  const navigate = useNavigate();
  const location = useLocation();
  const currentUrl = location.pathname.split("/")[3];

  useEffect(() => {
    setRole(localStorage.getItem("role")!);

    setIsLoading(true);
    getSurveyById(currentUrl, setSurvey);
    const uid = localStorage.getItem("uid")!;
    const fetchData = async () => {
      getResultsData(uid, survey!.id, setResults);
      getSections(currentUrl, setSections);
      setQuestions(await getQuestionsById(currentUrl));
      setIsLoading(false);
    };
    fetchData()
      .then(() => console.log("done"))
      .catch((err) => console.log("err", err));
  }, [currentUrl, survey?.id]);

  const handelClick = () => {
    if (!sectionId) return;
    deleteSection(survey!.id, sectionId!);
    setIsDeleteOpen(false);
    setSectionId("");
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <Header heading="Dashboard" />
          <p className="mt-4">Welcome {role === "admin" ? "Admin" : "User"}!</p>
          <div className="w-7/12">
            <div className="bg-[#EE2F7BCC] text-white rounded-2xl w-full px-7 py-5 mt-5">
              <h2 className="text-[48px] font-bold">{survey?.title}</h2>
              <p className="text-[16px] my-3 mb-8">{survey?.description}</p>
            </div>
            <div className="flex justify-between items-center mt-10">
              <h2 className="text-3xl text-primary font-bold">
                {role == "admin"
                  ? "All Sections"
                  : `${questions && questions?.length} Questions`}
              </h2>
              {role !== "admin" ? (
                results && results?.length == questions?.length ? (
                  <Button
                    className="bg-[#3C3C3C] text-lg text-white w-[182px] h-[49px]"
                    onClick={() => navigate(`/dashboard/result/${currentUrl}`)}
                  >
                    Results
                  </Button>
                ) : results &&
                  results?.length !== 0 &&
                  results?.length < (questions?.length || 0) ? (
                  <Button
                    className="bg-[#3C3C3C] text-lg text-white w-[182px] h-[49px]"
                    onClick={() =>
                      navigate(`/dashboard/question/${currentUrl}`)
                    }
                  >
                    Resume
                  </Button>
                ) : (
                  <Button
                    className="bg-[#3C3C3C] text-lg text-white w-[182px] h-[49px]"
                    onClick={() =>
                      navigate(`/dashboard/question/${currentUrl}`)
                    }
                  >
                    Start
                  </Button>
                )
              ) : (
                <div>
                  <Button
                    className="bg-primary text-sm text-white w-[152px] h-8 md:px-3 px-3"
                    onClick={() => setIsOpen(true)}
                  >
                    Create Section
                  </Button>
                </div>
              )}
            </div>
            <div className="mt-5 ms-5 mb-10">
              <ul>
                {sections?.map((val, index) => {
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center py-[2px]">
                        {role == "admin" ? (
                          <Link
                            to={`/dashboard/section/${survey?.id}/${val.id}`}
                          >
                            <li className="list-item list-disc capitalize font-medium my-1 hover:text-slate-500">
                              {val?.title}
                            </li>
                          </Link>
                        ) : (
                          <li className="list-item list-disc capitalize font-medium">
                            {val?.title}
                          </li>
                        )}

                        {role === "admin" && (
                          <div className="flex justify-between items-center gap-x-3">
                            <Button
                              className="bg-green-600 text-[16px] h-7 md:px-[6px] px-[6px]"
                              onClick={() => {
                                setIsEditOpen(true);
                                setSection(val);
                              }}
                            >
                              <MdEdit />
                            </Button>
                            <Button
                              className="bg-red-600  text-[16px] h-7 md:px-[6px] px-[6px]"
                              onClick={() => {
                                setIsDeleteOpen(true);
                                setSectionId(val.id);
                              }}
                            >
                              <MdDelete />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </ul>
            </div>
          </div>
          <Modal
            isOpen={isOpen}
            title="Create Section"
            onChange={() => setIsOpen(false)}
          >
            <CreateSection surveyId={survey?.id || ""} setIsOpen={setIsOpen} />
          </Modal>
          <Modal
            isOpen={isEditOpen}
            title="Edit Section"
            onChange={() => setIsEditOpen(false)}
          >
            <EditSection
              surveyId={survey?.id || ""}
              setIsOpen={setIsEditOpen}
              section={section!}
            />
          </Modal>
          <Modal
            isOpen={isDeleteOpen}
            title="Delete Section"
            onChange={() => setIsDeleteOpen(false)}
          >
            <DeleteModal
              handelClick={handelClick}
              handleClose={() => {
                setIsDeleteOpen(false);
                setSectionId("");
              }}
            />
          </Modal>
        </div>
      )}
    </>
  );
};

export default SurveyDetail;
