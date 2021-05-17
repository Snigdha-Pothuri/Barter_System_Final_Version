import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'; 
import {DrawerItems} from 'react-navigation-drawer'; 
import firebase from 'firebase'; 
import {Avatar,Icon} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import db from '../config';

export default class CustomSideBarMenu extends React.Component {
  constructor () {
    super();
    this.state = {
      userId : firebase.auth().currentUser.email,
      image : "#",
      name : "",
      docId : ""
    }
  } 
  selectPicture = async () => {
    const {cancelled,uri} = await ImagePicker.launchImageLibraryAsync({
      mediaTypes : ImagePicker.MediaTypeOptions.All,
      allowsEditing : true,
      aspect : [4,3],
      quality : 1
    })
    if( ! cancelled){
      this.uploadImage(uri,this.state.userId)
    }
  }
  uploadImage = async (uri,imageName) => {
    var response = await fetch(uri)
    var blob = await response.blob()
    var ref = firebase.storage().ref().child("user_profiles/"+imageName)
    return ref.put(blob).then((response)=>{
      this.fetchImage(imageName)
    })
  } 
  fetchImage = (imageName) => {
  var storageRef =  firebase.storage().ref().child("user_profiles/"+imageName)
  storageRef.getDownloadURL().then((url)=> {
    this.setState({
      image:url
    })
  }) 
  .catch((error)=>{
    this.setState({
      image : "#"
    })
  })
  } 
  getUserProfile () {
    db.collection("users").where("email_id","==",this.state.userId)
    .onSnapshot((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          name : doc.data().first_name + " " + doc.data().last_name,
          docId : doc.id,
          image : doc.data().image
        })
      })
    })
  } 
  componentDidMount () {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }
 render (){
     return ( 
         <View style={{flex:1}}>
         <View style={{flex:0.5,alignItems:"center",backgroundColor:"orange"}}>
              <Avatar
                 rounded 
                 source = {{uri:this.state.image}}
                 size = "medium"
                 onPress = {()=>{this.selectPicture()}}
                 containerStyle = {{     width:"40%",
                 height:"40%",
                 alignSelf:'center',
                 borderColor:'#ffab91',
                 borderRadius:40,
                 flex:0.75,
                 borderWidth:1,
                 marginTop:20,
                 marginLeft : 20,
                 padding:10}}
                 showEditButton 
              />
              <Text style={{fontWeight : "bold",fontSize:20,paddingTop : 10}}> {this.state.name} </Text>
           </View>
<View>

           <DrawerItems
                {
                   ...this.props 
               }
           />
         </View>
         <View>
           <TouchableOpacity  style={{flexDirection:"row",width:"100%",height:"100%"}}
             onPress={()=>{
                 this.props.navigation.navigate("SignUpLogin")
                 firebase.auth().signOut()
             }
            
            }
           >
             <Icon
             name="logout"
             type = "antdesign"
             size = "100"
             iconStyle={{paddingLeft:30}}
             />
            <Text style={{fontWeight:"bold",marginLeft:30,fontSize:15}}> "Log Out" </Text>
           </TouchableOpacity>
         </View> 

       </View>
     )
 }

}

