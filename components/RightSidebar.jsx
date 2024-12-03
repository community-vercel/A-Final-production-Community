import React from "react";

const RightSidebar = () => {
  return (
    <div className="w-80 bg-gray-200 shadow-lg rounded-lg p-4 ml-4">
      <h3 className="text-lg font-semibold">Document Answer</h3>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm">88% Similar</span>
        <span className="text-sm">12%</span>
      </div>

      <p className="mt-4 text-sm">
        In order to help you locate the correct parts and repair information, we will need more information about the problem you are facing. Please submit a new question with more details, and we will be happy to help you!
      </p>

      <div className="mt-4">
        <h4 className="text-sm font-semibold">Archived Questions</h4>
        <ul>
          {/* Replace these with actual data */}
          {Array.from({ length: 5 }).map((_, index) => (
            <li key={index} className="flex items-center justify-between mt-1">
              <span className="text-sm">Question {index + 1}</span>
              <button className="text-blue-600 text-sm">+</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-semibold">Unsolvable Question</h4>
        <button className="bg-red-500 text-white px-4 py-2 rounded mt-2">Escalate Question</button>
      </div>
    </div>
  );
};

export default RightSidebar;
