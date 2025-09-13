import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Homepage from './Homepage';
import AboutUs from './AboutUs';
import ChooseOptionPage from './ChooseOptionPage';
import CreateStorybookPage from './CreateStorybookPage';
import Storybook from './Storybook';
import StorybookMobile from './StorybookMobile';
import Quiz from './Quiz';
import Audio from './Audio';
import './index.css';
import DownloadStory from "./DownloadStory";
import Picturebook from "./Picturebook";
import CreatePicturebookPage from './CreatePicturebookPage';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/AboutUs" element={<AboutUs />} />
      <Route path="/ChooseOptionPage" element={<ChooseOptionPage />} />
      <Route path="/create/storybook" element={<CreateStorybookPage />} />
      <Route path="/storybook" element={<Storybook />} />
      <Route path="/picturebook" element={<Picturebook />} />
      <Route path="/storybook-mobile" element={<StorybookMobile />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/Audio" element={<Audio />} />
      <Route path="/download-story" element={<DownloadStory />} />
      <Route path="/create/picturebook" element={<CreatePicturebookPage />} />
      <Route path="/picturebook" element={<Picturebook />} />

    </Routes>
  </BrowserRouter>
);
