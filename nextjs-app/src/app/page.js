// app/page.js

'use client';
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Progress from '../app/component/stepper';
import Form from '../app/component/form';
import Objective from '../app/component/obj';
import Experience from '../app/component/exp';
import Education from '../app/component/edu';
import CVPreview from '../app/component/template';
import ProjectForm from '../app/component/proj';
import SkillForm from '../app/component/skill';

function Home() {
  const [step, setStep] = useState(0);
  const [cvData, setCvData] = useState({
    personalDetails: {},
    objective: '',
    experience: [],
    education: [],
    projects: [],
    skills: []
  });
  const [isFinished, setIsFinished] = useState(false);
  const previewRef = useRef(null);

  const validateStep = () => {
    switch (step) {
      case 0: {
        const required = ['firstName', 'lastName', 'email', 'phone', 'city', 'linkedin', 'website'];
        const details = cvData.personalDetails || {};
        return required.every(key => details[key] && details[key].trim() !== '');
      }
      case 1:
        return cvData.objective && cvData.objective.trim() !== '';
      case 2:
        return cvData.experience.length > 0;
      case 3:
        return cvData.education.length > 0;
      case 4:
        return cvData.projects.length > 0;
      case 5:
        case 5:
        return cvData.skills.some(skill => skill.name && skill.level);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      alert('Please complete all required fields before proceeding.');
      return;
    }

    if (step < 6) {
      setStep(prevStep => prevStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(prevStep => prevStep - 1);
    }
  };

  const handleFinish = async () => {
    if (previewRef.current) {
      const canvas = await html2canvas(previewRef.current);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('cv.pdf');
    }

    setIsFinished(true);
    console.log("Form completed!", cvData);
  };

  const testHuggingFace = async () => {
    const res = await fetch('/api/huggingface', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `<|im_start|>user\nSummarize this: The French Revolution began in 1789...\n<|im_end|>\n<|im_start|>assistant`
      })
    });

    const data = await res.json();
    console.log(data[0]?.generated_text || data);
  };

  useEffect(() => {
    testHuggingFace();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 relative">
      {isFinished ? (
        <div ref={previewRef}>
          <CVPreview data={cvData} />
        </div>
      ) : (
        <>
          <div className="w-full max-w-3xl px-4 pb-40 mt-4">
            <div className="flex justify-center">
              <Progress step={step} />
            </div>
            {step === 0 && (
              <Form
                data={cvData.personalDetails}
                setData={data => setCvData(prev => ({ ...prev, personalDetails: data }))}
              />
            )}
            {step === 1 && (
              <Objective
                data={cvData.objective}
                setData={data => setCvData(prev => ({ ...prev, objective: data }))}
              />
            )}
            {step === 2 && (
              <Experience
                data={cvData.experience}
                setData={data => setCvData(prev => ({ ...prev, experience: data }))}
              />
            )}
            {step === 3 && (
              <Education
                data={cvData.education}
                setData={data => setCvData(prev => ({ ...prev, education: data }))}
              />
            )}
            {step === 4 && (
              <ProjectForm
                data={cvData.projects}
                setData={data => setCvData(prev => ({ ...prev, projects: data }))}
              />
            )}
            {step === 5 && (
              <SkillForm
                data={cvData}
                setData={setCvData}
              />
            )}
            {step === 6 && (
              <div ref={previewRef}>
                <CVPreview data={cvData} />
              </div>
            )}
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-white shadow-md py-4 px-8 z-50">
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
                disabled={step === 0}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {step === 6 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
