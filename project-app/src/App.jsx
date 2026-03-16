// src/App.jsx
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
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
import NoticeDetail from './pages/notice/Noticedetail'
import NoticeEdit from './pages/notice/Noticeedit'
import NoticeList from './pages/notice/Noticelist'
import OAuth2Callback from './components/Login/OAuth2Callback'

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

// 어드민 Route 가드 - 토큰 없으면 로그인 페이지로
function AdminRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
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
        <Route path="/noticelist"       element={<UserLayout><NoticeList /></UserLayout>} />
<Route path="/noticedetail/:no" element={<UserLayout><NoticeDetail /></UserLayout>} />
<Route path="/noticewrite"      element={<UserLayout><NoticeEdit /></UserLayout>} />
<Route path="/noticeupdate/:no" element={<UserLayout><NoticeEdit /></UserLayout>} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />

        {/* 어드민 페이지 - Header/Footer 없음, 토큰 없으면 로그인으로 */}
        <Route path="/admin"               element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/usermanage"    element={<AdminRoute><UserManage /></AdminRoute>} />
        <Route path="/admin/service"       element={<AdminRoute><Service /></AdminRoute>} />
        <Route path="/admin/roominsert"    element={<AdminRoute><RoomInsert /></AdminRoute>} />
        <Route path="/admin/roomup"        element={<AdminRoute><RoomUpdate /></AdminRoute>} />
        <Route path="/admin/serviceinsert" element={<AdminRoute><ServiceInsert /></AdminRoute>} />
        <Route path="/admin/serviceupdate" element={<AdminRoute><ServiceUpdate /></AdminRoute>} />
        <Route path="/admin/trainer"       element={<AdminRoute><Trainer /></AdminRoute>} />
        <Route path="/admin/trainerinsert" element={<AdminRoute><TrainerInsert /></AdminRoute>} />
        <Route path="/admin/trainerupdate" element={<AdminRoute><TrainerUpdate /></AdminRoute>} />
        <Route path="/admin/notice"        element={<AdminRoute><Notice /></AdminRoute>} />
        <Route path="/admin/petstatus"     element={<AdminRoute><PetStatus /></AdminRoute>} />

      </Routes>
    </BrowserRouter>
  )
}