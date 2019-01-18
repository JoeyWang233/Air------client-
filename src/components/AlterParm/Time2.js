import {DatePicker,Icon} from 'antd'
import React from 'react'
import moment from 'moment'
class Time2 extends React.Component {
    state = {
      text:this.props.text,
      willText:this.props.text,
      editable: false,
    }
    handleChange = (date,dateString) => {
      this.setState({willText:dateString});
    }
    check = () => {
      let {willText} = this.state
      this.setState({ editable: false ,text:willText})
      if (this.props.onChange) {
        this.props.onChange(willText,willText);
      }
    }
    edit = () => {
      this.setState({ editable: true });
    }
    close = () => {
      this.setState({ editable: false,willText:this.state.text });
    }
    render(){
      const {text,editable} = this.state
      return (
        <div >
          {
            editable ?
              <div>
                <DatePicker onChange={this.handleChange} defaultValue={moment(text,'YYYY-MM-DD')} format='YYYY-MM-DD' allowClear={false}/>
                <span>&nbsp;&nbsp;
                <Icon
                  type="check"
                  onClick={this.check}
                /></span>
                 <span>&nbsp;&nbsp;&nbsp;&nbsp;<Icon
                  type="close"
                  onClick={this.close}
                /></span>
              </div>
              :
              <div>
                {text || ' '}
                <span><Icon
                  type="edit"
                  onClick={this.edit}
                /></span>
              </div>
          }
        </div>
      )
    }
  }
export default Time2