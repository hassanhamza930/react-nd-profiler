import { Section, Subsection } from "../Types/index";
import { db } from "../config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
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

    const unsubscribeSections = onSnapshot(
      sectionsCollection,
      async (querySnapshot) => {
        const sections = [];

        for (const doc of querySnapshot.docs) {
          const sectionData = {
            id: doc.id,
            title: doc.data().title,
            subsections: [],
          };

          const subsectionsCollection = collection(doc.ref, "subsections");
          const unsubscribeSubsections = onSnapshot(
            subsectionsCollection,
            (subsectionsSnapshot) => {
              sectionData.subsections = subsectionsSnapshot.docs.map(
                (subDoc) => ({
                  id: subDoc.id,
                  title: subDoc.data().title,
                })
              );

              const existingIndex = sections.findIndex(
                (existingSection) => existingSection.id === sectionData.id
              );

              if (existingIndex !== -1) {
                sections[existingIndex] = sectionData;
              } else {
                sections.push(sectionData);
              }

              setSections([...sections]);
            }
          );
        }
      }
    );

    return () => {
      unsubscribeSections();
    };
  } catch (error) {
    console.error("Error fetching sections:", error);
  }
};

export const getSubsectionById = async (
  surveyId: string,
  sectionId: string,
  subsectionId: string,
  setSubsection: (data: Subsection) => void
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
    const subsectionDoc = await getDoc(subsectionRef);
    if (subsectionDoc.exists()) {
      const subsectionData = {
        id: subsectionDoc.id,
        title: subsectionDoc.data().title,
      };
      setSubsection(subsectionData);
      return subsectionData;
    } else {
      console.error("Subsection not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching subsection by ID:", error);
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
      toast.success("Section updated successfully");
    } else {
      console.error("Section not found");
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

export const createSubsection = async (
  surveyId: string,
  sectionId: string,
  title: string,
  setIsOpen: (args: boolean) => void
) => {
  try {
    if (!title) {
      toast.error("Title cannot be empty");
      return;
    }
    const sectionRef = doc(db, "surveys", surveyId, "sections", sectionId);
    const subsectionsCollection = collection(sectionRef, "subsections");

    await addDoc(subsectionsCollection, {
      title,
    });

    toast.success("Subsection created successfully");
    setIsOpen(false);
  } catch (error) {
    console.error("Error creating new subsection:", error);
  }
};

export const updateSubsection = async (
  surveyId: string,
  sectionId: string,
  subsectionId: string,
  updatedData: Partial<Subsection>
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

    const subsectionDoc = await getDoc(subsectionRef);

    if (subsectionDoc.exists()) {
      await updateDoc(subsectionRef, updatedData);
      toast.success("Subsection updated successfully");
    } else {
      console.error("Subsection not found");
    }
  } catch (error) {
    console.error("Error updating subsection:", error);
  }
};

export const deleteSubsection = async (
  surveyId: string,
  sectionId: string,
  subsectionId: string
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

    const subsectionDoc = await getDoc(subsectionRef);

    if (subsectionDoc.exists()) {
      await deleteDoc(subsectionRef);
      toast.success("Subsection deleted successfully");
    } else {
      console.error("Subsection not found");
      toast.error("Subsection not found");
    }
  } catch (error) {
    console.error("Error deleting subsection:", error);
    toast.error("Error deleting subsection. Please try again later.");
  }
};
