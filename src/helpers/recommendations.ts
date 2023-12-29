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


export const getAllRecommendationsData = async (
  setRecommendations: (data: RecommendationData[]) => void
) => {
  try {
    const surveysCollection = collection(db, "surveys");
    const surveysSnapshot = await getDocs(surveysCollection);

    const unsubscribeArray: Array<() => void> = [];
    const allRecommendationsData: RecommendationData[] = [];

    const surveyPromises = surveysSnapshot.docs.map(async (surveyDoc) => {
      const surveyId = surveyDoc.id;
      const sectionsSnapshot = await getDocs(
        collection(surveyDoc.ref, "sections")
      );

      const sectionPromises = sectionsSnapshot.docs.map(async (sectionDoc) => {
        const sectionId = sectionDoc.id;
        const sectionTitle = sectionDoc.data().title;

        const recommendationsQuery = query(
          collection(sectionDoc.ref, "recommendations"),
          orderBy("timestamp", "desc")
        );

        return new Promise<void>((resolve) => {
          const unsubscribe = onSnapshot(recommendationsQuery, (snapshot) => {
            const sectionRecommendations: RecommendationData[] = [];

            snapshot.forEach((recommendationDoc) => {
              const data = {
                id: recommendationDoc.id,
                from0to25: recommendationDoc.data().from0to25,
                from25to50: recommendationDoc.data().from25to50,
                from50to75: recommendationDoc.data().from50to75,
                from75to100: recommendationDoc.data().from75to100,
              };
              const recommendation: RecommendationData = {
                surveyId: surveyId,
                sectionId: sectionId,
                sectionTitle: sectionTitle,
                recommendation: data,
              };
              sectionRecommendations.push(recommendation);
            });

            if (sectionRecommendations.length === 0) {
              const recommendation: RecommendationData = {
                surveyId: surveyId,
                sectionId: sectionId,
                sectionTitle: sectionTitle,
                recommendation: null,
              };
              sectionRecommendations.push(recommendation);
            }
            const index = allRecommendationsData.findIndex(
              (r) => r.surveyId === surveyId && r.sectionId === sectionId
            );

            if (index !== -1) {
              allRecommendationsData.splice(
                index,
                1,
                ...sectionRecommendations
              );
            } else {
              allRecommendationsData.push(...sectionRecommendations);
            }

            setRecommendations([...allRecommendationsData]);
            resolve();
          });
          unsubscribeArray.push(unsubscribe);
        });
      });
      await Promise.all(sectionPromises);
    });

    await Promise.all(surveyPromises);
    return () => {
      unsubscribeArray.forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  } catch (error) {
    console.error("Error fetching surveys data:", error);
  }
};

export const createRecommendation = async (
  surveyId: string,
  sectionId: string,
  data: Recommendation,
  setIsCreateOpen: (args: boolean) => void,
  setIsLoading: (args: boolean) => void
) => {
  try {
    const surveyCollection = doc(db, "surveys", surveyId);
    const sectionsCollection = collection(surveyCollection, "sections");
    const questionsCollection = collection(
      doc(sectionsCollection, sectionId),
      "recommendations"
    );
    const newData = {
      from25to50: data.from25to50,
      from50to75: data.from50to75,
      from75to100: data.from75to100,
      timestamp: serverTimestamp(),
    };
    await addDoc(questionsCollection, newData);
    setIsCreateOpen(false);
    setIsLoading(false);
    toast.success("Recommendation added successfully");
  } catch (error) {
    console.error("Error adding recommendation:", error);
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
