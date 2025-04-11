"use client"
import { useChecker } from "../context/CheckerContext"
import PreviousButton from "../components/PreviousButton"

const TreatmentPage = () => {
  const { userData } = useChecker()

  if (!userData.treatments || !userData.selectedCondition) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading treatment information...</p>
        </div>
      </div>
    )
  }

  const handleStartOver = () => {
    // In a real app, you might use React Router
    window.location.reload()
  }

  // Function to determine probability badge color
  const getProbabilityColor = (probability) => {
    const prob = probability?.toLowerCase()
    if (prob === "high") return "bg-red-100 text-red-800"
    if (prob === "medium") return "bg-yellow-100 text-yellow-800"
    if (prob === "low") return "bg-green-100 text-green-800"
    return "bg-blue-100 text-blue-800" // default
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* User Info Card */}
        <div className="bg-white shadow-sm rounded-lg p-4 mb-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Patient Details</h1>
          <div className="flex space-x-4">
            <div className="bg-blue-50 px-3 py-1 rounded-full">
              <span className="font-medium text-blue-800">Age: {userData.age}</span>
            </div>
            <div className="bg-purple-50 px-3 py-1 rounded-full">
              <span className="font-medium text-purple-800">Sex: {userData.sex}</span>
            </div>
          </div>
        </div>

        {/* Condition Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
              {userData.selectedCondition.name} - Treatment Options
            </h2>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getProbabilityColor(
                userData.selectedCondition.probability,
              )}`}
            >
              {userData.selectedCondition.probability} Probability
            </span>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-amber-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                This information is provided for educational purposes only and is not a substitute for professional
                medical advice. Always consult with a healthcare provider for diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>

        {/* Treatments Section */}
        <div className="space-y-6">
          {/* Medications */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="bg-blue-50 px-6 py-3 border-b border-blue-100">
              <h3 className="text-lg font-medium text-blue-800">Recommended Medications</h3>
            </div>
            <div className="px-6 py-4">
              <ul className="space-y-3">
                {userData.treatments.medications.map((medication, index) => (
                  <li key={index} className="pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                    <span className="font-semibold text-gray-800">{medication.name}</span>
                    <p className="mt-1 text-gray-600">{medication.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Home Care */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="bg-green-50 px-6 py-3 border-b border-green-100">
              <h3 className="text-lg font-medium text-green-800">Home Care</h3>
            </div>
            <div className="px-6 py-4">
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {userData.treatments.homeCare.map((care, index) => (
                  <li key={index} className="leading-relaxed">
                    {care}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Lifestyle & Prevention */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="bg-purple-50 px-6 py-3 border-b border-purple-100">
              <h3 className="text-lg font-medium text-purple-800">Lifestyle & Prevention</h3>
            </div>
            <div className="px-6 py-4">
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {userData.treatments.lifestyle.map((item, index) => (
                  <li key={index} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* When to See a Doctor */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="bg-red-50 px-6 py-3 border-b border-red-100">
              <h3 className="text-lg font-medium text-red-800">When to See a Doctor</h3>
            </div>
            <div className="px-6 py-4">
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {userData.treatments.whenToSeeDoctor.map((item, index) => (
                  <li key={index} className="leading-relaxed font-medium">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-auto">
            <PreviousButton />
          </div>
          <button
            onClick={handleStartOver}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  )
}

export default TreatmentPage
