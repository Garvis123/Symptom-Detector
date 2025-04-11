"use client"

import { useState } from "react"
import { useChecker } from "../context/CheckerContext"
import PreviousButton from "../components/PreviousButton"
import ContinueButton from "../components/ContinueButton"
import { Loader2, AlertCircle } from "lucide-react"

const ConditionsPage = () => {
  const { userData, updateUserData } = useChecker()
  const [selectedCondition, setSelectedCondition] = useState(userData.selectedCondition || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleConditionSelect = (condition) => {
    setSelectedCondition(condition)
    updateUserData({ selectedCondition: condition })
    // Clear any previous errors
    setError(null)
  }

  const handleContinue = async () => {
    if (!selectedCondition) return false

    setIsLoading(true)
    setError(null)

    try {
      // Make sure to properly encode the condition name for the URL
      const conditionName = encodeURIComponent(selectedCondition.name)
      console.log(`Fetching details for: ${conditionName}`)

      const response = await fetch(`http://localhost:5000/api/condition-details/${conditionName}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch condition details")
      }

      const data = await response.json()
      console.log("Received condition details:", data)

      if (data.details) {
        // Store the details in context
        updateUserData({ details: data.details })
        setIsLoading(false)
        return true
      } else {
        throw new Error("No details received from the server")
      }
    } catch (err) {
      console.error("Error fetching condition details:", err)
      setError(err.message || "Error fetching condition details")
      setIsLoading(false)
      return false
    }
  }

  // Probability badge styling helper
  const getProbabilityStyles = (probability) => {
    const probabilityLower = probability.toLowerCase()

    if (probabilityLower === "high") {
      return "bg-gradient-to-r from-red-500 to-red-600 text-white"
    } else if (probabilityLower === "medium") {
      return "bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900"
    } else {
      return "bg-gradient-to-r from-teal-400 to-teal-500 text-teal-900"
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap gap-4 items-center border-l-4 border-teal-500">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-500 mr-2">Age:</span>
          <span className="text-lg font-semibold text-gray-800">{userData.age}</span>
        </div>
        <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-500 mr-2">Sex:</span>
          <span className="text-lg font-semibold text-gray-800">{userData.sex}</span>
        </div>
      </div>

      {/* Symptoms Summary */}
      <div className="bg-gradient-to-r from-slate-50 to-teal-50 rounded-xl shadow-md p-5 mb-8 border border-slate-100">
        <h3 className="font-bold text-gray-700 mb-2">Based on your symptoms:</h3>
        <p className="text-gray-600 italic bg-white bg-opacity-60 p-3 rounded-lg border border-teal-100">
          {userData.symptoms}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Conditions List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Possible Conditions</h2>
        <p className="text-gray-600 mb-6">Select a condition to learn more details</p>

        <div className="grid gap-4 md:grid-cols-2">
          {userData.conditions &&
            userData.conditions.map((condition) => (
              <div
                key={condition.id || condition.name}
                className={`
                  rounded-xl transition-all duration-200 cursor-pointer 
                  ${
                    selectedCondition?.id === condition.id || selectedCondition?.name === condition.name
                      ? "bg-gradient-to-br from-teal-50 to-emerald-50 shadow-lg border-2 border-teal-400 transform scale-[1.02]"
                      : "bg-white shadow-md hover:shadow-lg border border-gray-100 hover:border-teal-200"
                  }
                `}
                onClick={() => handleConditionSelect(condition)}
              >
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{condition.name}</h3>
                    <span
                      className={`
                        px-3 py-1 rounded-full text-sm font-medium 
                        ${getProbabilityStyles(condition.probability)}
                      `}
                    >
                      {condition.probability} Probability
                    </span>
                  </div>
                  <p className="text-gray-600">{condition.description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center mt-6">
        <PreviousButton className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2" />

        <div className="flex items-center gap-4">
          {isLoading && (
            <div className="flex items-center text-teal-600">
              <Loader2 size={20} className="animate-spin mr-2" />
              <span>Loading...</span>
            </div>
          )}

          <ContinueButton
            onClick={handleContinue}
            disabled={!selectedCondition || isLoading}
            className={`
              px-5 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2
              ${
                !selectedCondition || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-md"
              }
            `}
          />
        </div>
      </div>
    </div>
  )
}

export default ConditionsPage
