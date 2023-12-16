import { Timestamp } from "firebase/firestore";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface Survey {
  id: string;
  title: string;
  tagline: string;
  description: string;
  role: string;
  status: string;
}

export interface SurveyState {
  surveys: Survey[];
}

export interface RootSurveyState {
  survey: {
    surveys: Survey[];
  };
}

export interface Section {
  id: string;
  title: string;
}

export interface Subsection {
  id: string;
  title: string;
}

export interface Options {
  id?: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export interface Question {
  id?: string;
  sectionId?: string;
  subsectionId?:string;
  text: string;
  options: Options;
  timestamp?: Timestamp;
}

export interface Response {
  id: string;
  response: string;
  option: string;
  sectionId: string;
  subsectionId:string;
  surveyId: string;
  questionId: string;
}

export interface ClassifiedData {
  [sectionId: string]: {
    totalQuestions: number;
    totalMarks: number;
    obtainedMarks: number;
    responses: any[];
  };
}

export interface Recommendation {
  id?: string;
  from0to25?: string;
  from25to50: string;
  from50to75: string;
  from75to100: string;
}

export interface RecommendationData {
  id?: string;
  surveyId: string | null;
  sectionId: string;
  sectionTitle: string;
  recommendation: Recommendation | null;
  percentage?: number;
}
