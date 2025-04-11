import React from 'react';
import { useChecker } from '../context/CheckerContext';

const NavTabs = () => {
  const { currentTab } = useChecker();

  const tabs = [
    { id: 'info', label: 'Info' },
    { id: 'symptoms', label: 'Symptoms' },
    { id: 'conditions', label: 'Conditions' },
    { id: 'details', label: 'Details' },
    { id: 'treatment', label: 'Treatment' },
  ];

  return (
    <div className="w-full flex flex-wrap justify-center gap-2 sm:gap-4 px-4 py-3 bg-white rounded-lg shadow-sm">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`px-4 py-2 text-sm sm:text-base rounded-full font-medium transition-all duration-300
            ${
              currentTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700'
            }`}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default NavTabs;
