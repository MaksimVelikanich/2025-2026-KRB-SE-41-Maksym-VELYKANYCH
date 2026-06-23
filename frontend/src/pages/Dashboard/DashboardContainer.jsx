import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import HeaderContainer from '../../components/Header/HeaderContainer';
import { predictSingle, predictBatch, getHistory } from '../../services/api';

class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab:       'single',
      singleResult:    null,
      singleLoading:   false,
      singleError:     '',
      batchResult:     null,
      batchLoading:    false,
      batchError:      '',
      lastPredictions: [],
      stats: { total: 0, fraudCount: 0 }
    };
  }

  componentDidMount() {
    this.loadHistory();
  }

  loadHistory = async () => {
    try {
      const { data } = await getHistory();
      this.setState({ lastPredictions: data.slice(0, 3) });
    } catch {
      // тихо ігноруємо
    }
  };
  

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  parseCsvRow = (row) => {
    const values = row.trim().split(',').map(Number);
  
    const keys = [
      'V1','V2','V3','V4','V5','V6','V7','V8','V9','V10',
      'V11','V12','V13','V14','V15','V16','V17','V18','V19','V20',
      'V21','V22','V23','V24','V25','V26','V27','V28',
      'Amount'
    ];
  
    if (values.length < 29) {
      throw new Error('Row must contain at least 29 values (V1-V28 + Amount)');
    }
  
    const result = Object.fromEntries(keys.map((k, i) => [k, values[i]]));
  
    result.Time = values[29] ?? 50000;
  
    return result;
  };

  handleSingleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ singleLoading: true, singleError: '', singleResult: null });
    try {
      const csvRow = e.target.csvRow.value;
      const transaction = this.parseCsvRow(csvRow);
      const { data } = await predictSingle(transaction);
      this.setState({ singleResult: data });
      this.loadHistory();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Помилка перевірки';
      this.setState({ singleError: msg });
    } finally {
      this.setState({ singleLoading: false });
    }
  };

  handleBatchUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    this.setState({ batchLoading: true, batchError: '', batchResult: null });
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await predictBatch(formData);
      this.setState({ batchResult: data });
      this.loadHistory();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Помилка завантаження файлу';
      this.setState({ batchError: msg });
    } finally {
      this.setState({ batchLoading: false });
    }
  };

  render() {
    return (
      <>
        <HeaderContainer />
        <Dashboard
          activeTab={this.state.activeTab}
          onTabChange={this.handleTabChange}
          singleResult={this.state.singleResult}
          singleLoading={this.state.singleLoading}
          singleError={this.state.singleError}
          onSingleSubmit={this.handleSingleSubmit}
          batchResult={this.state.batchResult}
          batchLoading={this.state.batchLoading}
          batchError={this.state.batchError}
          onBatchUpload={this.handleBatchUpload}
          lastPredictions={this.state.lastPredictions}
        />
      </>
    );
  }
}

function DashboardWithNavigate(props) {
  const navigate = useNavigate();
  return <DashboardContainer {...props} navigate={navigate} />;
}

export default DashboardWithNavigate;