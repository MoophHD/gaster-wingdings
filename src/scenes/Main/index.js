import React, { Component } from 'react';
import { Body, Input, Text } from 'native-base';
import { KeyboardAvoidingView, View } from 'react-native';
import styled from 'styled-components';
import { ANDROID_STATUSBAR, AD_HEIGHT } from 'config/metrics';
import { mainClDark } from 'config/colors';
import AppHeader from './components/AppHeader';
import UserInput from './components/UserInput';
import Output from './components/Output';
import {
  AdMobBanner
} from 'expo';

const Wrapper = styled.View `
    display: flex;
    flex-grow: 1;
    border-top-width: ${ANDROID_STATUSBAR}px;
    border-color: ${ mainClDark };
`

const TranslateWrapper = styled(Body)`
    align-self: center;
    display: flex;
    width: 100%;
    padding: 0 10px;
    align-items: center;
`

class Main extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            eng: '',
            wing: ''
        }
        
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(val) {
        this.setState(() => ({eng: val}))
        
        this.setState(() => ({wing: val}))
    }
    
    render() {
        const { eng, wing } = this.state;
        
        return(
           <Wrapper>
                <AppHeader />
                <TranslateWrapper>
                    <UserInput 
                        value={eng}
                        onChange={this.handleChange}
                    />
                    <Output value={eng} wingValue={wing} />
                </TranslateWrapper>
                
                <AdMobBanner
                    style={{marginLeft: 25}}
                  bannerSize="banner"
                  adUnitID="ca-app-pub-3940256099942544/6300978111"/>
            </Wrapper>
         
        )
    }
}

//ca-app-pub-1038804138558980/1032039289

export default Main;