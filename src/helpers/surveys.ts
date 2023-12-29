import { toast } from "react-toastify";
import { Survey } from "../Types/index";
import { db } from "../config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
// export const getSurveys = async (
//   filter: string,
//   setSurveys: (data: Survey[]) => void
// ) => {
//   try {
//     const q = query(collection(db, "surveys"), where("role", "==", filter));

//     const querySnapshot = await getDocs(q);

//     const data = querySnapshot.docs.map((doc) => {
//       const { title, tagline, description, role, status } = doc.data();
//       return {
//         id: doc.id,
//         title,
//         tagline,
//         description,
//         role,
//         status,
//       };
//     });

//     setSurveys(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };
export const getSurveys = async (
  filter: string,
  setSurveys: (data: Survey[]) => void
) => {
  try {
    const q = query(collection(db, "surveys"), where("role", "==", filter));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        tagline: doc.data().tagline,
        description: doc.data().description,
        role: doc.data().role,
        status: doc.data().status,
      }));

      setSurveys(data);
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getSurveyById = async (
  surveyId: string,
  setSurveys: (data: Survey) => void
) => {
  try {
    const surveyDoc = await getDoc(doc(db, "surveys", surveyId));

    if (surveyDoc.exists()) {
      const data = {
        id: surveyDoc.id,
        title: surveyDoc.data().title,
        tagline: surveyDoc.data().tagline,
        description: surveyDoc.data().description,
        role: surveyDoc.data().role,
        status: surveyDoc.data().status,
      };
      setSurveys(data);
      return data;
    } else {
      console.error("Survey not found");
    }
  } catch (error) {
    console.error("Error fetching survey:", error);
  }
};

export const createSurvey = async (newSurveyData: Partial<Survey>) => {
  try {
    const newSurveyRef = await addDoc(collection(db, "surveys"), newSurveyData);
    toast.success("Survey created successfully");
    return newSurveyRef.id;
  } catch (error) {
    console.error("Error creating survey:", error);
  }
};

export const updateSurvey = async (
  surveyId: string,
  updatedData: Partial<Survey>
) => {
  try {
    const surveyRef = doc(db, "surveys", surveyId);
    const surveyDoc = await getDoc(surveyRef);

    if (surveyDoc.exists()) {
      await updateDoc(surveyRef, updatedData);
      toast.success("Survey updated successfully");
    } else {
      console.error("Survey not found");
    }
  } catch (error) {
    console.error("Error updating survey:", error);
  }
};

export const deleteSurvey = async (surveyId: string) => {
  try {
    const surveyDoc = await getDoc(doc(db, "surveys", surveyId));

    if (surveyDoc.exists()) {
      await deleteDoc(doc(db, "surveys", surveyId));
      toast.success("Survey deleted successfully");
    } else {
      console.error("Survey not found");
    }
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};
