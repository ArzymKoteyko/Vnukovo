import React from 'react'
import '../../css/accept_button.css'

let t1 = 'Выслать код'
let t2 = 'Отправить повторно'

class AcceptButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <input 
                className="AcceptButton" 
                type="button"
                value={this.props.text}
                onClick={this.props.onClick}>
            </input>
        )
    }
}

export default AcceptButton