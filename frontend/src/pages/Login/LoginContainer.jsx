import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import { login } from '../../services/api';


class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email:    '',
      password: '',
      error:    '',
      loading:  false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: '' });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: '' });
    try {
      const { data } = await login(this.state.email, this.state.password);
      localStorage.setItem('token', data.access_token);
      this.props.navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Помилка входу';
      this.setState({ error: msg });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Login
        email={this.state.email}
        password={this.state.password}
        error={this.state.error}
        loading={this.state.loading}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        onGoRegister={() => this.props.navigate('/register')}
      />
    );
  }
}

function LoginWithNavigate(props) {
  const navigate = useNavigate();
  return <LoginContainer {...props} navigate={navigate} />;
}

export default LoginWithNavigate;