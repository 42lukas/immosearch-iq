import Link from 'next/link';

export default function About() {
  return (
    <div className="relative h-screen">
      <div className="absolute top-0 left-0 w-full z-10 p-5">
        <div className="w-full flex justify-between items-center rounded-md px-10 py-3 bg-white shadow-md">
          <Link href="/" className="text-black text-lg">
            <button className="hover:bg-gray-100 rounded-md font-bold p-2">wohnungen</button>
          </Link>
          <Link href="/home" className="text-black text-2xl font-bold">
            <button className="font-bold p-2">Immosearch-iq</button>
          </Link>
          <Link href="/" className="text-black text-lg">
            <button className="hover:bg-gray-200 rounded-md font-bold p-2">dokumente</button>
          </Link>
        </div>
      </div>

      <div className="flex h-full relative">
        <div className="flex-1 bg-[#fef4e8] flex flex-col justify-center px-16">
          <h1 className="text-6xl font-bold mb-6 text-black">About Us</h1>
          <p className="text-lg text-gray-700">
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


      <div className="bg-[#fef4e8] flex">
        <div className='justify-start items-top p-20'>
          <img
            src="/code_img.png"
            alt="Bild"
            className="w-96 h-96 relative rounded-2xl"
          />
        </div>
        
        <div className='justify-center items-top pt-28'>
          <h1 className="text-6xl font-bold mb-6 text-black">GitHub und Code</h1>
          <p className='ps-3 text-gray-700 w-4/6'>Dieses Projekt ist ein OpenSource-Projekt. 
          Im folgenden GitHub repository ist eine Anleitung zur Nutzung der Website und installation 
          benötigter Technologien.
          <Link href={"https://github.com/42lukas/immosearch-iq"}>
            <p className='text-black font-bold'>https://github.com/42lukas/immosearch-iq</p>
          </Link>
          <br/>
          Für Bugs, anderen technischen Problemen und Fragen melde dich gerne bei:
          <p className='font-bold'>LukasEmail@gmail.com | NasserEmail@gmail.com</p>
          </p>
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

        <div className="mt-28 w-full flex justify-center space-x-60 py-4">
          <Link href={"/home"}>
            <p className="hover:underline font-bold">Home</p>
          </Link>
          <Link href={"/impressum"}>
            <p className="hover:underline font-bold">Impressum</p>
          </Link>
          <Link href={"/about"}>
            <p className="hover:underline font-bold">About</p>
          </Link>
        </div>
      </footer>

    </div>
  );
}