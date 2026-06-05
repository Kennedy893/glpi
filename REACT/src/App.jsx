import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import RouteConfig from './config/RouteConfig';

function App() {
  console.log('App rendering'); 

  return (
    <BrowserRouter>
      <AuthProvider>
        <RouteConfig />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;