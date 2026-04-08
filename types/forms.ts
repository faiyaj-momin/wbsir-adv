// Form types and interfaces

export type CaseType =
  | 'multiple_paternity_claims'
  | 'name_mismatch'
  | 'father_name_mismatch'
  | 'age_over_50'
  | 'age_under_15';

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

export interface NameMismatchDetails {
  nameOnDocument: string;
  nameOnSIR: string;
  isSelf?: boolean;
  isFather?: boolean;
}

export interface MultiplePaternityClaimsDetails {
  brothersCount: number;
  sistersCount: number;
  parentType?: 'father' | 'mother' | 'other';
}

export interface AgeOver50Details {
  brothersCount: number;
  sistersCount: number;
  birthPosition: number;
  parentType?: 'father' | 'mother' | 'other';
  parentDoB?: string;
  ageDifference?: number;
}

export interface AgeUnder15Details {
  brothersCount: number;
  sistersCount: number;
  birthPosition: number;
  parentType?: 'father' | 'mother' | 'other';
  parentDoB?: string;
  ageDifference?: number;
}

export interface DynamicFields {
  nameMismatch?: NameMismatchDetails;
  multiplePaternityC?: MultiplePaternityClaimsDetails;
  ageOver50?: AgeOver50Details;
  ageUnder15?: AgeUnder15Details;
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
    id: 'multiple_paternity_claims',
    label: 'Multiple Paternity Claims',
    labelBn: 'একাধিক পিতৃত্ব দাবি',
    description: 'When one person is claimed as father by multiple children',
    descriptionBn: 'যখন একজন ব্যক্তিকে একাধিক সন্তান তাদের পিতা হিসাবে দাবি করে'
  },
  {
    id: 'name_mismatch',
    label: 'Name Mismatch',
    labelBn: 'নামের অমিল',
    description: 'When name on documents differs from NID',
    descriptionBn: 'যখন নথিতে নাম ও জাতীয় পরিচয়পত্রের নাম ভিন্ন হয়'
  },
  {
    id: 'age_over_50',
    label: 'Age > 50',
    labelBn: 'বয়স > ৫০',
    description: 'When applicant age is over 50 years',
    descriptionBn: 'যখন আবেদনকারীর বয়স ৫০ বছরের বেশি'
  },
  {
    id: 'age_under_15',
    label: 'Age < 15',
    labelBn: 'বয়স < ১৫',
    description: 'When applicant age is under 15 years',
    descriptionBn: 'যখন আবেদনকারীর বয়স ১৫ বছরের কম'
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
