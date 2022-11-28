import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [ logName, setLogName ] = useState('login');
  useEffect(()=> {
    refreshToken();
  },[])


  const refreshToken = async () => {
		try {
		  const response = await axios.get('http://localhost:5000/dashboard');
		  if(response.status === 200) {
      setLogName("Dashboard")
		  }
		} catch (error) {
 
		}
	  }

  return (
    <div className='container'>
        <Link to="/login">
        <span className='btn btn-primary'> {logName}</span>
        </Link>
        <Link to="/register">
        <span className='btn btn-primary'> Register</span>
        </Link>

        <h4>Welcome To my clouds  </h4>
    </div>
  )
}

export default Home