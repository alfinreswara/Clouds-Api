import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard.js";
import Upload from "./components/Upload";
import Myfile from "./components/Myfile";
import Trash from "./components/Trash";
function App() {
  return (
   <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard  />} />
        <Route path="/upload" element={<Dashboard  name={ <Upload /> }/>}/>
        <Route path="/myfile" element={<Dashboard  name={ <Myfile /> }/>} />
        <Route path="/trash" element={<Dashboard  name={ <Trash /> }/>} />
      

      
      </Routes>
   </BrowserRouter>
  );
}

export default App;
