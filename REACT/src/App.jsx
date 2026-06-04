import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TicketsPage } from './pages/ticket/TicketsPage';
import { TicketEditPage } from './components/ticket/TicketEdit';
import { UserImportPage } from './pages/UserImportPage';
import { ResetPage } from './pages/ResetPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TicketsPage />} />
        <Route path="/tickets/:id/edit" element={<TicketEditPage />} />
        <Route path="/import" element={<UserImportPage />} />
        <Route path="/reset" element={<ResetPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;