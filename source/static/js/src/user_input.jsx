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
            pin_code: null, // for debug
        };
        this.endpoint = "/data_server"
    }
    // send request to server
    fetchData(params) {
        let dist_url = this.endpoint + formatParams(params);
        let request = new XMLHttpRequest();
        request.open('GET', dist_url, false); // false for synchronous request
        request.send(null);
        return request.responseText;
    }
    // observe changes in phone input
    handleTelNumberChange = (value, country, e) => {
        this.state.tel_number = value;
    }
    // button "next" is presed
    handleTelephoneSend = () => {
        let res = JSON.parse(this.fetchData(
            {'tel_number': this.state.tel_number},
        ));
        if (res['does_exist'] == true) {
            this.setState((state) => {
                return {
                    tel_verified: true,
                    pin_code: res['pin_code'] // for debug
                }
            });
            console.log(res['pin_code']); // for debug
        }
        else {
            console.log("phone number dosen't exist");
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
                        onClick={this.handleTelephoneSend}
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
                    <h5>{this.state.pin_code}</h5>
                </form>
            </>)
        }
    }
}

export default UserInput