import {InputNumber,Icon} from 'antd'
import React from 'react'
class InputCell extends React.Component {
    state = {
        text: this.props.text,
        willText: this.props.text,
        editable: false,
    }
    handleChange = (value) => {
        this.setState({ willText:value });
    }
    check = () => {
        let {willText} = this.state
        this.setState({ editable: false ,text:willText});
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
    render() {
        const { text, editable } = this.state;
        return (
        <div>
          {
            editable ?
              <div >
                 <InputNumber style={{width:'60px'}} step={this.props.step} defaultValue={text} onChange={this.handleChange} />
                <span>&nbsp;&nbsp;<Icon
                  type="check"
                  onClick={this.check}
                /></span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;<Icon
                  type="close"
                  onClick={this.close}
                /></span>
              </div>
              :
              <div >
                {text || ' '}
                <span><Icon
                  type="edit"
                  onClick={this.edit}
                /></span>
              </div>
          }
        </div>
      );
    }
  }
  export default InputCell