import Header from "../../components/header";
import "../../index.css";
import { getQuestionsById } from "../../helpers/questions";
import QuestionForm from "../../components/ui/forms/QuestionForm";
import { useEffect, useState } from "react";
import { Question } from "../../Types";

const QuestionPage = () => {
  const [questions, setQuestions] = useState<Array<Question>>();
  const currentUrl = window.location.pathname.split("/")[3];

  useEffect(() => {
    if (currentUrl) {
      getQuestionsById(currentUrl).then((data) => {
        setQuestions(data);
      });
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
