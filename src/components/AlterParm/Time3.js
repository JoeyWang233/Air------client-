import {Select,DatePicker,Icon} from 'antd'
import React from 'react'
import moment from 'moment'
const Option = Select.Option
let hours = [],minutes = [],seconds = []
for(let i =0;i<24;i++){
    let value = (Array(2).join('0') + i).slice(-2)
    hours.push(<Option key={value}>{value}</Option>)
}
for(let i =0;i<60;i++){
    let value = (Array(2).join('0') + i).slice(-2)
    minutes.push(<Option key={value}>{value}</Option>)
}
seconds = minutes
class Time2 extends React.Component {
    state = {
      text:this.props.text,
      willText:this.props.text,
      editable: false,
    }
    handleDateChange = (date,dateString) => {
      let {willText} = this.state
      let match = /(.*) (.*)/.exec(willText)
      if(match[2]){
        willText = dateString + ' ' + match[2]
      }else{
        willText = dateString + ' 00:00:00'
      }
      this.setState({willText});
    }
    handleHourChange = (value) => {
        let {willText} = this.state
        let yearTime = /(.*) (.*)/.exec(willText)
        let hourTime = []
        if(yearTime[2]){
            hourTime = /.*(:.*:.*)/.exec(yearTime[2])
        }
        if(yearTime[1]){ 
            willText = hourTime[0] ? (yearTime[1] + ' ' + value + hourTime[1]) : (yearTime[1] + ' ' + value + ':00:00')
        }else{
            willText = hourTime[0] ? (value + hourTime[1]) : (value + ':00:00')
        }
        this.setState({ willText });
    }
    handleMinuteChange = (value) => {
        let {willText} = this.state
        let yearTime = /(.*) (.*)/.exec(willText)
        let hourTime = []
        if(yearTime[2]){
            hourTime = /(.*:).*(:.*)/.exec(yearTime[2])
        }
        if(yearTime[1]){ 
            willText = hourTime[0] ? (yearTime[1] + ' ' + hourTime[1] + value + hourTime[2]) : (yearTime[1] + ' ' + '00:' + value + ':00')
        }else{
            willText = hourTime[0] ? (hourTime[1] + value + hourTime[2]) : ('00:' + value + ':00')
        }
        this.setState({ willText });
    }
    handleSecondChange = (value) => {
        let {willText} = this.state
        let yearTime = /(.*) (.*)/.exec(willText)
        let hourTime = []
        if(yearTime[2]){
            hourTime = /(.*:.*:).*/.exec(yearTime[2])
        }
        if(yearTime[1]){ 
            willText = hourTime[0] ? (yearTime[1] + ' ' + hourTime[1] + value) : (yearTime[1] + ' ' + '00:00:' + value)
        }else{
            willText = hourTime[0] ? (hourTime[1] + value) : ('00:00:' + value)
        }
        this.setState({ willText });
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
        this.setState({ editable: false, willText:this.state.text });
    }
    render(){
        const {text,editable} = this.state
        let yearTime = /(.*) (.*)/.exec(text)
        let hourTime = []
        if(yearTime[2]){
            hourTime = /(.*):(.*):(.*)/.exec(yearTime[2])
        }
        return (
        <div >
        {
            editable ?
              <div>
                <DatePicker style={{width:'100px'}} onChange={this.handleDateChange} defaultValue={yearTime[1]?moment(yearTime[1],'YYYY-MM-DD'):moment('')} format='YYYY-MM-DD' allowClear={false}/>
                <span>
                <Select defaultValue={hourTime[1]?hourTime[1]:''} style={{ width: 50 }} onChange={(value)=>this.handleHourChange(value)}>{hours}</Select>
                <span style={{fontWeight:'bold'}}> : </span>
                <Select defaultValue={hourTime[2]?hourTime[2]:''} style={{ width: 50 }} onChange={(value)=>this.handleMinuteChange(value)}>{minutes}</Select>
                <span style={{fontWeight:'bold'}}> : </span>
                <Select defaultValue={hourTime[3]?hourTime[3]:''} style={{ width: 50 }} onChange={(value)=>this.handleSecondChange(value)}>{seconds}</Select>
                </span>
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