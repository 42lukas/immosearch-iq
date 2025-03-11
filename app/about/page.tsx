"use client";
import Navbar, { NavLink } from '@/components/Navbar';
import Link from 'next/link';
import { FaMapMarkedAlt, FaHeart, FaInfoCircle, FaUserEdit, FaQuestionCircle } from 'react-icons/fa';

export default function About() {

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
      <Navbar navLinks={navLinks} />

      <div className="flex h-full relative">
        <div className="flex-1 bg-gray-900 flex flex-col justify-center px-16">
          <h1 className="text-6xl font-bold mb-6 text-white">About Us</h1>
          <p className="text-lg text-gray-300">
            Wir sind Nasser und Lukas, zwei Informatik Studenten vom RKI. 
            Diese Website ist aus einem Projekt in der Uni entstanden.
          </p>
        </div>
  
        <div className="flex-1 bg-white flex justify-center items-center">
          <img
            src="/redHouses.png"
            alt="Bild"
            className="w-full h-full object-cover rounded-bl-lg"
          />
        </div>
      </div>


      <div className="bg-gray-900 flex">
        <div className='justify-start items-top p-20'>
          <img
            src="/code_img.png"
            alt="Bild"
            className="w-96 h-96 relative rounded-2xl"
          />
        </div>
        
        <div className='justify-center items-top pt-28'>
          <h1 className="text-6xl font-bold mb-6 text-white">GitHub und Code</h1>
          <p className='ps-3 text-gray-300 w-4/6'>
            Dieses Projekt ist ein OpenSource-Projekt. 
            Im folgenden GitHub repository ist eine Anleitung zur Nutzung der Website und Installation 
            benötigter Technologien.
          </p>
          <Link href={"https://github.com/42lukas/immosearch-iq"}>
            <span className='text-white font-bold ps-3 hover:underline'>https://github.com/42lukas/immosearch-iq</span>
          </Link>
          <br/>
          <p className='ps-3 text-gray-300 w-4/6'>
            Für Bugs, andere technische Probleme und Fragen melde dich gerne bei:
          </p>
          <span className='font-bold ps-3'>LukasEmail@gmail.com | NasserEmail@gmail.com</span>
        </div>

      </div>
      <footer className='h-1/3 bg-gray-900'>
        <div className='flex flex-col items-center pt-10'>
          <h1 className='text-5xl font-bold text-white'>immosearch-IQ</h1>
          <h1 className='text-4xl font-bold text-white'>Socials</h1>
          <div className='flex mt-10'>
            <a href={"https://tiktok.com"} target='_blank'>
              <img src='/tiktok_icon.png' className='w-16 h-16 mt-6' alt='TikTok'/>
            </a>
            <a href={"https://instagram.com"} target='_blank'>
              <img src='/insta_icon.png' className='w-16 h-16 mt-6 mx-14' alt='Instagram'/>
            </a>
            <a href={"https://x.com"} target='_blank'>
              <img src='/x_icon.png' className='w-16 h-16 mt-6 rounded-2xl' alt='X'/>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}