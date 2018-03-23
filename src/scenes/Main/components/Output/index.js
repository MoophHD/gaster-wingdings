import React, { Component } from 'react';
import { Content, Card, CardItem, Text, Input } from 'native-base';
import { View, Clipboard } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { DEVICE_HEIGHT } from 'config/metrics';
import { black } from 'config/colors';
const pureFontSize = 28;
const fontSize = Math.round(pureFontSize * DEVICE_HEIGHT / 375);

const Wrapper = styled(View)`
    height: 250px;
    width: 100%;
    padding: 0 10px;
`

const MyCard = styled(Card)`position: relative`

const TextWrapper = styled(Content)`
    padding: 15px 0;
`

const Translation = styled(Text)`
    font-size: ${props => props.big ? fontSize * .7 : fontSize};
    font-family: Wing_new;
    color: ${props => props.placeholder ? 'grey' : black};
`

class OutPut extends Component {
    
    render() {
        const { value } = this.props;
        let big = value.length > 15;
        return (
            <Wrapper>
            <MyCard>
            <CardItem>
                <TextWrapper>
                    <Translation 
                        big={big}
                        placeholder={!value} 
                        selectable>
                        
                        {value || 'Where am I?'}
                    </Translation>
                </TextWrapper>
            </CardItem>
            </MyCard>
            </Wrapper>
        )
    }
}

OutPut.propTypes = {
    value: PropTypes.string,
    wingValue: PropTypes.string
}

export default OutPut;