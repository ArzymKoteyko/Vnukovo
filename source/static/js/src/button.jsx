import React from 'react'
import '../../css/accept_button.css'

let t1 = 'Выслать код'
let t2 = 'Отправить повторно'

class AcceptButton extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        
    }
    componentWillUnmount() {

    }
    render() {
        return (
            <input 
                className="AcceptButton" 
                type="submit"
                value={this.props.text}>
            </input>
        )
    }
}

export default AcceptButton