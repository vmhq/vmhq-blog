import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Index = React.lazy(() => import("./pages/Index.tsx"));
const PostPage = React.lazy(() => import("./pages/PostPage.tsx"));
const About = React.lazy(() => import("./pages/About.tsx"));
const NotFound = React.lazy(() => import("./pages/NotFound.tsx"));

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
  </BrowserRouter>
);

export default App;
