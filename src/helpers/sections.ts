import { Section } from "../Types/index";
import { db } from "../config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-hot-toast";

export const getSections = (
  surveyId: string,
  setSections: (data: Section[]) => void
) => {
  try {
    const surveyCollection = doc(db, "surveys", surveyId);
    const sectionsCollection = collection(surveyCollection, "sections");

    const unsubscribe = onSnapshot(sectionsCollection, (querySnapshot) => {
      const sections = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
      }));
      setSections(sections);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching sections:", error);
  }
};

export const getSectionById = async (
  surveyId: string,
  sectionId: string,
  setSection: (data: Section) => void
) => {
  try {
    const sectionRef = doc(db, "surveys", surveyId, "sections", sectionId);
    const sectionDoc = await getDoc(sectionRef);

    if (sectionDoc.exists()) {
      const sectionData = {
        id: sectionDoc.id,
        title: sectionDoc.data().title,
      };
      setSection(sectionData);
      return sectionData;
    } else {
      console.error("Section not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching section by ID:", error);
    return null;
  }
};

export const createSection = async (
  surveyId: string,
  title: string,
  setIsOpen: (args: boolean) => void
) => {
  try {
    if (!title) {
      toast.error("title cannot be empty");
      return;
    }
    const surveyCollection = doc(db, "surveys", surveyId);
    const sectionsCollection = collection(surveyCollection, "sections");

    await addDoc(sectionsCollection, {
      title,
    });

    toast.success("Section created successfully");
    setIsOpen(false);
  } catch (error) {
    console.error("Error creating new section:", error);
  }
};

export const updateSection = async (
  surveyId: string,
  sectionId: string,
  updatedData: Partial<Section>
) => {
  try {
    const sectionRef = doc(db, "surveys", surveyId, "sections", sectionId);
    const sectionDoc = await getDoc(sectionRef);

    if (sectionDoc.exists()) {
      await updateDoc(sectionRef, updatedData);
      toast.success("Section updated successfully")
    } else {
      console.error('Section not found');
    }
  } catch (error) {
    console.error("Error updating section:", error);
  }
};

export const deleteSection = async (surveyId: string, sectionId: string) => {
  try {
    const sectionDoc = await getDoc(
      doc(db, "surveys", surveyId, "sections", sectionId)
    );

    if (sectionDoc.exists()) {
      await deleteDoc(doc(db, "surveys", surveyId, "sections", sectionId));
      toast.success("Section deleted successfully");
    } else {
      console.error("Section not found");
      toast.error("Section not found");
    }
  } catch (error) {
    console.error("Error deleting section:", error);
    toast.error("Error deleting section. Please try again later.");
  }
};
