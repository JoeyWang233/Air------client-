import {Select,Icon} from 'antd'
import React from 'react'
const Option = Select.Option
class Time1 extends React.Component {
    state = {
      text:this.props.text,
      willText:this.props.text,
      editable: false,
    }
    handleHourChange = (value) => {
      let time = /.+:(.+)/.exec(this.state.willText)
      let willText
      if(time[0]){
        willText = value + ':' + time[1]
      }else{
        willText = value + ':00'
      }
      this.setState({ willText });
    }
    handleMinuteChange = (value) => {
      let time = /(.+):.+/.exec(this.state.willText)
      let willText
      if(time[0]){
        willText = time[1] + ':' + value
      }else{
        willText = '00:' + value
      }
      this.setState({ willText });
    }
    check = () => {
      this.setState({ editable: false,text:this.state.willText});
      if (this.props.onChange) {
        this.props.onChange(this.state.willText,this.state.willText.replace(':',''));
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
      let matchText = /(.*):(.*)/.exec(text)
      let hours = [],minutes = []
      for(let i =0;i<24;i++){
        let value = (Array(2).join('0') + i).slice(-2)
        hours.push(<Option key={value}>{value}</Option>)
      }
      for(let i =0;i<60;i++){
        let value = (Array(2).join('0') + i).slice(-2)
        minutes.push(<Option key={value}>{value}</Option>)
      }
      return (
        <div >
          {
            editable ?
              <div >
                  <Select defaultValue={matchText[1]} style={{ width: 50 }} onChange={(value)=>this.handleHourChange(value)}>{hours}</Select>
                  <span style={{fontWeight:'bold'}}> : </span>
                  <Select defaultValue={matchText[2]} style={{ width: 50 }} onChange={(value)=>this.handleMinuteChange(value)}>{minutes}</Select>
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
                <Icon
                  type="edit"
                  onClick={this.edit}
                />
              </div>
          }
        </div>
      )
    }
  }
export default Time1