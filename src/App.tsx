import * as React from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Index = React.lazy(() => import("./pages/Index"));
const PostPage = React.lazy(() => import("./pages/PostPage"));
const About = React.lazy(() => import("./pages/About"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const App = () => (
  <BrowserRouter>
    <React.Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/post/:slug" element={<PostPage />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
    <Analytics />
    <SpeedInsights />
  </BrowserRouter>
);

export default App;
