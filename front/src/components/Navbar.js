import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const Logout = async() => {
    try {
      await axios.delete('http://localhost:5000/logout');
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }
  return (
<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
  <div className="container mx">
    <h1 className="navbar-brand" href="#">Lansion</h1>
    <div className="d-frex">
      <ul className="navbar-nav">
        <li>
            <button onClick={ Logout } className='btn btn-dark'>Logout</button>
        </li>
      </ul>
    </div>
  </div>
</nav>
  )
}

export default Navbar