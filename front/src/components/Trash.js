import React, {  useEffect, useState } from 'react'
import { FullTrashIcon } from '../icons/SvgIcones'
import axios from 'axios';
import jwt_decode from "jwt-decode"

const Trash = () => {
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [fileTrash, setFileTrash ] = useState([]);

    useEffect(() => {
        const refreshToken = async () => {
            try {
              const response = await axios.get('http://localhost:5000/token');
              setToken(response.data.accessToken);
              const decoded = jwt_decode(response.data.accessToken);
              setExpire(decoded.exp);
            } catch (error) {
              if(error.response) {
                console.log("gagal")
              }
            }
          }
          refreshToken();
        getTrashFile();
    },[])
    
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
  
    function genTime(time) {
      const anj = Number(time)
      const oaja = anj + (86400000 * 30); 
      const a = new Date(oaja);
      const n = new Date().getTime();
      var direffence = a - n ;
      var minutes = Math.floor(direffence % (1000 * 60 * 60) / (1000 * 60));
      var hours = Math.floor(direffence % (1000 * 60 * 60 * 24) / (1000 * 60 * 60) );
      var days = Math.floor(direffence / (1000 * 60 * 60 * 24));
    
      if(minutes === 0 && hours === 0 && days === 0) { return " Just now Created   \t"}
      else if(hours === 0 && days === 0) { return ` ${minutes} Minutes left`}
      else if ( days === 0) { return ` ${hours} Hours left `}
      else if (days > 0) { return ` ${days} Days left` }
      else { return " ngentod"}
    }

    const getTrashFile = async () => {
      const response = await axiosJWT.get('http://localhost:5000/getTrashFiles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setFileTrash(response.data)
    }

    const restoreFile = async (path) => {
       await axiosJWT.get(`http://localhost:5000/restore/${path}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
       }). then((res) => {
        window.location.reload();  
        console.log(res.data.msg)

       })
    }

    const deleteFilePer = async (path, un) => {
      await axiosJWT.delete(`http://localhost:5000/del/${un}/${path}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        window.location.reload();
      })
    }

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
     <h1 className="h2">< FullTrashIcon width="60px" height="50px"/>Trash</h1>
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
    <table className='table'>
      <thead>
        <tr>
          <th scope='row'>No</th>
          <th>name</th>
          <th>automatic Delete</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {fileTrash.map((trash, i) => {
          return(

            <tr key={trash.id}>
            <td>{i + 1}</td>
            <td>{trash.name}</td>
            <td>{ genTime(trash.create) }</td>
            <td><button className='btn btn-primary' onClick={ () => restoreFile(trash.pathFile) }>Restore</button>
            <button className='btn btn-danger' onClick={ () => deleteFilePer(trash.name, trash.author) }>delete permanent</button></td>
        </tr>
            )
        })}
      </tbody>
    </table>
    </main>
  )
}

export default Trash