import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [msg, setMsg] = useState(''); 
    const navigate = useNavigate();

    const Register = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register', {
                name,
                username,
                email,
                password,
                confPassword
            });
            navigate('/login')
        } catch (error) {
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

  return (
    <section className="h-100">
    <div className="container h-100">
        <div className="row justify-content-sm-center h-100">
            <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
                <div className="text-center my-5">
                </div>
                <div className="card shadow-lg">
                    <div className="card-body p-5">
                        <h1 className="fs-4 card-title fw-bold mb-4">Register</h1>
                        <p className='text'>{msg}</p>
                        <form onSubmit={ Register } className="needs-validation">
                            <div className="mb-3">
                                <label className="mb-2 text-muted" for="name">Name</label>
                                <input id="name" type="text" className="form-control" name="name"required value={name} onChange={(e) => setName(e.target.value)}/>
                                <div className="invalid-feedback">
                                    Name is required	
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="mb-2 text-muted" for="username">Username</label>
                                <input id="username" type="text" className="form-control" name="username" required value={username} onChange={(e) => setUsername(e.target.value)}/>
                                <div className="invalid-feedback">
                                    username is required	
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="mb-2 text-muted" for="email">E-Mail Address</label>
                                <input id="email" type="email" className="form-control" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                <div className="invalid-feedback">
                                    Email is invalid
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="mb-2 text-muted" for="password">Password</label>
                                <input id="password" type="password" className="form-control" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                <div className="invalid-feedback">
                                    Password is required
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="mb-2 text-muted" for="confPassword">Confirm Password</label>
                                <input id="confPassword" type="password" className="form-control" name="confPassword" required value={confPassword} onChange={(e) => setConfPassword(e.target.value)} />
                                <div className="invalid-feedback">
                                    confirm Password is required
                                </div>
                            </div>

                            <p className="form-text text-muted mb-3">
                                By registering you agree with our terms and condition.
                            </p>

                            <div className="align-items-center d-flex">
                                <button type="submit" className="btn btn-primary ms-auto">
                                    Register	
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="card-footer py-3 border-0">
                        <div className="text-center">
                            Already have an account? <Link to="/login"><a className="text-dark">Login</a></Link>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-5 text-muted">
                    Copyright &copy; 2017-2021 &mdash; Your Company 
                </div>
            </div>
        </div>
    </div>
</section>
)
}

export default Register