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
import { BiDotsVertical } from "react-icons/bi";
import { Database } from "../../Types/supabase";
import ClipLoader from "react-spinners/ClipLoader";

const SurveyDetail = () => {
  const [questions, setQuestions] = useState<Array<Question>>();
  const [sections, setSections] =
    useState<Database["public"]["Tables"]["sections"]["Row"]>();
  const [render, setRender] = useState<boolean>(false);
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
  const [subSection, setSubSection] = useState<any>(); // eslint-disable-line
  const [role, setRole] = useState<string>();
  const [loading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(); // eslint-disable-line
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
    setRender(false);
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
  }, [currentUrl, survey?.id, render]);

  useEffect(() => {
    const fetchData = async () => {
      //   try {
      //     const db = getFirestore();
      //     const surveyDocRef = doc(collection(db, "surveys"), survey?.id);
      //     const sectionDocRef = doc(surveyDocRef, "sections", sectionId);
      //     const recommendationsCollectionRef = collection(
      //       sectionDocRef,
      //       "recommendations"
      //     );
      //     const querySnapshot = await getDocs(recommendationsCollectionRef);
      //     const recommendationsData = querySnapshot.docs.map((doc) => {
      //       return { id: doc.id, ...doc.data() } as Recommendation;
      //     });
      //     setRecommendations(recommendationsData[0]);
      //   } catch (error) {
      //     console.error("Error fetching data:", error);
      //     setRecommendations(null);
      //   }
    };

    fetchData();
  }, [survey?.id, sectionId, section]);

  // console.log("sections", sections);

  const handelClick = () => {
    if (!sectionId) return;
    deleteSection(survey!.id, sectionId!);
    setIsDeleteOpen(false);
    setSectionId("");
    setRender(true);
  };

  const handelSubSectionDelete = () => {
    if (!subSectionId) return;
    deleteSubsection(survey!.id, sectionId!, subSectionId);
    setIsSubSectionDeleteOpen(false);
    setSubSectionId("");
    setRender(true);
  };
  // console.log("survey",survey)
  return (
    <>
      {render || loading ? (
        <div className="w-full min-h-[100vh] justify-center items-center flex">
          <ClipLoader
            color={"#3b82f6"}
            loading={render || loading}
            // cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div>
          <Header heading="Dashboard" />
          <p className="mt-4">Welcome {role === "admin" ? "Admin" : "User"}!</p>
          <div className="w-7/12">
            <div className="relative z-0 bg-[url('https://img.freepik.com/free-vector/dynamic-gradient-grainy-background_23-2148963687.jpg')] bg-cover bg-end mt-5 rounded-xl text-white font-medium flex flex-col justify-between items-start overflow-hidden">
              <div className="absolute z-10 bg-blue-600/50 backdrop-blur-lg h-full w-full"></div>
              <div className="relative h-full w-full z-20 flex-col flex justify-between items-start p-5 ">
                <h2 className="text-4xl font-normal capitalize">
                  {survey?.title}
                </h2>
                <p className="text-lg font-normal my-3 mb-8">
                  {survey?.description}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-10">
              <h2 className="text-2xl text-primary font-normal">
                {role == "admin"
                  ? "All Sections"
                  : `${questions && questions?.length} Questions`}
              </h2>
              {role !== "admin" ? (
                <Button
                  className="bg-[#3C3C3C] text-lg text-white w-[182px] h-[49px]"
                  onClick={() => navigate(`/dashboard/question/${currentUrl}`)}
                >
                  Start
                </Button>
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
                              <p className="text-primary capitalize font-normal my-4 -ms-4 text-lg ">
                                {val?.title}
                              </p>
                              <div className="relative inline-block">
                                <button
                                  onClick={() => {
                                    setIsDropDownOpen(
                                      isDropDownOpen == val.id
                                        ? "nothing"
                                        : val.id
                                    );
                                    setSectionId(
                                      sectionId == val.id ? "" : val.id
                                    );
                                  }}
                                  className="relative z-10 block p-2 text-gray-700 bg-white border border-transparent rounded-md focus:outline-none hover:bg-slate-100"
                                >
                                  <BiDotsVertical />
                                </button>
                                {isDropDownOpen == val.id && (
                                  <div className="absolute left-0 z-20 w-48 py-2 pt-4 origin-top-left bg-white rounded-md shadow-xl ">
                                    <p
                                      onClick={() => {
                                        setIsDropDownOpen("");
                                        setIsSubSectionCreateOpen(true);
                                      }}
                                      className="block cursor-pointer px-4 py-2 text-sm text-gray-600 capitalize transition-colors duration-300 transform  hover:bg-gray-100 "
                                    >
                                      Create Sub Section
                                    </p>
                                    <p
                                      onClick={() => {
                                        setIsCreateRecoOpen(true);
                                        setSection(val);
                                        setIsDropDownOpen("");
                                      }}
                                      className="block cursor-pointer px-4 py-2 text-sm text-gray-600 capitalize transition-colors duration-300 transform  hover:bg-gray-100 "
                                    >
                                      Add Recommendations
                                    </p>{" "}
                                    <p
                                      onClick={() => {
                                        setIsEditOpen(true);
                                        setIsDropDownOpen("");
                                        setSection(val);
                                      }}
                                      className="block cursor-pointer px-4 py-2 text-sm text-gray-600 capitalize transition-colors duration-300 transform  hover:bg-gray-100 "
                                    >
                                      Edit Section
                                    </p>
                                    <p
                                      onClick={() => {
                                        setIsDeleteOpen(true);
                                        setIsDropDownOpen("");
                                        setSectionId(val.id);
                                      }}
                                      className="block cursor-pointer px-4 py-2 text-sm text-gray-600 capitalize transition-colors duration-300 transform  hover:bg-gray-100 "
                                    >
                                      Delete Section
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
                                    <li className="ms-7 list-item list-disc capitalize font-normal hover:text-slate-500">
                                      {subsection?.title}
                                    </li>
                                  </Link>
                                  <div className="relative inline-block">
                                    <button
                                      onClick={() => {
                                        setIsDropDownOpen(
                                          isDropDownOpen == subsection.id
                                            ? "nothing"
                                            : subsection.id
                                        );
                                        setSectionId(
                                          sectionId == val.id ? "" : val.id
                                        );
                                        setSubSectionId(
                                          subSectionId == subsection.id
                                            ? ""
                                            : subsection.id
                                        );
                                      }}
                                      className="relative z-10 block p-2 text-gray-700 bg-white border border-transparent rounded-md focus:outline-none hover:bg-slate-100"
                                    >
                                      <BiDotsVertical />
                                    </button>
                                    {isDropDownOpen == subsection.id && (
                                      <div className="absolute left-0 z-20 w-28 py-2 pt-4 origin-top-left bg-white rounded-md shadow-xl ">
                                        <p
                                          onClick={() => {
                                            setIsSubSectionEditOpen(true);
                                            setSubSection(subsection);
                                            setIsDropDownOpen("");
                                          }}
                                          className="block cursor-pointer px-4 py-2 text-sm text-gray-600 capitalize transition-colors duration-300 transform  hover:bg-gray-100 "
                                        >
                                          Edit
                                        </p>
                                        <p
                                          onClick={() => {
                                            setIsSubSectionDeleteOpen(true);
                                            setSubSectionId(subsection.id);
                                            setIsDropDownOpen("");
                                          }}
                                          className="block cursor-pointer px-4 py-2 text-sm text-gray-600 capitalize transition-colors duration-300 transform  hover:bg-gray-100 "
                                        >
                                          Delete
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
                            <p className="text-primary my-4 -ms-4 text-lg capitalize font-normal">
                              {val?.title}
                            </p>
                            {val?.subsections?.map((subsection) => {
                              return (
                                <li className="ms-7 list-item list-disc capitalize font-normal">
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
            <CreateSection
              surveyId={survey?.id || ""}
              setIsOpen={setIsOpen}
              setRender={setRender}
            />
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
              setRender={setRender}
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
              setRender={setRender}
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
              subsection={subSection}
              setRender={setRender}
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
              section={section!}
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
