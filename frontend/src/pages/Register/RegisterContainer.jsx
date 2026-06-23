import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Register from './Register';
import { register } from '../../services/api';

class RegisterContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '', password: '', confirmPassword: '', error: '', loading: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: '' });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ error: 'Паролі не співпадають' });
      return;
    }
    if (this.state.password.length < 6) {
      this.setState({ error: 'Пароль має бути мінімум 6 символів' });
      return;
    }
    this.setState({ loading: true, error: '' });
    try {
      await register(this.state.email, this.state.password);
      this.props.navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Помилка реєстрації';
      this.setState({ error: msg });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Register
        email={this.state.email}
        password={this.state.password}
        confirmPassword={this.state.confirmPassword}
        error={this.state.error}
        loading={this.state.loading}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        onGoLogin={() => this.props.navigate('/login')}
      />
    );
  }
}

function RegisterWithNavigate(props) {
  const navigate = useNavigate();
  return <RegisterContainer {...props} navigate={navigate} />;
}

export default RegisterWithNavigate;