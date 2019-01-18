import {Checkbox,Icon} from 'antd'
import React from 'react'
class Ckeck extends React.Component {
    state = {
      check:this.props.check,
      willCheck:this.props.check,
      text:this.props.text,
      editable: false,
    }
    handleChange = (e) => {
      let willCheck = e.target.checked
      this.setState({willCheck});
    }
    check = () => {
      let {willCheck} = this.state
      let text = willCheck ?  <Icon type="check-square" /> :<Icon type="close-square-o" />
      this.setState({ editable: false,text,check:willCheck});
      if (this.props.onChange) {
        this.props.onChange(text,willCheck?1:0);
      }
    }
    edit = () => {
      this.setState({ editable: true });
    }
    close = () => {
      this.setState({ editable: false,willCheck:this.state.check});
    }
    render(){
      const {check,text,editable} = this.state
      return (
        <div >
          {
            editable ?
              <div>
                  <Checkbox
                  defaultChecked={check}
                  onChange={this.handleChange}
                />
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