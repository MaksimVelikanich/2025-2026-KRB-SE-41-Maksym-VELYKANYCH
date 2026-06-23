import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <span className={styles.logo}>{title}</span>

      <nav className={styles.nav}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          History
        </NavLink>
      </nav>

      <button className={styles.logout} onClick={handleLogout}>
        Log out
      </button>
    </header>
  );
};

export default Header;