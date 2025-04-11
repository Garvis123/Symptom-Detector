"use client"

import { useEffect, useState } from "react"
import { useChecker } from "../context/CheckerContext"
import { useNavigate } from "react-router-dom"
import PreviousButton from "../components/PreviousButton"
import ContinueButton from "../components/ContinueButton"

const DetailsPage = () => {
  const { userData, updateUserData } = useChecker()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Redirect to conditions page if details are missing
    if (!userData.details || !userData.selectedCondition) {
      navigate("/conditions") // Adjust the path as needed
    }
  }, [userData.details, userData.selectedCondition, navigate])

  const handleContinue = async () => {
    if (!userData.selectedCondition) return false

    setIsLoading(true)
    setError(null)

    try {
      // Use the treatments endpoint with a GET request instead
      const response = await fetch(
        `http://localhost:5000/api/treatments/${encodeURIComponent(userData.selectedCondition.name)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch treatment suggestions")
      }

      const data = await response.json()
      console.log("Treatment data received:", data)

      if (data.treatments) {
        updateUserData({ treatments: data.treatments })
        setIsLoading(false)
        return true
      } else {
        throw new Error("No treatment data received")
      }
    } catch (error) {
      console.error("Treatment fetch error:", error)
      setError(error.message || "Failed to load treatment suggestions")
      setIsLoading(false)
      return false
    }
  }

  if (!userData.details || !userData.selectedCondition) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading details...</p>
        </div>
      </div>
    )
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">{userData.selectedCondition.name}</h2>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getProbabilityColor(userData.selectedCondition.probability)}`}
            >
              {userData.selectedCondition.probability} Probability
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Details Section */}
        <div className="space-y-6">
          {/* Overview */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="bg-blue-50 px-6 py-3 border-b border-blue-100">
              <h3 className="text-lg font-medium text-blue-800">Overview</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700 leading-relaxed">{userData.details.overview}</p>
            </div>
          </div>

          {/* Causes */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="bg-indigo-50 px-6 py-3 border-b border-indigo-100">
              <h3 className="text-lg font-medium text-indigo-800">Causes</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700 leading-relaxed">{userData.details.causes}</p>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="bg-amber-50 px-6 py-3 border-b border-amber-100">
              <h3 className="text-lg font-medium text-amber-800">Risk Factors</h3>
            </div>
            <div className="px-6 py-4">
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {userData.details.riskFactors?.map((factor, index) => (
                  <li key={index} className="leading-relaxed">
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Complications */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="bg-rose-50 px-6 py-3 border-b border-rose-100">
              <h3 className="text-lg font-medium text-rose-800">Possible Complications</h3>
            </div>
            <div className="px-6 py-4">
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {userData.details.complications?.map((complication, index) => (
                  <li key={index} className="leading-relaxed">
                    {complication}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Prevention */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="bg-emerald-50 px-6 py-3 border-b border-emerald-100">
              <h3 className="text-lg font-medium text-emerald-800">Prevention</h3>
            </div>
            <div className="px-6 py-4">
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {userData.details.prevention?.map((prevention, index) => (
                  <li key={index} className="leading-relaxed">
                    {prevention}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center">
          <div className="w-1/3">
            <PreviousButton />
          </div>
          <div className="w-1/3 flex justify-end items-center">
            <div className="relative">
              <ContinueButton onClick={handleContinue} disabled={isLoading} />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailsPage
