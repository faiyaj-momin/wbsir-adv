import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';
import type { FormData, MultiplePaternityDetails } from '@/types/forms';
import { User, Users, Calendar } from 'lucide-react';

interface Step3DynamicFieldsProps {
  formData: FormData;
  onUpdate: (updates: Partial<FormData['dynamicFields']>) => void;
}

export function Step3DynamicFields({ formData, onUpdate }: Step3DynamicFieldsProps) {
  const { selectedCases, dynamicFields } = formData;
  const { t } = useLanguage();

  const calculateAgeDiff = (parentDoB: string, applicantDoB: string) => {
    if (!parentDoB || !applicantDoB) return 0;
    const pDate = new Date(parentDoB);
    const aDate = new Date(applicantDoB);
    let diff = aDate.getFullYear() - pDate.getFullYear();
    const mDiff = aDate.getMonth() - pDate.getMonth();
    if (mDiff < 0 || (mDiff === 0 && aDate.getDate() < pDate.getDate())) {
      diff--;
    }
    return diff;
  };

  const hasSelfNameMismatch = selectedCases.includes('SELF_NAME_MISMATCH');
  const hasParentNameMismatch = selectedCases.includes('PARENT_NAME_MISMATCH');
  const hasMultiplePaternity = selectedCases.includes('MULTIPLE_PATERNITY');
  const hasAgeGapGt50 = selectedCases.includes('AGE_GAP_GT_50');
  const hasAgeGapLt15 = selectedCases.includes('AGE_GAP_LT_15');
  const hasGrandparentAgeGapLt40 = selectedCases.includes('GRANDPARENT_AGE_GAP_LT_40');

  if (!hasSelfNameMismatch && !hasParentNameMismatch && !hasMultiplePaternity && !hasAgeGapGt50 && !hasAgeGapLt15 && !hasGrandparentAgeGapLt40) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {t('Additional Details', 'অতিরিক্ত বিবরণ')}
        </h2>
        <p className="text-muted-foreground">
          {t('No additional details required for the selected cases.', 'নির্বাচিত কেসগুলির জন্য কোনো অতিরিক্ত বিবরণ প্রয়োজন নেই।')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {t('Additional Details', 'অতিরিক্ত বিবরণ')}
      </h2>
      <p className="text-sm text-muted-foreground">
        {t('Please provide additional information based on your selected cases', 'আপনার নির্বাচিত কেসের ভিত্তিতে অতিরিক্ত তথ্য প্রদান করুন')}
      </p>

      {/* Self Name Mismatch Section */}
      {hasSelfNameMismatch && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-primary">
            <User className="w-5 h-5" />
            <h3 className="font-medium">{t('Self Name Mismatch Details', 'নিজের নামের অমিলের বিবরণ')}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="selfNameOnDocument">
                {t('Name on Document', 'নথিতে নাম')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="selfNameOnDocument"
                value={dynamicFields.selfNameMismatch?.nameOnDocument || ''}
                onChange={(e) => {
                  onUpdate({
                    selfNameMismatch: {
                      ...dynamicFields.selfNameMismatch,
                      nameOnSIR: dynamicFields.selfNameMismatch?.nameOnSIR || '',
                      nameOnDocument: e.target.value
                    }
                  });
                }}
                placeholder={t('Enter name as on document', 'নথিতে নাম লিখুন')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="selfNameOnSIR">
                {t('Name on SIR 2002', '2002 এস. আই. আর (SIR) এ নাম')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="selfNameOnSIR"
                value={dynamicFields.selfNameMismatch?.nameOnSIR || ''}
                onChange={(e) => {
                  onUpdate({
                    selfNameMismatch: {
                      ...dynamicFields.selfNameMismatch,
                      nameOnDocument: dynamicFields.selfNameMismatch?.nameOnDocument || '',
                      nameOnSIR: e.target.value
                    }
                  });
                }}
                placeholder={t('Enter name as on SIR 2002', '2002 এস. আই. আর (SIR) অনুযায়ী নাম লিখুন')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Parent Name Mismatch Section */}
      {hasParentNameMismatch && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-primary">
            <User className="w-5 h-5" />
            <h3 className="font-medium">{t('Parent Name Mismatch Details', 'পিতা-মাতার নামের অমিলের বিবরণ')}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentNameOnDocument">
                {t('Parent Name on Document', 'নথিতে পিতা-মাতার নাম')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="parentNameOnDocument"
                value={dynamicFields.parentNameMismatch?.parentNameOnDocument || ''}
                onChange={(e) => {
                  onUpdate({
                    parentNameMismatch: {
                      ...dynamicFields.parentNameMismatch,
                      parentNameOnSIR: dynamicFields.parentNameMismatch?.parentNameOnSIR || '',
                      parentNameOnDocument: e.target.value
                    }
                  });
                }}
                placeholder={t('Enter parent name as on document', 'নথিতে পিতা-মাতার নাম লিখুন')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentNameOnSIR">
                {t('Parent Name on SIR 2002', '2002 এস. আই. আর (SIR) এ পিতা-মাতার নাম')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="parentNameOnSIR"
                value={dynamicFields.parentNameMismatch?.parentNameOnSIR || ''}
                onChange={(e) => {
                  onUpdate({
                    parentNameMismatch: {
                      ...dynamicFields.parentNameMismatch,
                      parentNameOnDocument: dynamicFields.parentNameMismatch?.parentNameOnDocument || '',
                      parentNameOnSIR: e.target.value
                    }
                  });
                }}
                placeholder={t('Enter parent name as on SIR', 'এসআইআর অনুযায়ী পিতা-মাতার নাম লিখুন')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Multiple Paternity Section */}
      {hasMultiplePaternity && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-primary">
            <Users className="w-5 h-5" />
            <h3 className="font-medium">{t('Siblings Information', 'ভাইবোনের তথ্য')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentType-multiple">
                {t('Select Parent', 'পিতা/মাতা নির্বাচন করুন')}
              </Label>
              <select
                id="parentType-multiple"
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={dynamicFields.multiplePaternity?.parentType || 'father'}
                onChange={(e) => {
                  const current: MultiplePaternityDetails = dynamicFields.multiplePaternity || { brothersCount: 0, sistersCount: 0 };
                  onUpdate({
                    multiplePaternity: {
                      ...current,
                      parentType: e.target.value as any
                    }
                  });
                }}
              >
                <option value="father">{t('Father', 'পিতা')}</option>
                <option value="mother">{t('Mother', 'মাতা')}</option>
                <option value="other">{t('Other', 'অন্যান্য')}</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brothersCount">
                {t('Number of Brothers', 'ভাইয়ের সংখ্যা')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="brothersCount"
                type="number"
                min="0"
                value={dynamicFields.multiplePaternity?.brothersCount ?? ''}
                onChange={(e) => {
                  const current: MultiplePaternityDetails = dynamicFields.multiplePaternity || { brothersCount: 0, sistersCount: 0 };
                  onUpdate({
                    multiplePaternity: {
                      ...current,
                      brothersCount: parseInt(e.target.value) || 0
                    }
                  });
                }}
                placeholder={t('Enter number of brothers', 'ভাইয়ের সংখ্যা লিখুন')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sistersCount">
                {t('Number of Sisters', 'বোনের সংখ্যা')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="sistersCount"
                type="number"
                min="0"
                value={dynamicFields.multiplePaternity?.sistersCount ?? ''}
                onChange={(e) => {
                  const current: MultiplePaternityDetails = dynamicFields.multiplePaternity || { brothersCount: 0, sistersCount: 0 };
                  onUpdate({
                    multiplePaternity: {
                      ...current,
                      sistersCount: parseInt(e.target.value) || 0
                    }
                  });
                }}
                placeholder={t('Enter number of sisters', 'বোনের সংখ্যা লিখুন')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Age Gap > 50 Section */}
      {hasAgeGapGt50 && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-primary">
            <Calendar className="w-5 h-5" />
            <h3 className="font-medium">{t('Age Gap > 50 Details', '৫০ বছরের বেশি বয়সের ব্যবধানের তথ্য')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentType-50">
                {t('Select Parent', 'পিতা/মাতা নির্বাচন করুন')}
              </Label>
              <select
                id="parentType-50"
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={dynamicFields.ageGapGt50?.parentType || 'father'}
                onChange={(e) => {
                  onUpdate({
                    ageGapGt50: {
                      ...(dynamicFields.ageGapGt50 || { birthPosition: 1, brothersCount: 0, sistersCount: 0 }),
                      parentType: e.target.value as any
                    }
                  });
                }}
              >
                <option value="father">{t('Father', 'পিতা')}</option>
                <option value="mother">{t('Mother', 'মাতা')}</option>
                <option value="other">{t('Other', 'অন্যান্য')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentDoB-50">
                {t('Parent Date of Birth', 'পিতা/মাতার জন্ম তারিখ')}
              </Label>
              <Input
                id="parentDoB-50"
                type="date"
                value={dynamicFields.ageGapGt50?.parentDoB || ''}
                onChange={(e) => {
                  const dob = e.target.value;
                  const diff = calculateAgeDiff(dob, formData.basicDetails.dateOfBirth);
                  onUpdate({
                    ageGapGt50: {
                      ...(dynamicFields.ageGapGt50 || { birthPosition: 1, brothersCount: 0, sistersCount: 0 }),
                      parentDoB: dob,
                      ageDifference: diff
                    }
                  });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brothersCount-50">
                {t('Number of Brothers', 'ভাইয়ের সংখ্যা')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="brothersCount-50"
                type="number"
                min="0"
                value={dynamicFields.ageGapGt50?.brothersCount ?? ''}
                onChange={(e) => {
                  onUpdate({
                    ageGapGt50: {
                      ...(dynamicFields.ageGapGt50 || { birthPosition: 1, brothersCount: 0, sistersCount: 0 }),
                      brothersCount: parseInt(e.target.value) || 0
                    }
                  });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sistersCount-50">
                {t('Number of Sisters', 'বোনের সংখ্যা')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="sistersCount-50"
                type="number"
                min="0"
                value={dynamicFields.ageGapGt50?.sistersCount ?? ''}
                onChange={(e) => {
                  onUpdate({
                    ageGapGt50: {
                      ...(dynamicFields.ageGapGt50 || { birthPosition: 1, brothersCount: 0, sistersCount: 0 }),
                      sistersCount: parseInt(e.target.value) || 0
                    }
                  });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthPosition-50">
                {t('Your Birth Position', 'আপনার জন্ম ক্রম')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="birthPosition-50"
                type="number"
                min="1"
                value={dynamicFields.ageGapGt50?.birthPosition ?? ''}
                onChange={(e) => {
                  onUpdate({
                    ageGapGt50: {
                      ...(dynamicFields.ageGapGt50 || { birthPosition: 1, brothersCount: 0, sistersCount: 0 }),
                      birthPosition: parseInt(e.target.value) || 1
                    }
                  });
                }}
              />
            </div>

            {dynamicFields.ageGapGt50?.ageDifference !== undefined && (
              <div className="flex items-end pb-3">
                <div className="w-full p-2 bg-primary/10 rounded border border-primary/20">
                  <p className="text-sm font-medium">
                    {t('Age Difference:', 'বয়সের পার্থক্য:')} {dynamicFields.ageGapGt50.ageDifference} {t('years', 'বছর')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Age Gap < 15 Section */}
      {hasAgeGapLt15 && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-primary">
            <Calendar className="w-5 h-5" />
            <h3 className="font-medium">{t('Age Gap < 15 Details', '১৫ বছরের কম বয়সের ব্যবধানের তথ্য')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentType-15">
                {t('Select Parent', 'পিতা/মাতা নির্বাচন করুন')}
              </Label>
              <select
                id="parentType-15"
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={dynamicFields.ageGapLt15?.parentType || 'father'}
                onChange={(e) => {
                  onUpdate({
                    ageGapLt15: {
                      ...(dynamicFields.ageGapLt15 || { brothersCount: 0, sistersCount: 0, birthPosition: 1 }),
                      parentType: e.target.value as any
                    }
                  });
                }}
              >
                <option value="father">{t('Father', 'পিতা')}</option>
                <option value="mother">{t('Mother', 'মাতা')}</option>
                <option value="other">{t('Other', 'অন্যান্য')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentDoB-15">
                {t('Parent Date of Birth', 'পিতা/মাতার জন্ম তারিখ')}
              </Label>
              <Input
                id="parentDoB-15"
                type="date"
                value={dynamicFields.ageGapLt15?.parentDoB || ''}
                onChange={(e) => {
                  const dob = e.target.value;
                  const diff = calculateAgeDiff(dob, formData.basicDetails.dateOfBirth);
                  onUpdate({
                    ageGapLt15: {
                      ...(dynamicFields.ageGapLt15 || { brothersCount: 0, sistersCount: 0, birthPosition: 1 }),
                      parentDoB: dob,
                      ageDifference: diff
                    }
                  });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brothersCount-15">
                {t('Number of Brothers', 'ভাইয়ের সংখ্যা')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="brothersCount-15"
                type="number"
                min="0"
                value={dynamicFields.ageGapLt15?.brothersCount ?? ''}
                onChange={(e) => {
                  onUpdate({
                    ageGapLt15: {
                      ...(dynamicFields.ageGapLt15 || { brothersCount: 0, sistersCount: 0, birthPosition: 1 }),
                      brothersCount: parseInt(e.target.value) || 0
                    }
                  });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sistersCount-15">
                {t('Number of Sisters', 'বোনের সংখ্যা')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="sistersCount-15"
                type="number"
                min="0"
                value={dynamicFields.ageGapLt15?.brothersCount ?? ''}
                onChange={(e) => {
                  onUpdate({
                    ageGapLt15: {
                      ...(dynamicFields.ageGapLt15 || { brothersCount: 0, sistersCount: 0, birthPosition: 1 }),
                      sistersCount: parseInt(e.target.value) || 0
                    }
                  });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthPosition-15">
                {t('Your Birth Position', 'আপনার জন্ম ক্রম')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="birthPosition-15"
                type="number"
                min="1"
                value={dynamicFields.ageGapLt15?.birthPosition ?? ''}
                onChange={(e) => {
                  onUpdate({
                    ageGapLt15: {
                      ...(dynamicFields.ageGapLt15 || { brothersCount: 0, sistersCount: 0, birthPosition: 1 }),
                      birthPosition: parseInt(e.target.value) || 1
                    }
                  });
                }}
              />
            </div>

            {dynamicFields.ageGapLt15?.ageDifference !== undefined && (
              <div className="flex items-end pb-3">
                <div className="w-full p-2 bg-primary/10 rounded border border-primary/20">
                  <p className="text-sm font-medium">
                    {t('Age Difference:', 'বয়সের পার্থক্য:')} {dynamicFields.ageGapLt15.ageDifference} {t('years', 'বছর')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grandparent Age Gap < 40 Section */}
      {hasGrandparentAgeGapLt40 && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-primary">
            <Calendar className="w-5 h-5" />
            <h3 className="font-medium">{t('Grandparent Age Gap < 40 Details', 'দাদা-দাদির বয়সের ব্যবধান < ৪০ এর তথ্য')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grandparentType">
                {t('Select Grandparent', 'দাদা-দাদি নির্বাচন করুন')}
              </Label>
              <select
                id="grandparentType"
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={dynamicFields.grandparentAgeGapLt40?.grandparentType || 'grandfather'}
                onChange={(e) => {
                  onUpdate({
                    grandparentAgeGapLt40: {
                      ...(dynamicFields.grandparentAgeGapLt40 || { birthPosition: 1, brothersCount: 0, sistersCount: 0 }),
                      grandparentType: e.target.value as any
                    }
                  });
                }}
              >
                <option value="grandfather">{t('Grandfather', 'দাদা')}</option>
                <option value="grandmother">{t('Grandmother', 'দাদি')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grandparentDoB">
                {t('Grandparent Date of Birth', 'দাদা-দাদির জন্ম তারিখ')}
              </Label>
              <Input
                id="grandparentDoB"
                type="date"
                value={dynamicFields.grandparentAgeGapLt40?.grandparentDoB || ''}
                onChange={(e) => {
                  const dob = e.target.value;
                  const diff = calculateAgeDiff(dob, formData.basicDetails.dateOfBirth);
                  onUpdate({
                    grandparentAgeGapLt40: {
                      ...(dynamicFields.grandparentAgeGapLt40 || { birthPosition: 1, brothersCount: 0, sistersCount: 0 }),
                      grandparentDoB: dob,
                      ageDifference: diff
                    }
                  });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brothersCount-grandparent">
                {t('Number of Brothers', 'ভাইয়ের সংখ্যা')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="brothersCount-grandparent"
                type="number"
                min="0"
                value={dynamicFields.grandparentAgeGapLt40?.brothersCount ?? ''}
                onChange={(e) => {
                  onUpdate({
                    grandparentAgeGapLt40: {
                      ...(dynamicFields.grandparentAgeGapLt40 || { birthPosition: 1, brothersCount: 0, sistersCount: 0 }),
                      brothersCount: parseInt(e.target.value) || 0
                    }
                  });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sistersCount-grandparent">
                {t('Number of Sisters', 'বোনের সংখ্যা')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="sistersCount-grandparent"
                type="number"
                min="0"
                value={dynamicFields.grandparentAgeGapLt40?.sistersCount ?? ''}
                onChange={(e) => {
                  onUpdate({
                    grandparentAgeGapLt40: {
                      ...(dynamicFields.grandparentAgeGapLt40 || { birthPosition: 1, brothersCount: 0, sistersCount: 0 }),
                      sistersCount: parseInt(e.target.value) || 0
                    }
                  });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthPosition-grandparent">
                {t('Your Birth Position', 'আপনার জন্ম ক্রম')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="birthPosition-grandparent"
                type="number"
                min="1"
                value={dynamicFields.grandparentAgeGapLt40?.birthPosition ?? ''}
                onChange={(e) => {
                  onUpdate({
                    grandparentAgeGapLt40: {
                      ...(dynamicFields.grandparentAgeGapLt40 || { birthPosition: 1, brothersCount: 0, sistersCount: 0 }),
                      birthPosition: parseInt(e.target.value) || 1
                    }
                  });
                }}
              />
            </div>

            {dynamicFields.grandparentAgeGapLt40?.ageDifference !== undefined && (
              <div className="flex items-end pb-3">
                <div className="w-full p-2 bg-primary/10 rounded border border-primary/20">
                  <p className="text-sm font-medium">
                    {t('Age Difference:', 'বয়সের পার্থক্য:')} {dynamicFields.grandparentAgeGapLt40.ageDifference} {t('years', 'বছর')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
