import React from 'react';
import { StyleSheet, Text, View, Image,FlatList,TouchableOpacity,Alert } from 'react-native';
import {ListItem} from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';
import {Header,Icon,Card} from 'react-native-elements';
import MyBarters from '../screens/MyDonations';

export default class ReceiverDetailsScreen extends React.Component {
    constructor (props) {
        super(props);
        this.state ={
           userName:"",
           userId : firebase.auth().currentUser.email,
           receiverId : this.props.navigation.getParam("details")["userName"],
           requestId : this.props.navigation.getParam("details")["exchangeId"],
           itemName : this.props.navigation.getParam("details")["itemName"],
           description : this.props.navigation.getParam("details")["description"],
           receiverName : "",
           receiverAddress : "",
           receiverContact : "",
           receiverDocId : ""
        }
    } 
     getReceiverDetails () {
         db.collection("users").where("email_id","==",this.state.receiverId).get()
         .then(snapshot=>{
             snapshot.forEach(doc=>{
                 this.setState({
                    receiverName : doc.data().first_name,
                    receiverAddress : doc.data().address,
                    receiverContact : doc.data().contact
                 })
             })
         })
         db.collection("exchanged_requests").where("request_id","==",this.state.exchangeId).get()
         .then(snapshot=>{
             snapshot.forEach(doc=>{
                 this.setState({
                     receiverDocId : doc.id
                 })
             })
         })
     } 

     updateBarterStatus = ()=>{
         db.collection("all_barters").add({
             item_Name : this.state.itemName,
             exchangeId : this.state.exchangeId,
             request_by : this.state.receiverName,
             donor_id : this.state.userId
,
request_status : "Donor Interested"
            })
     }

     componentDidMount () {
        this.getReceiverDetails();
        this.getUserDetails(this.state.userId);
     }

     addNotification = () => {
         var message = this.state.userName + "Has shown interest to donate a book"
         db.collection("all_notifications").add({
             "targeted_user_Id" : this.state.receiverId,
             donorId : this.state.userId,
             exchangeId : this.state.exchangeId,
             itemName : this.state.itemName,
             date : firebase.firestore.FieldValue.serverTimestamp(),
             notification_status : "unread",
             message : message
         })
             
     } 
     getUserDetails =  (userId) =>  {
        db.collection("users").where("email_id","==",userId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                   userName : doc.data().first_name + " " + doc.data().last_name 
                })
            })
        })
    }

   render () {
       return(
           <View style={{flex:1}}>
                 <Header 
          leftComponent = {<Icon name="arrow-left" type="font-awesome" color="blue" 
          onPress={()=>this.props.navigation.goBack()}
          />
}
          centerComponent = {{text : "Exchange Items",style:{color:"black",fontSize:30,fontWeight:"bold"}}}
          backgroundColor = "pink"
        />  
        <View style={{flex:0.3}}>
            <Card 
              title={"Item Information"}
              titleStyle = {{fontSize:20}}
            >
             <Card>
                 <Text style={{fontWeight:"bold"}}> Name : {this.state.itemName} </Text>
                 </Card> 

                 <Card>
                 <Text style={{fontWeight:"bold"}}> Reason  : {this.state.description} </Text>
                 </Card> 
            </Card> 
            <View style={{flex:0.3}}>
                <Card 
                  title={"Receiver Information"}
                  titleStyle = {{fontSize:20}}
                > 
                   <Card>
                 <Text style={{fontWeight:"bold"}}> Receiver name : {this.state.receiverName} </Text>
                 </Card>

                 <Card>
                 <Text style={{fontWeight:"bold"}}> Address : {this.state.receiverAddress} </Text>
                 </Card>

                 <Card>
                 <Text style={{fontWeight:"bold"}}> Contact number  : {this.state.receiverContact} </Text>
                 </Card>
                </Card>
            </View>

        </View>
           <View>
               {
                   this.state.receiverId !== this.state.userId 
                   ? (
                       <TouchableOpacity
                       onPress={()=>{this.updateBarterStatus()
                        this.addNotification()
                      this.props.navigation.navigate("MyBarters")
                    }}
                       >
                         <Text> I want to exchange </Text>
                       </TouchableOpacity>
                   )
                   : null
               }
           </View>
           </View>
       )
   }
}