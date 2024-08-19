import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Homepage from "./components/homepage.js";
import FetchedData from "./components/fetched_data.js";
import Page404 from "./components/page404.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/FetchedData' element={<FetchedData />} />
        <Route path='*' element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;
