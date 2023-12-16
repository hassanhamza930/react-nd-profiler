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
import { toast } from "react-hot-toast";

// export const getQuestionsById = async (surveyId: string) => {
//   try {
//     const surveyCollection = doc(db, "surveys", surveyId);

//     const sectionsSnapshot = await getDocs(
//       collection(surveyCollection, "sections")
//     );

//     let questionArray: Array<Question> = [];

//     for (const sectionDoc of sectionsSnapshot.docs) {
//       const sectionId = sectionDoc.id;

//       const questionsSnapshot = await getDocs(
//         collection(sectionDoc.ref, "questions")
//       );

//       for (const questionDoc of questionsSnapshot.docs) {
//         const optionsSnapshot = await getDocs(
//           collection(questionDoc.ref, "options")
//         );
//         optionsSnapshot.forEach((optionDoc) => {
//           const question = {
//             id: questionDoc.id,
//             text: questionDoc.data().text,
//             sectionId: sectionId,
//             options: {
//               id: optionDoc.id,
//               option1: optionDoc.data().option1,
//               option2: optionDoc.data().option2,
//               option3: optionDoc.data().option3,
//               option4: optionDoc.data().option4,
//             },
//           };
//           questionArray.push(question);
//         });
//       }
//     }
//     return questionArray;
//   } catch (error) {
//     console.error("Error fetching questions:", error);
//   }
// };

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

export const getQuestionsBySubsectionId = (
  surveyId: string,
  sectionId: string,
  subsectionId: string,
  setQuestions: (data: Question[]) => void,
  setIsLoading: (args: boolean) => void
) => {
  try {
    const subsectionRef = doc(
      db,
      "surveys",
      surveyId,
      "sections",
      sectionId,
      "subsections",
      subsectionId
    );

    const questionsCollection = collection(subsectionRef, "questions");

    const questionsQuery = query(
      questionsCollection,
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      questionsQuery,
      async (querySnapshot) => {
        const questionArray: Question[] = [];

        for (const questionDoc of querySnapshot.docs) {
          const optionsSnapshot = await getDocs(
            collection(questionDoc.ref, "options")
          );
          optionsSnapshot.forEach((optionDoc) => {
            const question = {
              id: questionDoc.id,
              text: questionDoc.data().text,
              options: {
                id: optionDoc.id,
                option1: optionDoc.data().option1,
                option2: optionDoc.data().option2,
                option3: optionDoc.data().option3,
                option4: optionDoc.data().option4,
              },
              timestamp: questionDoc.data().timestamp,
            };
            questionArray.push(question);
          });
        }

        setQuestions(questionArray);
      },
      (error) => {
        console.error("Error fetching questions:", error);
      }
    );

    setIsLoading(false);
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up snapshot listener:", error);
  }
};

export const editQuestion = async (
  surveyId: string,
  sectionId: string,
  subsectionId: string,
  questionId: string,
  questionData: Partial<Question>,
  optionsData: Options,
  setIsLoading: (args: boolean) => void
) => {
  try {
    const questionRef = doc(
      db,
      "surveys",
      surveyId,
      "sections",
      sectionId,
      "subsections",
      subsectionId,
      "questions",
      questionId
    );

    await updateDoc(questionRef, questionData);

    const optionsRef = doc(questionRef, "options", optionsData.id!);
    const optionsDoc = await getDoc(optionsRef);

    if (optionsDoc.exists()) {
      await updateDoc(optionsRef, optionsData as any);
    } else {
      toast.error("Option not found");
    }
    setIsLoading(false);
    toast.success("Question updated successfully");
  } catch (error) {
    console.error("Error updating question and options:", error);
    throw error;
  }
};

export const createQuestion = async (
  surveyId: string,
  sectionId: string,
  subsectionId: string,
  setIsOpen: (args: boolean) => void,
  setIsLoading: (args: boolean) => void,
  data: Partial<Question>
) => {
  try {
    const surveyCollection = doc(db, "surveys", surveyId);
    const sectionsCollection = collection(surveyCollection, "sections");
    const subsectionsCollection = collection(
      doc(sectionsCollection, sectionId),
      "subsections"
    );
    const questionsCollection = collection(
      doc(subsectionsCollection, subsectionId),
      "questions"
    );
    const newQuestionRef = await addDoc(questionsCollection, {
      text: data.text,
      timestamp: serverTimestamp(),
    });

    const optionsCollection = collection(newQuestionRef, "options");
    await addDoc(optionsCollection, data?.options);

    setIsOpen(false);
    setIsLoading(false);
    toast.success("Question created successfully");
  } catch (error) {
    console.error("Error creating new question and options:", error);
  }
};

export const deleteQuestion = async (
  surveyId: string,
  sectionId: string,
  subsectionId: string,
  questionId: string
) => {
  try {
    const questionRef = doc(
      db,
      "surveys",
      surveyId,
      "sections",
      sectionId,
      "subsections",
      subsectionId,
      "questions",
      questionId
    );
    await deleteDoc(questionRef);
    toast.success("Question deleted successfully.");
  } catch (error) {
    console.error("Error deleting question:", error);
  }
};

