"use client";

import React from "react";

const EmptyState = () => {
  return (
    <div className="h-full flex items-center justify-center text-center">
      <div>
        <h2 className="text-2xl font-semibold text-gray-700">
          Select a group
        </h2>
        <p className="text-gray-500 mt-2">
          Choose a group from the left sidebar to start messaging.
        </p>
      </div>
    </div>
  );
};

const GroupsPage = () => {
  return <EmptyState />;
};

export default GroupsPage;
