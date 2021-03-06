import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  AsyncStorage,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Card,
  CardSection,
  Input,
  Button,
  Spinner,
  Footer,
  BubbleScreen,
} from './components/common';
import images from './images';
import {firebase} from './config';
import {loginStyles} from './components/styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

let fields = [
  {
    placeholder: 'E-mail-Address',
    name: 'email',
    password: false,
    error: 'Fill email',
  },
  {
    placeholder: 'Password',
    name: 'password',
    password: true,
    error: 'Fill Password',
  },
];

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: '',
      loading: false,
    };

    this.onLogin = this.onLogin.bind(this);
  }

  isValid({name, error}) {
    if (this.state[name].length === 0) {
      this.setState({error});
      return false;
    }
    return true;
  }

  onLogin() {
    const {email, password} = this.state;
    if (!fields.find(item => !this.isValid(item))) {
      this.setState({error: ''});
      this.setState({loading: true});
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => this.authSuccess(password))
        .catch(err => this.authFailed());
    }
  }

  authSuccess(password) {
    this.setState({loading: false});
    AsyncStorage.setItem('USER', password);
  }

  authFailed() {
    this.setState({
      loading: false,
      error: 'Authentication Failed',
    });
  }

  renderButton() {
    if (this.state.loading) return <Spinner size="small" />;
    return <Button onPress={this.onLogin}>Login</Button>;
  }

  renderLogo() {
    return (
      <View style={loginStyles.logo}>
        <Image source={images.nmma} style={loginStyles.logoStyle} />
      </View>
    );
  }

  renderField({placeholder, name, password}) {
    return (
      <CardSection>
        <Input
          placeholder={placeholder}
          value={this.state[name]}
          autoCapitalize={'none'}
          password={password}
          onChangeText={value => this.setState({[name]: value})}
        />
      </CardSection>
    );
  }

  render() {
    return (
      <ScrollView contentContainerStyle={loginStyles.container}>
        <BubbleScreen />
        <KeyboardAvoidingView
          behavior={'position'}
          extraHeight={60}
          keyboardVertiralOffset={-120}>
          {this.renderLogo()}
          <Card>
            {this.renderField({
              placeholder: 'Email-Address',
              name: 'email',
              password: false,
            })}
            {this.renderField({
              placeholder: 'Password',
              name: 'password',
              password: true,
            })}
            <Text style={loginStyles.errorText}>{this.state.error}</Text>
            <View style={loginStyles.btn}>{this.renderButton()}</View>
          </Card>
        </KeyboardAvoidingView>
        <Footer />
      </ScrollView>
    );
  }
}

export default Login;
