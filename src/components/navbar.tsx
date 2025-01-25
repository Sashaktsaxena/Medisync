export default function Navbar(){
    return (
        <div className="min-h-36 bg-gradient-to-br from-blue-300 to-teal-100 p-4 flex flex-col items-center justify-center">
        <div className="bg-blue-300 w-full rounded-3xl border border-black min-h-[90px] shadow-xl shadow-black flex justify-between items-center p-5">
        <div className="text-black font-bold text-3xl ">Logo</div>
            <nav className="flex space-x-4 text-xl text-black">
              <a href="#" className="hover:text-gray-300 text-black">
                Home
              </a>
              <a href="#" className="hover:text-gray-300 text-black">
                About
              </a>
              <a href="#" className="hover:text-gray-300 text-black">
                Services
              </a>
              <a href="#" className="hover:text-gray-300 text-black">
                Contact
              </a>
            </nav>
          </div>
        </div>
    );
}