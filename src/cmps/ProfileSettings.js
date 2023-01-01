import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useFormRegister } from '../hooks/useFormRegister'
import { userService } from '../services/user.service'

export const ProfileSettings = () => {
  const fields = useRef({
    username: '',
    password: '',
    profilePic: '',
  })
  const [register, setFields] = useFormRegister(fields.current)
  useEffect(() => {
    ;(async () => {
      const user = await userService.getLoggedInUser()
      const newFields = {
        username: user.username,
        profilePic: user.imgUrl,
      }
      setFields((prevFields) => ({ ...prevFields, ...newFields }))
    })()
  }, [])

  return (
    <section className="profile-settings profile-sections-wrapper">
      <form className="auth-form card">
        <h4>Update Password</h4>
        <label htmlFor="password">Current Password</label>
        <input {...register('password', 'password')} placeholder="********" />
        <label htmlFor="newPassword">New Password</label>
        <input
          {...register('newPassword', 'password')}
          placeholder="********"
        />
        <label htmlFor="newPasswordVerify">Verify New Password</label>
        <input
          {...register('newPasswordVerify', 'password')}
          placeholder="********"
        />
        <span>
          <button>Update</button>
        </span>
      </form>
      <form className="auth-form card">
        <h4>Update Username</h4>
        <label htmlFor="username">Username</label>
        <input {...register('username', 'text')} placeholder="john_doe123" />
        <label htmlFor="passwordVerify">Current Password</label>
        <input
          {...register('passwordVerify', 'password')}
          placeholder="********"
        />
        <span>
          <button>Update</button>
          <Link to="/signup">Reset</Link>
        </span>
      </form>
    </section>
  )
}
