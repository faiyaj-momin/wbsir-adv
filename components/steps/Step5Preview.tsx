import { useLanguage } from '@/context/LanguageContext';
import { CASES } from '@/types/forms';
import type { FormData, CaseType } from '@/types/forms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, FileText, Users, Calendar, AlertCircle, CheckCircle, RotateCcw, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AppealDocument } from '@/components/appeal-document';
import { TEMPLATES } from '@/lib/templates';
import { AIPipelineResult } from '@/lib/aiPipeline';

interface Step5PreviewProps {
  formData: FormData;
}

export function Step5Preview({ formData }: Step5PreviewProps) {

  // console.log(JSON.stringify(Object.values(TEMPLATES).map(t => t).join("\n\n")))

  const { t, language } = useLanguage();
  const { basicDetails, selectedCases } = formData;

  const [appealText, setAppealText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const generateAppeal = async () => {
      if (selectedCases.length === 0) {
        setAppealText('');
        setErrorMessage(null);
        setIsGenerating(false);
        return;
      }

      setIsGenerating(true);
      setErrorMessage(null);

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const json = (await response.json()) as {
          success: boolean;
          data?: AIPipelineResult;
          error?: string;
        };

        if (!response.ok || !json.success) {
          throw new Error(json.error || 'Failed to generate appeal application.');
        }

        if (!isActive) return;

        console.log('Generated appeal text:', json.data);
        setAppealText(json.data?.finalDoc?.trim() ?? '');
      } catch (error) {
        if (!isActive) return;
        const message = error instanceof Error ? error.message : 'Unable to generate appeal application.';
        setErrorMessage(message);
        setAppealText('');
      } finally {
        if (isActive) {
          setIsGenerating(false);
        }
      }
    };

    generateAppeal();

    return () => {
      isActive = false;
    };
  }, [formData, selectedCases.length]);

  const hasAppealText = !isGenerating && appealText.trim().length > 0;

  const getCaseLabel = (caseId: CaseType) => {
    const caseItem = CASES.find(c => c.id === caseId);
    return language === 'en' ? caseItem?.label : caseItem?.labelBn;
  };

  const getCaseIcon = (caseId: CaseType) => {
    switch (caseId) {
      case 'name_mismatch':
        return <User className="w-4 h-4" />;
      case 'multiple_paternity_claims':
        return <Users className="w-4 h-4" />;
      case 'age_over_50':
      case 'age_under_15':
        return <Calendar className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleRegenerate = async () => {
    if (selectedCases.length === 0) return;

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const json = (await response.json()) as {
        success: boolean;
        data?: { finalDoc: string };
        error?: string;
      };

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to regenerate appeal application.');
      }
      console.log('Regenerated appeal text:', {...json.data},);
      setAppealText(json.data?.finalDoc?.trim() ?? '');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to regenerate appeal application.';
      setErrorMessage(message);
      setAppealText('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {t('Application Preview', 'আবেদন প্রিভিউ')}
      </h2>
      <p className="text-sm text-muted-foreground">
        {t('Review your generated appeal letter', 'আপনার তৈরি আবেদন পত্র পর্যালোচনা করুন')}
      </p>

      {/* Basic Details Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            {t('Personal Information', 'ব্যক্তিগত তথ্য')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">{t('Full Name:', 'পূর্ণ নাম:')}</span>
              <p className="font-medium">{basicDetails.fullName || '-'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t('Date of Birth:', 'জন্ম তারিখ:')}</span>
              <p className="font-medium">{basicDetails.dateOfBirth || '-'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t("Father's Name:", 'পিতার নাম:')}</span>
              <p className="font-medium">{basicDetails.fatherName || '-'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t("Mother's Name:", 'মাতার নাম:')}</span>
              <p className="font-medium">{basicDetails.motherName || '-'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t("Spouse Name:", 'স্বামী/স্ত্রীর নাম:')}</span>
              <p className="font-medium">{basicDetails.spouseName || '-'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t('Gender:', 'লিঙ্গ:')}</span>
              <p className="font-medium">
                {basicDetails.gender 
                  ? (basicDetails.gender === 'male' ? t('Male', 'পুরুষ') : t('Female', 'মহিলা')) 
                  : '-'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">{t('District:', 'জেলা:')}</span>
              <p className="font-medium">{basicDetails.district || '-'}</p>
            </div>

            {basicDetails.address && (
              <div className="sm:col-span-2">
                <span className="text-muted-foreground">{t('Address:', 'ঠিকানা:')}</span>
                <p className="font-medium">{basicDetails.address}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Cases Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {t('Selected Cases', 'নির্বাচিত কেস')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {selectedCases.map((caseId) => (
              <Badge key={caseId} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                {getCaseIcon(caseId as CaseType)}
                {getCaseLabel(caseId as CaseType)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Appeal Letter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between no-print">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {t('Generated Appeal Letter', 'তৈরি আবেদন পত্র')}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            disabled={isGenerating || selectedCases.length === 0}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            {isGenerating
              ? t('Regenerating...', 'পুনরায় তৈরি হচ্ছে...')
              : t('Regenerate', 'পুনরায় তৈরি')
            }
          </Button>
        </div>

        {errorMessage ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
            <p className="text-rose-800 font-medium">{errorMessage}</p>
          </div>
        ) : isGenerating ? (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <div className="absolute inset-0 w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <p className="text-blue-800 font-semibold text-lg">
                  {t('Generating Appeal Application', 'আবেদন পত্র তৈরি করা হচ্ছে')}
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  {t('Please wait while we create your personalized appeal letter...', 'আপনার ব্যক্তিগত আবেদন পত্র তৈরি করার জন্য অনুগ্রহ করে অপেক্ষা করুন...')}
                </p>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        ) : appealText.trim().length > 0 ? (
          <AppealDocument
            content={appealText}
            applicantName={basicDetails.fullName}
            district={basicDetails.district}
            caseType={selectedCases[0] || 'name_mismatch'}
          />
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 font-medium">
              {t(
                'Please fill all required fields to generate your appeal letter.',
                'আপনার আবেদন পত্র তৈরি করতে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন।'
              )}
            </p>
          </div>
        )}
      </div>

      {/* Success Message */}
      {appealText.trim().length > 0 && !isGenerating && !errorMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg no-print">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <p className="font-medium">
              {t('Your appeal letter is ready!', 'আপনার আবেদন পত্র প্রস্তুত!')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}