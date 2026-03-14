import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppWrapper } from "./modules/app/components/AppWrapper";
import { Layout } from "./modules/app/components/Layout";

import EventsPage from "./modules/events/components/EventsPage";
import { LoginForm } from "./modules/users/components/LoginForm";
import { ProfileForm } from "./modules/users/components/ProfileForm";
import { RegisterForm } from "./modules/users/components/RegisterForm";
import { TwoFaForm } from "./modules/users/components/TwoFaForm";

const DashboardPage = lazy(() => import("./modules/dashboard/components/DashboardPage"));

function App() {
  return (
    <AppWrapper>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/me" element={<ProfileForm />} />
          <Route path="/2fa" element={<TwoFaForm />} />
          <Route path="/events" element={<EventsPage />} />
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<div>Chargement du dashboard...</div>}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </Layout>
    </AppWrapper>
  );
}

export default App;