import React from 'react'
import PropTypes from 'prop-types'
import {Button,Table,Input,Icon} from 'antd';
import { connect } from 'dva'
const Detail = ({ statusDetail,dispatch}) => {
    const columns = [{
      dataIndex: 'prop1',
      width:'15%',
    },{
      dataIndex: 'value1',
      width:'30%',
    },{
      dataIndex: 'prop2',
      width:'15%',
    },{
      dataIndex: 'value2',
    },];
    return (
     <div>
       <div>
       <span>Latest status of {statusDetail.DevSN}</span>
       {/* <span><Button size={'large'} type='primary' style={{position: 'absolute',right: 64}} onClick={()=>{dispatch({type: 'Dev/alter'})}}>{Dev.alter? 'Confirm' : 'Alter'}</Button></span> */}
       </div>
       <br/>
     <Table columns={columns}
      showHeader={false}
      dataSource={statusDetail.data}
      pagination={false}
      size='small'
      scroll={{ y: 480 }}
      bordered
      />
      </div>
      )
  }
  
  Detail.propTypes = {
    statusDetail: PropTypes.object,
  }
  
  export default connect(({ statusDetail, loading }) => ({ statusDetail, loading: loading.models.statusDetail }))(Detail)