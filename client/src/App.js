import React, { useContext} from 'react';
import  { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { AuthProvider, AuthContext} from './context/auth';

import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { Container } from 'semantic-ui-react';

const PrivateRoute = ({ component: Component, authRequired, ...rest }) => {
  const { user } = useContext(AuthContext);

  if (authRequired && !user) {
    return <Navigate to="/login" replace />;
  }

  if (!authRequired && user) {
    return <Navigate to="/" replace />;
  }

  return <Component {...rest} />;
};

function App() {

  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<PrivateRoute component={Login} authRequired={false} />} />
            <Route path="/register" element={<PrivateRoute component={Register} authRequired={false} />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
