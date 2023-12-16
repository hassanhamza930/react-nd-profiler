import Header from "../../components/header";
import Button from "../../components/ui/Button";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSurveyById } from "../../helpers/surveys";
import {
  deleteSection,
  deleteSubsection,
  getSections,
} from "../../helpers/sections";
import { getQuestionsById } from "../../helpers/questions";
import { Question, Recommendation, Section, Survey } from "../../Types";
import Modal from "../../components/ui/Modal";
import DeleteModal from "../../components/ui/Modals/DeleteModal";
import { MdDelete, MdEdit } from "react-icons/md";
import CreateSection from "../../components/ui/Modals/Sections/CreateSection";
import EditSection from "../../components/ui/Modals/Sections/EditSection";
import { getResultsData } from "../../helpers/result";
import { useNavigate } from "react-router-dom";
import Loading from "./loading";
import { collection, doc, getDocs, getFirestore } from "firebase/firestore";
import CreateRecommendation from "../../components/ui/Modals/Recommendations/CreateRecommendation";
import EditRecommendation from "../../components/ui/Modals/Recommendations/EditRecommendation";
import CreateSubSection from "../../components/ui/Modals/Sections copy/CreateSubSection";
import EditSubSection from "../../components/ui/Modals/Sections copy/EditSubSection";

