import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import analytics from '@react-native-firebase/analytics';

// Store
import {anonymousLoginIn, loginIn} from '../../stores/Auth/actions';
import {
  migrateDocumentationToAnonymous,
  deleteDocumentationList,
  migrateDocumentation,
} from '../../stores/Documentation/actions';

// Components
import Header from '../../components/Header';
import Text from '../../components/Global/Text';
import Colors from '../../../constants/Colors';
import GlobalStyle from '../../../constants/GlobalStyle';
import Button from '../../components/Global/Button';

// SVG
import Trash from '../../../assets/images/icons/trash.svg';

// Helper
import {validateEmail} from '../../helpers';

class ChangeSecretEmailScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  constructor() {
    super();
    this.state = {
      showEmailRegisterModal: false,
      newEmail: null,
      repeatEmail: null,
    };
  }

  async onDeleteEmail() {
    const {email} = this.props;
    await this.props.migrateDocumentationToAnonymous(email);
    await this.props.deleteDocumentationList(email);
    await this.props.anonymousLoginIn();

    await analytics().logEvent('deleted_secret_email');

    this.props.navigation.replace('HomeScreen');
  }

  async onRegisterNewEmail() {
    const {newEmail, repeatEmail} = this.state;
    const {email} = this.props;

    const validation = validateEmail(newEmail, repeatEmail);
    if (validation === true) {
      await this.props.migrateDocumentation(newEmail, email);
      await this.props.deleteDocumentationList(email);
      await this.props.loginIn(newEmail);

      await analytics().logEvent('changed_secret_email');

      this.props.navigation.replace('HomeScreen');
      return true;
    }

    this.dropDownAlertRef.alertWithType('error', '', validation);
  }

  render() {
    const {email} = this.props;
    const index = this.props.navigation.dangerouslyGetParent().state.index;
    return (
      <View style={{flex: 1}}>
        <View style={{position: 'relative', zIndex: 1000}}>
          <DropdownAlert
            ref={(ref) => (this.dropDownAlertRef = ref)}
            closeInterval={2000}
            messageStyle={{
              fontSize: 17,
              textAlign: 'left',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: 'transparent',
            }}
          />
        </View>
        <Header
          onGoBack={() =>
            index > 0
              ? this.props.navigation.goBack()
              : this.props.navigation.navigate('HomeScreen')
          }
          leaveButton
          leaveButtonTop={15}
          title="Ändra hemlig mail"
        />
        <ScrollView style={styles.container}>
          <View style={{paddingVertical: 20}}>
            <Text.Medium style={styles.registeredEmailText}>
              Registrerad hemlig mail:
            </Text.Medium>
            <View style={{flexDirection: 'row'}}>
              <Text.Regular style={styles.registeredEmailText}>
                {email}
              </Text.Regular>
              <TouchableOpacity
                onPress={() => this.onDeleteEmail()}
                style={styles.trashContainer}>
                <Trash />
                <Text.Bold
                  style={[styles.registeredEmailText, styles.trashText]}>
                  Radera
                </Text.Bold>
              </TouchableOpacity>
            </View>
          </View>
          <Text.Medium style={styles.title}>
            Fyll i ny hemliga mailadress
          </Text.Medium>
          <View style={{marginTop: 20}}>
            <Text.RobotoRegularItalic
              style={[GlobalStyle.label, {color: Colors.text}]}>
              Hemlig mailadress
            </Text.RobotoRegularItalic>
            <TextInput
              autoCapitalize="none"
              style={GlobalStyle.input}
              placeholder="Hemlig mailadress"
              placeholderTextColor={Colors.placeholder}
              onChangeText={(text) => this.setState({newEmail: text})}
            />
          </View>
          <View style={{marginTop: 15}}>
            <Text.RobotoRegularItalic
              style={[GlobalStyle.label, {color: Colors.text}]}>
              Upprepa hemlig mailadress
            </Text.RobotoRegularItalic>
            <TextInput
              autoCapitalize="none"
              style={GlobalStyle.input}
              placeholder="Upprepa hemlig mailadress"
              placeholderTextColor={Colors.placeholder}
              onChangeText={(text) => this.setState({repeatEmail: text})}
            />
          </View>
          <View style={{marginTop: 30, alignItems: 'center'}}>
            <Button.GreenGradient
              onPress={() => this.onRegisterNewEmail()}
              style={{paddingVertical: 15}}
              containerStyle={{maxWidth: 280, width: '100%'}}
              title="Byt hemlig mail"
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundPink,
    paddingHorizontal: 15,
    paddingTop: 35,
  },
  title: {
    color: Colors.text,
    fontSize: 22,
  },
  subText: {
    color: Colors.text,
    fontSize: 18,
  },
  textRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  registeredEmailText: {
    fontSize: 18,
  },
  trashContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  trashText: {
    color: Colors.darkGreen,
    marginLeft: 5,
  },
});

function mapStateToProps(state) {
  return {
    email: state.authReducer.email,
  };
}

export default connect(mapStateToProps, {
  migrateDocumentationToAnonymous,
  anonymousLoginIn,
  deleteDocumentationList,
  migrateDocumentation,
  loginIn,
})(ChangeSecretEmailScreen);
