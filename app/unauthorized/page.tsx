export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Unauthorized Access</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        You do not have permission to view this page. Please contact your administrator if you believe this is an error.
      </p>
    </div>
  );
}
