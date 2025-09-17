import EmployerApplicationCard from "./EmployerApplicationCard";

function EmployerDashboard({ applications }) {
  const mockApplications = [
    {
      id: 1,
      created_at: "2025-09-01T12:00:00Z",
      resumeURL: "https://example.com/resumes/john-doe.pdf",
      // resumeURL:
      //   "https://gzzccmqtkneoosqxvvor.supabase.co/storage/v1/object/sign/resumes/applications/17e5c61b-5d5d-4f91-b5fb-34e80b087f44/ec26fa24-b1c6-474f-ac73-1b1cd684a425/Ramtin62_Resume.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZTFmMDk5NS1iY2ZlLTRkYjktOGI5MC04NGM3MmIxMTMxZjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJyZXN1bWVzL2FwcGxpY2F0aW9ucy8xN2U1YzYxYi01ZDVkLTRmOTEtYjVmYi0zNGU4MGIwODdmNDQvZWMyNmZhMjQtYjFjNi00NzRmLWFjNzMtMWIxY2Q2ODRhNDI1L1JhbXRpbjYyX1Jlc3VtZS5wZGYiLCJpYXQiOjE3NTc3NzEzNzYsImV4cCI6MTc1ODM3NjE3Nn0.I6AsNfUft1upD6nz1vsupRorfjGUvkEcmT5NL41rInw",
      status: "in-review",
      rating: 3,
      jobs: {
        id: 101,
        title: "Frontend Developer",
        companyName: "TechCorp",
        employerId: 1,
        maxHires: 2,
      },
      users: {
        id: 501,
        fullName: "John Doe",
      },
    },
    {
      id: 2,
      created_at: "2025-09-05T15:30:00Z",
      resumeURL: null,
      status: "in-review",
      rating: null,
      jobs: {
        id: 102,
        title: "Backend Developer",
        companyName: "CodeFactory",
        employerId: 1,
        maxHires: 0,
      },
      users: {
        id: 502,
        fullName: "Jane Smith",
      },
    },
  ];

  return (
    <ul>
      {mockApplications.map((app) => (
        <EmployerApplicationCard key={app.id} application={app} />
      ))}
    </ul>
  );

  // return (
  //   <div className="space-y-8">
  //     <section>
  //       <h3 className="text-xl font-semibold mt-10 mb-4">
  //         Job Applications for Your Jobs
  //       </h3>

  //       {applications.length === 0 ? (
  //         <p>No one has applied to your jobs yet!</p>
  //       ) : (
  //         <ul className="divide-y divide-primary-700">
  //           {applications.map((app) => (
  //             <EmployerApplicationCard key={app.id} application={app} />
  //           ))}
  //         </ul>
  //       )}
  //     </section>
  //   </div>
  // );
}

export default EmployerDashboard;
