import { toast } from "react-toastify";
import { Database } from "../Types/supabase";
import { supabaseClient } from "../config/supabase";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../config/firebase";

export const getSurveys = async (
  filter: string,
  setSurveys: (data: any) => void
) => {
  //   const completedSurveysRef = collection(
  //     db,
  //     "users",
  //     localStorage.getItem("uid"),
  //     "completedSurveys"
  //   );
  //   const completedSurveysQuery = query(completedSurveysRef);
  //   const completedSurveysSnapshot = await getDocs(completedSurveysQuery);
  //   const completedSurveyIds = completedSurveysSnapshot.docs.map((doc) => doc.data().surveyId);
  // console.log(completedSurveyIds)
  const { data, error } = await supabaseClient
    .from("surveys")
    .select("*, sections(*,subsections(*,questions(*)))")
    .eq("role", filter);
  if (error) {
    toast.error(error.message);
  } else {
    // if (filter !== "admin") {
    //   const filteredSurveys = data.filter(
    //     (survey) => !completedSurveyIds.includes(survey.id)
    //   );

    //   setSurveys(filteredSurveys);
    //   console.log("Filtered surveys:", filteredSurveys);
    //   return;
    // }
    setSurveys(data);
    console.log("data", data);
  }
};

export const getCompleteSurveys = async (
  userId: string,
  setCompletedSurveys: (args: string[]) => void,
  
) => {
  const completedSurveysRef = collection(
    db,
    "users",
    userId,
    "completedSurveys"
  );
  const completedSurveysQuery = query(completedSurveysRef);
  const completedSurveysSnapshot = await getDocs(completedSurveysQuery);
  const completedSurveyIds = completedSurveysSnapshot.docs.map(
    (doc) => doc.data().surveyId
  );
  console.log(completedSurveyIds);
  setCompletedSurveys(completedSurveyIds);
};

export const getSurveyById = async (
  surveyId: string,
  setSurveys: (data: any) => void
) => {
  const { data, error } = await supabaseClient
    .from("surveys")
    .select("*, sections(*,subsections(*))")
    .eq("id", surveyId)
    .single();
  if (error) {
    toast.error(error.message);
  } else {
    setSurveys(data);
  }
};

export const createSurvey = async (
  newSurveyData: any,
  setRender: (args: boolean) => void
) => {
  const { error } = await supabaseClient.from("surveys").insert({
    title: newSurveyData.title,
    description: newSurveyData.description,
    role: newSurveyData.role,
  });
  if (!error) {
    toast.success("Survey created successfully");
    setRender(true);
  } else {
    console.error("Error creating survey:", error);
    return;
  }
};

export const updateSurvey = async (
  surveyId: string,
  updatedData: Database["public"]["Tables"]["surveys"]["Update"],
  setRender: (args: boolean) => void
) => {
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
    setRender(true);
  } else {
    console.log("error", error);
    toast.error("Survey did not Update, Something went wrong!");
  }
};

export const deleteSurvey = async (
  surveyId: string,
  setRender: (args: boolean) => void
) => {
  const { error } = await supabaseClient
    .from("surveys")
    .delete()
    .eq("id", surveyId);
  if (!error) {
    toast.success("Survey deleted Successfully");
    setRender(true);
  } else {
    console.log("error", error);
    toast.error("Survey did not delete, Something went wrong!");
  }
};
