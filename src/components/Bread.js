import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'
import { Link } from 'react-router-dom'
import pathToRegexp from 'path-to-regexp'
import styles from './Bread.less'

const Bread = ({ location }) => {
let menu= [
    {
      id: 1,
      icon: 'home',
      name: 'Home',
      route: '/',
    },{
      id: 2,
      icon: 'video-camera',
      name: 'Monitor',
      route: '/monitor',
    },{
      id: 3,
      icon: 'database',
      name: 'Devices',
      route: '/devices',
    },{
      id: 4,
      icon: 'file-text',
      name: 'Detail',
      route: '/devices/:DevSN',
    },{
      id: 5,
      icon: 'database',
      name: 'Upgrade',
      route: '/upgrade',
    },
  ]

  const pathSnippets = location.pathname.split('/').filter(i => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    let name,icon;
    for (let i in menu) {
        if (menu[i].route && pathToRegexp(menu[i].route).exec(url)) {
            name = menu[i].name
            icon = menu[i].icon
            break
        }
    }
    return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>
          <span><Icon type={icon} style={{ marginRight: 4 }} />{name}</span>
          </Link>
        </Breadcrumb.Item>
    )
  });
  const breadcrumbItems = [(
    <Breadcrumb.Item key="home">
        <Link to='/'>
          <span><Icon type='home' style={{ marginRight: 4 }} />Home</span>
        </Link>
    </Breadcrumb.Item>
  )].concat(extraBreadcrumbItems);
  // 递归查找父级
//   const breads = pathArray.map((item, key) => {
//     const content = (
//       <span>{item.icon
//         ? <Icon type={item.icon} style={{ marginRight: 4 }} />
//         : ''}{item.name}</span>
//     )
//     return (
//       <Breadcrumb.Item key={key}>
//         {((pathArray.length - 1) !== key)
//           ? <Link to={pathToRegexp.compile(item.route || '')(paramMap) || '#'}>
//             {content}
//           </Link>
//           : content}
//       </Breadcrumb.Item>
//     )
//   })

  return (
    <div className={styles.bread}>
      <Breadcrumb>
        {breadcrumbItems}
      </Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  location: PropTypes.object,
}

export default Bread
