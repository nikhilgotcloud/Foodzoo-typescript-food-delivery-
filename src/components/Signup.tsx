import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [otpSent, setOTPSent] = useState(false);


  const navigate = useNavigate();
  const sendOTP = async () => {
    try {
      const response = await axios.post('http://localhost:8000/send-otp', { email });
      if (response.status === 200) {
        toast.success('OTP has been sent to your email. Please check your inbox.', {
          position: toast.POSITION.TOP_CENTER,
        });
        setOTPSent(true);
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please enter correct email.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  async function submit(e: any) {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/signup", {
        username, password, role, email, otp
      })
      if (response.status === 200) {

        toast.success("signup sucess.Please Login ", {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate('/')
      }
    } catch (error:any) {
      if (error.response) {
        const errorMessage = error.response.data;
  
        if (errorMessage === 'Username already exists') {
          toast.warning("Username already exists. Please Choose diff. Username", {
            position: toast.POSITION.TOP_CENTER,
          });
        } else if (errorMessage === 'Email already exists') {
          toast.warning("Email already exists. Please Login with different mail", {
            position: toast.POSITION.TOP_CENTER,
          });
        } else if (errorMessage === 'Invalid OTP') {
          toast.warning("Please enter correct OTP..", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } else {
        toast.error("Failed to sign up. Please try again", {
          position: toast.POSITION.TOP_CENTER,
        });
        console.log(error);
      }
    }
  }
  let cont = {
    backgroundColor: 'black',
    minHeight: '100vh',


  }
  let head = {
    color: 'white',
    fontFamily: 'cursive',

  }

  return (
    <div className="container-fluid" style={cont}>
      <div className="row">
        <div className="col-md-6">
          <h1 className="m-5 text-center " style={head}>
            <b>Food Zoo</b>
          </h1>
        </div>
        <div className="col-md-6">
          <div className="card m-4"  >
            <div className="card-body"  >
              <h5 className="card-title text-center">Signup</h5>
              <form action="POST"
              // onSubmit={handleLogin}
              >
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {otpSent ? (
                  <div className="row mb-3">
                    <div className="col">
                      <label htmlFor="otp" className="form-label">
                        Enter OTP Sent on Your Email
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ width: '70%' }}
                        id="otp"
                        value={otp}
                        onChange={(e) => setOTP(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ) : null}
                {otpSent ? (
                  <div className="col-12 text-end mb-3" style={{'marginTop':"-8%"}}>
                    <button type="button" className="btn btn-primary" onClick={sendOTP}>
                      Resend OTP
                    </button>
                  </div>
                ) : (
                  <div className="col text-end mt-4">
                    <button type="button" className="btn btn-primary" onClick={sendOTP}>
                      Send OTP
                    </button>
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 "><label>Select Role:
                  <select
                    value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">Select</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </label></div>
                <div className="text-end">
                  <button type="submit" className="btn btn-primary" onClick={submit}>
                    Signup
                  </button>
                </div>
              </form>
            </div>
            <div className='text-center'><button className=" text-center  btn btn-danger mb-2" ><Link to="/" style={{ color: 'white' }} className="text-decoration-none">Login</Link> </button></div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default Signup