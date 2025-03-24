"use client";
import Navbar, { NavLink } from '@/components/Navbar';
import { useState } from 'react';
import { FaHeart, FaUserEdit, FaInfoCircle } from 'react-icons/fa';

const faqs = [
  {
    question: "Was ist Immosearch-IQ?",
    answer: "Immosearch-IQ ist eine automatisierte Wohnungssuche, die passende Wohnungsangebote analysiert, bewertet und automatisch Bewerbungen erstellt.",
  },
  {
    question: "Wie funktioniert das Scoring-System?",
    answer: "Wohnungen werden basierend auf Preis, Zimmeranzahl, Größe und Lage automatisch bewertet und in einer Rangliste dargestellt.",
  },
  {
    question: "Welche Immobilienplattformen werden unterstützt?",
    answer: "Derzeit wird nur immowelt.de unterstützt. Weitere Plattformen könnten in zukünftigen Versionen hinzukommen.",
  },
  {
    question: "Wie kann ich eine Bewerbung erstellen?",
    answer: "Gib deine persönlichen Daten auf der User-Seite ein und definiere deine Wohnungspräferenzen. Das System generiert dann passende Bewerbungen.",
  },
  {
    question: "Welche Technologien nutzt Immosearch-IQ?",
    answer: "Das Projekt basiert auf Next.js mit React & TypeScript im Frontend, Node.js für das Backend und Cheerio/Axios für das Web Scraping.",
  },
  {
    question: "Gibt es Einschränkungen bei der Nutzung?",
    answer: "Ja, das Scraping öffentlicher Webseiten kann gegen deren Nutzungsbedingungen verstoßen. Immosearch-IQ ist nur für private Zwecke gedacht.",
  },
  {
    question: "Ich bekomme einen 'Hydration failed'-Fehler, was kann ich tun?",
    answer: "Einige Browser-Erweiterungen wie Grammarly oder LanguageTool können Hydration-Fehler verursachen. Deaktiviere sie für localhost.",
  },
  {
    question: "Kann ich Immosearch-IQ auf meinem Handy nutzen?",
    answer: "Die Web-App ist für den Desktop optimiert, kann aber auch auf mobilen Geräten genutzt werden. Manche Funktionen sind jedoch eingeschränkt.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const navLinks: NavLink[] = [
    {
      href: "/favorites",
      label: "Favorites",
      icon: FaHeart,
    },
    {
      href: "/user",
      label: "User",
      icon: FaUserEdit,
    },
    {
      href: "/about",
      label: "About",
      icon: FaInfoCircle,
    }
  ];

  return (
    <div className="relative bg-gray-900 text-white">
      <Navbar navLinks={navLinks} />

      <div className="container mx-auto py-16 px-8">
        <h1 className="text-6xl font-bold text-center mb-12">Häufig gestellte Fragen (FAQ)</h1>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-6">
              <button
                className="w-full text-left bg-gray-800 p-5 rounded-lg text-xl font-semibold flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span className="text-2xl">{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <div className="bg-gray-700 p-5 mt-2 rounded-lg text-gray-300">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}