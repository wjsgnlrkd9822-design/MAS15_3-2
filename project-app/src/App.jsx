// src/App.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManage     from './pages/admin/UserManage'
import Service        from './pages/admin/Service'
import RoomInsert     from './pages/admin/RoomInsert'
import RoomUpdate     from './pages/admin/RoomUpdate'
import ServiceInsert  from './pages/admin/ServiceInsert'
import ServiceUpdate  from './pages/admin/ServiceUpdate'
import Trainer        from './pages/admin/Trainer'
import TrainerInsert  from './pages/admin/TrainerInsert'
import TrainerUpdate  from './pages/admin/TrainerUpdate'
import Notice         from './pages/admin/Notice'
import PetStatus      from './pages/admin/PetStatus'
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import HomePage from "./components/home/HomePage"
import RoomListPage from "./components/reservation/RoomListPage"
import ReservationDetailPage from "./components/reservation/ReservationDetailPage"
import IntroducePage from "./components/introduce/IntroducePage"
import Mypage from "./pages/Mypage"
import Join from "./pages/Join"
import Login from "./pages/Login"

// 일반 레이아웃 (Header + Footer 있음)
function UserLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 일반 페이지 - Header/Footer 있음 */}
        <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
        <Route path="/pet/reservation" element={<UserLayout><RoomListPage /></UserLayout>} />
        <Route path="/pet/reservation/:roomNo" element={<UserLayout><ReservationDetailPage /></UserLayout>} />
        <Route path="/pet/introduce" element={<UserLayout><IntroducePage /></UserLayout>} />
        <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
        <Route path="/join" element={<UserLayout><Join /></UserLayout>} />
        <Route path="/mypage" element={<UserLayout><Mypage /></UserLayout>} />

        {/* 어드민 페이지 - Header/Footer 없음 */}
        <Route path="/admin"                   element={<AdminDashboard />} />
        <Route path="/admin/usermanage"        element={<UserManage />} />
        <Route path="/admin/service"           element={<Service />} />
        <Route path="/admin/roominsert"        element={<RoomInsert />} />
        <Route path="/admin/roomup"            element={<RoomUpdate />} />
        <Route path="/admin/serviceinsert"     element={<ServiceInsert />} />
        <Route path="/admin/serviceupdate"     element={<ServiceUpdate />} />
        <Route path="/admin/trainer"           element={<Trainer />} />
        <Route path="/admin/trainerinsert"     element={<TrainerInsert />} />
        <Route path="/admin/trainerupdate"     element={<TrainerUpdate />} />
        <Route path="/admin/notice"            element={<Notice />} />
        <Route path="/admin/petstatus"         element={<PetStatus />} />

      </Routes>
    </BrowserRouter>
  )
}