import { Link } from "react-router-dom";

function AdminHomePage() {



  return (
    <>
        <div className="container border rounded-4 shadow-lg my-5 ">
          <div className="flex-1  p-6">
            <h1 className="text-4xl font-bold">Welcome back, DOAGuru</h1>
            <div className="  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

              <Link to="">
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-gray-600">Total Register Employee</p>
                </div>
              </Link>

              <Link to="">

                <div className="p-4 bg-white rounded-lg shadow-md">

                  <p className="text-2xl font-bold">0</p>

                  <p className="text-gray-600">Total Projects</p>
                </div>
              </Link>
              <div className="p-4 bg-white rounded-lg shadow-md">
                <p className="text-2xl font-bold">0</p>
                <p className="text-gray-600">Assign Projects </p>
              </div>
            </div>
          </div>
        </div>
   
    </>
  );
}
export default AdminHomePage;
