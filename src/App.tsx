import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {LoginPage} from "@/pages/login";
import {ProtectedRoute} from "@/components/ProtectedRoute";
import {DashboardPage} from "@/pages/dashboard.tsx";
import {HuntDetailsPage} from "@/pages/hunt-details.tsx";
import Navbar from "@/components/navbar.tsx";
import Test from "@/components/test.tsx";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Navbar/>
                            <DashboardPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={"/hunt/:huntId"}
                    element={
                        <ProtectedRoute>
                            <Navbar/>
                            <HuntDetailsPage/>
                        </ProtectedRoute>
                    }/>
                <Route
                    path={"/test"}
                    element={
                        <Test/>
                    }/>
                {/*<Route path="*" element={<Navigate to="/" replace />} />*/}
            </Routes>
        </Router>
    );
}

export default App;
