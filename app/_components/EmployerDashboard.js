import EmployerApplicationCard from "./EmployerApplicationCard";

function EmployerDashboard({ applications }) {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-semibold mt-10 mb-7">
          Job Applications for Your Jobs
        </h3>

        {applications.length === 0 ? (
          <p>No one has applied to your jobs yet!</p>
        ) : (
          <ul className="divide-y divide-primary-700">
            {applications.map((app) => (
              <EmployerApplicationCard key={app.id} application={app} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default EmployerDashboard;
