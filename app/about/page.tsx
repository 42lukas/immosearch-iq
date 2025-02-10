import Link from 'next/link';

export default function About() {
  return (
    <div className="relative h-screen bg-black">
      <div className="absolute top-0 left-0 w-full z-10 p-5">
        <div className="w-full flex justify-between items-center rounded-md px-10 py-3 bg-white shadow-md">
          <Link href="/" className="text-black text-lg">
            <button className="hover:bg-gray-200 rounded-md font-bold p-2">wohnungen</button>
          </Link>
          <Link href="/" className="text-black text-2xl font-bold">
            <button className="font-bold p-2">Immosearch-iq</button>
          </Link>
          <Link href="/" className="text-black text-lg">
            <button className="hover:bg-gray-200 rounded-md font-bold p-2">dokumente</button>
          </Link>
        </div>
      </div>

      <div className="flex h-full mt-20 relative">
        <div className="flex-1 bg-[#fef4e8] flex flex-col justify-center px-16">
          <h1 className="text-6xl font-bold mb-6 text-[rgb(229,221,211)]">About Us</h1>
          <p className="text-lg text-gray-700">
            Wir sind Nasser und Lukas, zwei Informatik Studenten vom RKI. 
            Diese Website ist aus einem Projekt in der Uni entstanden.
          </p>
        </div>
  
        <div className="flex-1 bg-white flex justify-center items-center">
          <img
            src="/redHouses.png"
            alt="Bild"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

/*
<div className="flex items-center justify-center h-screen bg-gray-800">
        <div className="bg-white p-6 rounded-sm shadow-lg">
            <p className="flex justify-center text-xl font-bold text-black">About Page</p>
            <div className="flex items-center justify-center space-x-2 border border-gray-300 rounded-lg p-2">
                <Image aria-hidden src="/magnifying_glass.png" alt="Magnifying Glass" width={25} height={25}/>
                <input className="text-black focus-visible:false" placeholder="input" type="text"></input>
            </div>
        </div>
      </div>
*/