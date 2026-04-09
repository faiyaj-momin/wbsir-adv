import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';
import { CASES } from '@/types/forms';
import type { CaseType } from '@/types/forms';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MAX_CASE_SELECTION, NOTICE_CASES, isCaseSelectionAllowed } from '@/lib/case-selection';

interface Step2CaseSelectionProps {
  selectedCases: CaseType[];
  onToggleCase: (caseId: CaseType) => void;
}

export function Step2CaseSelection({ selectedCases, onToggleCase }: Step2CaseSelectionProps) {
  const { t, language } = useLanguage();
  const hasNoticeSelection = selectedCases.some(c => NOTICE_CASES.includes(c));
  const hasAgeGapGt50 = selectedCases.includes('AGE_GAP_GT_50');
  const hasAgeGapLt15 = selectedCases.includes('AGE_GAP_LT_15');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {t('Select Applicable Cases', 'প্রযোজ্য কেস নির্বাচন করুন')}
      </h2>
      <p className="text-sm text-muted-foreground">
        {t('Select all cases that apply to your situation', 'আপনার পরিস্থিতিতে প্রযোজ্য সব কেস নির্বাচন করুন')}
      </p>
      <p className="text-sm text-muted-foreground">
        {t(
          'You may select up to 3 cases. Notice issues cannot be combined with other cases, and age-gap cases are mutually exclusive with each other, grandparent cases, and notice issues.',
          'আপনি সর্বোচ্চ ৩ টি কেস নির্বাচন করতে পারেন। নোটিশ কেসগুলি অন্য কেসের সাথে মিলিয়ে যায় না, এবং বয়সের ব্যবধান কেসগুলি একে অপর, দাদা-দাদি কেস এবং নোটিশ কেসের সাথে একসঙ্গে নির্বাচন করা যাবে না।'
        )}
      </p>

      <TooltipProvider>
        <div className="space-y-3">
          {CASES.map((caseItem) => {
            const isSelected = selectedCases.includes(caseItem.id);
            const isDisabled = !isSelected && !isCaseSelectionAllowed(caseItem.id, selectedCases);

            return (
              <div
                key={caseItem.id}
                className={`
                  flex items-start space-x-3 p-4 rounded-lg border transition-all
                  ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                  ${isDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                `}
                onClick={() => {
                  if (!isDisabled) onToggleCase(caseItem.id);
                }}
              >
                <Checkbox
                  id={caseItem.id}
                  checked={isSelected}
                  onCheckedChange={() => {
                    if (!isDisabled) onToggleCase(caseItem.id);
                  }}
                  disabled={isDisabled}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor={caseItem.id}
                      className="font-medium cursor-pointer"
                    >
                      {language === 'en' ? caseItem.label : caseItem.labelBn}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>{language === 'en' ? caseItem.description : caseItem.descriptionBn}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </TooltipProvider>

      {selectedCases.length === 0 && (
        <p className="text-sm text-amber-600">
          {t('Please select at least one case to proceed', 'অগ্রসর হতে কমপক্ষে একটি কেস নির্বাচন করুন')}
        </p>
      )}

      {selectedCases.length === MAX_CASE_SELECTION && (
        <p className="text-sm text-amber-600">
          {t('You have reached the maximum of 3 cases.', 'আপনি ৩টি কেসের সর্বোচ্চ সীমা পৌঁছেছেন।')}
        </p>
      )}

      {hasNoticeSelection && (
        <p className="text-sm text-amber-600">
          {t('Notice issues cannot be combined with any other case selection.', 'নোটিশ কেসগুলি অন্য কোনো কেসের সাথে একত্রে নির্বাচন করা যাবে না।')}
        </p>
      )}

      {(hasAgeGapGt50 || hasAgeGapLt15) && (
        <p className="text-sm text-amber-600">
          {hasAgeGapGt50
            ? t(
                'Age Gap > 50 cannot be combined with Age Gap < 15, Grandparent Age Gap < 40, or notice issues.',
                'বয়সের ব্যবধান > ৫০ কে Age Gap < 15, দাদা-দাদির বয়সের ব্যবধান < ৪০, অথবা নোটিশ কেসগুলির সাথে একত্রে নির্বাচন করা যাবে না।'
              )
            : t(
                'Age Gap < 15 cannot be combined with Age Gap > 50, Grandparent Age Gap < 40, or notice issues.',
                'বয়সের ব্যবধান < ১৫ কে Age Gap > 50, দাদা-দাদির বয়সের ব্যবধান < ৪০, অথবা নোটিশ কেসগুলির সাথে একত্রে নির্বাচন করা যাবে না।'
              )}
        </p>
      )}
    </div>
  );
}
