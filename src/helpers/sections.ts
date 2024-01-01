import { toast } from "react-toastify";
import { Section, Subsection } from "../Types/index";
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
import { supabaseClient } from "../config/supabase";
import { Database } from "../Types/supabase";

// export const getSections = (
//   surveyId: string,
//   setSections: (data: Section[]) => void
// ) => {
//   try {
//     const surveyCollection = doc(db, "surveys", surveyId);
//     const sectionsCollection = collection(surveyCollection, "sections");

//     const unsubscribeSections = onSnapshot(
//       sectionsCollection,
//       async (querySnapshot) => {
//         const sections = [];

//         for (const doc of querySnapshot.docs) {
//           const sectionData = {
//             id: doc.id,
//             title: doc.data().title,
//             subsections: [],
//           };

//           const subsectionsCollection = collection(doc.ref, "subsections");
//           onSnapshot(subsectionsCollection, (subsectionsSnapshot) => {
//             sectionData.subsections = subsectionsSnapshot.docs.map(
//               (subDoc) => ({
//                 id: subDoc.id,
//                 title: subDoc.data().title,
//               })
//             );

//             const existingIndex = sections.findIndex(
//               (existingSection) => existingSection.id === sectionData.id
//             );

//             if (existingIndex !== -1) {
//               sections[existingIndex] = sectionData;
//             } else {
//               sections.push(sectionData);
//             }

//             setSections([...sections]);
//           });
//         }
//       }
//     );

//     return () => {
//       unsubscribeSections();
//     };
//   } catch (error) {
//     console.error("Error fetching sections:", error);
//   }
// };

export const getSections = async (
  surveryId: string,
  // setSections: (data: Database["public"]["Tables"]["sections"]["Row"]
  setSections: (data: any) => void
) => {
  const { data, error } = await supabaseClient
    .from("sections")
    .select("*, subsections(*))")
    .eq("surveyid", surveryId).order('id')

  if (error) {
    toast.error(error.message);
  } else {
    // toast.success("All Surveys fetched successfully");
    // console.log(data);
    setSections(data);
  }
};
export const getSectionById = async (
  sectionId:string,
  // setSections: (data: Database["public"]["Tables"]["sections"]["Row"]
  setSection: (data: any) => void
) => {
  const { data, error } = await supabaseClient
    .from("sections")
    .select("*")
    .eq("id", sectionId).single()

  if (error) {
    toast.error(error.message);
  } else {
    // toast.success("All Surveys fetched successfully");
    // console.log(data);
    console.log("recommedation fetched",data)
    setSection(data);
  }
};

export const getSubsectionById = async (
  surveyId: string,
  sectionId: string,
  subsectionId: string,
  setSubsection: (data: any) => void // eslint-disable-line
) => {
 const { data, error } = await supabaseClient
    .from("surveys")
    .select("*, sections(*,subsections(*))")
    .eq("id", surveyId).single()
  if (error) {
    toast.error(error.message);
  } else {
    setSubsection(data);
  }
};


export const createSection = async (
  surveryId: string,
  title: string,
  setIsOpen: (args: boolean) => void
) => {
  const { error, data } = await supabaseClient.from("sections").insert({
    title: title,
    surveyid: surveryId,
  });
  if (!error) {
    toast.success("Section created successfully");
    setIsOpen(false);
  } else {
    console.error("Error creating survey:", error);
    toast.error("Error creating sections");
    setIsOpen(false);
    return;
  }
};
export const updateSection = async (
  surveyId: string,
  sectionId: string,
  updatedData: Database["public"]["Tables"]["sections"]["Update"],
  setRender: (args: boolean) => void
) => {
  const { error } = await supabaseClient
    .from("sections")
    .update({
      title: updatedData.title,
      surveyid: surveyId,
    })
    .eq("id", sectionId);
  if (!error) {
    toast.success("Section Update Successfully");
    setRender(true);
  } else {
    console.log("error", error);
    toast.error("Section did not Update, Something went wrong!");
  }
};


export const deleteSection = async (surveyId: string, sectionId: string) => {
  const { error } = await supabaseClient
    .from("sections")
    .delete()
    .eq("id", sectionId);
  if (!error) {
    toast.success("Section deleted Successfully");
  } else {
    console.log("error", error);
    toast.error("Section did not delete, Something went wrong!");
  }
};


export const createSubsection = async (
  sectionId: string,
  title: string,
  setIsOpen: (args: boolean) => void,
  setRender: (args: boolean) => void
) => {
  const { error, data } = await supabaseClient.from("subsections").insert({
    title: title,
    sectionid: sectionId,
  });
  if (!error) {
    toast.success("Sub Section created successfully");
    setRender(true);
    setIsOpen(false);
  } else {
    console.error("Error creating survey:", error);
    toast.error("Error creating Sub Section");
    setIsOpen(false);
    return;
  }
};

export const updateSubsection = async (
  surveyId: string,
  sectionId: string,
  subsectionId: string,
  updatedData: any,
  setRender: (args: boolean) => void
  
) => {
  console.log("subsectionId",subsectionId,sectionId)
  const { error } = await supabaseClient
    .from("subsections")
    .update({
      title: updatedData.title,
      sectionid: sectionId,
    })
    .eq("id", subsectionId);
  if (!error) {
    toast.success("SubSection Update Successfully");
    setRender(true);
  } else {
    console.log("error", error);
    toast.error("SubSection did not Update, Something went wrong!");
  }
};

export const deleteSubsection = async (
  surveyId: string,
  sectionId: string,
  subsectionId: string
) => {
  const { error } = await supabaseClient
  .from("subsections")
  .delete()
  .eq("id", subsectionId);
if (!error) {
  toast.success("SubSection deleted Successfully");
} else {
  console.log("error", error);
  toast.error("SubSection did not delete, Something went wrong!");
}
};
