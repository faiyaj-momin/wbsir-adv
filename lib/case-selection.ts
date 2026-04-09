import type { CaseType } from '@/types/forms';

export const MAX_CASE_SELECTION = 3;
export const NOTICE_CASES: CaseType[] = ['NOTICE_NOT_SERVED', 'NOTICE_INCOMPLETE'];

const AGE_GAP_GT_50_CONFLICTS: CaseType[] = [
  'AGE_GAP_LT_15',
  'GRANDPARENT_AGE_GAP_LT_40',
  ...NOTICE_CASES,
];

const AGE_GAP_LT_15_CONFLICTS: CaseType[] = [
  'AGE_GAP_GT_50',
  'GRANDPARENT_AGE_GAP_LT_40',
  ...NOTICE_CASES,
];

const GRANDPARENT_AGE_GAP_LT_40_CONFLICTS: CaseType[] = [
  'AGE_GAP_GT_50',
  'AGE_GAP_LT_15',
  ...NOTICE_CASES,
];

export function isCaseSelectionAllowed(caseId: CaseType, selectedCases: CaseType[]) {
  if (selectedCases.includes(caseId)) return true;
  if (selectedCases.length >= MAX_CASE_SELECTION) return false;

  const hasNoticeSelected = selectedCases.some(c => NOTICE_CASES.includes(c));
  const isNoticeCase = NOTICE_CASES.includes(caseId);

  if (hasNoticeSelected || isNoticeCase) {
    return false;
  }

  if (caseId === 'AGE_GAP_GT_50') {
    return !selectedCases.some(c => AGE_GAP_GT_50_CONFLICTS.includes(c));
  }

  if (caseId === 'AGE_GAP_LT_15') {
    return !selectedCases.some(c => AGE_GAP_LT_15_CONFLICTS.includes(c));
  }

  if (caseId === 'GRANDPARENT_AGE_GAP_LT_40') {
    return !selectedCases.some(c => GRANDPARENT_AGE_GAP_LT_40_CONFLICTS.includes(c));
  }

  return true;
}

export function isCaseSelectionValid(selectedCases: CaseType[]) {
  if (selectedCases.length === 0 || selectedCases.length > MAX_CASE_SELECTION) {
    return false;
  }

  const hasNoticeSelected = selectedCases.some(c => NOTICE_CASES.includes(c));
  if (hasNoticeSelected && selectedCases.length > 1) {
    return false;
  }

  if (selectedCases.includes('AGE_GAP_GT_50')) {
    if (selectedCases.some(c => AGE_GAP_GT_50_CONFLICTS.includes(c))) {
      return false;
    }
  }

  if (selectedCases.includes('AGE_GAP_LT_15')) {
    if (selectedCases.some(c => AGE_GAP_LT_15_CONFLICTS.includes(c))) {
      return false;
    }
  }

  if (selectedCases.includes('GRANDPARENT_AGE_GAP_LT_40')) {
    if (selectedCases.some(c => GRANDPARENT_AGE_GAP_LT_40_CONFLICTS.includes(c))) {
      return false;
    }
  }

  return true;
}