const SurveyDetail = () => {
  const [questions, setQuestions] = useState<Array<Question>>();
  const [sections, setSections] = useState<Array<Section>>();
  const [survey, setSurvey] = useState<Survey>();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubSectionDeleteOpen, setIsSubSectionDeleteOpen] = useState(false);
  const [isSubSectionEditOpen, setIsSubSectionEditOpen] = useState(false);
  const [isSubSectionCreateOpen, setIsSubSectionCreateOpen] = useState(false);
  const [sectionId, setSectionId] = useState<string>();
  const [subSectionId, setSubSectionId] = useState<string>();
  const [section, setSection] = useState<Section>();
  const [subSection, setSubSection] = useState<Section>();
  const [role, setRole] = useState<string>();
  const [loading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>();
  const [isDropDownOpen, setIsDropDownOpen] = useState<string>();
  const [isCreateRecoOpen, setIsCreateRecoOpen] = useState(false);
  const [isEditRecoOpen, setIsEditRecoOpen] = useState(false);
  const [recommendations, setRecommendations] =
    useState<Recommendation | null>();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const surveyDocRef = doc(collection(db, "surveys"), survey?.id);
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
  }, [survey?.id, sectionId]);

  const handelClick = () => {
    if (!sectionId) return;
    deleteSection(survey!.id, sectionId!);
    setIsDeleteOpen(false);
    setSectionId("");
  };

  const handelSubSectionDelete = () => {
    if (!subSectionId) return;
    deleteSubsection(survey!.id, sectionId!, subSectionId);
    setIsSubSectionDeleteOpen(false);
    setSubSectionId("");
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
                      <div className="py-[2px]">
                        {role == "admin" ? (
                          <div>
                            <div className="flex justify-between items-center">
                              <p className="text-primary capitalize font-semibold my-4 -ms-4 text-lg ">
                                {val?.title}
                              </p>
                              <div className="relative inline-block">
                                <button
                                  onClick={() => {
                                    setIsDropDownOpen(val.id);
                                    setSectionId(val.id);
                                  }}
                                  className="relative z-10 block p-2 text-gray-700 bg-white border border-transparent rounded-md dark:text-white dark:bg-gray-800 focus:outline-none"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                  </svg>
                                </button>
                                {isDropDownOpen == val.id && (
                                  <div className="absolute left-0 z-20 w-48 py-2 pt-4 origin-top-left bg-white rounded-md shadow-xl dark:bg-gray-800">
                                    <p
                                      onClick={() => {
                                        setIsEditOpen(true);
                                        setSection(val);
                                      }}
                                      className="block cursor-pointer px-4 py-2 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                    >
                                      Edit Section
                                    </p>
                                    <p
                                      onClick={() => {
                                        setIsDeleteOpen(true);
                                        setSectionId(val.id);
                                      }}
                                      className="block cursor-pointer px-4 py-2 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                    >
                                      Delete Section
                                    </p>
                                    <p
                                      onClick={() => {
                                        setIsSubSectionCreateOpen(true);
                                      }}
                                      className="block cursor-pointer px-4 py-2 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                    >
                                      Create Sub Section
                                    </p>
                                    <p
                                      onClick={() => {
                                        if (recommendations) {
                                          setIsEditRecoOpen(true);
                                        } else {
                                          setIsCreateRecoOpen(true);
                                        }
                                      }}
                                      className="block cursor-pointer px-4 py-2 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                    >
                                      {recommendations
                                        ? "Edit Recommendation"
                                        : "Create Recommendation"}
                                    </p>
                                    <hr />
                                    <p
                                      onClick={() =>
                                        setIsDropDownOpen("nothing")
                                      }
                                      className="block cursor-pointer px-4 py-2 mt-1 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                    >
                                      Close
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                            {val?.subsections?.map((subsection) => {
                              return (
                                <div className="flex justify-between items-center">
                                  <Link
                                    to={`/dashboard/section/${survey?.id}/${val.id}/${subsection.id}`}
                                  >
                                    <li className="ms-7 list-item list-disc capitalize font-medium hover:text-slate-500">
                                      {subsection?.title}
                                    </li>
                                  </Link>
                                  <div className="relative inline-block">
                                    <button
                                      onClick={() => {
                                        setIsDropDownOpen(subsection.id);
                                        setSectionId(val.id);
                                        setSubSectionId(subSection.id);
                                      }}
                                      className="relative z-10 block p-2 text-gray-700 bg-white border border-transparent rounded-md dark:text-white dark:bg-gray-800 focus:outline-none"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                      </svg>
                                    </button>
                                    {isDropDownOpen == subsection.id && (
                                      <div className="absolute left-0 z-20 w-28 py-2 pt-4 origin-top-left bg-white rounded-md shadow-xl dark:bg-gray-800">
                                        <p
                                          onClick={() => {
                                            setIsSubSectionEditOpen(true);
                                            setSubSection(subsection);
                                          }}
                                          className="block cursor-pointer px-4 py-2 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                          Edit
                                        </p>
                                        <p
                                          onClick={() => {
                                            setIsSubSectionDeleteOpen(true);
                                            setSubSectionId(subsection.id);
                                          }}
                                          className="block cursor-pointer px-4 py-2 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                          Delete
                                        </p>

                                        <hr />
                                        <p
                                          onClick={() =>
                                            setIsDropDownOpen("nothing")
                                          }
                                          className="block cursor-pointer px-4 py-2 mt-1 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                          Close
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div>
                            <p className="text-primary my-4 -ms-4 text-lg capitalize font-semibold">
                              {val?.title}
                            </p>
                            {val?.subsections?.map((subsection) => {
                              return (
                                <li className="ms-7 list-item list-disc capitalize font-medium">
                                  {subsection?.title}
                                </li>
                              );
                            })}
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
            isOpen={isSubSectionCreateOpen}
            title="Create Sub Section"
            onChange={() => setIsSubSectionCreateOpen(false)}
          >
            <CreateSubSection
              surveyId={survey?.id || ""}
              sectionId={sectionId}
              setIsOpen={setIsSubSectionCreateOpen}
            />
          </Modal>
          <Modal
            isOpen={isSubSectionEditOpen}
            title="Edit Sub Section"
            onChange={() => setIsSubSectionEditOpen(false)}
          >
            <EditSubSection
              surveyId={survey?.id || ""}
              sectionId={sectionId}
              setIsOpen={setIsSubSectionEditOpen}
              subsection={subSection!}
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
          <Modal
            isOpen={isSubSectionDeleteOpen}
            title="Delete Sub Section"
            onChange={() => setIsSubSectionDeleteOpen(false)}
          >
            <DeleteModal
              handelClick={handelSubSectionDelete}
              handleClose={() => {
                setIsSubSectionDeleteOpen(false);
                setSubSectionId("");
              }}
            />
          </Modal>
          <Modal
            isOpen={isCreateRecoOpen}
            title="Create Recommendation"
            onChange={() => setIsCreateRecoOpen(false)}
          >
            <CreateRecommendation
              surveyId={survey?.id}
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
                surveyId={survey?.id}
                sectionId={sectionId}
                setIsOpen={setIsEditRecoOpen}
                recommendation={recommendations}
              />
            </Modal>
          )}
        </div>
      )}
    </>
  );
};

export default SurveyDetail;
