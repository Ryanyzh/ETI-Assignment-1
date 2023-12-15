import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './Auth/auth';
import MainPage from './Main/main';
import './App.css';

function App() {
  const userId = localStorage.getItem('userId');

  if (userId){
    return (
      <div className="w-screen h-screen m-0 p-0 overflow-x-hidden overflow-y-hidden">
       <MainPage />
      </div>
    )
  }
  else {
    return (
      <div className="w-screen h-screen m-0 p-0 overflow-x-hidden overflow-y-hidden">
       <AuthPage />
      </div>
    )
  }

  // return (
  //   <div className="w-screen h-screen m-0 p-0 overflow-x-hidden overflow-y-hidden">
  //     <Routes>
  //       {userId ? (
  //         // User is authenticated, render Main Page
  //         <Route path="/main" element={<MainPage />} />
  //       ) : (
  //         // User is not authenticated, render Auth Page
  //         <Route path="/auth" element={<AuthPage />} />
  //       )}

  //       {/* Redirect any other routes to /auth */}
  //       <Route path="/*" element={<Navigate to="/auth" />} />
  //     </Routes>
  //   </div>
  // );
}

export default App;