import EmployerApplicationCard from "./EmployerApplicationCard";

function EmployerDashboard({ applications }) {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mt-6 mb-5">
          Job Applications for Your Jobs
        </h3>

        {applications.length === 0 ? (
          <p className="text-sm sm:text-base text-primary-300">
            No one has applied to your jobs yet!
          </p>
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
