import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import VoltarTopo from "./components/VoltarTopo";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DetalhesImovel from "./pages/DetalhesImovel";
import DashboardProprietario from "./pages/DashboardProprietario";
import NovoImovel from "./pages/NovoImovel";
import EditarImovel from "./pages/EditarImovel";
import MinhasReservas from "./pages/MinhasReservas";
import AdminDashboard from "./pages/AdminDashboard";
import Perfil from "./pages/Perfil";
import ComoFunciona from "./pages/ComoFunciona";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/imoveis/:id" element={<DetalhesImovel />} />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute tiposPermitidos={["CLIENTE", "PROPRIETARIO", "ADMIN"]}>
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proprietario"
          element={
            <ProtectedRoute tiposPermitidos={["PROPRIETARIO", "ADMIN"]}>
              <DashboardProprietario />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proprietario/novo-imovel"
          element={
            <ProtectedRoute tiposPermitidos={["PROPRIETARIO", "ADMIN"]}>
              <NovoImovel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proprietario/editar-imovel/:id"
          element={
            <ProtectedRoute tiposPermitidos={["PROPRIETARIO", "ADMIN"]}>
              <EditarImovel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/minhas-reservas"
          element={
            <ProtectedRoute tiposPermitidos={["CLIENTE", "PROPRIETARIO", "ADMIN"]}>
              <MinhasReservas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute tiposPermitidos={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <VoltarTopo />
      <Footer />
    </>
  );
}

export default App;