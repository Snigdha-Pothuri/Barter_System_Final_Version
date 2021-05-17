import React from 'react';
import { StyleSheet, Text, View, Image,FlatList,TouchableOpacity,Alert } from 'react-native';
import {ListItem,Icon} from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class MyBarters extends React.Component {
    static navigationOptions = {
        header : null
    }
  constructor () {
    super ();
    this.state = {
     donorId : firebase.auth().currentUser.email,
      allBarters : [],
      donorName : ""
    }
    this.requestRef = null

  } 
  getDonorDetails = (donorId) => {
    db.collection("users").where("email_id","==",donorId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          donorName : doc.data().first_name + " " + doc.data().last_name
        })
      })
    })
  }
  getAllDonations = () => {
   this.requestRef = db.collection("all_barters").where("donor_id","==",this.state.donorId)
   .onSnapshot((snapshot)=>{
     var allBarters = []
     snapshot.docs.map((doc)=>{
       var donation = doc.data()
       donation["doc_id"]=doc.id
       allBarters.push(donation)
     })
    
     this.setState({
       allBarters : allBarters
     })
   })
   } 
   
 sendBook = (bookDetails) =>{
     if(bookDetails.request_status === "itemSent"){
       var requestStatus = "Donor interested"
       db.collection("all_barters").doc(bookDetails.doc_id).update({
         "request_status" : "Donor interested"
       })
       this.sendNotification(bookDetails,requestStatus)
     } 
     else {
        var requestStatus = "Book sent"
        db.collection("all_barters").doc(bookDetails.doc_id).update({
          "request_status" : "Book sent"
        })
        this.sendNotification(bookDetails,requestStatus)

     }

   }
   sendNotification = (bookDetails,requestStatus) => {
    var requestId = bookDetails.exchangeId
    var donorId = bookDetails.donor_id
    db.collection("all_notifications").where("exchangeId","==",requestId)
    .where("donor_id","==",donorId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var message = ""
        if (requestStatus === "Item sent") {
          message = this.state.donorName + "Sent you a item"
        }
        else {
          message = this.state.donorName + "Has shown interest in donating you a item"
        }
        db.collection("all_notifications").doc(doc.id).update({
          "message" : message,
          notification_status : "unread",
          date : firebase.firestore.FieldValue.serverTimestamp()
        })
      })
    })
   }
componentDidMount (){
  this.getAllDonations()
}
  componentWillUnmount (){
    this.requestRef()
  }
  keyExtractor = (item,index)=>
    index.toString();
  renderItem = ({item,i}) => {
    return (
    <ListItem
       key={i}
       title = {item.item_Name}
       subtitle = {"requested by : " + item.request_by + "\nstatus :" + item.request_status} 
       leftElement = {<Icon
                 name = "gift" type="font-awesome" color = "yellow"
       />}
       titleStyle = {{color:"black",fontWeight:"bold"}}
       rightElement = {
         <TouchableOpacity style={[styles.button,
        {
          backgroundColor : item.request_status === "item sent" ? "green" : "red"
        } 
        ]}
        onPress = {()=>{this.sendBook(item)}}
         >
          <Text style={{color:"black"}}> 
            Send Book
          </Text>
         </TouchableOpacity> 
       } 
       bottomDivider 
    />
    )
  }

  render(){
    return (
      <View style={{flex:1}}>
        <MyHeader title="My Barters" 
          navigation= {this.props.navigation}
        />
        <View style={{flex:1}}>
           {
             this.state.allBarters.length === 0
             ? (
               <View>
                 <Text> List of all items exchanged </Text>
               </View>
             ) 
             : (
               <FlatList
                  keyExtractor = {this.keyExtractor}
                  data = {this.state.allBarters}
                  renderItem = {this.renderItem}
               />
             )
           }
        </View>
      </View>
    );
  }
} 

const styles = StyleSheet.create({
  button :{
    width:100,height:50,alignItems:"center",alignSelf:"center",justifyContent:"center"
  }
})