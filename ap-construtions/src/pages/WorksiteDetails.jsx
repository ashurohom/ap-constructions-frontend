import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const WorksiteDetails = () => {
  const { id } = useParams();

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] bg-slate-100 p-6">
        <h1 className="text-2xl font-bold mb-4">
          Worksite Details
        </h1>

        <p className="text-slate-600">
          Worksite ID: <strong>{id}</strong>
        </p>

        {/* Next: fetch worksite details + assign workers here */}
      </div>
    </>
  );
};

export default WorksiteDetails;
