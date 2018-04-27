import React, { Component } from 'react';
import { Input, Container, Item } from 'native-base';
import { View, TextInput } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { textClDark } from 'config/colors';
import adjustFontSize from "assets/adjustFontSize";
const contentW = 100;

const Wrapper = styled(View)`
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
`
const engSize = adjustFontSize( 10.5 );
const wingSize = adjustFontSize( 20 );

const Myinput = styled(Input)`
    font-family: ${props => props.isEng ? "Roboto" : "Wing_new"};
    font-size: ${props => props.isEng ? engSize : wingSize}px;
    color: ${textClDark};
    width: ${contentW}%;
    padding: 0;
`

const Underline = styled(Item)`
    background-color: ${textClDark};
    border-color: transparent;
    width: ${contentW}%;
    height: 2px;
`


class UserInput extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.blurId != this.props.blurId) this.focusInput(false);
    }
    
    focusInput(isFocus) {
        if (!this.input) return;
        
        
        if (isFocus) {
            this.input._root.focus();
        } else {
            this.input._root.blur();
        }
    }
    render() {
        const { onChange, value, onBlur, isInputEng } = this.props;
        return(
            <Wrapper>
                <Myinput 
                    
                    isEng={isInputEng}
                    
                    innerRef={el => { if (el) this.input = el }}
                    multiline
                    onEndEditing={onBlur}
                    onBlur={onBlur}
                    value={value} 
                    onChangeText={onChange} 
                    placeholder={"Where am I?"}
                    placeholderTextColor="#ccc"/>
                <Underline />
            </Wrapper>
        )
    }
}



UserInput.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    onBlur: PropTypes.func,
    blurId: PropTypes.number,
    isInputEng: PropTypes.bool
}

export default UserInput;