import { useState, useEffect, useCallback } from 'react';
import { emptyFormData } from '@/types/forms';
import type { FormData, FormStep, CaseType } from '@/types/forms';
import { isCaseSelectionAllowed, isCaseSelectionValid } from '@/lib/case-selection';

const STORAGE_KEY = 'multi-step-form-data';

export function useForm() {
  const [formData, setFormData] = useState<FormData>(emptyFormData);
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData || emptyFormData);
        setCurrentStep(parsed.currentStep || 1);
      } catch (e) {
        console.error('Failed to parse saved form data:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever form data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        formData,
        currentStep
      }));
    }
  }, [formData, currentStep, isLoaded]);

  const updateBasicDetails = useCallback((updates: Partial<FormData['basicDetails']>) => {
    setFormData(prev => ({
      ...prev,
      basicDetails: { ...prev.basicDetails, ...updates }
    }));
  }, []);

  const toggleCase = useCallback((caseId: CaseType) => {
    setFormData(prev => {
      const isAlreadySelected = prev.selectedCases.includes(caseId);
      if (!isAlreadySelected && !isCaseSelectionAllowed(caseId, prev.selectedCases)) {
        return prev;
      }

      const selectedCases = isAlreadySelected
        ? prev.selectedCases.filter(c => c !== caseId)
        : [...prev.selectedCases, caseId];

      // Clean up dynamic fields for unselected cases
      const dynamicFields = { ...prev.dynamicFields };
      if (!selectedCases.includes('SELF_NAME_MISMATCH')) {
        delete dynamicFields.selfNameMismatch;
      }
      if (!selectedCases.includes('PARENT_NAME_MISMATCH')) {
        delete dynamicFields.parentNameMismatch;
      }
      if (!selectedCases.includes('MULTIPLE_PATERNITY')) {
        delete dynamicFields.multiplePaternity;
      }
      if (!selectedCases.includes('AGE_GAP_GT_50')) {
        delete dynamicFields.ageGapGt50;
      }
      if (!selectedCases.includes('AGE_GAP_LT_15')) {
        delete dynamicFields.ageGapLt15;
      }
      if (!selectedCases.includes('GRANDPARENT_AGE_GAP_LT_40')) {
        delete dynamicFields.grandparentAgeGapLt40;
      }

      return { ...prev, selectedCases, dynamicFields };
    });
  }, []);

  const updateDynamicFields = useCallback((updates: Partial<FormData['dynamicFields']>) => {
    setFormData(prev => ({
      ...prev,
      dynamicFields: { ...prev.dynamicFields, ...updates }
    }));
  }, []);

  const updateAdditionalFacts = useCallback((additionalFacts: string) => {
    setFormData(prev => ({ ...prev, additionalFacts }));
  }, []);

  const goToStep = useCallback((step: FormStep) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 5) as FormStep);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1) as FormStep);
  }, []);

  const resetForm = useCallback(() => {
    setFormData(emptyFormData);
    setCurrentStep(1);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Validation helpers
  const isStep1Valid = useCallback(() => {
    const { fullName, fatherName, motherName, dateOfBirth } = formData.basicDetails;
    return fullName.trim() !== '' &&
      fatherName.trim() !== '' &&
      motherName?.trim() !== '' &&
      dateOfBirth !== ''
  }, [formData.basicDetails]);

  const isStep2Valid = useCallback(() => {
    return isCaseSelectionValid(formData.selectedCases);
  }, [formData.selectedCases]);

  const isStep3Valid = useCallback(() => {
    const { selectedCases, dynamicFields } = formData;

    if (selectedCases.includes('SELF_NAME_MISMATCH')) {
      if (!dynamicFields.selfNameMismatch?.nameOnDocument?.trim() ||
        !dynamicFields.selfNameMismatch?.nameOnSIR?.trim()) {
        return false;
      }
    }

    if (selectedCases.includes('PARENT_NAME_MISMATCH')) {
      if (!dynamicFields.parentNameMismatch?.parentNameOnDocument?.trim() ||
        !dynamicFields.parentNameMismatch?.parentNameOnSIR?.trim()) {
        return false;
      }
    }

    if (selectedCases.includes('MULTIPLE_PATERNITY')) {
      if (dynamicFields.multiplePaternity?.brothersCount === undefined ||
        dynamicFields.multiplePaternity?.sistersCount === undefined) {
        return false;
      }
    }

    if (selectedCases.includes('AGE_GAP_GT_50')) {
      if (dynamicFields.ageGapGt50?.brothersCount === undefined ||
        dynamicFields.ageGapGt50?.sistersCount === undefined ||
        dynamicFields.ageGapGt50?.birthPosition === undefined) {
        return false;
      }
    }

    if (selectedCases.includes('AGE_GAP_LT_15')) {
      if (dynamicFields.ageGapLt15?.brothersCount === undefined ||
        dynamicFields.ageGapLt15?.sistersCount === undefined ||
        dynamicFields.ageGapLt15?.birthPosition === undefined) {
        return false;
      }
    }

    if (selectedCases.includes('GRANDPARENT_AGE_GAP_LT_40')) {
      if (dynamicFields.grandparentAgeGapLt40?.brothersCount === undefined ||
        dynamicFields.grandparentAgeGapLt40?.sistersCount === undefined ||
        dynamicFields.grandparentAgeGapLt40?.birthPosition === undefined) {
        return false;
      }
    }

    return true;
  }, [formData]);

  return {
    formData,
    currentStep,
    isLoaded,
    updateBasicDetails,
    toggleCase,
    updateDynamicFields,
    updateAdditionalFacts,
    goToStep,
    nextStep,
    prevStep,
    resetForm,
    clearStorage,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid
  };
}