import styles from './Register.module.css';

const Register = ({ email, password, confirmPassword, error, loading, onChange, onSubmit, onGoLogin }) => {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.subtitle}>Create a new account</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} type="email" name="email"
              value={email} onChange={onChange} placeholder="your@email.com" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input className={styles.input} type="password" name="password"
              value={password} onChange={onChange} placeholder="at least 6 characters" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Confirm password</label>
            <input className={styles.input} type="password" name="confirmPassword"
              value={confirmPassword} onChange={onChange} placeholder="••••••••" required />
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Registration...' : 'Register'}
          </button>
        </form>

        <p className={styles.footer}>
        Already have an account?{' '}
          <span className={styles.link} onClick={onGoLogin}>Entry</span>
        </p>
      </div>
    </div>
  );
};

export default Register;