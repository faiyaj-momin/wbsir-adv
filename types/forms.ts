// Form types and interfaces

export type CaseType =
  | 'AGE_GAP_GT_50'
  | 'AGE_GAP_LT_15'
  | 'GRANDPARENT_AGE_GAP_LT_40'
  | 'MULTIPLE_PATERNITY'
  | 'PARENT_NAME_MISMATCH'
  | 'SELF_NAME_MISMATCH'
  | 'NOTICE_NOT_SERVED'
  | 'NOTICE_INCOMPLETE';


export interface CaseInfo {
  id: CaseType;
  label: string;
  labelBn: string;
  description: string;
  descriptionBn: string;
}

export interface BasicDetails {
  fullName: string;
  fatherName: string;
  motherName?: string;
  spouseName?: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  district: string;
}

export interface SelfNameMismatchDetails {
  nameOnDocument: string;
  nameOnSIR: string;
}

export interface ParentNameMismatchDetails {
  parentNameOnDocument: string;
  parentNameOnSIR: string;
}

export interface MultiplePaternityDetails {
  brothersCount: number;
  sistersCount: number;
  parentType?: 'father' | 'mother' | 'other';
}

export interface AgeGapGt50Details {
  brothersCount: number;
  sistersCount: number;
  birthPosition: number;
  parentType?: 'father' | 'mother' | 'other';
  parentDoB?: string;
  ageDifference?: number;
}

export interface AgeGapLt15Details {
  brothersCount: number;
  sistersCount: number;
  birthPosition: number;
  parentType?: 'father' | 'mother' | 'other';
  parentDoB?: string;
  ageDifference?: number;
}

export interface GrandparentAgeGapLt40Details {
  brothersCount: number;
  sistersCount: number;
  birthPosition: number;
  grandparentType?: 'grandfather' | 'grandmother';
  grandparentDoB?: string;
  ageDifference?: number;
}

export interface DynamicFields {
  selfNameMismatch?: SelfNameMismatchDetails;
  parentNameMismatch?: ParentNameMismatchDetails;
  multiplePaternity?: MultiplePaternityDetails;
  ageGapGt50?: AgeGapGt50Details;
  ageGapLt15?: AgeGapLt15Details;
  grandparentAgeGapLt40?: GrandparentAgeGapLt40Details;
}

export interface FormData {
  basicDetails: BasicDetails;
  selectedCases: CaseType[];
  dynamicFields: DynamicFields;
  additionalFacts: string;
}

export type FormStep = 1 | 2 | 3 | 4 | 5;

export const CASES: CaseInfo[] = [
  {
    id: 'MULTIPLE_PATERNITY',
    label: 'Multiple Paternity',
    labelBn: 'একাধিক পিতৃত্ব',
    description: 'When one person is claimed as father by multiple children',
    descriptionBn: 'যখন একজন ব্যক্তিকে একাধিক সন্তান তাদের পিতা হিসাবে দাবি করে'
  },
  {
    id: 'SELF_NAME_MISMATCH',
    label: 'Self Name Mismatch',
    labelBn: 'নিজের নামের অমিল',
    description: 'When name on documents differs from NID',
    descriptionBn: 'যখন নথিতে নাম ও জাতীয় পরিচয়পত্রের নাম ভিন্ন হয়'
  },
  {
    id: 'PARENT_NAME_MISMATCH',
    label: 'Parent Name Mismatch',
    labelBn: 'পিতা-মাতার নামের অমিল',
    description: 'When parent name on documents differs from records',
    descriptionBn: 'যখন পিতা-মাতার নাম নথিতে রেকর্ড থেকে ভিন্ন হয়'
  },
  {
    id: 'AGE_GAP_GT_50',
    label: 'Age Gap > 50',
    labelBn: 'বয়সের ব্যবধান > ৫০',
    description: 'When applicant age is over 50 years',
    descriptionBn: 'যখন আবেদনকারীর বয়স ৫০ বছরের বেশি'
  },
  {
    id: 'AGE_GAP_LT_15',
    label: 'Age Gap < 15',
    labelBn: 'বয়সের ব্যবধান < ১৫',
    description: 'When applicant age is under 15 years',
    descriptionBn: 'যখন আবেদনকারীর বয়স ১৫ বছরের কম'
  },
  {
    id: 'GRANDPARENT_AGE_GAP_LT_40',
    label: 'Grandparent Age Gap < 40',
    labelBn: 'দাদা-দাদির বয়সের ব্যবধান < ৪০',
    description: 'When grandparent age gap is less than 40 years',
    descriptionBn: 'যখন দাদা-দাদির বয়সের ব্যবধান ৪০ বছরের কম'
  },
  {
    id: 'NOTICE_NOT_SERVED',
    label: 'Notice Not Served',
    labelBn: 'নোটিশ পরিবেশিত হয়নি',
    description: 'When notice has not been properly served',
    descriptionBn: 'যখন নোটিশ সঠিকভাবে পরিবেশিত হয়নি'
  },
  {
    id: 'NOTICE_INCOMPLETE',
    label: 'Notice Incomplete',
    labelBn: 'নোটিশ অসম্পূর্ণ',
    description: 'When the notice is incomplete',
    descriptionBn: 'যখন নোটিশ অসম্পূর্ণ'
  }
];

export const emptyFormData: FormData = {
  basicDetails: {
    fullName: '',
    fatherName: '',
    motherName: '',
    spouseName: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    district: '',
  },
  selectedCases: [],
  dynamicFields: {},
  additionalFacts: ''
};
