import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  username: string;
  password: string;
  role: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  
    axios
      .get<User[]>('/Login.json')
      .then((response) => {
        const data = response.data;
        const user = data.find((user: User) => user.username === username && user.password === password);
  
        if (user) {
          // Login successful
          localStorage.setItem('currentUser', JSON.stringify(user));
          navigate('/FoodList');
          toast.success('Welcome!!', {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          // Login failed
          toast.error('Invalid username or password', {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })
      .catch((error) => {
        console.log('Error fetching login data:', error);
      });
 
  };

  let cont={
    backgroundColor: 'black',
     minHeight: '100vh',
     
     
  }
  let head={
    color: 'white' ,
     fontFamily:'cursive',
     
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
              <h5 className="card-title text-center">Login</h5>
              <form onSubmit={handleLogin}>
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
                <div className="text-end">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
