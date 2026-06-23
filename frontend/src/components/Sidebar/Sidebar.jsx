import styles from "./Sidebar.module.css";

const Sidebar = ({ items }) => {
  return (
    <aside className={styles.sidebar}>
      {items.map(item => (
        <button
          key={item.id}
          className={styles.menuItem}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;