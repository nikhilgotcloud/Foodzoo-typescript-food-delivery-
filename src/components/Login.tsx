import { useState,useEffect} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate, Link } from 'react-router-dom';

// interface User {
//   username: string;
//   password: string;
//   role: string;
// }

const Login: React.FC = () => {
  const navigate= useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role,setRole] = useState<string>('');
  

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  async function submit(e: any) {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/', {
        username,
        password,
        role,
      });

      if (response.status === 200) {
        const { token,role } = response.data;

        // Save the token in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('foodToken', token);
        localStorage.setItem('role', role);
        setRole(role)

        // Save the current user's ID to local storage
      const { userId } = response.data;
      localStorage.setItem('userId', userId);


        navigate('/FoodList');
        toast.success('Welcome', {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (response.data === 'notexist') {
        toast.error("Username does not exist. Please login with valid Crendentials!! ", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (e) {
      toast.error("Invalid Credentials. Please check and try again!! ", {
        position: toast.POSITION.TOP_CENTER,
      });
      console.log(e);
    }
  }

  

  // const navigate = useNavigate();

  // const handleLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
  
  //   axios
  //     .get<User[]>('/Login.json')
  //     .then((response) => {
  //       const data = response.data;
  //       const user = data.find((user: User) => user.username === username && user.password === password);
  
  //       if (user) {
  //         // Login successful
  //         localStorage.setItem('currentUser', JSON.stringify(user));
  //         navigate('/FoodList');
  //         toast.success('Welcome!!', {
  //           position: toast.POSITION.TOP_CENTER,
  //         });
  //       } else {
  //         // Login failed
  //         toast.error('Invalid username or password', {
  //           position: toast.POSITION.TOP_CENTER,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log('Error fetching login data:', error);
  //     });
 
  // };

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
              <form  action="POST"
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
                  <button type="submit" className="btn btn-primary" onClick={submit}>
                    Login
                  </button>
                </div>
              </form>
            </div>
            <div className='text-center'><button className=" text-center  btn btn-danger" ><Link to="/signup" style={{color:'white'}} className="text-decoration-none">Signup</Link> </button></div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
