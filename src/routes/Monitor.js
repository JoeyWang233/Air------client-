import React from 'react';
import { connect } from 'dva';
import styles from './Monitor.less';
import { Layout, Menu, Icon, Affix, Input, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { withRouter } from 'dva/router';
import Bread from '../components/Bread';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
function Monitor({ app, children, dispatch, location }) {
  const { pathname } = location;
  // pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return (
    <Layout>
      <Header className={styles.header}>
        <Row>
          <Col span={6} offset={14}>
            <Input
              className={styles.search}
              value={app.inputValue}
              onChange={(e) => { dispatch({ type: 'app/inputChange', payload: { e } }); }}
              placeholder="Search DevSN"
              size="large"
              suffix={<Link to={`devices/${app.inputValue}`}><Icon type="search" /></Link>}
            />
          </Col>
          <Col span={4}>
            <Menu mode="horizontal" >
              <SubMenu
                style={{ float: 'right' }}
                title={<span><Icon type="user" />{'user.username'}</span>}
              >
                <Menu.Item key="logout">Sign out</Menu.Item>
              </SubMenu>
            </Menu>
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider
          width="130"
          breakpoint="lg"
          onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
        >
          <div className="logo" />
          <Affix>
            <Menu theme="dark" mode="inline" selectedKeys={[pathname]}>
              <Menu.Item key="/">
                <Link to={'/'}>
                  <div>
                    <Icon type="home" />
                    <span className="nav-text">Home</span>
                  </div>
                </Link>
              </Menu.Item>
              <Menu.Item key="/monitor">
                <Link to={'/monitor'}>
                  <div>
                    <Icon type="video-camera" />
                    <span className="nav-text">Monitor</span>
                  </div>
                </Link>
              </Menu.Item>
              <Menu.Item key="/devices">
                <Link to={'/devices'}>
                  <div>
                    <Icon type="database" />
                    <span className="nav-text">Devices</span>
                  </div>
                </Link>
              </Menu.Item>
              <Menu.Item key="/upgrade">
                <Link to={'/upgrade'}>
                  <div>
                    <Icon type="database" />
                    <span className="nav-text">Upgrade</span>
                  </div>
                </Link>
              </Menu.Item>
            </Menu>
          </Affix>
        </Sider>
        <Layout style={{ padding: '5px 14px' }}>
          <Bread location={location} />
          <Content style={{ margin: '0px 16px 0' }}>
            <div className={styles.content}>
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

function mapStateToProps(state) {
}


export default withRouter(connect(({ app }) => ({ app }))(Monitor));
