import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { Home } from './pages/Home';
import { Report } from './pages/Report';
import { Review } from './pages/Review';
import { Success } from './pages/Success';
import { Track } from './pages/Track';
import { Resources } from './pages/Resources';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="report" element={<Report />} />
          <Route path="review" element={<Review />} />
          <Route path="success" element={<Success />} />
          <Route path="track" element={<Track />} />
          <Route path="resources" element={<Resources />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
