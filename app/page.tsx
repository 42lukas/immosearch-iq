import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/redHouses.png')" }}>
      
      {/* 🔹 Overlay für dunkleren Hintergrund */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* 🔹 Inhalt der Seite (relativ positioniert, damit das Overlay nicht darüber liegt) */}
      <div className="relative flex flex-col justify-center items-center h-full text-white text-center">

        {/* 🔹 Titel */}
        <h1 className="pt-20 font-bold text-7xl">Immosearch-IQ</h1>

        {/* 🔹 Button */}
        <Link href="/about">
          <button className="relative mt-10 flex items-center justify-center bg-orange-600 py-5 px-10 rounded-md w-auto text-white font-extrabold hover:scale-110 transition-transform duration-300 ease-in-out group">
            Beginne deine Wohnungssuche
          </button>
        </Link>
      </div>
    </div>
  );
}