import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { PlussIcon, ProfileIcon, CloudIcon, DashboardIcon, FullTrashIcon } from '../icons/SvgIcones';
const Dashboard = (props) => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [usage, setUsage ] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        refreshToken();
        usageClouds();
        persentase()
      },[]);

      const refreshToken = async () => {
        try {
          const response = await axios.get('http://localhost:5000/token');
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setName(decoded.name);
          setExpire(decoded.exp);
          console.log(decoded.name)
        } catch (error) {
          if(error.response) {
            navigate('/login');
          }
        }
      }

      const axiosJWT = axios.create();
      axiosJWT.interceptors.request.use(async(config) => {
        const cuuretDate = new Date();
        if(expire * 1000 < cuuretDate.getTime()){
          const response = await axios.get('http://localhost:5000/token');
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setExpire(decoded.exp);
        }
        return config;
      }, (error) => {
        return Promise.reject(error);
      });
    
      const usageClouds = async () => {
        await axiosJWT.get('http://localhost:5000/getUsage', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then((response) => {
          setUsage(response.data) 
        })
      } 
      
      function limit() {
        let bytes = 0;
        usage.map((usag, i) => {
            bytes += usag.size;
        })
        console.log(bytes)
        if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
        else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
        else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB"; }
        else if (bytes > 1)           { bytes = bytes + " bytes"; }
        else if (bytes === 1)         { bytes = bytes + " byte"; }
        else                          { bytes = "0 bytes"; }
        return bytes;
      }
      function persentase() {
        let bytes = 0;
        usage.map((usag, i) => {
            bytes += usag.size;
        })
        let pers = (bytes / 3221225472 ) * 100;
        return  pers.toFixed(2)
      }

      const Logout = async (req, res) => {
        try {
            await axios.delete('http://localhost:5000/logout');
            navigate('/');
        } catch (error) {
            console.log(error);
        }
      }
    return (
  <div>
      <header className="navbar navbar-dark sticky-top bg-secondary flex-md-nowrap p-0 shadow">
        <Link to="/">
      <span className="navbar-brand col-md-3 col-lg-2 me-0 px-3">Lansion Clouds</span>
        </Link>
      <div className="navbar-nav">
        <div className="nav-item text-nowrap">
          <button onClick={ Logout } className='btn btn-secondary'>Logout</button>
        </div>
      </div>
    </header>

    <div className="container-fluid">
      <div className="row">
        <nav
          id="sidebarMenu"
          className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
        >
          <div className="position-fixed pt-3">
            <ul className="nav flex-column">
              <li className="nav-item active">
                  <Link to="/dashboard">
                  <span className='nav-link'>
                  <p> <DashboardIcon width="25px" height="20px"/> Dashboard</p>
                  </span>
                  </Link>
                  
              </li>
              <li className="nav-item">
                  <Link to="/myfile">
                     <span className='nav-link'>
                    <p className='text-bold'><CloudIcon width="25px" height="25px"/> My Clouds</p>
                     </span>
                  </Link>

              </li>
              <li className="nav-item">
                  <Link to="/trash">
                     <span className='nav-link'>
                    <p className='text-bold'><FullTrashIcon width="25px" height="25px"/> My Trash</p>
                     </span>
                  </Link>

              </li>
            </ul>

            <h6
              className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
            >
              <span>More</span>
              <a className="link-secondary" href="#" aria-label="Add a new report">
                <span data-feather="plus-circle"></span>
              </a>
            </h6>
            <ul className="nav flex-column mb-2">
              <li className="nav-item">
                <Link to="/upload">
                <span>
                  <p className='nav-link'>
                  <PlussIcon width={"50px"} height={"50px"} />
                  </p>
                </span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

  { props.name ? props.name : <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
   <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2"><ProfileIcon width="55px" height="50px"/> {name}</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
                
              <div className="btn-group me-2">
                <button type="button" className="btn btn-sm btn-outline-secondary">
                  Share
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary">
                  Export
                </button>
              </div>
              <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                <span data-feather="calendar"></span>
                This week
              </button>
            </div>
        </div>    
        <div className="card" style={{width:"18rem"}}>
  <div className="card-header">
      Paket Free Plan
  </div>
  <div className="card-body">
    <p className="card-text">Penggunaan Terpakai :</p>
    <h5 className="card-title"> { limit() } / 3GB</h5>
    <div className="progress">
  <div className="progress-bar" role="progressbar" style={{width: persentase()+"%"}}  aria-valuemin={"0"} aria-valuemax={"100"}></div>
    </div>
    <a href="#" className="btn btn-primary mt-4">Upgrade premium</a>
  </div>
</div>
        </main> 
        }
      </div>
    </div>
  </div>
    )
}

export default Dashboard