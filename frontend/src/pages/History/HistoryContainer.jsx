import React, { Component } from 'react';
import History from './History';
import HeaderContainer from '../../components/Header/HeaderContainer';
import { getHistory } from '../../services/api';

class HistoryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { predictions: [], loading: true };
  }

  componentDidMount() {
    this.loadHistory();
  }

  loadHistory = async () => {
    try {
      const { data } = await getHistory();
      this.setState({ predictions: data, loading: false });
    } catch {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <>
        <HeaderContainer />
        <History
          predictions={this.state.predictions}
          loading={this.state.loading}
        />
      </>
    );
  }
}

export default HistoryContainer;