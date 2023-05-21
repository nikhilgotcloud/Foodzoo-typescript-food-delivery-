import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const navigate=useNavigate()
  const urlParams = new URLSearchParams(window.location.search);
  const totalAmount = urlParams.get('totalAmount');


  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success('Address saved successfully!', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  let dv = {
    backgroundColor: 'black',
  };

  let wv = {
    color: 'white',
    fontFamily:'cursive'
  };
  const handleLogout = () => {
    
    navigate('/');
    toast.success("You are logged out!!!", {
      position: toast.POSITION.TOP_CENTER,
      
    })};

  return (
    <>
      <nav className="navbar bg-body-dark">
        <div className="container-fluid p-2" style={dv}>
          <h1 className="navbar-brand ms-4" style={wv}>
            Food Zoo
          </h1>
          <button type="button" className="btn btn-primary"  onClick={handleLogout} >
              Logout
            </button>
        </div>
      </nav>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <img
              src="https://catalog.wlimg.com/1/1197028/other-images/table-615849..jpg"
              alt={'cdscs'}
              className="img-fluid"
            />
          </div>
          <div className="col-md-6">
            <div className="text-start">
              <h3><b> Amount to be paid : ₹{totalAmount}</b></h3>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Delivery Address</h5>
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-2">
                    <label htmlFor="fullName" className="form-label" >
                      Full Name
                    </label>
                    <input type="text" className="form-control" id="fullName" required />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <input type="text" className="form-control" id="address" required />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="zip" className="form-label">
                      ZIP Code
                    </label>
                    <input type="text" className="form-control" id="zip" required />
                  </div>
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
