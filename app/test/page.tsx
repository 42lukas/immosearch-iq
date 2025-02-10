export default function Test() {
    return (
      <div className="relative flex h-screen">
        {/* Linker Bereich */}
        <div className="flex-1 bg-[#fef4e8] flex flex-col justify-center px-16">
          <h1 className="text-6xl font-bold mb-6 text-[rgb(229,221,211)]">About Us</h1>
          <p className="text-lg text-gray-700">
            We're John and Jai, co-founders of Hydrant. Our journey started when both of us were trying to solve the same
            problem on opposite sides of the US. After a friend connected us, the rest is history.
          </p>
        </div>
  
        {/* Rechter Bereich */}
        <div className="flex-1 bg-white flex justify-center items-center">
                    <img
                src="/redHouses.png"
                alt="Bild"
                className="w-full h-full object-cover"
            />
        </div>
      </div>
    );
  }