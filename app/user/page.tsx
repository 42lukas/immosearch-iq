"use client";

import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
} from "react-icons/fi";
import { MdEuroSymbol } from "react-icons/md";
import Link from 'next/link';

function NavBar() {
  return (
    <nav className="w-full flex justify-between items-center bg-white shadow p-4">
      <div className="text-xl font-bold text-blue-600">
        Meine persönlichen Daten
      </div>
      <Link href={"/home"} className="text-xl font-bold text-blue-600">
        immosearch-IQ
      </Link>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-gray-100 text-center py-4 mt-auto">
      <p className="text-gray-500">
        © {new Date().getFullYear()} - immosearch-IQ
      </p>
    </footer>
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
    monthlyIncome: "",
    hobbies: [] as string[],
    additionalInfo: "",
  });

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Formulardaten:", formData);
    alert("Formular erfolgreich abgeschickt! Siehe Console für Details.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 to-blue-700">
      <NavBar />

      <header className="text-white flex flex-col items-center justify-center text-center py-20 px-4">
        <h1 className="text-4xl font-bold mb-4">Willkommen!</h1>
        <p className="max-w-2xl mb-6">
          Fülle einfach das folgende Formular aus, um dich für deine Wunschwohnung
          zu bewerben. Je mehr Informationen du bereitstellst, desto besser sind
          deine Chancen auf eine Zusage! Basierend auf diesen Daten wird immosearch-IQ
          eine passende Bewerbung zu den besten Inseraten fomrulieren. 
        </p>
        <a
          href="#formSection"
          className="bg-white text-blue-600 py-2 px-4 rounded-md shadow hover:bg-gray-200 transition"
        >
          Jetzt Formular ausfüllen
        </a>
      </header>

      <main
        id="formSection"
        className="bg-white rounded-t-3xl shadow-2xl -mt-8 p-8 md:p-12 max-w-4xl mx-auto w-full"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Persönliche Daten
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
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
                  className="w-full focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="relative">
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
                  className="w-full focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="relative">
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
                  className="w-full focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-gray-700 font-semibold mb-1 block">
                Geburtsdatum
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <FiCalendar className="text-gray-400 mr-2" />
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="relative md:col-span-2">
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
                  className="w-full focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="relative">
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
                  className="w-full focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="relative">
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
                  className="w-full focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-gray-700 font-bold mb-2 block">
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

          <div>
            <label className="text-gray-700 font-semibold mb-1 block">
              Weitere Informationen (optional)
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows={4}
              placeholder="Hier kannst du weitere Details, Interessen oder persönliche Anliegen erwähnen."
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Speichern
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}