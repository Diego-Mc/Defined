import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useFormRegister } from '../hooks/useFormRegister'
import { userService } from '../services/user.service'

export const Signup = () => {
  const fields = useRef({ fullName: '', username: '', password: '' })

  const handleChange = (newFields) => {
    fields.current = { ...newFields }
  }

  const [register, setField] = useFormRegister(
    { ...fields.current },
    handleChange
  )

  const handleSubmit = (ev) => {
    ev.preventDefault()
    console.log('submitting this:', { ...fields.current })
    userService.signup({ ...fields.current })
  }

  return (
    <form onSubmit={handleSubmit} className="card signup-form auth-form">
      <h3 className="title">Signup</h3>
      <label htmlFor="fullName">Full Name</label>
      <input {...register('fullName', 'text')} placeholder="John Doe" />
      <label htmlFor="username">Username</label>
      <input {...register('username', 'text')} placeholder="john_doe123" />
      <label htmlFor="password">Password</label>
      <input {...register('password', 'password')} placeholder="********" />
      <span>
        <button>Sign up</button>
        <Link to="/login">Login</Link>
      </span>
    </form>
  )
}
