import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {

	const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
	const [msg, setMsg] = useState(''); 
    const navigate = useNavigate();
	useEffect(() => {
		refreshToken();
	}, []);

	const refreshToken = async () => {
		try {
		  const response = await axios.get('http://localhost:5000/dashboard');
		  if(response.status === 200) {
			navigate("/dashboard")
		  }
		} catch (error) {
		  if(error.response) {
			navigate('/login');
		  }
		}
	  }

    const Auth = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/login', {
                email,
                password,
            });
            navigate('/dashboard')
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
							<h1 className="fs-4 card-title fw-bold mb-4">Login</h1>
							<p className='text'>{msg}</p>
							<form onSubmit={ Auth } className="needs-validation">
								<div className="mb-3">
									<label className="mb-2 text-muted" for="email">E-Mail Address</label>
									<input id="email" type="email" className="form-control" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
									<div className="invalid-feedback">
										Email is invalid
									</div>
								</div>
								<div className="mb-3">
									<div className="mb-2 w-100">
										<label className="text-muted" for="password">Password</label>
									</div>
									<input id="password" type="password" className="form-control" name="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
								    <div className="invalid-feedback">
								    	Password is required
							    	</div>
								</div>

								<div className="d-flex align-items-center">
									<button type="submit" className="btn btn-primary ms-auto">
										Login
									</button>
								</div>
							</form>
						</div>
						<div className="card-footer py-3 border-0">
							<div className="text-center">
								Don't have an account? <Link to="/register"> <a className="text-dark">Create Account</a> </Link>
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

export default Login