const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Logo and Title */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 flex items-center">
            {/* Logo Icon */}
            <div className="mr-2 bg-white rounded-full p-1.5 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-blue-600"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>

            {/* Logo Text */}
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-white">Medi</span>
              <span className="text-blue-100">Mind</span>
              <span className="ml-2 text-lg font-medium text-white opacity-90">Symptom Checker</span>
            </h1>
          </div>

          {/* "WITH BODY MAP" Badge */}
          <div className="bg-blue-700 bg-opacity-40 backdrop-blur-sm text-blue-100 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wider border border-blue-400 border-opacity-30">
            WITH BODY MAP
          </div>

          {/* Subtitle */}
          <p className="text-blue-50 text-lg max-w-2xl">
            Identify possible conditions and treatment related to your symptoms.
          </p>

          {/* Disclaimer */}
          <div className="mt-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-blue-50 max-w-xl">
            <span>This tool does not provide medical advice.</span>{" "}
            <button className="font-medium underline decoration-dotted decoration-1 underline-offset-2 hover:text-white transition-colors">
              See additional information
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      {/* <div className="h-6 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 relative overflow-hidden">
        <svg className="absolute bottom-0 w-full h-8 text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="currentColor"
          />
        </svg>
      </div> */}
    </header>
  )
}

export default Header
