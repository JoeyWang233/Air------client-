import {Radio,Icon} from 'antd'
import React from 'react'
const RadioGroup = Radio.Group
class Ckeck extends React.Component {
    state = {
      value:this.props.value,
      text:this.props.text,
      willText:this.props.text,
      editable: false,
    }
    handleChange = (e) => {
      let willText = e.target.value
      this.setState({ willText});
    }
    check = () => {
      let {willText,value} = this.state
      this.setState({ editable: false,text:willText})
      let index = value.findIndex(function(value,index){
          return value == willText
      })
      if (this.props.onChange) {
        this.props.onChange(willText,index);
      }
    }
    edit = () => {
      this.setState({ editable: true });
    }
    close= () => {
      this.setState({ editable: false, willText:this.state.text });
    }
    render(){
      const {value,text,editable} = this.state
      let radio = []
      for(let i=0;i<value.length;i++){
          radio.push(<Radio key={i} value={value[i]}>{value[i]}</Radio>)
      }
      return (
        <div >
          {
            editable ?
              <div>
                    <RadioGroup onChange={this.handleChange} defaultValue={text}>
                        {radio}
                    </RadioGroup>
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
export default Ckeck