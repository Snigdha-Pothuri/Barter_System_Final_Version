import React,{Component}from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView} from 'react-native';
    import MyHeader from '../components/MyHeader';

import db from '../config';
import firebase from 'firebase';

export default class SettingScreen extends Component{
  constructor(){
    super();
    this.state={
      emailId:'',
      firstName:'',
      lastName:'',
      address:'',
      contact:'',
      docId : ""
    }
  }  

  getUserDetails = () => {
      var user = firebase.auth().currentUser
      var email = user.email
      db.collection("users").where("email_id","==",email).get()
      .then(snapshot =>{
        snapshot.forEach(doc=>{
            var data = doc.data()
            this.setState({
                emailId : data.email_id,
                firstName : data.first_name,
                lastName : data.last_name,
                address : data.address,
                contact : data.contact,
                docId : doc.id  
            })
        })
      })
      
  } 

  updateUserDetails = () => {
      db.collection("users").doc(this.state.docId).update({
          "first_name" : this.state.firstName,
          "last_name" : this.state.lastName,
          "address" : this.state.address,
          "contact" : this.state.contact
      })
      alert("Profile Details Updated")
  }

  componentDidMount () {
      this.getUserDetails()
  }

  render (){
      return(

        
          <View style={{flex:1}}>
  <MyHeader  
        title = "Settings"
        navigation= {this.props.navigation}
      />
      <View>
      <TextInput
          style={styles.formTextInput}
          placeholder ={"First Name"}
          maxLength ={8}
          onChangeText={(text)=>{
            this.setState({
              firstName: text
            })
          }
            }
            value = {this.state.firstName}
        />
         <TextInput
          style={styles.formTextInput}
          placeholder ={"Last Name"}
          maxLength ={8}
          onChangeText={(text)=>{
            this.setState({
              lastName: text
            })
          }}
          value = {this.state.lastName}
        />
        <TextInput
          style={styles.formTextInput}
          placeholder ={"Contact"}
          maxLength ={10}
          keyboardType={'numeric'}
          onChangeText={(text)=>{
            this.setState({
              contact: text
            })
          }}
          value = {this.state.contact}
        />
        <TextInput
          style={styles.formTextInput}
          placeholder ={"Address"}
          multiline = {true}
          onChangeText={(text)=>{
            this.setState({
              address: text
            })
          }}
          value = {this.state.address}
        /> 

<TouchableOpacity
            style={styles.cancelButton}
            onPress={()=>{this.updateUserDetails()}}
          >
          <Text style={{color:'#ff5722'}}> Save </Text>
          </TouchableOpacity>
      </View>
          </View>
          
      )
  }
  }

  const styles=StyleSheet.create({
    formTextInput:{
        width:"75%",
        height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10
      },
      cancelButton:{
        width:200,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        marginTop:5,
      }
  })