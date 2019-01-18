import {Input,Icon} from 'antd'
import React from 'react'
class InputCell extends React.Component {
    state = {
      value: this.props.value,
      willValue:this.props.value,
      editable: false,
    }
    handleChange = (e) => {
      const willValue = e.target.value;
      this.setState({ willValue });
    }
    check = () => {
      this.setState({ editable: false ,value:this.state.willValue});
      if (this.props.onChange) {
        this.props.onChange(this.state.willValue,this.state.willValue);
      }
    }
    edit = () => {
      this.setState({ editable: true });
    }
    close = () => {
      this.setState({ editable: false,willValue:this.state.value });
    }
    render() {
      const { value, editable } = this.state;
      return (
        <div className="editable-cell">
          {
            editable ?
              <div className="editable-cell-input-wrapper">
                <Input
                  defaultValue={value}
                  onChange={this.handleChange}
                  onPressEnter={this.check}
                  style={{width:'70%'}}
                />
                <span>&nbsp;&nbsp;<Icon
                  type="check"
                  className="editable-cell-icon-check"
                  onClick={this.check}
                /></span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;<Icon
                  type="close"
                  onClick={this.close}
                /></span>
              </div>
              :
              <div className="editable-cell-text-wrapper">
                {value || ' '}
                <span><Icon
                  type="edit"
                  className="editable-cell-icon"
                  onClick={this.edit}
                /></span>
              </div>
          }
        </div>
      );
    }
  }
  export default InputCell