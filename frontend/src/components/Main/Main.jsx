import React, { Component } from 'react';
import styles from './Main.module.css';
import UploaderContainer from '../Uploader/UploaderContainer';

class Main extends Component {
  render() {
    const { state, onFileUpload } = this.props;

    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Моніторинг Транзакцій</h1>
        <p className={styles.subtitle}>Система виявлення аномалій на базі ML</p>

        <div className={styles.uploadSection}>
          <UploaderContainer 
            onFileUpload={onFileUpload} 
            fileName={state.fileName} 
          />
        </div>

        {/* Показуємо дашборд тільки якщо файл завантажено */}
        {state.isUploaded && (
          <div className={styles.dashboard}>
            <div className={styles.card}>
              <h3>Всього перевірено</h3>
              <p className={styles.number}>{state.stats.total}</p>
            </div>
            <div className={styles.card}>
              <h3>Аномалії (Фрод)</h3>
              <p className={`${styles.number} ${styles.danger}`}>{state.stats.anomalies}</p>
            </div>
            <div className={styles.card}>
              <h3>Чисті операції</h3>
              <p className={`${styles.number} ${styles.success}`}>{state.stats.normal}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Main;