import React from 'react';
import { Button, Affix, notification, Card, BackTop } from 'antd';
import socket from '../services/socket.js';
import styles from './real-time_monitor.less';
import { connect } from 'dva';

const ButtonGroup = Button.Group;
let id = {};
let realTimeData = [];
const RealTimeMessage = React.createClass({
  getInitialState() {
    return { ...this.props.monitorStates };
  },
  trace(e) {
    const name = /(.+)-(.+)/.exec(e.target.name);
    const DevSN = name[1];
    const currentId = parseInt(name[2]);
    const lastId = (currentId - 1) ? (currentId - 1) : currentId;
    const nextId = (currentId == this.state.id[DevSN]) ? currentId : (currentId + 1);
    this.setState({
      targetDevSN: DevSN,
      trace: true,
      currentId,
      nextId,
      lastId,
    }, () => {
      setTimeout(() => {
        window.scrollBy(0, 1);
      }, 50);
      this.props.dispatch({ type: 'app/save', payload: { monitorStates: this.state } });
    });
  },
  monitor() {
    socket.emit('monitor');
    this.setState({
      monitor: 'monitoring ...',
    }, () => {
      this.props.dispatch({ type: 'app/save', payload: { monitorStates: this.state } });
    });
    let key = 0;
    socket.on('message', (data) => {
      const dataArray = data.split('\r\n');
      for (let i = 1; i <= dataArray.length - 3; i++) {
        const regExp1 = /#.+ (.+)#/;
        const regExp2 = /\[.+\]/;
        if (regExp1.test(dataArray[i - 1])) {
          const DevSN = regExp1.exec(dataArray[i - 1])[1];
          if (id[DevSN]) {
            id[DevSN]++;
          } else {
            id[DevSN] = 1;
          }
          this.setState({
            id,
          }, () => {
            this.props.dispatch({ type: 'app/save', payload: { monitorStates: this.state } });
          });
          realTimeData.push(<li key={key += i} ><a name={`${DevSN}-${id[DevSN]}`} onClick={e => this.trace(e)}>{dataArray[i - 1]}</a></li>);
        } else if (regExp2.test(dataArray[i - 1])) {
          realTimeData.push(<li key={key += i} style={{ fontSize: 16, color: '#00CC00' }}>{dataArray[i - 1]}</li>);
        } else {
          realTimeData.push(<li key={key += i}>{dataArray[i - 1]}</li>);
        }
      }
      realTimeData.push(<br key={key += 1} />);
      realTimeData.push(<hr key={key += 1} />);
      realTimeData.push(<br key={key += 1} />);
      this.setState({
        log: realTimeData,
      }, () => {
        this.props.dispatch({ type: 'app/save', payload: { monitorStates: this.state } });
      });
    });
  },
  close() {
    socket.removeAllListeners('message');
    socket.emit('closeMonitor');
    socket.on('successClose', () => {
      this.setState({
        monitor: 'Succeed to close the monitor.',
      }, () => {
        this.props.dispatch({ type: 'app/save', payload: { monitorStates: this.state } });
      });
    });
  },
  clear() {
    this.setState({
      log: '',
      id: {},
      currentId: 0,
      targetDevSN: '',
      trace: false,
      nextId: 0,
      lastId: 0,
    }, () => {
      this.props.dispatch({ type: 'app/save', payload: { monitorStates: this.state } });
    });
    id = {};
    realTimeData = [];
    if (this.state.monitor === 'Succeed to close the monitor.') {
      this.setState({
        monitor: '',
      }, () => {
        this.props.dispatch({ type: 'app/save', payload: { monitorStates: this.state } });
      });
    }
  },
  last() {
    const currentId = (this.state.currentId - 1) ? (this.state.currentId - 1) : this.state.currentId;
    const lastId = (currentId - 1) ? (currentId - 1) : currentId;
    const nextId = (currentId === this.state.id[this.state.targetDevSN]) ? currentId : (currentId + 1);
    setTimeout(() => {
      this.setState({
        currentId,
        nextId,
        lastId,
      }, () => {
        this.props.dispatch({ type: 'app/save', payload: { monitorStates: this.state } });
      });
    }, 100);
  },
  next(e) {
    const currentId = (this.state.currentId === this.state.id[this.state.targetDevSN]) ? this.state.currentId : (this.state.currentId + 1);
    const lastId = (currentId - 1) ? (currentId - 1) : currentId;
    const nextId = (currentId === this.state.id[this.state.targetDevSN]) ? currentId : (currentId + 1);
    setTimeout(() => {
      this.setState({
        currentId,
        nextId,
        lastId,
      }, () => {
        this.props.dispatch({ type: 'app/save', payload: { monitorStates: this.state } });
      });
    }, 100);
  },
  closeTrace() {
    this.setState({
      trace: false,
    }, () => {
      this.props.dispatch({ type: 'app/save', payload: { monitorStates: this.state } });
    });
  },
  render() {
    return (
      <div>
        <BackTop />
        <ButtonGroup className={styles.button}>
          <Button type="primary" size="large" onClick={this.monitor}>Monitor</Button>
          <Button type="primary" size="large" onClick={this.close}>Close</Button>
          <Button type="primary" size="large" onClick={this.clear}>Clear</Button>
        </ButtonGroup>
        <hr />
        <h3>{this.state.monitor}</h3>

        {this.state.trace ? (
          <Affix style={{ position: 'absolute', right: 16 }}>
            <Card id="card" title={`To trace the ${this.state.targetDevSN}`} bordered style={{ width: 300 }}>
              <div>
                <a href={`#${this.state.targetDevSN}-${this.state.lastId}`}><Button type="primary" onClick={this.last}> Last </Button></a>
                <span />
                <a href={`#${this.state.targetDevSN}-${this.state.nextId}`}><Button type="primary" onClick={this.next}> Next </Button></a>
                <Button onClick={this.closeTrace} style={{ position: 'absolute', right: 16 }}>Close</Button>
              </div>
            </Card>
          </Affix>
            ) : (<br />)}

        <div>{this.state.log}</div>
      </div>
    );
  },
});
const Operation = ({ app, dispatch }) => {
  return (
    <RealTimeMessage monitorStates={app.monitorStates} dispatch={dispatch} />
  );
};

export default connect(({ app }) => ({ app }))(Operation);
