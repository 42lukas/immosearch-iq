"use client";

import Navbar, { NavLink } from '@/components/Navbar';
import { FaQuestionCircle, FaHeart, FaUserEdit } from 'react-icons/fa';

export default function About() {
  // Definiert die Navigationslinks für die Navbar
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
      href: "/faq",
      label: "FAQ",
      icon: FaQuestionCircle,
    }
  ];

  return (
    <div className="relative h-screen">
      {/* Navbar mit den definierten Links */}
      <Navbar navLinks={navLinks} />

      <div className="flex h-full relative">
        {/* Linke Seite: Textinhalt */}
        <div className="flex-1 bg-gray-900 flex flex-col justify-center px-16">
          <h1 className="text-6xl font-bold mb-6 text-white">About Us</h1>
          <p className="text-lg text-gray-300">
            Wir sind Nasser und Lukas, zwei Informatik Studenten vom RKI. 
            Diese Website ist aus einem Projekt in der Uni entstanden.
          </p>
        </div>
  
        {/* Rechte Seite: Bild */}
        <div className="flex-1 bg-white flex justify-center items-center">
          <img
            src="/redHouses.png"
            alt="Bild"
            className="w-full h-full object-cover rounded-bl-lg"
          />
        </div>
      </div>

      {/* Abschnitt: GitHub und Kontaktinformationen */}
      <div className="bg-gray-900 flex flex-col md:flex-row p-10">
        <div className="flex justify-start items-start p-4">
          <img
            src="/code_img.png"
            alt="Code Bild"
            className="w-96 h-96 rounded-2xl"
          />
        </div>
        
        <div className="flex flex-col justify-center items-start p-4">
          <h1 className="text-6xl font-bold mb-6 text-white">GitHub und Code</h1>
          <p className="text-gray-300 w-4/6">
            Dieses Projekt ist ein OpenSource-Projekt. Im folgenden GitHub Repository findest du eine Anleitung zur Nutzung der Website und Installation benötigter Technologien.
          </p>
            <a className="text-white font-bold" href="https://github.com/42lukas/immosearch-iq" target="_blank" rel="noopener noreferrer">
              https://github.com/42lukas/immosearch-iq
            </a>
          <p className="text-gray-300 w-4/6 mt-4">
            Für Bugs, andere technische Probleme und Fragen melde dich gerne bei:{" "}
            <span className="font-bold">LukasEmail@gmail.com | NasserEmail@gmail.com</span>
          </p>
          <span className='font-bold ps-3'>LukasEmail@gmail.com | NasserEmail@gmail.com</span>
        </div>
      </div>

      {/* Footer: Social Media Links */}
      <footer className="bg-gray-900 p-10">
        <div className="flex flex-col items-center pt-10">
          <h1 className="text-5xl font-bold text-white">immosearch-IQ</h1>
          <h1 className="text-4xl font-bold text-white">Socials</h1>
          <div className="flex mt-10 space-x-10">
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
              <img src="/tiktok_icon.png" className="w-16 h-16 mt-6" alt="TikTok" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="/insta_icon.png" className="w-16 h-16 mt-6" alt="Instagram" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              <img src="/x_icon.png" className="w-16 h-16 mt-6 rounded-2xl" alt="X" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
