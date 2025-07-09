import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

function App() {
  return (
    <ProtectedRoute role={undefined}>
      <AdminLayout />
    </ProtectedRoute>
  );
}

export default App;
