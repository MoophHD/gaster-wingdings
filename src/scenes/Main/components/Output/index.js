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
import { eW, wE, cyrillicLatin } from 'assets/legend/legend';
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
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    alignItems: center;
`
const scriptType = {
    eng: "eng",
    wing: "wing"
}
const engSize = adjustFontSize( 16 );
const wingSize = adjustFontSize( 32 );
const Translation = styled(Text)`
    font-size: ${props => (props.isEng ? engSize : wingSize ) * (props.big ? .7 :  1 )}px;
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
        if (/[а-яА-ЯЁё]/.test(eVal)) eVal = this.convertCyrillic(eVal);

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
        let translatedStr = "";
        
        Array.prototype.forEach.call(wVal, (wLetter) => {
            let decCode = wLetter.charCodeAt(0);
            let hexCode = decCode.toString(16).toUpperCase();
          if (wE.hasOwnProperty(hexCode)) {
            let letter = wE[hexCode];
            translatedStr += letter;
          } else {
              translatedStr += wLetter;
          }
        });
        
        return translatedStr;
        
    }

    convertCyrillic(val) {
        let latinVal = "";
        for (let i = 0; i < val.length; i++) {
            let symbol = val[i];
            if (cyrillicLatin.hasOwnProperty(symbol)) {
                latinVal += cyrillicLatin[symbol];
            } else {
                latinVal += symbol;
            }
        }

        val = latinVal;
        
        return latinVal;
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.blurId != this.props.blurId) this.focusInput(false);
    }
    render() {
        let { value } = this.props;

        
        if (/[а-яА-ЯЁё]/.test(value)) value = this.convertCyrillic(value);
        console.log(value);
        let chuncks = [];//type: wing / eng, val
        let big = value.length > 15;
        
        let fstCode = value[0] && value[0].charCodeAt(0).toString(16).toUpperCase();
        let type = wE.hasOwnProperty(fstCode) ? scriptType.wing : scriptType.eng;
        let lastTypeChangeI = 0;
        for (let i = 0; i < value.length; i++) {
            let symbol = value[i];
            let code =  symbol.charCodeAt(0).toString(16).toUpperCase();

            if (i == value.length - 1) {
                chuncks.push({ value: value.slice(lastTypeChangeI, i + 1), type: type});
                break;
            }
            if (type == scriptType.wing) {
                // look for a not-wing symbol or is last
                if (!wE.hasOwnProperty(code)) {
                    chuncks.push({ value: value.slice(lastTypeChangeI, i), type: type })

                    lastTypeChangeI = i;
                    type = scriptType.eng;
                }
            } else if (type == scriptType.eng) {
                if (wE.hasOwnProperty(code)) {
                    chuncks.push({ value: value.slice(lastTypeChangeI, i), type: type })

                    lastTypeChangeI = i;
                    type = scriptType.wing;
                }
            }
        }
        return (
            <View style={s.wrapper}> 
            
                <OutPutWrapper>
                    
                <PanWrapper onPress={() => this.focusInput(true)}>
                        <MyCard>
                        <CardItem style={s.cardItem}>
                            <TextWrapper>
                                {
                                    chuncks.map((chunck, i) => {
                                        let { value, type } = chunck;
                                        if (type == scriptType.wing) value = this.toEng(value);
                                        return (
                                            <Translation
                                                key={`_output${i}`}
                                                isEng={type != scriptType.eng}
                                                editable={false}
                                                onChange={(val) => this.handleChange(val)}
                                                innerRef={el => { if (el) this.input = el }}
                                                big={big}
                                                multiline={true}
                                                underlineColorAndroid='rgba(0,0,0,0)'
                                                placeholder={'Where am I?'} >

                                                {value}

                                            </Translation>
                                        )
                                    })
                            
                                }
                       
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
    blurId: PropTypes.number
}


//     < Translation
// editable = { false}
// onChange = {(val) => this.handleChange(val)}
// innerRef = { el => { if (el) this.input = el } }
// big = { big }
// multiline = { true}
// underlineColorAndroid = 'rgba(0,0,0,0)'
// placeholder = { 'Where am I?'} >

//     { value }

//                                     </Translation >
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