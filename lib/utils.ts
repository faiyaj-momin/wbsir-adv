import { FormData } from "@/types/forms";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function injectTemplate(template: string, data: any) {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    return data[key.trim()] ?? "";
  });
}

function shouldUseTemplate(form: FormData) {
  return form.selectedCases.length === 1;
}

