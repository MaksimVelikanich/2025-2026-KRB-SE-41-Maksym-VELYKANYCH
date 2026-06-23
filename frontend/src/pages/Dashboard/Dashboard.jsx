import styles from './Dashboard.module.css';

const Dashboard = ({
  activeTab, onTabChange,
  singleResult, singleLoading, singleError, onSingleSubmit,
  batchResult, batchLoading, batchError, onBatchUpload,
}) => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.pageHeader}>
          <h2 className={styles.title}>Dashboard</h2>
          <p className={styles.subtitle}>
            Analyze transactions for fraudulent activity
          </p>
        </div>

        <div className={styles.tabs}>
          <button
            className={activeTab === 'single'
              ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => onTabChange('single')}
          >
            Single Transaction
          </button>
          <button
            className={activeTab === 'batch'
              ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => onTabChange('batch')}
          >
            Batch CSV
          </button>
        </div>

        {activeTab === 'single' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Single Transaction Check</h3>
            <p className={styles.hint}>
              Paste a CSV row with 30 values (V1–V28, Amount, Time)
            </p>
            <form onSubmit={onSingleSubmit} className={styles.form}>
              <textarea
                className={styles.textarea}
                name="csvRow"
                placeholder="-1.3598, -0.0727, 2.5363, 1.3781, -0.3383 ..."
                rows={4}
                required
              />
              <button
                type="submit"
                className={styles.button}
                disabled={singleLoading}
              >
                {singleLoading ? 'Analyzing...' : 'Analyze Transaction'}
              </button>
            </form>

            {singleError && (
              <div className={styles.error}>{singleError}</div>
            )}

            {singleResult && (
              <div className={singleResult.is_fraud
                ? `${styles.result} ${styles.resultFraud}`
                : `${styles.result} ${styles.resultOk}`}
              >
                <div className={styles.resultBadge}>
                  {singleResult.is_fraud ? 'FRAUD' : 'LEGITIMATE'}
                </div>
                <div className={styles.resultDetails}>
                  <span>
                    Probability:&nbsp;
                    <strong>
                      {(singleResult.probability * 100).toFixed(1)}%
                    </strong>
                  </span>
                  <span className={styles.dot}>·</span>
                  <span>
                    Risk level:&nbsp;
                    <strong>{singleResult.risk_level}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'batch' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Batch Analysis</h3>
            <p className={styles.hint}>
              Upload a CSV file to analyze multiple transactions at once
            </p>

            <label className={styles.uploadLabel}>
              <input
                type="file"
                accept=".csv"
                className={styles.hiddenInput}
                onChange={onBatchUpload}
                disabled={batchLoading}
              />
              {batchLoading ? 'Processing...' : 'Upload CSV File'}
            </label>

            {batchError && (
              <div className={styles.error}>{batchError}</div>
            )}

            {batchResult && (
              <div className={styles.batchStats}>
                <div className={styles.statCard}>
                  <p className={styles.statNum}>{batchResult.total}</p>
                  <p className={styles.statLabel}>Total</p>
                </div>
                <div className={`${styles.statCard} ${styles.statDanger}`}>
                  <p className={styles.statNum}>{batchResult.fraud_count}</p>
                  <p className={styles.statLabel}>Fraudulent</p>
                </div>
                <div className={`${styles.statCard} ${styles.statSuccess}`}>
                  <p className={styles.statNum}>
                    {batchResult.total - batchResult.fraud_count}
                  </p>
                  <p className={styles.statLabel}>Legitimate</p>
                </div>
                <div className={styles.statCard}>
                  <p className={styles.statNum}>
                    {(batchResult.fraud_rate * 100).toFixed(2)}%
                  </p>
                  <p className={styles.statLabel}>Fraud Rate</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;