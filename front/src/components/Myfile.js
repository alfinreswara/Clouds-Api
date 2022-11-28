import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Pdf, ZipIcon, Mp4Icon, IsoIcon, CloudIcon, DeleteIcon } from '../icons/SvgIcones';
import fileDownload from 'js-file-download';


const Myfile = () => {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [files, setFiles] = useState([]); 
  const navigate =  useNavigate();

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.get('http://localhost:5000/token');
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setUserId(decoded.userId);
        setExpire(decoded.exp);
      } catch (error) {
        if(error.response) {
          navigate('/login');
        }
      }
    }
    refreshToken();
    getFiles();
  },[]);


 
  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(async(config) => {
    const cuuretDate = new Date();
    if(expire * 1000 < cuuretDate.getTime()){
      const response = await axios.get('http://localhost:5000/token');
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setUserId(decoded.userId);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const getFiles = async () => {
    const response = await axiosJWT.get('http://localhost:5000/myfile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setFiles(response.data) 
  } 
  const downloadFIles = async (path, nm) => {
    const response = await axiosJWT.get(`http://localhost:5000/download/clouds/${path}`, {
      responseType: "blob"
    })
    .then((response) => {
      navigate("/myfile")
      let nam = nm.slice(13);
      fileDownload(response.data, nam);
    })
    setFiles(response.data) 
  } 

  const deleteFiles = async (path) => {
      try {
          if(window.confirm("delete file? ")){
            await axiosJWT.delete(`http://localhost:5000/delete/${path}`)
            .then(() => {
              window.location.reload();
            })
          }
      } catch (error) {
          console.log(error);
      }
  }

  function iconsFile(filesa, imgscr) {
    const file = filesa.slice(3);
    const type1 = file.split('.');
    const i = type1.length - 1;
    if (type1[i] === "jpg" ) { return <img src={`http://localhost:5000/${imgscr}`} style={{width: "100%", height:"100%"}} />}
    else if (type1[i] === "png") { return <img src={`http://localhost:5000/${imgscr}`} style={{width: "100%", height:"100%"}} />}
    else if (type1[i] === "jpeg") {<img src={`http://localhost:5000/${imgscr}`} style={{width: "100%", height:"100%"}} />}
    else if (type1[i] === "zip") { return <ZipIcon width={"100%"} height={"100%"}/>}
    else if (type1[i] === "pdf") { return <Pdf width={"18rem"} height={"100%"}/>}
    else if (type1[i] === "mp4") { return <Mp4Icon width={"18rem"} height={"100%"}/>}
    else if (type1[i] === "iso") { return <IsoIcon width={"18rem"} height={"100%"}/>}
    else { return <ZipIcon width={"18rem"} height={"100%"}/> }
  }


  function formatSizeUnits(bytes){
    if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
    else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
    else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB"; }
    else if (bytes > 1)           { bytes = bytes + " bytes"; }
    else if (bytes === 1)          { bytes = bytes + " byte"; }
    else                          { bytes = "0 bytes"; }
    return bytes;
  }
  function currentime(date) {
    var myDate = new Date(date);
    var last = myDate.getTime();
    var now = new Date().getTime();

    var direffence = now - last ;
    var minutes = Math.floor(direffence % (1000 * 60 * 60) / (1000 * 60));
    var hours = Math.floor(direffence % (1000 * 60 * 60 * 24) / (1000 * 60 * 60) );
    var days = Math.floor(direffence / (1000 * 60 * 60 * 24));
  
    if(minutes === 0 && hours === 0 && days === 0) { return "\t Just now Created   \t"}
    else if(hours === 0 && days === 0) { return `Created ${minutes} Minutes ago`}
    else if ( days === 0) { return `Created ${hours} Hours ago `}
    else if (days > 0) { return `created ${days} Days Ago` }
    else { return " ngentod"}

  }

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
     <h1 className="h2">< CloudIcon width="60px" height="50px"/>My Clouds</h1>
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
    
            <div className="container mx-auto mt-4">
            <div className="row">
      {files.map((file, i) => {
          return(
              <div className="col-md-3 mx-2 ml-5 my-3 border border-1" key={file.id}>
              <div style={{height:"15rem"}} className='d-flex'>
              {iconsFile(file.name, file.url)}
            <span onClick={ () => { deleteFiles(file.pathFile) } }><DeleteIcon width="20px" height="24px" /></span>
              </div>
            <div className="card border-0 text-center">
            <div className="card-body">
              <h5 className="card-title">{file.name.slice(13)}</h5>
              <h6 className="card-subtitle text-muted">{formatSizeUnits(file.size)}</h6>
              <small className='text-muted'>{currentime(file.createdAt)}</small>
            <button className='btn btn-primary' onClick={ () => { downloadFIles(file.pathFile, file.name) } }>Download</button>
            </div>
            </div>
              </div>    
              
            ) 
        })}
            </div>
            </div>
  </main>
  )
}

export default Myfile