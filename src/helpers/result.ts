import {
  doc,
  collection,
  setDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { ClassifiedData, RecommendationData, Response } from "../Types/index";

/**
 *
 * @param userId
 * @param sectionId
 * @param questionId
 * @param surveyId
 * @param response
 * @param option
 * @returns
 */
export const addResponse = async (
  userId: string,
  sectionId: string,
  questionId: string,
  surveyId: string,
  response: string,
  option: string
) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const resultsCollectionRef = collection(userDocRef, "results");
    const questionExistsQuery = query(
      resultsCollectionRef,
      where("questionId", "==", questionId),
      where("surveyId", "==", surveyId),
      where("userId", "==", userId)
    );

    const questionExistsSnapshot = await getDocs(questionExistsQuery);

    if (!questionExistsSnapshot.empty) {
      console.log("Question ID already exists for this user and survey");
      return;
    }
    const newResultDocRef = doc(resultsCollectionRef);
    await setDoc(newResultDocRef, {
      sectionId,
      questionId,
      surveyId,
      response,
      option,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error adding response:", error);
  }
};

/**
 *
 * @param userId
 * @param surveyId
 * @param setResults
 * @returns
 */
export const getResultsData = (
  userId: string,
  surveyId: string,
  setResults: (data: Response[]) => void
) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const resultsCollectionRef = collection(userDocRef, "results");

    const q = query(resultsCollectionRef, where("surveyId", "==", surveyId));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          response: doc.data().response,
          option: doc.data().option,
          sectionId: doc.data().sectionId,
          surveyId: doc.data().surveyId,
          questionId: doc.data().questionId,
        }));
        setResults(results);
        localStorage.setItem("responses", String(results.length));
      },
      (error) => {
        console.error("Error fetching results:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up results snapshot listener:", error);
  }
};

/**
 *
 * @param sectionId
 * @param resultsData
 * @returns
 */
const getTotalQuestionsInSection = (
  sectionId: string,
  resultsData: Response[]
) => {
  return resultsData.reduce((total, result) => {
    if (result.sectionId === sectionId) {
      total += 1;
    }
    return total;
  }, 0);
};

/**
 *
 * @param userId
 * @param surveyId
 * @param setResults
 * @returns
 */
export const getResults = async (
  userId: string,
  surveyId: string,
  // eslint-disable-next-line
  setResults: (args: any) => void
) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const resultsCollectionRef = collection(userDocRef, "results");
    const q = query(resultsCollectionRef, where("surveyId", "==", surveyId));

    const querySnapshot = await getDocs(q);
    const resultsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      response: doc.data().response,
      option: doc.data().option,
      sectionId: doc.data().sectionId,
      surveyId: doc.data().surveyId,
      questionId: doc.data().questionId,
    }));

    const sectionSet = new Set();

    const classifiedData = resultsData.reduce(
      (acc: ClassifiedData, result: Response) => {
        const { sectionId, questionId, option } = result;
        sectionSet.add(sectionId);

        if (!acc[sectionId]) {
          acc[sectionId] = {
            totalQuestions: 0,
            totalMarks: 100 / sectionSet.size,
            obtainedMarks: 0,
            responses: [],
          };
        }

        const totalQuestions = getTotalQuestionsInSection(
          sectionId,
          resultsData
        );

        const questionWeight =
          totalQuestions > 0 ? acc[sectionId].totalMarks / totalQuestions : 0;

        let optionWeight;
        switch (option) {
          case "A":
            optionWeight = 1.0;
            break;
          case "B":
            optionWeight = 0.75;
            break;
          case "C":
            optionWeight = 0.5;
            break;
          case "D":
            optionWeight = 0.25;
            break;
          default:
            optionWeight = 0;
        }

        const questionMarks = questionWeight * optionWeight;
        acc[sectionId].obtainedMarks += questionMarks;

        acc[sectionId].responses.push({
          questionId,
          option,
          questionMarks,
        });
        return acc;
      },
      {}
    );

    const resultArray = Object.entries(classifiedData).map(
      ([sectionId, data]) => ({
        sectionId,
        totalMarks: data.totalMarks,
        obtainedMarks: data.obtainedMarks,
        percentage: (data.obtainedMarks / data.totalMarks) * 100,
      })
    );
    setResults(resultArray);
    return resultArray;
  } catch (error) {
    console.error("Error getting results data:", error);
    return [];
  }
};

/**
 *
 * @param data
 * @param setRecommendations
 * @param surveyId
 */
export const getFilteredRecommendationsData = async (
  data: Array<{
    obtainedMarks: number;
    percentage: number;
    sectionId: string;
    totalMarks: number;
  }>,
  setRecommendations: (data: RecommendationData[]) => void,
  surveyId: string
) => {
  try {
    const allRecommendationsData: RecommendationData[] = [];

    await Promise.all(
      data.map(async ({ sectionId, percentage }) => {
        const surveysCollection = collection(db, "surveys");
        const surveyDoc = await getDoc(doc(surveysCollection, surveyId));
        const sectionDoc = await getDoc(
          doc(surveyDoc.ref, "sections", sectionId)
        );

        if (sectionDoc.exists()) {
          const sectionTitle = sectionDoc.data().title;

          const recommendationsQuery = query(
            collection(sectionDoc.ref, "recommendations"),
            orderBy("timestamp", "desc")
          );
          const snapshot = await getDocs(recommendationsQuery);

          const sectionRecommendations: RecommendationData[] = [];

          snapshot.forEach((recommendationDoc) => {
            const recommendationData = {
              id: recommendationDoc.id,
              // from0to25: recommendationDoc.data().from0to25,
              from25to50: recommendationDoc.data().from25to50,
              from50to75: recommendationDoc.data().from50to75,
              from75to100: recommendationDoc.data().from75to100,
            };

            if (percentage <= 50 && recommendationData.from25to50 !== null) {
              sectionRecommendations.push({
                surveyId: null,
                sectionId: sectionId,
                sectionTitle: sectionTitle,
                recommendation: recommendationData?.from25to50,
                percentage,
              });
            } else if (
              percentage > 50 &&
              percentage <= 75 &&
              recommendationData.from50to75 !== null
            ) {
              sectionRecommendations.push({
                surveyId: null,
                sectionId: sectionId,
                sectionTitle: sectionTitle,
                recommendation: recommendationData?.from50to75,
                percentage,
              });
            } else if (
              percentage > 75 &&
              percentage <= 100 &&
              recommendationData.from75to100 !== null
            ) {
              sectionRecommendations.push({
                surveyId: null,
                sectionId: sectionId,
                sectionTitle: sectionTitle,
                recommendation: recommendationData?.from75to100,
                percentage,
              });
            }
          });

          if (sectionRecommendations.length === 0) {
            const recommendation: RecommendationData = {
              surveyId: null,
              sectionId: sectionId,
              sectionTitle: sectionTitle,
              recommendation: null,
            };
            sectionRecommendations.push(recommendation);
          }
          const index = allRecommendationsData.findIndex(
            (r) => r.sectionId === sectionId
          );

          if (index !== -1) {
            allRecommendationsData.splice(index, 1, ...sectionRecommendations);
          } else {
            allRecommendationsData.push(...sectionRecommendations);
          }
        }
      })
    );

    setRecommendations([...allRecommendationsData]);
  } catch (error) {
    console.error("Error fetching sections data:", error);
  }
};
