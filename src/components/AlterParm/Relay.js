import {Checkbox,Icon} from 'antd'
import React from 'react'
const CheckboxGroup = Checkbox.Group
class Relay extends React.Component {
    state = {
      relay:this.props.relay,
      willRelay:this.props.relay,
      text:this.props.text,
      editable: false,
    }
    handleChange = (checkedValues) => {
        let willRelay=[0,0,0,0,0,0,0,0]
        for(let i=0;i<checkedValues.length;i++){
            willRelay[parseInt(checkedValues[i])-1] = 1
        }
        this.setState({willRelay });
    }
    check = () => {
      const {willRelay} = this.state
      const text = (<div>
        <span>{willRelay[0] ? <Icon type="check-square" /> :<Icon type="close-square-o" />}&nbsp;1&nbsp;&nbsp;</span>
        <span>{willRelay[1] ? <Icon type="check-square" /> :<Icon type="close-square-o" />}&nbsp;2&nbsp;&nbsp;</span>
        <span>{willRelay[2] ? <Icon type="check-square" /> :<Icon type="close-square-o" />}&nbsp;3&nbsp;&nbsp;</span>
        <span>{willRelay[3] ? <Icon type="check-square" /> :<Icon type="close-square-o" />}&nbsp;4&nbsp;&nbsp;</span>
        <span>{willRelay[4] ? <Icon type="check-square" /> :<Icon type="close-square-o" />}&nbsp;5&nbsp;&nbsp;</span>
        <span>{willRelay[5] ? <Icon type="check-square" /> :<Icon type="close-square-o" />}&nbsp;6&nbsp;&nbsp;</span>
        <span>{willRelay[6] ? <Icon type="check-square" /> :<Icon type="close-square-o" />}&nbsp;7&nbsp;&nbsp;</span>
        <span>{willRelay[7] ? <Icon type="check-square" /> :<Icon type="close-square-o" />}&nbsp;8</span>
      </div>)
      this.setState({ editable: false,text,relay:willRelay});
      if (this.props.onChange) {
        this.props.onChange(text,willRelay);
      }
    }
    edit = () => {
      this.setState({ editable: true });
    }
    close = () => {
      this.setState({ editable: false, willRelay:this.state.relay });
    }
    render(){
      const {relay,text,editable} = this.state
      let defaultValue=[]
      for(let i=0;i<8;i++){
          if(parseInt(relay[i])){
              defaultValue.push((i+1).toString())
          }
      }
      const plainOptions = ['1','2','3','4','5','6','7','8']
      return (
        <div >
          {
            editable ?
              <div >
                <CheckboxGroup options={plainOptions} defaultValue={defaultValue} onChange={this.handleChange} />
                <span><Icon
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
                <span>{text || ' '}</span>
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
export default Relay