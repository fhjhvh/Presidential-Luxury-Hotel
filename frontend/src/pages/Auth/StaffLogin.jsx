import React from 'react';
import { useNavigate } from 'react-router-dom';

const StaffLogin = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/auth/staff/role-selection');
  }, [navigate]);

  return null;
};

export default StaffLogin;
