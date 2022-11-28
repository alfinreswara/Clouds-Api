import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from "jwt-decode";
const Upload = () => {

  const [ image, setImage ] = useState(null);
  const [ username, setUsername ] = useState('');
  const [ userId, setUserId ] = useState(null);
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.get('http://localhost:5000/token');
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setUsername(decoded.username);
        setUserId(decoded.userId);
        setExpire(decoded.exp);
        console.log(decoded.name)
      } catch (error) {
        if(error.response) {
          navigate('/login');
        }
      }
    }
    refreshToken();
  },[]);


  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(async(config) => {
    const cuuretDate = new Date();
    if(expire * 1000 < cuuretDate.getTime()){
      const response = await axios.get('http://localhost:5000/token');
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setUsername(decoded.username);
      setUserId(decoded.userId);
      setExpire(decoded.exp);
      console.log(decoded);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });


const UploadFile = async (e) => {
  e.preventDefault();
  try {
    const response =  await axiosJWT({
      method: 'post',
      url: 'http://localhost:5000/uploadfile',
      data: { username: username, userId: userId, dataUser: image },
      headers : {
        Authorization: `Bearer ${token}`,
         'Content-Type': 'multipart/form-data' 
        } })
    setMsg(response.data.msg)
    e.target.reset();
  } catch (error) {
    console.log(error)
  }
}

  return (
         <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
           <h1 className="h2">Upload File & Backup Your File</h1>
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
          <div className={`alert-info text-center ${msg ? "alert" : ""}`}>
              {msg}
          </div>
        <form onSubmit={ UploadFile }>
        <div className="mb-3">
            <label for="formFile" className="form-label">File Input</label>
              <input type="hidden" className='form-control' name='username' value={username} />
              <input type="hidden" className='form-control' name='userId' value={userId} />
              <input className="form-control" type="file" id="formFile" name='dataUser' onChange={(e) => setImage(e.target.files[0])} />
         </div>
            <button className='btn btn-primary' type="submit">Submit</button>
        </form>
        </main>
      
  )
}

export default Upload