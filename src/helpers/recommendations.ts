import { toast } from "react-toastify";
import { Recommendation, RecommendationData } from "../Types/index";
import { db } from "../config/firebase";
import {
  addDoc,
  collection,
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

export const getAllRecommendationsData = async (
  setRecommendations: (data: RecommendationData[]) => void
) => {
  // const { data, error } = await supabaseClient
  //   .from("surveys")
  //   .select("*, sections(*,subsections(*))")
  //   .eq("id", surveyId).single()
  // if (error) {
  //   toast.error(error.message);
  // } else {
  //   setSubsection(data);
  // }
};

export const createRecommendation = async (
  surveyId: string,
  section: any,
  data: any,
  setIsCreateOpen: (args: boolean) => void,
  setIsLoading: (args: boolean) => void
) => {
  const { error } = await supabaseClient
    .from("sections")
    .update({
      title: section.title,
      surveyid: section.surveyid,
      from25to50: data.from25to50,
      from50to75: data.from50to75,
      from75to100: data.from75to100,
    })
    .eq("id", section.id);
  if (!error) {
    toast.success("Recommedation added Successfully");
    setIsLoading(true);
    setIsCreateOpen(false);
  } else {
    console.log("error", error);
    toast.error("Recommedation added failed!");
    setIsCreateOpen(false);
  }
};

export const editRecommendation = async (
  surveyId: string,
  sectionId: string,
  recommendationId: string,
  updatedData: any,
  setIsOpen: (args: boolean) => void,
  setIsLoading: (args: boolean) => void
) => {
  try {
    const recommendationRef = doc(
      db,
      "surveys",
      surveyId,
      "sections",
      sectionId,
      "recommendations",
      recommendationId
    );

    const recommendationDoc = await getDoc(recommendationRef);

    if (recommendationDoc.exists()) {
      await updateDoc(recommendationRef, updatedData);
      setIsOpen(false);
      setIsLoading(false);
      toast.success("Recommendation updated successfully");
    } else {
      toast.error("Recommendation does not exist");
    }
  } catch (error) {
    console.error("Error updating recommendation:", error);
    toast.error("Error updating recommendation");
  }
};
