import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SunoGovProvider, useSunoGov } from './context/SunoGovContext';
import { RootLayout } from './layouts/RootLayout';
import { Home } from './pages/Home';
import { Report } from './pages/Report';
import { Review } from './pages/Review';
import { Success } from './pages/Success';
import { Track } from './pages/Track';
import { Resources } from './pages/Resources';

// ==========================================
// Route Guard Wrappers
// ==========================================

const ReviewGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { rawInput, analysis, uan } = useSunoGov();
  
  if (!rawInput || !analysis || !uan) {
    return <Navigate to="/report" replace />;
  }
  return <>{children}</>;
};

const SuccessGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { refId, grievance } = useSunoGov();
  
  if (!refId || !grievance) {
    return <Navigate to="/report" replace />;
  }
  return <>{children}</>;
};

const TrackGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { refId, grievance } = useSunoGov();
  
  if (!refId || !grievance) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// ==========================================
// Main Application Routing Layout
// ==========================================

export const App: React.FC = () => {
  return (
    <SunoGovProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="report" element={<Report />} />
            
            <Route 
              path="review" 
              element={
                <ReviewGuard>
                  <Review />
                </ReviewGuard>
              } 
            />
            
            <Route 
              path="success" 
              element={
                <SuccessGuard>
                  <Success />
                </SuccessGuard>
              } 
            />
            
            <Route 
              path="track" 
              element={
                <TrackGuard>
                  <Track />
                </TrackGuard>
              } 
            />
            
            <Route path="resources" element={<Resources />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SunoGovProvider>
  );
};

export default App;
