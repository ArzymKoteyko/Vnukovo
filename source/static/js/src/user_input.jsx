import React from 'react';
import PhoneInput from 'react-phone-input-2'
import '../../css/phone_input.css'
import PinField from 'react-pin-field';
import '../../css/pin_input.css'
import AcceptButton from './button.jsx'


function formatParams( params ){
    return "?" + Object
        .keys(params)
        .map(function(key){
            return key+"="+encodeURIComponent(params[key])
        })
        .join("&")
}


class UserInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tel_number: null,
            tel_verified: false,
            pin_lenght: 6,
            recieved_pin_code: null, // for debug
            pin_code: null,
            session_id: null,
            is_valid: null,
        };
        this.tel_input_link = document.getElementsByClassName('form-control')[0]
        this.pin_input_link = document.getElementsByTagName('swd-pin-field')[0]
    }
    // send request to server
    fetchData(params, endpoint) {
        let dist_url = endpoint + formatParams(params);
        let request = new XMLHttpRequest();
        request.open('GET', dist_url, false); // false for synchronous request
        request.send(null);
        return request.responseText;
    }
    // observe changes in phone input
    handleTelNumberChange = (value, country, e) => {
        this.state.tel_number = value;
        document.getElementsByClassName('form-control')[0].removeAttribute('valid_fail')
        document.getElementsByClassName('form-control')[0].removeAttribute('valid_pass')
    }
    // button "next" is presed
    handleTelNumberSend = () => {
        let res = JSON.parse(this.fetchData(
            {
                'tel_number': this.state.tel_number
            },
            "/tel_validation"
        ));
        if (res['status'] == 'pass') {
            this.setState((state) => {
                return {
                    tel_verified: true,
                    session_id: res['session_id'],  
                    recieved_pin_code: res['pin_code'] // for debug
                }
            });
            console.log(res['pin_code']); // for debug
            document.getElementsByClassName('form-control')[0].setAttribute('valid_pass', '')
            document.getElementsByClassName('form-control')[0].removeAttribute('valid_fail')
        }
        else {
            console.log("phone number dosen't exist");
            document.getElementsByClassName('form-control')[0].setAttribute('valid_fail', '')
            document.getElementsByClassName('form-control')[0].removeAttribute('valid_pass')
        }
    }
    handlePinChange = (value) => {
        if (value.length == this.state.pin_lenght) {
            this.setState((state) => {
                return {
                    pin_code: value,
                }
            })
            let validation = JSON.parse(this.fetchData(
                {
                    'session_id': this.state.session_id,
                    'pin_code': this.state.pin_code
                },
                "/pin_validation"
            ));
            this.setState((state) => {
                return {
                    is_valid: validation['status'] == 'pass' ? true : false
                }
            })
            if (this.state.is_valid) {
                document.getElementsByTagName('swd-pin-field')[0].removeAttribute('valid_fail')
                document.getElementsByTagName('swd-pin-field')[0].setAttribute('valid_pass', '')
            }
            else if (!this.state.is_valid) {
                document.getElementsByTagName('swd-pin-field')[0].setAttribute('valid_fail', '')
                document.getElementsByTagName('swd-pin-field')[0].removeAttribute('valid_pass')
            }
            console.log(validation)
            console.log(this.state.is_valid)   
        }
        else {
            document.getElementsByTagName('swd-pin-field')[0].removeAttribute('valid_fail')
            document.getElementsByTagName('swd-pin-field')[0].removeAttribute('valid_pass')
        }
    }

    render() {
        document.getElementById('UserInput').style.setProperty('--amount', this.state.pin_lenght)
        // first phase of authentication
        // user must enter phone number
        if (!this.state.tel_verified) {
            return (<>
                <form action="" method="post">
                    <PhoneInput
                        onChange={this.handleTelNumberChange}
                        country={'ru'}
                    />
                    <h5>{'Телефон'}</h5>
                    <AcceptButton
                        onClick={this.handleTelNumberSend}
                        text={'далее'}
                    />
                </form>
            </>)
        }
        // second phase of authentication
        // user must enter pin code from sms
        else if (this.state.tel_verified) {
            return (<>
                <form action="" method="post">
                    <PhoneInput
                        country={'ru'}
                    />
                    <h5>{'Телефон'}</h5>
                    <PinField
                        onChange={this.handlePinChange} 
                        class="pin-field"
                        validate="0123456789"
                        inputmode="numeric"
                        length={this.state.pin_lenght}
                    />
                    <h5>{'Код из смс'}</h5>
                    <AcceptButton
                        onClick={() => this.handleClick()}
                        text={'отправить код'}
                    />
                    <h5>{this.state.recieved_pin_code}</h5>
                </form>
            </>)
        }
    }
}

export default UserInput