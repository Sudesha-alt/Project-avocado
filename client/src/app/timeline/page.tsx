"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { useGetProjectsQuery } from "@/state/api";
import { Chart } from "react-google-charts";
import React, { useEffect, useMemo } from "react";

const Timeline = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  const chartData = useMemo(() => {
    if (!projects) return [];

    return [
      [
        { type: "string", label: "Task ID" },
        { type: "string", label: "Task Name" },
        { type: "date", label: "Start Date" },
        { type: "date", label: "End Date" },
        { type: "number", label: "Duration" },
        { type: "number", label: "Percent Complete" },
        { type: "string", label: "Dependencies" },
      ],
      ...projects
        .filter((project) => project.startDate && project.endDate)
        .map((project) => [
          `Project-${project.id}`,
          project.name,
          new Date(project.startDate as string),
          new Date(project.endDate as string),
          null,
          50, // Assuming progress
          null,
        ]),
    ];
  }, [projects]);

  const options = {
    height: 600,
    gantt: {
      trackHeight: 30, // Controls row height
      palette: [
        {
          color: isDarkMode ? "#1F2937" : "#00BCD4", // Main progress bar color
          dark: isDarkMode ? "#0A192F" : "#008B8B", // Darker shade
          light: isDarkMode ? "#374151" : "#B2EBF2", // Lighter shade
        },
      ],
    },
  };

  // Apply styles dynamically when the component mounts
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .google-visualization-table td {
        color: black !important;
      }

      text {
        fill: black !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !projects)
    return <div>An error occurred while fetching projects</div>;

  return (
    <div className="max-w-full p-8">
      <header className="mb-4 flex items-center justify-between">
        <Header name="Projects Timeline" />
      </header>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <Chart
          chartType="Gantt"
          width="100%"
          height="50%"
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default Timeline;
