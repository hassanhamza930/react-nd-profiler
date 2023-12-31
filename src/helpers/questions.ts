import { toast } from "react-toastify";
import { Options, Question } from "../Types";
import { db } from "../config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { supabaseClient } from "../config/supabase";


export const getQuestionsById = async (surveyId: string) => {
  try {
    const surveyCollection = doc(db, "surveys", surveyId);

    const sectionsSnapshot = await getDocs(
      collection(surveyCollection, "sections")
    );

    const questionArray: Array<Question> = [];

    for (const sectionDoc of sectionsSnapshot.docs) {
      const sectionId = sectionDoc.id;

      const subsectionsSnapshot = await getDocs(
        collection(sectionDoc.ref, "subsections")
      );

      for (const subsectionDoc of subsectionsSnapshot.docs) {
        const subsectionId = subsectionDoc.id;

        const questionsSnapshot = await getDocs(
          collection(subsectionDoc.ref, "questions")
        );

        for (const questionDoc of questionsSnapshot.docs) {
          const optionsSnapshot = await getDocs(
            collection(questionDoc.ref, "options")
          );

          optionsSnapshot.forEach((optionDoc) => {
            const question = {
              id: questionDoc.id,
              text: questionDoc.data().text,
              sectionId: sectionId,
              subsectionId: subsectionId,
              options: {
                id: optionDoc.id,
                option1: optionDoc.data().option1,
                option2: optionDoc.data().option2,
                option3: optionDoc.data().option3,
                option4: optionDoc.data().option4,
              },
            };
            questionArray.push(question);
          });
        }
      }
    }
    return questionArray;
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
};

export const getQuestionsBySubsectionId = async (
  surveyId: string,
  sectionId: string,
  subsectionId: string,
  setQuestions: (data: Question[]) => void,
  setIsLoading: (args: boolean) => void
) => {
  const { data, error } = await supabaseClient
    .from("questions")
    .select("*")
    .eq("subsectionid", subsectionId);
  if (error) {
    toast.error(error.message);
    setIsLoading(false);
  } else {
    setIsLoading(false);
    setQuestions(data);
  }
};

export const editQuestion = async (
  surveyId: string,
  sectionId: string,
  subsectionId: string,
  questionId: string,
  questionData: any,
  optionsData: any,
  setIsLoading: (args: boolean) => void,
  setRender: (args: boolean) => void,

) => {
  const { error } = await supabaseClient
    .from("questions")
    .update({
      title: questionData.text,
      option1:optionsData.option1,
      option2:optionsData.option2,
      option3:optionsData.option3,
      option4:optionsData.option4,
      subsectionid: subsectionId,
    })
    .eq("id", questionId);
  if (!error) {
    toast.success("Question Updated Successfully");
    setRender(true);
    setIsLoading(false)
  } else {
    console.log("error", error);
    toast.error("Question did not Update, Something went wrong!");
    setIsLoading(false)
  }
};

export const createQuestion = async (
  surveyId: string,
  sectionId: string,
  subsectionId: string,
  setIsOpen: (args: boolean) => void,
  setIsLoading: (args: boolean) => void,
  data: any,
  setRender: (args: boolean) => void
) => {
  console.log("questions data", subsectionId);
  const { error } = await supabaseClient.from("questions").insert({
    title: data.text,
    subsectionid: subsectionId,
    option1: data.options.option1,
    option2: data.options.option2,
    option3: data.options.option3,
    option4: data.options.option4,
  });
  if (!error) {
    toast.success("question created successfully");
    // setRender(true);
    setIsLoading(false);
    setIsOpen(false);
    setRender(true);
  } else {
    console.error("Error creating question:", error);
    toast.error(error?.message);
    setIsLoading(false);
    setIsOpen(false);
    return;
  }
};

export const deleteQuestion = async (
  surveyId: string,
  sectionId: string,
  subsectionId: string,
  questionId: string,
  setRender: (args: boolean) => void
) => {
  const { error } = await supabaseClient
    .from("questions")
    .delete()
    .eq("id", questionId);
  if (!error) {
    toast.success("Question deleted Successfully");
    setRender(true);
  } else {
    console.log("error", error);
    toast.error("Question did not delete, Something went wrong!");
  }
};
