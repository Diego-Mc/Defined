import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useFormRegister } from '../hooks/useFormRegister'
import { userService } from '../services/user.service'

export const Login = () => {
  const fields = useRef({ username: '', password: '' })

  const handleChange = (newFields) => {
    fields.current = { ...newFields }
  }

  const [register, setField] = useFormRegister(
    { ...fields.current },
    handleChange
  )

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    console.log('submitting this:', { ...fields.current })
    const user = await userService.login({ ...fields.current })
    console.log('successful!', user)
  }

  return (
    <form onSubmit={handleSubmit} className="card signup-form auth-form">
      <h3 className="title">Login</h3>
      <label htmlFor="username">Username</label>
      <input {...register('username', 'text')} placeholder="john_doe123" />
      <label htmlFor="password">Password</label>
      <input {...register('password', 'password')} placeholder="********" />
      <span>
        <button>Login</button>
        <Link to="/signup">Sign up</Link>
      </span>
    </form>
  )
}
