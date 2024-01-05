import { atom } from "recoil";
import { Database } from "../Types/supabase";

type Tresult = {
  surveyId: string | null;
  sections: Array<{
    sectionId: string | null;
    subsections: Array<{
      subsectionId: string | null;
      questions: Array<{
        questionId: string | null;
        points: number | null;
      }>;
    }>;
  }>;
};

export const surveyState = atom({
  key: "surveyState",
  default: {
    surveyId: null,
    sections: [],
  },
});

type resultState = {
  surveyId: number | null;
  resutls: any[];
};
export const resultState = atom<any>({
  key: "resultState",
  default: {
    surveyId: null,
    results: [],
  },
});
