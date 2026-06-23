import styles from './Login.module.css';

const Login = ({ email, password, error, loading, onChange, onSubmit, onGoRegister }) => {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.subtitle}>Log in to your account</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Пароль</label>
            <input
              className={styles.input}
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'entry...' : 'Log in'}
          </button>
        </form>

        <p className={styles.footer}>
        Don't have an account?{' '}
          <span className={styles.link} onClick={onGoRegister}>
          Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;