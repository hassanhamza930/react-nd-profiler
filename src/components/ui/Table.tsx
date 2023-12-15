
import { Recommendation, RecommendationData } from "../..//Types";
import React, { useState, useEffect } from "react";
import Button from "./Button";
import { IoMdEye } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import Modal from "./Modal";
import ViewRecommendation from "./Modals/Recommendations/ViewRecommendation";
import EditRecommendation from "./Modals/Recommendations/EditRecommendation";
import { getAllRecommendationsData } from "../../helpers/recommendations";
import CreateRecommendation from "./Modals/Recommendations/CreateRecommendation";

const Table = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [surveyId, setSurveyId] = useState<string>("");
  const [sectionId, setSectionId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [recommendations, setRecommendations] =
    useState<RecommendationData[]>();
  const [filterRecommendations, setFilterRecommendations] = useState<string>();
  const [recommendationData, setRecommendationData] =
    useState<Recommendation>();

  useEffect(() => {
    const fetchData = async () => {
      await getAllRecommendationsData(setRecommendations);
    };
    fetchData();
  }, [filterRecommendations]);

  const handleSearch = () => {
    if (searchTerm == "") {
      setFilterRecommendations("filter");
      return;
    }
    const filteredResults = recommendations?.filter((item) =>
      item.sectionTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setRecommendations(filteredResults);
  };

  return (
    <div>
      <header className="px-5 py-4 border-b border-gray-100 flex justify-end">
        <div className="relative w-full">
          <input
            type="text"
            className="w-full backdrop-blur-sm bg-white/20 py-2 pl-10 pr-4 rounded-lg focus:outline-none border-2 border-gray-100 focus:border-primary transition-colors duration-300"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-700 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
        </div>
        <Button
          className="rounded-lg h-[43px] ms-4 md:px-4 px-4"
          onClick={handleSearch}
        >
          <svg
            className="w-5 h-5 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 22 22"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </Button>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-sm font-bold uppercase text-black bg-gray-50">
              <th className="p-3 whitespace-nowrap">
                <div className="font-bold text-left">Section Name</div>
              </th>
              <th className="p-3 whitespace-nowrap">
                <div className="font-bold text-left">0% to 25%</div>
              </th>
              <th className="p-3 whitespace-nowrap">
                <div className="font-bold text-left">25% to 50%</div>
              </th>
              <th className="p-3 whitespace-nowrap">
                <div className="font-bold text-left">50% to 75%</div>
              </th>
              <th className="p-3 whitespace-nowrap">
                <div className="font-bold text-left">75% to 100%</div>
              </th>
              <th className="p-3 whitespace-nowrap">
                <div className="font-bold text-left">Action</div>
              </th>
            </thead>
            {recommendations?.map((val, index) => {
              return (
                <tbody className="text-sm divide-y divide-gray-100" key={index}>
                  <tr>
                    <td className="p-3">
                      <div className="flex items-center">
                        <div
                          className="font-medium text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html: val?.sectionTitle,
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <div
                        className="text-left font-medium text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: val?.recommendation?.from0to25!,
                        }}
                      />
                    </td>
                    <td className="p-3">
                      <div
                        className="text-left font-medium text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: val?.recommendation?.from25to50!,
                        }}
                      />
                    </td>
                    <td className="p-3">
                      <div
                        className="text-left font-medium text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: val?.recommendation?.from50to75!,
                        }}
                      />
                    </td>
                    <td className="p-3">
                      <div
                        className="text-left font-medium text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: val?.recommendation?.from75to100!,
                        }}
                      />
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="text-lg text-left">
                        {val?.recommendation == null ? (
                          <Button
                            className="bg-primary border-2 text-sm h-[36px]"
                            onClick={() => {
                              setIsCreateOpen(true);
                              setSurveyId(val?.surveyId!);
                              setSectionId(val?.sectionId);
                            }}
                          >
                            Create
                          </Button>
                        ) : (
                          <div>
                            <Button
                              className="bg-blue-600 text-[16px] h-7 md:px-[6px] px-[6px]"
                              onClick={() => {
                                setIsOpen(true);
                                setRecommendationData(val?.recommendation!);
                              }}
                            >
                              <IoMdEye />
                            </Button>
                            <Button
                              className="bg-green-600 ms-3 text-[16px] h-7 md:px-[6px] px-[6px]"
                              onClick={() => {
                                setIsEditOpen(true);
                                setSectionId(val?.sectionId);
                                setSurveyId(val?.surveyId!);
                                setRecommendationData(val?.recommendation!);
                              }}
                            >
                              <MdEdit />
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
          <Modal
            isOpen={isCreateOpen}
            title="Create Recommendation"
            onChange={() => setIsCreateOpen(false)}
          >
            <CreateRecommendation
              surveyId={surveyId}
              sectionId={sectionId}
              setIsCreateOpen={setIsCreateOpen}
            />
          </Modal>
          <Modal
            isOpen={isEditOpen}
            title="Edit Recommendation"
            onChange={() => setIsEditOpen(false)}
          >
            <EditRecommendation
              surveyId={surveyId}
              sectionId={sectionId}
              setIsOpen={setIsEditOpen}
              recommendation={recommendationData!}
            />
          </Modal>
          <Modal
            isOpen={isOpen}
            title="Recommendation Detail"
            onChange={() => setIsOpen(false)}
          >
            <ViewRecommendation recommendation={recommendationData!} />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Table;
