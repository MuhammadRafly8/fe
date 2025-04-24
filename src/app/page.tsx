import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex items-center">
          <div className="flex items-center">
            <Image 
              src="/aislogo.png"
              alt="AIS Logo" 
              width={50} 
              height={50} 
              className="mr-3"
            />
            <h1 className="text-xl font-bold">Sistem Informasi RAMS</h1>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-2">Get Started Today</h2>
          <p className="text-gray-600 mb-8">Welcome Back</p>
          
          <Link href="/login">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
