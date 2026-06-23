import { useState } from 'react';
import styles from './History.module.css';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#F87171', '#34D399'];

const Modal = ({ record, onClose }) => {
  if (!record) return null;

  const isSingle = record.type === 'single';

  const pieData = isSingle
    ? [
        { name: 'Fraud probability',  value: record.result.probability },
        { name: 'Safe probability',   value: 1 - record.result.probability },
      ]
    : [
        { name: 'Fraudulent', value: record.result.fraud_count },
        { name: 'Legitimate', value: record.result.total - record.result.fraud_count },
      ];

  const barData = isSingle
    ? [
        { name: 'Fraud %',
          value: parseFloat((record.result.probability * 100).toFixed(1)) },
        { name: 'Safe %',
          value: parseFloat(((1 - record.result.probability) * 100).toFixed(1)) },
      ]
    : [
        { name: 'Fraudulent', value: record.result.fraud_count },
        { name: 'Legitimate',
          value: record.result.total - record.result.fraud_count },
      ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>
              {isSingle ? 'Single Transaction' : 'Batch Analysis'} — Details
            </h3>
            <p className={styles.modalSub}>
              {new Date(record.created_at).toLocaleString('en-GB')}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Stats row */}
        <div className={styles.modalStats}>
          {isSingle ? (
            <>
              <div className={styles.mStat}>
                <p className={styles.mStatVal}>
                  {record.result.is_fraud ? 'FRAUD' : 'LEGITIMATE'}
                </p>
                <p className={styles.mStatLabel}>Verdict</p>
              </div>
              <div className={styles.mStat}>
                <p className={styles.mStatVal}>
                  {(record.result.probability * 100).toFixed(1)}%
                </p>
                <p className={styles.mStatLabel}>Probability</p>
              </div>
              <div className={styles.mStat}>
                <p className={styles.mStatVal}>{record.result.risk_level}</p>
                <p className={styles.mStatLabel}>Risk Level</p>
              </div>
            </>
          ) : (
            <>
              <div className={styles.mStat}>
                <p className={styles.mStatVal}>{record.result.total}</p>
                <p className={styles.mStatLabel}>Total</p>
              </div>
              <div className={styles.mStat}>
                <p className={`${styles.mStatVal} ${styles.danger}`}>
                  {record.result.fraud_count}
                </p>
                <p className={styles.mStatLabel}>Fraudulent</p>
              </div>
              <div className={styles.mStat}>
                <p className={`${styles.mStatVal} ${styles.success}`}>
                  {record.result.total - record.result.fraud_count}
                </p>
                <p className={styles.mStatLabel}>Legitimate</p>
              </div>
              <div className={styles.mStat}>
                <p className={styles.mStatVal}>
                  {(record.result.fraud_rate * 100).toFixed(2)}%
                </p>
                <p className={styles.mStatLabel}>Fraud Rate</p>
              </div>
            </>
          )}
        </div>

        {/* Charts */}
        <div className={styles.charts}>
          <div className={styles.chartBox}>
            <p className={styles.chartTitle}>Distribution</p>
            <PieChart width={220} height={200}>
              <Pie
                data={pieData}
                cx={105} cy={90}
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                paddingAngle={3}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) =>
                  isSingle
                    ? `${(v * 100).toFixed(1)}%`
                    : v
                }
                contentStyle={{
                  background: '#2A2640',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </div>

          <div className={styles.chartBox}>
            <p className={styles.chartTitle}>Comparison</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barSize={40}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#9B96AE', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: '#2A2640',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};


const History = ({ predictions, loading }) => {
  const [selected, setSelected] = useState(null);

  if (loading) return (
    <div className={styles.page}>
      <div className={styles.container}>
        <p className={styles.loading}>Loading...</p>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.pageHeader}>
          <h2 className={styles.title}>History</h2>
          <p className={styles.subtitle}>
            {predictions.length} record{predictions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {predictions.length === 0 ? (
          <div className={styles.empty}>
            No records yet. Go to Dashboard and analyze a transaction.
          </div>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Type</span>
              <span>Result</span>
              <span>Details</span>
              <span>Date</span>
            </div>

            {predictions.map((p) => (
              <div
                key={p.id}
                className={styles.tableRow}
                onClick={() => setSelected(p)}
              >
                <span className={styles.typeCell}>
                  {p.type === 'single' ? 'Single' : 'Batch'}
                </span>

                <span className={
                  (p.result.is_fraud || p.result.fraud_count > 0)
                    ? styles.cellFraud : styles.cellOk
                }>
                  {p.type === 'single'
                    ? (p.result.is_fraud ? 'Fraud' : 'Legitimate')
                    : (p.result.fraud_count > 0 ? 'Fraud detected' : 'Clean')}
                </span>

                <span className={styles.detailCell}>
                  {p.type === 'single'
                    ? `${(p.result.probability * 100).toFixed(1)}%  ·  ${p.result.risk_level}`
                    : `${p.result.fraud_count} / ${p.result.total}  ·  ${(p.result.fraud_rate * 100).toFixed(2)}%`}
                </span>

                <span className={styles.dateCell}>
                  {new Date(p.created_at).toLocaleString('en-GB')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal record={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default History;