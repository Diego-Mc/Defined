import React, { useEffect } from 'react'
import { useHistory, useNavigation, useSearchParams } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { NavLink, Outlet } from 'react-router-dom'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { userService } from '../services/user.service'

export const Profile = () => {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    const loggedInUser = userService.getLoggedInUser()
    console.log('loggedinuser', loggedInUser)
    if (!loggedInUser) return navigate('/login', { replace: true })
    if (location.pathname === '/profile')
      navigate('bookmarks', { replace: true })
  }, [])

  useEffect(() => {
    if (location.pathname === '/profile')
      navigate('bookmarks', { replace: true })
  }, [location])

  const handleLogout = async () => {
    await userService.logout()
    navigate('/')
  }

  return (
    <main className="profile-view">
      <section className="nav">
        <h2 className="title">My Profile</h2>
        <nav>
          <NavLink to="bookmarks" className="nav-link card">
            <span className="material-symbols-outlined icon">bookmarks</span>
            <span>Bookmarks</span>
          </NavLink>
          <NavLink to="history" className="nav-link card">
            <span className="material-symbols-outlined icon">history</span>
            <span>History</span>
          </NavLink>
          <NavLink to="settings" className="nav-link card">
            <span className="material-symbols-outlined icon">settings</span>
            <span>Settings</span>
          </NavLink>
          <span className="logout-btn card" onClick={handleLogout}>
            <span className="material-symbols-outlined icon">logout</span>
            <span>Log out</span>
          </span>
        </nav>
      </section>
      <section className="route">
        <Outlet />
      </section>
    </main>
  )
}
