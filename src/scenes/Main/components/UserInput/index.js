import React from 'react';
import { Input, Container, Item } from 'native-base';
import { View, TextInput } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { textClDark } from 'config/colors';

const contentW = 100;

const Wrapper = styled(View)`
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 45px;
`

const Myinput = styled(Input)`
    font-family: Roboto;
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

const UserInput = ({ onChange, value }) => (
    <Wrapper>
        <Myinput 
            multiline
            value={value} 
            onChangeText={onChange} 
            placeholder={"Where am I?"}
            placeholderTextColor="#ccc"/>
        <Underline />
    </Wrapper>
)

UserInput.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string
}

export default UserInput;