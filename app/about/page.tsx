import Image from "next/image";

export default function AboutPage() {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <div className="bg-white p-6 rounded-sm shadow-lg">
            <p className="flex justify-center text-xl font-bold text-black">About Page</p>
            <div className="flex items-center justify-center space-x-2 border border-gray-300 rounded-lg p-2">
                <Image aria-hidden src="/magnifying_glass.png" alt="Magnifying Glass" width={25} height={25}/>
                <input className="text-black focus-visible:false" placeholder="input" type="text"></input>
            </div>
        </div>
      </div>
    );
  }