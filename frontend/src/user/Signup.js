import React, { useState } from 'react'
import Layout from '../core/Layout'
import { signup } from '../auth'
import { Link } from 'react-router-dom'

const Signup = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false,
  })

  const { name, email, password, success, error } = values

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value })
  }

  const clickSubmit = (event) => {
    event.preventDefault()
    setValues({ ...values, error: false })
    signup({ name, email, password }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false })
      } else {
        setValues({
          ...values,
          name: '',
          email: '',
          password: '',
          error: '',
          success: true,
        })
      }
    })
  }

  const signupForm = () => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            type="text"
            onChange={handleChange('name')}
            className="form-control"
            value={name}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            type="email"
            onChange={handleChange('email')}
            className="form-control"
            value={email}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            type="password"
            onChange={handleChange('password')}
            className="form-control"
            value={password}
          />
        </div>

        <button onClick={clickSubmit} className="btn btn-primary">
          Submit
        </button>
      </form>
    )
  }

  const showError = () => {
    return (
      <div
        className="alert alert-danger"
        style={{ display: error ? '' : 'none' }}
      >
        {error}
      </div>
    )
  }

  const showSuccess = () => {
    return (
      <div
        className="alert alert-success"
        style={{ display: success ? '' : 'none' }}
      >
        New Account is created. Please <Link to="/signin">Signin</Link>.
      </div>
    )
  }

  return (
    <Layout
      title="Signup"
      description="Signup to Node React E-Commerce App"
      className="container col-md-8 offset-md-2"
    >
      {showSuccess()}
      {showError()}
      {signupForm()}
    </Layout>
  )
}

export default Signup
