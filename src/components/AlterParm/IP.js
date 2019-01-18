import {Input,Icon} from 'antd'
import React from 'react'
const InputGroup = Input.Group
class InputCell extends React.Component {
    state = {
        text: this.props.text,
        willText: this.props.text,
        editable: false,
    }
    handleChange = (e,key) => {
        let {willText} = this.state
        let ip = /(.*)\.(.*)\.(.*)\.(.*)/.exec(willText)
        if(ip[0]){
            ip[key] = e.target.value
            willText = ip.slice(1).join('.')
        }else{
            ip = ['.','.','.','.']
            ip[key-1] = e.target.value
            willText = ip.join('')
        }
        this.setState({willText});
    }
    check = () => {
        const {willText} = this.state
        this.setState({ editable: false,text:willText});
        if (this.props.onChange) {
            this.props.onChange(willText,willText);
        }
    }
    close = () => {
        this.setState({ editable: false,willText:this.state.text});
    }
    edit = () => {
        this.setState({ editable: true });
    }
    render() {
        const { text, editable } = this.state
        let ip = /(.*)\.(.*)\.(.*)\.(.*)/.exec(text)
        return (
        <div>
          {
            editable ?
              <div >
                <InputGroup compact>
                    <Input onPressEnter={this.check} onChange={(e)=>this.handleChange(e,1)} style={{ width: 35, textAlign: 'center'}} defaultValue={ip[0] ? ip[1] : ''} />
                    {/* <Input style={{ width: 16, borderLeft: 0, pointerEvents: 'none',textAlign: 'center',fontWeight:'bold',backgroundColor: '#fff'}} defaultValue="." disabled /> */}
                    <Input onPressEnter={this.check} onChange={(e)=>this.handleChange(e,2)} style={{ width: 35, textAlign: 'center'}} defaultValue={ip[0] ? ip[2] : ''} />
                    {/* <Input style={{ width: 16, borderLeft: 0, pointerEvents: 'none',textAlign: 'center',fontWeight:'bold',backgroundColor: '#fff'}} defaultValue="." disabled /> */}
                    <Input onPressEnter={this.check} onChange={(e)=>this.handleChange(e,3)} style={{ width: 35, textAlign: 'center'}} defaultValue={ip[0] ? ip[3] : ''} />
                    {/* <Input style={{ width: 16, borderLeft: 0, pointerEvents: 'none',textAlign: 'center',fontWeight:'bold',backgroundColor: '#fff'}} defaultValue="." disabled /> */}
                    <Input onPressEnter={this.check} onChange={(e)=>this.handleChange(e,4)} style={{ width: 35, textAlign: 'center'}} defaultValue={ip[0] ? ip[4] : ''} />
                </InputGroup>
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