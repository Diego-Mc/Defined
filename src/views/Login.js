import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useFormRegister } from '../hooks/useFormRegister'
import { userService } from '../services/user.service'
import { login } from '../store/user.actions'

export const Login = () => {
  const fields = useRef({ username: '', password: '' })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loggedInUser = useSelector(({ user }) => user)

  const handleChange = (newFields) => {
    fields.current = { ...newFields }
  }

  const [register, setField] = useFormRegister(
    { ...fields.current },
    handleChange
  )

  const handleSubmit = (ev) => {
    ev.preventDefault()
    dispatch(login({ ...fields.current }))
  }

  useEffect(() => {
    if (loggedInUser) navigate(-1)
  }, [loggedInUser])

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
