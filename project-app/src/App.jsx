import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./components/home/HomePage";
import RoomListPage from "./components/reservation/RoomListPage";
import ReservationDetailPage from "./components/reservation/ReservationDetailPage";
import IntroducePage from "./components/introduce/IntroducePage";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pet/reservation" element={<RoomListPage />} />
        <Route path="/pet/reservation/:roomNo" element={<ReservationDetailPage />} />
        <Route path="/pet/introduce" element={<IntroducePage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}