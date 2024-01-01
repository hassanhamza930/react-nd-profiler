import { toast } from "react-toastify";
import { Database } from "../Types/supabase";
import { supabaseClient } from "../config/supabase";

export const getSurveys = async (
  filter: string,
  setSurveys: (data: any) => void
) => {
  const { data, error } = await supabaseClient
    .from("surveys")
    .select("*, sections(*,subsections(*,questions(*)))")
    .eq("role", filter)
    .order("id", { ascending: true });
  if (error) {
    toast.error(error.message);
  } else {
    setSurveys(data);
    console.log(data);
  }
};


export const getSurveyById = async (
  surveyId: string,
  setSurveys: (data: any) => void,
) => {
  const { data, error } = await supabaseClient
    .from("surveys")
    .select("*, sections(*,subsections(*))")
    .eq("id", surveyId).single()
  if (error) {
    toast.error(error.message);
  } else {
    setSurveys(data);
  }
};


export const createSurvey = async (newSurveyData: any) => {
  const { error } = await supabaseClient.from("surveys").insert({
    title: newSurveyData.title,
    description: newSurveyData.description,
    role: newSurveyData.role,
  });
  if (!error) {
    toast.success("Survey created successfully");
  } else {
    console.error("Error creating survey:", error);
    return;
  }
};


export const updateSurvey = async (surveyId: string, updatedData: Database["public"]["Tables"]["surveys"]["Update"]) => {
  const { error } = await supabaseClient
    .from("surveys")
    .update({
      title: updatedData.title,
      description: updatedData.description,
      role: updatedData.role,
    })
    .eq("id", surveyId);
  if (!error) {
    toast.success("Survey Update Successfully");
  } else {
    console.log("error", error);
    toast.error("Survey did not Update, Something went wrong!");
  }
};

export const deleteSurvey = async (surveyId: string) => {
  const { error } = await supabaseClient
    .from("surveys")
    .delete()
    .eq("id", surveyId);
  if (!error) {
    toast.success("Survey deleted Successfully");
  } else {
    console.log("error", error);
    toast.error("Survey did not delete, Something went wrong!");
  }
};
