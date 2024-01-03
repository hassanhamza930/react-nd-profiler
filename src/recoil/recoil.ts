import { atom } from 'recoil';
export const surveyState = atom<any>({
    key: 'surveyState',
    default: {
      surveyId: null,
      sections: [],
    },
  });

type resultState={
    surveyId:number | null;
    resutls:any[]
}
  export const resultState = atom<any>({
    key: 'resultState',
    default: {
      surveyId: null,
      results: [],
    },
  });