import React from 'react';
import PhoneInput from 'react-phone-input-2'
import '../../css/phone_input.css'
import PinField from 'react-pin-field';
import '../../css/pin_input.css'
import AcceptButton from './button.jsx'


class UserInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tel_verified: true,
            pin_lenght: 6,
        };
    }
    componentDidMount() {
        fetch('', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstParam: 'yourValue',
                secondParam: 'yourOtherValue'
            })
        });
    }
    componentWillUnmount() {

    }
    render() {
        document.getElementById('UserInput').style.setProperty('--amount', this.state.pin_lenght)
        
        if (!this.state.tel_verified) {
            return (<>
                <form action="" method="post">
                    <PhoneInput
                        country={'ru'}
                    />
                    <h5>{'Телефон'}</h5>
                    <AcceptButton
                        text={'далее'}
                    />
                </form>
            </>)
        }
        else if (this.state.tel_verified) {
            return (<>
                <form action="" method="post">
                    <PhoneInput
                        country={'ru'}
                    />
                    <h5>{'Телефон'}</h5>
                    <PinField
                        class="pin-field"
                        validate="0123456789"
                        inputmode="numeric"
                        length={this.state.pin_lenght}
                    />
                    <h5>{'Код из смс'}</h5>
                    <AcceptButton
                        text={'отправить код'}
                    />
                </form>
            </>)
        }
    }
}

export default UserInput