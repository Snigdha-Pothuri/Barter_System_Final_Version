import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView, Alert, TouchableOpacity} from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class  ExchangeScreen extends React.Component {
   constructor(){
     super();
     this.state = {
       userId : firebase.auth().currentUser.email,
       itemName : "",
       description : "",
       isExchangeRequestActive : "",
       requesteditemName : "",
       itemStatus : "",
       requestId : "",
        userDocId : "",
        docId : "",

     }
   }
   createUniqueId(){
     return Math.random().toString(36).substring(7);
   }
   addRequest = async (itemName,description)=>
   {
     var userId = this.state.userId
     var randomRequestId = this.createUniqueId();
     db.collection("exchanged_requests")({
       "user_id" : userId,
       "item_Name": itemName,
       "description": description,
       "exchangeId" : randomRequestId,
       "item_status":"requested",
       "date" : firebase.firestore.FieldValue.serverTimestamp()
     })
     await this.getitemRequest()
     db.collection("users").where("email_id","==",userId).get()
     .then((snapshot)=>{
          snapshot.forEach((doc)=>{
            db.collection("users").doc(doc.id).update({isExchangeRequestActive : true})
          })
     })
     this.setState ({
      itemName : "",
       description : "",
      requestId : randomRequestId
     })
    return Alert.alert("item Succesfully Requested")
    } 
    receiveditems = (item_Name) => {
      var userId  = this.state.userId
      var requestId = this.state.requestId
      db.collection("received_items").add({
        "user_id" : userId,
        "item_Name" : item_Name,
        "request_id" : requestId,
       "itemStatus" : "received"
      })
    } 
    getIsitemRequestActive () {
      db.collection("users").where("email_id","==",this.state.userId)
      .onSnapshot((snapshot)=>{
        snapshot.forEach((doc)=>{
          this.setState({
            isExchangeRequestActive : doc.data().isExchangeRequestActive,
            userDocId : doc.id
          })
        })
      })
    } 
    getitemRequest = () => {
      var itemRrequest = db.collection("requested_items")
      .where("user_id","==",this.state.userId)
      .get()
      .then((snapshot)=> {
        snapshot.forEach((doc)=> {
          if(doc.data().item_status !== "received") {
            this.setState({
              requestId : doc.data().requested_id,
              requesteditemName : doc.data().item_Name,
              itemStatus : doc.data().item_status,
              docId : doc.id
            })
          }
        })
      })
    } 
    sendNotification = () => {
      db.collection("users").where("email_id","==",this.state.userId).get()
      .then((snapshot)=> {
        snapshot.forEach((doc)=> {
          var name = doc.data().first_name
          var last_name = doc.data().last_name
          db.collection("all_notifications").where("exchangeId","==",this.state.requestId).get()
          .then((snapshot)=>{
            snapshot.forEach((doc)=>{
              var donorId = doc.data().donorId
              var itemName = doc.data().itemName
              db.collection("all_notifications").add({
                "targeted_user_id" : donorId,
                "message" : name + " " + last_name + "Received the item" + itemName,
                "notification_status" : "unread",
                "itemName" : itemName
              })
            })
          })
        })
      })
    } 
    componentDidMount () {
      this.getitemRequest();
      this.getIsitemRequestActive();
    } 
  updateitemRequestStatus = () => {
    db.collection("requested_items").doc(this.state.docId)
    .update({
    item_status : "Received"
  }) 
  db.collection("users").where("email_id","==",this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      db.collection("users").doc(doc.id).update({
        isExchangeRequestActive : false
      })
    })
  })
  } 
  
  render(){
    if(this.state.isExchangeRequestActive === true){
      return (
        <View style={{flex:1,justifyContent:"center"}}>
           <Text>
             item Name
           </Text>
           <Text> {this.state.requesteditemName} </Text>
           <Text> item Status </Text>
           <Text> {this.state.itemStatus} </Text>
           <TouchableOpacity style={{borderWidth:1,backgroundColor:"yellow",alignSelf:"center",width:300}}
           onPress={()=>{this.sendNotification()
          this.updateitemRequestStatus()
          this.receiveditems(this.state.requesteditemName)}}
           >
<Text> I received the item </Text> 
           </TouchableOpacity>
        </View>
      )
    } 
  else {

 
    return (
       
      <View style={{flex:1}}>
      <MyHeader  
        title = "Request item"
        navigation= {this.props.navigation}
      />
      <KeyboardAvoidingView style={StyleSheet.keyboardStyle}>
       <TextInput 
          style={styles.formTextInput}
          placeholder = {"Enter item Name"}
          onChangeText={(text)=>{
            this.setState ({
              itemName : text
            })
          }}
          value = {this.state.itemName}
        
       />

<TextInput 
          style={styles.formTextInput}
          multiline
          numberOfLines={8}
          placeholder = {"Why do you want this item?"}
          onChangeText={(text)=>{
            this.setState ({
          description    : text
            })
          }}
          value = {this.state.description}
        
       />

       <TouchableOpacity style={styles.button} onPress={()=>{this.addRequest(this.state.itemName,this.state.description)}}>
       <Text>Request</Text>
       </TouchableOpacity>
      </KeyboardAvoidingView>
     
      </View>
    
    );
  }
  }
} 
const styles = StyleSheet.create({
 KeyboardAvoidingView:{
   flex:1,
   justifyContent:'center',
   alignItems:'center'
 },
 button:{
   width:"75%",
   height:35,
   justifyContent:'center',
   alignItems:'center',
   borderRadius:5,
   backgroundColor:"#ff9800",
   shadowColor: "#000",
   shadowOffset: {
      width: 0,
      height: 8,
   }
  },
  formTextInput : {
    width:"75%",
    height : 35,
    alignSelf : "center",
    borderRadius:10,
    borderWidth:1,
    marginTop : 20,
    padding:10
  }
})