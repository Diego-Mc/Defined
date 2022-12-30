import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { userService } from '../services/user.service'

export const Profile = () => {
  const navigate = useNavigate()
  useEffect(() => {
    console.log('hey')
    const loggedInUser = userService.getLoggedInUser()
    console.log('loggedinuser', loggedInUser)
    if (!loggedInUser) navigate('/login')
  }, [])

  return <div>Profile</div>
}
