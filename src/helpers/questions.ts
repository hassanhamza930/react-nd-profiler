import { toast } from "react-toastify";
import { Question } from "../Types";

import { supabaseClient } from "../config/supabase";

export const getQuestionsById = async (surveyId: string) => {
  const { data, error } = await supabaseClient
    .from("sections")
    .select("*, subsections(*,questions(*))")
    .eq("surveyid", surveyId)
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data;
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
  setRender: (args: boolean) => void
) => {
  const { error } = await supabaseClient
    .from("questions")
    .update({
      title: questionData.text,
      option1: optionsData.option1,
      option2: optionsData.option2,
      option3: optionsData.option3,
      option4: optionsData.option4,
      subsectionid: Number(subsectionId),
    })
    .eq("id", questionId);
  if (!error) {
    toast.success("Question Updated Successfully");
    setRender(true);
    setIsLoading(false);
  } else {
    console.log("error", error);
    toast.error("Question did not Update, Something went wrong!");
    setIsLoading(false);
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
    subsectionid: Number(subsectionId),
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
