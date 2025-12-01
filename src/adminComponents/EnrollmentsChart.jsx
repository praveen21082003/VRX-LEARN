import React from "react";
import { useAdmin } from "../components/context/AdminContextProvider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function EnrollmentsChart() {
  const { enrollments, allCourses, studentCount } = useAdmin();

  // Count enrollments by course
  const enrollmentCounts = {};
  enrollments.forEach((en) => {
    enrollmentCounts[en.course_id] = (enrollmentCounts[en.course_id] || 0) + 1;
  });

  // Build graph data
  const chartData = allCourses.map((course) => {
    const enrolled = enrollmentCounts[course.id] || 0;
    const remaining = studentCount - enrolled;

    return {
      courseName: course.name,
      enrolled,
      remaining,
    };
  });

  return (
    <div className="w-full bg-white rounded-lg shadow p-5">

      {/* Chart Title */}
      <h3 className="text-lg font-semibold mb-3">Course Enrollment Stats</h3>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <XAxis dataKey="courseName" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="enrolled" fill="#4F46E5" name="Enrolled Students" />
          <Bar dataKey="remaining" fill="#CBD5E1" name="Not Enrolled" />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-[#4F46E5] rounded-sm"></span>
          <p>Enrolled Students</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-[#CBD5E1] rounded-sm"></span>
          <p>Remaining Students</p>
        </div>
      </div>

      {/* Summary Info */}
      <div className="mt-4 border-t pt-4">
        <h4 className="font-semibold mb-2">Course-wise Enrollment</h4>

        <ul className="space-y-1 text-sm">
          {chartData.map((item, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{item.courseName}</span>
              <span className="font-medium text-blue-600">
                {item.enrolled} enrolled
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EnrollmentsChart;
