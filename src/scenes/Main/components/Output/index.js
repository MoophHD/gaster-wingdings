import React, { Component } from 'react';
import { Card, CardItem } from 'native-base';
import { View, 
        Clipboard, 
        Text, 
        TouchableWithoutFeedback,
        TouchableOpacity,
        StyleSheet } from 'react-native';
import styled from 'styled-components';
import MyText from "components/MyText";
import PropTypes from 'prop-types';
import { eW, wE, cyrillicLatin, tailTriggerCodes, eWOneSymbol } from 'assets/legend/legend';
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
    copy() {
        let val = this._lastFilteredValue ? this._lastFilteredValue : this.props.value;
        let reversedValue = "";
        // convert cyrillic to latin script
        if (/[а-яА-ЯЁё]/.test(val)) val = this.convertCyrillic(val);

        // reverse translation
        for (let i = 0; i < val.length; i++) {
            let symbol = val[i];
            let decCode = symbol.codePointAt(0);
            let hexCode = decCode.toString(16).toUpperCase();
            
            // is an english letter
            if (eW.hasOwnProperty(symbol)) {
                let wingHex = eW[symbol];
                let wingDec = parseInt(wingHex, 16);

                let wingSymbol = String.fromCodePoint(wingDec);
                reversedValue += wingSymbol;

            // is a wing symbol
            } else if (wE.hasOwnProperty(hexCode)) {
                reversedValue += wE[hexCode];

            // is a number, unknown sign etc.
            } else {
                reversedValue += symbol;
            }
        }
      
        Clipboard.setString(reversedValue);
    }
    
    handleChange(val) {
        this.props.onChange(val);
    }
   
    toEng(wVal) {
        let translatedStr = "";
        
        Array.prototype.forEach.call(wVal, (wLetter) => {
            let decCode = wLetter.codePointAt(0);
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

    render() {
        let { value: _value, onTap } = this.props;
        value = _value.slice();

        //filter double-symbol emojis 

        for (let i = 0; i < value.length; i++) {
            let code = value.codePointAt(i).toString(16).toUpperCase();

            //is a start of a double-symbol emoji
            if (tailTriggerCodes.indexOf(code) != -1) {
                // replace this and previous symbol with a new one
                let replacementSymbol = String.fromCodePoint(parseInt(eWOneSymbol[wE[lastSymbolCode]], 16) );
                value = value.slice(0, i - 1) + replacementSymbol + value.slice(i + 1, value.length);
                i--;
            }

            let lastSymbolCode = code;
        }

        this._lastFilteredValue = value;

        if (/[а-яА-ЯЁё]/.test(value)) value = this.convertCyrillic(value);

        let chuncks = [];//type: wing / eng, val
        let big = value.length > 15;
        let fstCode = value[0] && value[0].codePointAt(0).toString(16).toUpperCase();
        let type = wE.hasOwnProperty(fstCode) ? scriptType.wing : scriptType.eng;
        let lastTypeChangeI = 0;
        for (let  i = 0; i < value.length; i++) {
            let symbol = value[i];
            let code = symbol.codePointAt(0).toString(16).toUpperCase();
            //finish up the last
  
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

            if (i == value.length - 1) {
                chuncks.push({ value: value.slice(lastTypeChangeI, i + 1), type: type });
                break;
            }
        }
        return (
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => onTap()}>

            <View style={s.wrapper}> 
                <OutPutWrapper>
                    
                    <MyCard>
                    <CardItem style={{height: "100%", display:"flex", alignItems:"flex-start"}}>
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
                        
                    </OutPutWrapper>
                  
                <TouchableOpacity onPress={() => this.copy()}>
                    <View style={s.copyBtn}>
                        <MyText bold style={s.copyBtnTitle}>
                            Copy to Clipboard
                        </MyText>
                    </View> 
                </TouchableOpacity>
            </View>
            </TouchableWithoutFeedback>
        )
    }
}
OutPut.propTypes = {
    value: PropTypes.string,
    wingValue: PropTypes.string,
    onTap: PropTypes.func
}

const s = StyleSheet.create({
    wrapper: {
        padding: 10,
        width: "100%",
        flex: 1
    },
    cardItem: {
        flex: 1,
        alignItems: "flex-start",
        backgroundColor: "crimson",
        height: "100%"
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

if (!String.fromCodePoint) {
    (function () {
        var defineProperty = (function () {
            // IE 8 only supports `Object.defineProperty` on DOM elements
            try {
                var object = {};
                var $defineProperty = Object.defineProperty;
                var result = $defineProperty(object, object, object) && $defineProperty;
            } catch (error) { }
            return result;
        }());
        var stringFromCharCode = String.fromCharCode;
        var floor = Math.floor;
        var fromCodePoint = function () {
            var MAX_SIZE = 0x4000;
            var codeUnits = [];
            var highSurrogate;
            var lowSurrogate;
            var index = -1;
            var length = arguments.length;
            if (!length) {
                return '';
            }
            var result = '';
            while (++index < length) {
                var codePoint = Number(arguments[index]);
                if (
                    !isFinite(codePoint) ||       // `NaN`, `+Infinity`, or `-Infinity`
                    codePoint < 0 ||              // not a valid Unicode code point
                    codePoint > 0x10FFFF ||       // not a valid Unicode code point
                    floor(codePoint) != codePoint // not an integer
                ) {
                    throw RangeError('Invalid code point: ' + codePoint);
                }
                if (codePoint <= 0xFFFF) { // BMP code point
                    codeUnits.push(codePoint);
                } else { // Astral code point; split in surrogate halves
                    // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                    codePoint -= 0x10000;
                    highSurrogate = (codePoint >> 10) + 0xD800;
                    lowSurrogate = (codePoint % 0x400) + 0xDC00;
                    codeUnits.push(highSurrogate, lowSurrogate);
                }
                if (index + 1 == length || codeUnits.length > MAX_SIZE) {
                    result += stringFromCharCode.apply(null, codeUnits);
                    codeUnits.length = 0;
                }
            }
            return result;
        };
        if (defineProperty) {
            defineProperty(String, 'fromCodePoint', {
                'value': fromCodePoint,
                'configurable': true,
                'writable': true
            });
        } else {
            String.fromCodePoint = fromCodePoint;
        }
    }());
}