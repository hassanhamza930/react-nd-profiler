import { useState, useEffect } from "react";
import Header from "../../components/header";
import DownloadPdf from "../../components/ui/Buttons/DownloadPdf";
import Chart from "../../components/ui/Chart";
import {
  getFilteredRecommendationsData,
  getResults,
} from "../../helpers/result";
import { RecommendationData, Survey, User } from "../../Types";
import { getSurveyById } from "../../helpers/surveys";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const Result = () => {
  const [results, setResults] = useState();
  const [survey, setSurvey] = useState<Survey>();
  const [sections, setSections] = useState<string[]>();
  const [data, setData] = useState<any>(); // eslint-disable-line
  const [user, setUser] = useState<User>();
  const [recommendations, setRecommendations] =
    useState<RecommendationData[]>();

  const pathname = window.location.pathname;
  const surveyId = pathname?.split("/")[3];

  useEffect(() => {
    const uid = localStorage.getItem("uid")!;
    const fetchData = async () => {
      getSurveyById(surveyId, setSurvey);
      getResults(uid, surveyId, setResults);
    };
    fetchData();
  }, [surveyId]);

  useEffect(() => {
    const uid = localStorage.getItem("uid")!;
    getDoc(doc(collection(db, "users"), uid)).then((doc) => {
      if (doc.exists()) {
        setUser({ ...(doc.data() as User) });
      }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      getFilteredRecommendationsData(results!, setRecommendations, surveyId);
    };
    fetchData();
  }, [results, surveyId]);

  useEffect(() => {
    setSections(
      recommendations?.map((val: RecommendationData) => val.sectionTitle)
    );
    setData(
      recommendations?.map((val: RecommendationData) =>
        val.percentage?.toFixed(0)
      )
    );
  }, [recommendations]);

  return (
    <div>
      <Header heading={`Workplace ${survey?.title}`} />
      <div
        className="flex justify-between text-[#3C3C3C] mt-16 mb-20"
        id="result"
      >
        <div className="w-7/12" id="graphElement">
          <h2 className="text-3xl font-bold ps-7">Results & Recommendations</h2>
          <p className="text-base mt-5 mb-14 ps-7">{survey?.description}</p>
          <div className="me-28">
            <Chart sections={sections!} data={data} />
          </div>
        </div>
        <div id="recommendations" className="bg-transparent">
          {recommendations?.map((val, index) => {
            return (
              <div
                className="mb-7 p-5 rounded-md shadow-lg bg-gradient-to-r from-[#00c6ff]  to-[#0072ff] text-white w-full max-w-[250px]"
                key={index}
              >
                <h2 className="text-2xl font-medium  mb-1 uppercase">
                  {val?.sectionTitle}
                </h2>
                <div className="h-[2px] w-full bg-slate-500/10 rounded-full mb-3" />
                {val?.recommendation !== null && (
                  <div
                    className="ms-2"
                    dangerouslySetInnerHTML={{ __html: val?.recommendation }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-7 mb-20 ps-7">
        <DownloadPdf
          elementId="recommendations"
          graphElementId="graphElement"
          emailId={user?.email || ""}
        />
        {/* <SendMail elementId="result" /> */}
      </div>
    </div>
  );
};

export default Result;
