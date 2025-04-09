"use client"

import { useState } from "react"
import { useChecker } from "../context/CheckerContext"
import ContinueButton from "../components/ContinueButton"

const InfoPage = () => {
  const { userData, updateUserData } = useChecker()
  const [localAge, setLocalAge] = useState(userData.age || "")
  const [localSex, setLocalSex] = useState(userData.sex || "")
  const [errors, setErrors] = useState({})

  const handleContinue = () => {
    const newErrors = {}

    if (!localAge) {
      newErrors.age = "Age is required"
    } else if (localAge < 1 || localAge > 120) {
      newErrors.age = "Please enter a valid age between 1 and 120"
    }

    if (!localSex) {
      newErrors.sex = "Sex is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    }

    updateUserData({ age: localAge, sex: localSex })
    return true
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Personal Information</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <div className="relative">
              <input
                type="number"
                value={localAge}
                onChange={(e) => setLocalAge(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                  errors.age
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
                min="1"
                max="120"
                placeholder="Enter your age"
              />
              {errors.age && <div className="mt-1 text-sm text-red-600">{errors.age}</div>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sex</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  localSex === "Male"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setLocalSex("Male")}
              >
                Male
              </button>
              <button
                type="button"
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  localSex === "Female"
                    ? "bg-pink-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setLocalSex("Female")}
              >
                Female
              </button>
            </div>
            {errors.sex && <div className="mt-1 text-sm text-red-600">{errors.sex}</div>}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mt-6">
        <ContinueButton onClick={handleContinue} disabled={!localAge || !localSex} />
      </div>
    </div>
  )
}

export default InfoPage
