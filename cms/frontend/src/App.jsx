import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ResidentManagement from "./pages/ResidentManagement";
import ApplicationRequest from "./pages/ApplicationRequest";
import BlotterReport from "./pages/BlotterReportPage";
import BlotterReportViewPage from "./pages/BlotterReportViewPage";
import AddBlotterReportPage from "./pages/AddBlotterReportPage";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";
import EditResidentPage from "./pages/EditResidentPage ";
import AddResidentPage from "./pages/AddResidentPage";
import AddCertificationPage from "./pages/AddCertificationPage";
import EditBlotterReportPage from "./pages/EditBlotterReportPage";
import AppLayout from "./components/AppLayout";
import MasterDataPage from "./pages/MasterDataPage";
import NotificationAdvisoryPage from "./pages/NotificationAdvisoryPage";
import AddIncidentReportPage from "./pages/AddIncidentReportPage";
import EditIncidentReportPage from "./pages/EditIncidentReportPage";
import BlotterIncidentViewPage from "./pages/BlotterIncidentViewPage";
import BarangayOfficials from "./pages/BarangayOfficials";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/resident-management/add-resident"
                    element={
                        <ProtectedRoute>
                            <AddResidentPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/resident-management/edit-resident"
                    element={
                        <ProtectedRoute>
                            <EditResidentPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/resident-management"
                    element={
                        <ProtectedRoute>
                            <ResidentManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/application-request"
                    element={
                        <ProtectedRoute>
                            <ApplicationRequest />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/application-request/add-certification"
                    element={
                        <ProtectedRoute>
                            <AddCertificationPage />
                        </ProtectedRoute>
                    }
                />
                 <Route
                    path="/barangay-official"
                    element={
                        <ProtectedRoute>
                             <AppLayout>
                                <BarangayOfficials />
                             </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/blotter-report"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <BlotterReport />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/master-data"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <MasterDataPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/blotter-report/edit-complaint"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <EditBlotterReportPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/blotter-report/blotter-report-view"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <BlotterReportViewPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/blotter-report/add-complaint"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AddBlotterReportPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/blotter-report/add-incident"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AddIncidentReportPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/blotter-report/edit-incident"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <EditIncidentReportPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/blotter-report/incident-report-view"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <BlotterIncidentViewPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user-management"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <UserManagement />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/notification-advisory"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <NotificationAdvisoryPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Reports />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
