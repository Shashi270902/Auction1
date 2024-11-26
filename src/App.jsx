import { BrowserRouter, Route, Routes } from "react-router-dom";
import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works } from "./components";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";

import AddProduct from "./components/AddProduct"; // Import AddProduct component
import Room from "./components/Room";

import Services from "./components/ServiceCard";
import JoinRoom from "./components/Join-Room";
import CreateRoom from "./components/Create-Room";
import Products from "./components/Products";

const App = () => {
  const user = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Main page with Navbar */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <div className="relative z-0 bg-primary">
                <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
                  <Hero />
                </div>
                <About />
                <Experience />
                <Tech />
                <Works />
                <Feedbacks />
                <div className="relative z-0">
                  <Contact />
                </div>
              </div>
            </>
          }
        />
        
        {/* Signup page */}
        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Add Product page */}
        <Route path="/add-product" element={<AddProduct />} />

        {/* Create Auction Room page */}
        <Route path="/create-room" element={<CreateRoom />} /> 

        {/* Room page route */}
        <Route path="/room/:roomId" element={<Room />} /> 

        {/* Join Room page */}
        <Route path="/join-room" element={<JoinRoom />} />

        {/* Services Page */}
        <Route path="/services" element={<Services />} />

        <Route path="/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
