"use client";

import { generateDocument } from "@/lib/template-utils";
import { TEMPLATES } from "@/lib/templates";
import { FormData } from "@/types/forms";
import { useState } from "react";

export default function Home() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);

    // const res = await fetch("/api/generate", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     basicDetails: {
    //       name: "Rahim",
    //       age: 30,
    //       fatherName: "Karim",
    //     },
    //     applicantComment:
    //       "My father's name changed from old record",
    //     district: "Malda",
    //     lang: "en",
    //   }),
    // });

    // const data = await res.json();
    const formData: FormData = {
      basicDetails: {
        fullName: "Rahim",
        fatherName: "Karim",
        motherName: "Karima",
        spouseName: "",
        gender: "male",
        dateOfBirth: "1990-01-01",
        address: "123 Street, Malda",
        district: "Malda",
      },
      dynamicFields: {
        nameMismatch: {
          nameOnDocument: "Rahim",
          nameOnSIR: "Rahim Uddin",
          isSelf: true,
        },
        multiplePaternityC: {
          brothersCount: 2,
          sistersCount: 1,
          parentType: "father",
        },
        ageOver50: {
          brothersCount: 2,
          sistersCount: 1,
          birthPosition: 3,
          parentType: "father",
          parentDoB: "1950-01-01",
          ageDifference: 40,
        },
        ageUnder15: {
          brothersCount: 2,
          sistersCount: 1,
          birthPosition: 3,
          parentType: "father",
          parentDoB: "2005-01-01",
          ageDifference: 20,  
        },
      },
      selectedCases: ["multiple_paternity_claims"],
      additionalFacts: "",
    }
    
    
    setOutput(generateDocument(formData.selectedCases[0], formData, TEMPLATES));
    setLoading(false);
  };

  return (
    <main className="p-4">
      <button
        onClick={handleGenerate}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Application"}
      </button>

      <pre className="mt-4 whitespace-pre-wrap">
        {output}
      </pre>
    </main>
  );
}