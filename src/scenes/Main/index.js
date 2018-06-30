import React, { Component } from 'react';
import { Body, Input, Text } from 'native-base';
import { KeyboardAvoidingView, 
        View, 
        Keyboard, 
        TouchableOpacity,
        TouchableWithoutFeedback,
        StyleSheet} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import styled from 'styled-components';
import { ANDROID_STATUSBAR, AD_HEIGHT } from 'config/metrics';
import { mainClDark } from 'config/colors';
import AppHeader from './components/AppHeader';
import UserInput from './components/UserInput';
import Output from './components/Output';
import {
  AdMobBanner,
  AdMobInterstitial
} from 'expo';
import { wE, eW } from "assets/legend/legend";

const Wrapper = styled.View `
    display: flex;
    flex-grow: 1;
    border-top-width: ${ANDROID_STATUSBAR}px;
    border-color: ${ mainClDark };
    background-color: white;
`

const TranslateWrapper = styled(Body)`
    align-self: center;
    display: flex;
    width: 100%;
    padding: 0 10px;
    align-items: center;
`

const TEST_VID_ID = "ca-app-pub-3940256099942544/1033173712";
const VID_ID = "ca-app-pub-1038804138558980/3981037182";
const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";
const BANNER_ID = "ca-app-pub-1038804138558980/1032039289";

const IS_DEV = __DEV__;
const BETWEEN_ADS = 2 * 60;
let lastAdAnchor;
class Main extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            eng: "",
            blurId: 0
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }
    
    componentDidMount() {
        let id = IS_DEV ? TEST_VID_ID : VID_ID;
        AdMobInterstitial.setAdUnitID(id); 
        this._kbListener = Keyboard.addListener('keyboardDidHide', this.handleBlur);
        lastAdAnchor = new Date().getTime() / 1000;
    }
    
    componentWillUnmount () {
        this._kbListener.remove();
    }
        
    showAd() {
        sleep(2500).then(async () => {
            await AdMobInterstitial.requestAd(() =>  AdMobInterstitial.showAd());
        })
    }
    
    handleBlur() {
        console.log(`blur`);
        let dt = new Date().getTime() / 1000;
        
        if (dt - lastAdAnchor > BETWEEN_ADS ) {
            lastAdAnchor = dt;
            this.showAd();
        }
    }
    
    handleChange(val) {
        this.setState(() => ({eng: val}))
    }

    handleOutSideClick() {
        this.setState(() => ({ blurId: this.state.blurId + 1 }))
    }

    render() {
        const { eng, blurId } = this.state;
        return(
           <Wrapper>
                <AppHeader />
                <TouchableWithoutFeedback onPress={() => this.handleOutSideClick()}>
                    <TranslateWrapper>
                        <UserInput
                            blurId={blurId}
                            onBlur={this.handleBlur}
                            value={eng}
                            onChange={this.handleChange}/>
                            
                        <Output
                            onTap={this.handleBlur}
                            blurId={blurId}
                            value={eng} />
                    </TranslateWrapper>
                </TouchableWithoutFeedback>
                
                <AdMobBanner
                    style={{marginLeft: 25}}
                  bannerSize="banner"
                  adUnitID={ IS_DEV ? TEST_BANNER_ID : BANNER_ID } />
                  
            </Wrapper>
         
        )
    }
}


const s = StyleSheet.create({
    swapBtn: {
        margin: 0,
        backgroundColor: "#ccc",
        borderRadius: 999,
        padding: 2.5
    }
})

//ca-app-pub-1038804138558980/1032039289

export default Main;

function sleep(ms) {
  return new Promise((res) => {
    setTimeout(() => res(), ms);
  })
}