import React, { PureComponent } from 'react';
import { TouchableHighlight } from 'react-native';
import { Header, Right, Left, Icon, Text, Button} from 'native-base';
import styled from 'styled-components';
import MyText from 'components/MyText';
import { mainCl } from 'config/colors';

const Title = styled(MyText)`
    color: white;
    font-weight: bold;
`

const MyHeader = styled(Header)`
    padding-left: 20px;
    padding-right: 0px;
    background-color: ${ mainCl }
`

const IconCollider = styled(TouchableHighlight)`
    height: 100%;
    width: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`


class AppHeader extends PureComponent {
    render() {
        return(
            <MyHeader>
                <Left>
                    <Title>
                        Wingdings
                    </Title>
                </Left>
                <Right>
                    <IconCollider 
                        underlayColor={"transparent"}>
                        <Icon name="md-more" />
                    </IconCollider>
                </Right>
            </MyHeader>
        )
    }
}


export default AppHeader;