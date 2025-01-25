export default function Navbar(){
    return (
        <div className="min-h-36 bg-red-200 p-4 flex flex-col items-center justify-center">
        <div className="bg-red-400 w-full rounded-3xl border border-black min-h-[90px] shadow-xl shadow-black flex justify-between items-center p-5">
        <div className="text-white font-bold text-3xl">Logo</div>
            <nav className="flex space-x-4 text-xl">
              <a href="#" className="text-white hover:text-gray-300">
                Home
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                About
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                Services
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                Contact
              </a>
            </nav>
          </div>
        </div>
    );
}