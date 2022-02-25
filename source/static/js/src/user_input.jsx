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
            recieved_pin_code: null, // for debug, replace it when actual pin handler will be atached
            pin_code: null,
            session_id: null,
            is_valid: null,
        };
        this.tel_input_link = document.getElementsByClassName('form-control')[0]
        this.pin_input_link = document.getElementsByTagName('swd-pin-field')[0]
    }
    // form a link with given {params} and
    // send html[GET] request to server {endpoint}
    fetchData(params, endpoint) {
        let dist_url = endpoint + formatParams(params);
        let request = new XMLHttpRequest();
        request.open('GET', dist_url, false); // {false} for synchronous request
        request.send(null);
        return request.responseText;
    }
    // controls phone value validity
    handleTelNumberChange = (value, country, e) => {
        this.state.tel_number = value;
        document.getElementsByClassName('form-control')[0].removeAttribute('valid_fail')
        document.getElementsByClassName('form-control')[0].removeAttribute('valid_pass')
    }
    // handels button and enter key
    handelEnterPressed = (event) => {
        if (event.key == 'Enter') {
            this.handleTelNumberSend()
        }
    }

    // FIRST PHASE
    // this block of code handels first phase of authorization
    // |                |                              |      |
    // |                |   <----   html[get]  <----   |      |
    // |     server     |   {'tel_number': int_value}  | user |
    // |   1 endpoint   |                              |      |
    // |                |   ---->   response   ---->   |      |
    // |                |   {'status': 'pass'/'fail',  |      |
    // |                |    'session_id': uniq int }  |      |
    // 
    handleTelNumberSend = () => {
        // send a get request to server 
        // with paylod of user phone number
        // JSON: {'tel_number': user_phone_number}
        let res = JSON.parse(this.fetchData(
            {
                'tel_number': this.state.tel_number
            },
            "/tel_validation" /// 1 destionation endpoint !!!
        ));
        // if on server side verefication is passed
        // you should return this formated JSON:
        // {'status': 'pass',
        //  'session_id': some uniq number,
        // }
        // also on this step you should send user pin code
        if (res['status'] == 'pass') {
            this.setState((state) => {
                return {
                    tel_verified: true,
                    session_id: res['session_id'],  
/*DEBUG*/           recieved_pin_code: res['pin_code'] //// for debug, replace it when actual pin handler will be atached
                }
            });
            // some css stuff to deal with atribute states
            document.getElementsByClassName('form-control')[0].setAttribute('valid_pass', '')
            document.getElementsByClassName('form-control')[0].removeAttribute('valid_fail')
            document.getElementsByClassName('form-control')[0].removeAttribute('valid_fail_pasive')
            document.getElementsByClassName('form-control')[0].focus()
            document.getElementsByClassName('form-control')[0].select()
            setTimeout(() => {
                document.getElementsByClassName('pin-field')[0].focus()
                document.getElementsByClassName('pin-field')[0].select()
            }, 5)
        }
        // if verefication fails
        // this block of code will be executed
        // and user will have ability to immediately send another request
        else {
            console.log("phone number dosen't exist");
            document.getElementsByClassName('form-control')[0].setAttribute('valid_fail', '')
            document.getElementsByClassName('form-control')[0].removeAttribute('valid_pass')
            document.getElementsByClassName('form-control')[0].removeAttribute('valid_fail_pasive')
            setTimeout(() => {
                document.getElementsByClassName('form-control')[0].setAttribute('valid_fail_pasive', '')
                document.getElementsByClassName('form-control')[0].removeAttribute('valid_fail')
                document.getElementsByClassName('form-control')[0].removeAttribute('valid_pass', '')
                document.getElementsByClassName('form-control')[0].focus()
                document.getElementsByClassName('form-control')[0].select()
            }, 75)
        }
    }
    // SECOND PHASE
    // this block of code handels first phase of authorization
    // |                |                              |      |
    // |                |   <----   html[get]  <----   |      |
    // |     server     |   {'pin_code':   int_value,  | user |
    // |   2 endpoint   |    'session_id': int_value}  |      |
    // |                |                              |      |
    // |                |   ---->   response   ---->   |      |
    // |                | {'status': 'pass' or 'fail'} |      |
    // 
    handlePinChange = (value) => {
        // firsts check if pin is fully entered by user
        if (value.length == this.state.pin_lenght) {
            this.setState((state) => {
                return {
                    pin_code: value,
                }
            })
            // send a get request to server 
            // with paylod of user phone number
            // JSON: {'session_id': previously getted id (first phase),
            //        'pin_code': user pin code}
            let validation = JSON.parse(this.fetchData(
                {
                    'session_id': this.state.session_id,
                    'pin_code': this.state.pin_code
                },
                "/pin_validation" /// 2 destionation endpoint !!!
            ));
            // again some important css stuff
            this.setState((state) => {
                return {
                    is_valid: validation['status'] == 'pass' ? true : false
                }
            })
            if (this.state.is_valid) {
                document.getElementsByTagName('swd-pin-field')[0].removeAttribute('valid_fail')
                document.getElementsByTagName('swd-pin-field')[0].setAttribute('valid_pass', '')
                setTimeout(() => {window.location.replace('/')}, 100)
            }
            else if (!this.state.is_valid) {
                document.getElementsByTagName('swd-pin-field')[0].setAttribute('valid_fail', '')
                document.getElementsByTagName('swd-pin-field')[0].removeAttribute('valid_pass')
            }
        }
        else {
            document.getElementsByTagName('swd-pin-field')[0].removeAttribute('valid_fail')
            document.getElementsByTagName('swd-pin-field')[0].removeAttribute('valid_pass')
        }
    }

    render() {
        document.getElementById('UserInput').style.setProperty('--amount', this.state.pin_lenght)
        // first phase of authentication
        // user must enter phone numbers
        if (!this.state.tel_verified) {
            return (<>
                <form action="" method="post">
                    <PhoneInput
                        onChange={this.handleTelNumberChange}
                        onKeyDown={this.handelEnterPressed}
                        country={'ru'}
                        placeholder={'телефон'}
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
                        placeholder={'телефон'}
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
                        onClick={this.handleTelNumberSend}
                        text={'отправить повторно'}
                    />
                    {/* FOR DEBUG */}
                   <h5>{this.state.recieved_pin_code}</h5>
                    {/* FOR DEBUG */}
                </form>
            </>)
        }
    }
}

export default UserInput