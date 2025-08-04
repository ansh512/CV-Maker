'use client';
import React from 'react';

function CVPreview({ data: cvData }) {
  if (!cvData) {
    return (
      <div className="text-center mt-8 text-gray-500">
        No data provided to preview.
      </div>
    );
  }

  const {
    personalDetails = {},
    objective = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = cvData;

  return (
    <div
      id="cv-preview"
      className="bg-white p-6 shadow-lg max-w-2xl mx-auto mt-8 text-black"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold uppercase">
          {(personalDetails.firstName || 'Your') + ' ' + (personalDetails.lastName || 'Name')}
        </h1>
        <p className="text-sm text-gray-600">
          {personalDetails.city || 'City'} | {personalDetails.phone || 'Phone'} | {personalDetails.email || 'Email'}
        </p>
      </header>

      {objective && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-1">Objective</h2>
          <hr className="mb-2 border-gray-400" />
          <p className="text-sm">{objective}</p>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-1">Education</h2>
          <hr className="mb-2 border-gray-400" />
          <table className="w-full text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-2 py-1 text-left">Degree</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Institution</th>
                <th className="border border-gray-300 px-2 py-1 text-left">CGPA/Percentage</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              {education.map((edu, index) => (
                <tr key={index} className="border-t border-gray-300">
                  <td className="border border-gray-300 px-2 py-1">{edu.degree || '—'}</td>
                  <td className="border border-gray-300 px-2 py-1">{edu.institution || '—'}</td>
                  <td className="border border-gray-300 px-2 py-1">{edu.cgpa || '—'}</td>
                  <td className="border border-gray-300 px-2 py-1 italic">{edu.duration || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-1">Experience</h2>
          <hr className="mb-2 border-gray-400" />
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold">{exp.company || 'Company'}</p>
                  <p className="text-sm italic">{exp.role || 'Role'}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="italic">{exp.duration || 'Duration'}</p>
                  <p>{exp.location || 'Location'}</p>
                </div>
              </div>
              {exp.responsibilities?.length > 0 && (
                <ul className="list-[circle] pl-5 mt-1 text-sm">
                  {exp.responsibilities.map((responsibility, i) => (
                    <li key={i} className="mb-1">{responsibility}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-1">Projects</h2>
          <hr className="mb-2 border-gray-400" />
          {projects.map((project, index) => (
            <div key={index} className="mb-2">
              <p className="text-sm font-semibold">
                {project.name || 'Project Name'} {project.contact && ` - ${project.contact}`}
              </p>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-1">Skills</h2>
          <hr className="mb-2 border-gray-400" />
          <ul className="text-sm list-disc pl-5">
            {skills.map((skill, index) => (
              <li key={index}>
                {skill.name || 'Skill'}: {skill.level || 'Level'}
              </li>
            ))}
          </ul>
        </section>
      )}

    </div>
  );
}

export default CVPreview;
