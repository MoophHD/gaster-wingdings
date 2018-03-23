import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Main from './src/scenes/Main';
import { Font } from 'expo';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isLoaded: false
    }
  }
  
    async componentDidMount() {
      await Font.loadAsync({
        'Wing_new': require('assets/fonts/Wing_new.ttf'),
        'Ionicons': require('native-base/Fonts/Ionicons.ttf'),
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')
      });
      
      this.setState(() => ({isLoaded: true}));
    }

  render() {
    return (
      this.state.isLoaded && <Main />
    );
  }
}

