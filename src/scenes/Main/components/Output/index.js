import React, { Component } from 'react';
import { Content, Card, CardItem, Input, Button } from 'native-base';
import { View, 
        Clipboard, 
        Text, 
        TextInput, 
        ScrollView, 
        TouchableOpacity,
        StyleSheet } from 'react-native';
import styled from 'styled-components';
import MyText from "components/MyText";
import PropTypes from 'prop-types';
import { black } from 'config/colors';
import { eW, wE } from 'assets/legend/legend';
import PanWrapper from "components/PanWrapper";
import adjustFontSize from "assets/adjustFontSize";
const pureFontSize = 33;
const fontSize = adjustFontSize(pureFontSize);

import { mainCl } from 'config/colors';

const OutPutWrapper = styled(View)`
    height: 260px;
`

const MyCard = styled(Card)`position: relative`




const TextWrapper = styled(View)`
    padding: 15px 0;
    flex: 1;
`
//  
const engSize = adjustFontSize( 15 );
const wingSize = adjustFontSize( 32 );
const Translation = styled(TextInput)`
    font-size: ${props => ( (props.isEng ? engSize : wingSize )* (props.big ? .7 : 1 ))}px;
    font-family: ${props => props.isEng ? "Roboto" : "Wing_new"};
`

class OutPut extends Component {
    focusInput(isFocus) {
        if (!this.input) return;
        
        
        if (isFocus) {
            this.input.focus();
        } else {
            this.input.blur();
        }
    }
    
    copy() {
        let eVal = this.props.value;
        let translatedStr = "";
        
        // Convert hex codes into symbols if they are in the eW dictionary
        Array.prototype.forEach.call(eVal, (eLetter) => {
          if (eW.hasOwnProperty(eLetter)) {
            let code = parseInt(eW[eLetter], 16);
            let symbol = String.fromCharCode(code);
              
            translatedStr += symbol;
          } else {
              translatedStr += eLetter;
          }
        });
        
        
        Clipboard.setString(translatedStr);
    }
    
    handleChange(val) {
        this.props.onChange(val);
    }
    
    toEng(wVal) {
        console.log("toEng");
        
        let translatedStr = "";
        
        Array.prototype.forEach.call(wVal, (wLetter) => {
            console.log(`letter ${wLetter}`)
            let decCode = wLetter.charCodeAt(0);
            console.log(`decCode ${decCode}`)
            let hexCode = decCode.toString(16).toUpperCase();
            console.log(`hexCode ${hexCode}`);
          if (wE.hasOwnProperty(hexCode)) {
            let letter = wE[hexCode];
            translatedStr += letter;
          } else {
              translatedStr += wLetter;
          }
        });
        
        return translatedStr;
        
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.blurId != this.props.blurId) this.focusInput(false);
    }
    render() {
        const { value, isInputEng } = this.props;
        let big = value.length > 15;
        let isEng = !isInputEng;
        return (
            <View style={s.wrapper}> 
            
                    <OutPutWrapper>
                    
                <PanWrapper onPress={() => this.focusInput(true)}>
                        <MyCard>
                        <CardItem style={s.cardItem}>
                            <TextWrapper>
                                <Translation 
                                    isEng={!isInputEng}
                                    editable={false}
                                    onChange={(val) => this.handleChange(val)}
                                    innerRef={el => { if (el) this.input = el }}
                                    big={big}
                                    multiline={true}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    placeholder={'Where am I?'} 
                                    >
                                    {isEng ? this.toEng(value) : value}
                                </Translation>
                            </TextWrapper>
                        </CardItem>
                        </MyCard>
                        
                </PanWrapper>
                    </OutPutWrapper>
                  
                <TouchableOpacity onPress={() => this.copy()}>
                    <View style={s.copyBtn}>
                        <MyText bold style={s.copyBtnTitle}>
                            Copy to Clipboard
                        </MyText>
                    </View> 
                </TouchableOpacity>
            </View>
        )
    }
}
OutPut.propTypes = {
    value: PropTypes.string,
    wingValue: PropTypes.string,
    blurId: PropTypes.number,
    isInputEng: PropTypes.bool
}

const s = StyleSheet.create({
    wrapper: {
        padding: 10,
        width: "100%",
        flex: 1
    },
    cardItem: {
        flex: 1,
        alignItems: "flex-start"
    },
    copyBtn: {
        marginTop: 2,
        padding: 7.5
    },
    copyBtnTitle: {
        color: mainCl,
        textAlign: "center"
    }
});

export default OutPut;