import Header from "../../components/header";
import "../../index.css";
import { getQuestionsById } from "../../helpers/questions";
import QuestionForm from "../../components/ui/forms/QuestionForm";
import { useEffect, useState } from "react";
import { Question } from "../../Types";
import { Database } from "../../Types/supabase";
import { useRecoilState } from "recoil";
import { surveyState } from "../../recoil/recoil";

const QuestionPage = () => {
  const [questions, setQuestions] =
    useState<Database["public"]["Tables"]["questions"]["Row"][]>();
  const currentUrl = window.location.pathname.split("/")[3];
  const [survey, setSurvey] = useRecoilState(surveyState);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getQuestionsById(currentUrl);

        // Store all questions in an array
        const allQuestions = data.reduce(
          (acc, section) =>
            acc.concat(section.subsections.flatMap((sub) => sub.questions)),
          []
        );

        setSurvey({
          surveyId: currentUrl,
          sections: data,
        });

        // Set the questions in the state
        setQuestions(allQuestions);
      } catch (error) {
        console.error("Error setting survey data:", error.message);
      }
    };

    if (currentUrl) {
      fetchData();
    }
  }, [currentUrl]);
  return (
    <div>
      <Header heading="Workplace survey 1" />
      <QuestionForm questions={questions} />
    </div>
  );
};

export default QuestionPage;
