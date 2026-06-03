import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TicketsPage } from './pages/ticket/TicketsPage';
import { TicketEditPage } from './components/ticket/TicketEdit';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TicketsPage />} />
        <Route path="/tickets/:id/edit" element={<TicketEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;