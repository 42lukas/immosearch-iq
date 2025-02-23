"use client";

import { useState, useRef } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiHeart,
  FiCheck,
  FiUpload,
} from "react-icons/fi";
import { 
  MdOutlineWork,
  MdEuroSymbol
 } from "react-icons/md";

 import Link from 'next/link';


// Beispiel-Navigation
function NavBar() {
  return (
    <nav className="w-full flex justify-between items-center bg-white shadow p-2">
      <Link href="/home">
        <div className="flex items-center">
          <img src="favicon.ico" className="w-20 h-20"/>
          <p className="m-5 text-blue-950 font-bold text-2xl">immosearch-IQ</p>
        </div>
      </Link>
      <div>
        <a
          href="#formSection"
          className="text-blue-950 font-bold text-xl transition"
        >
          Zum Formular
        </a>
      </div>
    </nav>
  );
}

export default function UserPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    address: "",
    occupation: "",
    employer: "",
    monthlyIncome: "",
    hobbies: [] as string[],
    additionalInfo: "",
  });

  const [resume, setResume] = useState<File | null>(null);       // Lebenslauf
  const [salaryProofs, setSalaryProofs] = useState<File[]>([]);  // Gehaltsnachweise
  const [otherFiles, setOtherFiles] = useState<File[]>([]);      // Sonstige Dokumente

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const salaryProofsInputRef = useRef<HTMLInputElement>(null);
  const otherFilesInputRef = useRef<HTMLInputElement>(null);

  // Angebotene Hobbies
  const hobbyOptions = ["Sport", "Kochen", "Lesen", "Reisen", "Musik", "Gaming"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHobbyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, hobbies: [...prev.hobbies, value] };
      } else {
        return {
          ...prev,
          hobbies: prev.hobbies.filter((hobby) => hobby !== value),
        };
      }
    });
  };

  const handleResumeClick = () => {
    resumeInputRef.current?.click();
  };
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSalaryProofsClick = () => {
    salaryProofsInputRef.current?.click();
  };
  const handleSalaryProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSalaryProofs(Array.from(e.target.files));
    }
  };

  const handleOtherFilesClick = () => {
    otherFilesInputRef.current?.click();
  };
  const handleOtherFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setOtherFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Hier Daten und Dateien an eine API senden:
    // z.B. mit FormData oder fetch
    console.log("Formulardaten:", formData);
    console.log("Lebenslauf:", resume);
    console.log("Gehaltsnachweise:", salaryProofs);
    console.log("Sonstige Dateien:", otherFiles);
    alert("Formular erfolgreich abgeschickt! Siehe Console für Details.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 to-blue-700">
      <NavBar />

      <header className="text-white flex flex-col items-center justify-center text-center py-20 px-4">
        <h1 className="text-4xl font-bold mb-4">Persönliche Infomrationen</h1>
        <p className="max-w-2xl mb-6">
          Fülle das folgende Formular aus, um dich für deine Wunschwohnung zu
          bewerben. Je mehr Informationen du bereitstellst, desto so höher die Wahrscheinlichkeit auf eine Zusage!
          <br />
          <br />
          Basierend auf diesen Daten wird schließlich eine Bewerbung zugeschnitten auf passende Wohnungen generiert und mit 
          anderen beigelegten Dateien an die Anbieter/innen der Wohnungen gesendet.
        </p>
        <a
          href="#formSection"
          className="bg-white text-blue-600 py-2 px-4 rounded-md shadow hover:bg-gray-200 transition"
        >
          Jetzt Formular ausfüllen
        </a>
      </header>

      {/* Hauptbereich mit Formular */}
      <main
        id="formSection"
        className="bg-white rounded-t-3xl shadow-2xl -mt-8 p-8 md:p-12 max-w-4xl mx-auto w-full"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Persönliche Daten
        </h2>

        {/* multipart/form-data nicht vergessen, wenn du Dateien hochlädst */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          {/* Grid für klassische Felder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vollständiger Name */}
            <div>
              <label className="text-gray-700 font-semibold mb-1 block">
                Vollständiger Name
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <FiUser className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Max Mustermann"
                  className="w-full focus:outline-none text-black"
                  required
                />
              </div>
            </div>

            {/* E-Mail-Adresse */}
            <div>
              <label className="text-gray-700 font-semibold mb-1 block">
                Email-Adresse
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <FiMail className="text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="max@mustermann.de"
                  className="w-full focus:outline-none text-black"
                  required
                />
              </div>
            </div>

            {/* Telefonnummer */}
            <div>
              <label className="text-gray-700 font-semibold mb-1 block">
                Telefonnummer
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <FiPhone className="text-gray-400 mr-2" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+49 123 456789"
                  className="w-full focus:outline-none text-black"
                  required
                />
              </div>
            </div>

            {/* Geburtsdatum */}
            <div>
              <label className="text-black font-semibold mb-1 block">
                Geburtsdatum
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <FiCalendar className="text-gray-400 mr-2" />
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full focus:outline-none text-black"
                  required
                />
              </div>
            </div>

            {/* Adresse */}
            <div className="md:col-span-2">
              <label className="text-gray-700 font-semibold mb-1 block">
                Aktuelle Adresse
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <FiMapPin className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Musterstraße 1, 12345 Musterstadt"
                  className="w-full focus:outline-none text-black"
                  required
                />
              </div>
            </div>

            {/* Beruf / Beschäftigung */}
            <div>
              <label className="text-gray-700 font-semibold mb-1 block">
                Beruf / Beschäftigungsstatus
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <FiBriefcase className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Softwareentwickler/in, Student/in, etc."
                  className="w-full focus:outline-none text-black"
                  required
                />
              </div>
            </div>

            {/* Arbeitgeber */}
            <div>
              <label className="text-gray-700 font-semibold mb-1 block">
                Arbeitgeber
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <FiBriefcase className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="employer"
                  value={formData.employer}
                  onChange={handleChange}
                  placeholder="Musterarbeitgeber"
                  className="w-full focus:outline-none text-black"
                  required
                />
              </div>
            </div>

            {/* Monatliches Einkommen */}
            <div className="md:col-span-2">
              <label className="text-gray-700 font-semibold mb-1 block">
                Monatliches Einkommen
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <MdEuroSymbol className="text-gray-400 mr-2" />
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  placeholder="2500"
                  className="w-full focus:outline-none text-black"
                  required
                />
              </div>
            </div>
          </div>

          {/* Hobbies */}
          <div>
            <label className="text-gray-700 font-semibold mb-2 block">
              Hobbies / Freizeitaktivitäten
            </label>
            <div className="flex flex-wrap gap-4">
              {hobbyOptions.map((hobby) => (
                <label key={hobby} className="flex items-center text-black">
                  <input
                    type="checkbox"
                    value={hobby}
                    checked={formData.hobbies.includes(hobby)}
                    onChange={handleHobbyChange}
                    className="mr-2"
                  />
                  {hobby}
                </label>
              ))}
            </div>
          </div>

          {/* Notwendige Dateien */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Notwendige Dateien</h2>

            {/* Lebenslauf (eine Datei) */}
            <div className="mb-4">
              <label className="text-gray-700 font-semibold mb-2 block">
                Lebenslauf
              </label>
              <button
                type="button"
                onClick={handleResumeClick}
                className="inline-flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
              >
                <FiUpload className="mr-2" />
                Lebenslauf hochladen
              </button>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                ref={resumeInputRef}
                onChange={handleResumeChange}
                className="hidden"
              />
              {resume && (
                <div className="flex items-center text-green-600 mt-2">
                  <FiCheck className="mr-1" />
                  <span>{resume.name}</span>
                </div>
              )}
            </div>

            {/* Gehaltsnachweise (mehrere Dateien) */}
            <div className="mb-4">
              <label className="text-gray-700 font-semibold mb-2 block">
                Gehaltsnachweise (mehrere Dateien)
              </label>
              <button
                type="button"
                onClick={handleSalaryProofsClick}
                className="inline-flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
              >
                <FiUpload className="mr-2" />
                Gehaltsnachweise hochladen
              </button>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                ref={salaryProofsInputRef}
                onChange={handleSalaryProofChange}
                className="hidden"
              />
              {salaryProofs.length > 0 && (
                <div className="mt-2 space-y-1">
                  {salaryProofs.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center text-green-600"
                    >
                      <FiCheck className="mr-1" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sonstige Dokumente (mehrere Dateien) */}
            <div className="mb-4">
              <label className="text-gray-700 font-semibold mb-2 block">
                Sonstige Dokumente (optional, mehrere Dateien)
              </label>
              <button
                type="button"
                onClick={handleOtherFilesClick}
                className="inline-flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
              >
                <FiUpload className="mr-2" />
                Sonstige Dokumente hochladen
              </button>
              <input
                type="file"
                multiple
                ref={otherFilesInputRef}
                onChange={handleOtherFilesChange}
                className="hidden"
              />
              {otherFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {otherFiles.map((file, index) => (
                    <div key={index} className="flex items-center text-green-600">
                      <FiCheck className="mr-1" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Absenden */}
          <button
            type="submit"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Absenden
          </button>
        </form>
      </main>
    </div>
  );
}