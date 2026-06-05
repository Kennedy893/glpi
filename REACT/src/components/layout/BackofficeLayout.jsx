import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar';
import '../../assets/css/backoffice.css';

export const BackofficeLayout = ({ children }) => {
  return (
    <div className="backoffice-layout">
      <Navbar />
      <main className="backoffice-content">
        <div className="content-container">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};