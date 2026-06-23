import React, { Component } from 'react';
import styles from './Uploader.module.css';

class Uploader extends Component {
  render() {
    const { onFileUpload, fileName } = this.props;

    return (
      <div className={styles.uploadBox}>
        <input 
          type="file" 
          id="fileInput" 
          className={styles.hiddenInput} 
          accept=".csv"
          onChange={onFileUpload}
        />
        <label htmlFor="fileInput" className={styles.uploadButton}>
          {fileName ? `Файл: ${fileName}` : "Обрати CSV датасет"}
        </label>
        <p className={styles.hint}>Перетягніть файл сюди або натисніть кнопку (тільки .csv)</p>
      </div>
    );
  }
}

export default Uploader;