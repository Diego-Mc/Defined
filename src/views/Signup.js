import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useFormRegister } from '../hooks/useFormRegister'
import { userService } from '../services/user.service'
import { signup } from '../store/user.actions'

export const Signup = () => {
  const fields = useRef({ fullName: '', username: '', password: '' })

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
    dispatch(signup({ ...fields.current }))
  }

  useEffect(() => {
    if (loggedInUser) navigate(-1)
  }, [loggedInUser])

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
