import React from "react";
import { useAdmin } from "../components/context/AdminContextProvider";
import { Users, Contact, UserStar, UserX } from "lucide-react";

function EnrollmentsSummary() {
  const { enrollments, allCourses, studentCount } = useAdmin();

  // Count enrollments by course
  const enrollmentCounts = {};
  enrollments.forEach((en) => {
    enrollmentCounts[en.course_id] = (enrollmentCounts[en.course_id] || 0) + 1;
  });

  const summaryData = allCourses.map((course) => {
    const enrolled = enrollmentCounts[course.id] || 0;
    const remaining = studentCount - enrolled;

    return {
      courseName: course.name,
      enrolled,
      remaining,
    };
  });

  return (
    <div className="w-full bg-white rounded-lg shadow dark:bg-slate-700 p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryData.map((item, idx) => (
          <div
            key={idx}
            className="border dark:border-none rounded-lg shadow-sm p-4 hover:shadow-md transition dark:bg-[#0A0A0A]"
          >
            <h4 className="font-semibold mb-3">{item.courseName}</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="flex items-center gap-2 mb-2">
                <UserStar className="text-green-600" size={30} />
                <p className="text-sm">
                  <span className="font-semibold">{item.enrolled}</span> enrolled
                </p>
              </div>

              {/* <div className="flex items-center gap-2 mb-2">
                <UserX className="text-red-500" size={30} />
                <p className="text-sm">
                  <span className="font-semibold">{item.remaining}</span> not enrolled
                </p>
              </div>

              <div className="lg:col-span-2 flex justify-center items-center gap-2 mt-3 text-gray-600">
                <Contact size={20} className="text-blue-800" />
                <p className="text-xs">
                  Total Students: <span className="font-semibold">{studentCount}</span>
                </p>
              </div> */}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EnrollmentsSummary;
