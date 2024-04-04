// PrivateRoute.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ condition, redirectPath, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!condition) {
      navigate(redirectPath);
    }
  }, [condition, navigate, redirectPath]);

  return condition ? children : null;
};

export default PrivateRoute;