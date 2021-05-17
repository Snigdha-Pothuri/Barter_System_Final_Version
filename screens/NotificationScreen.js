import React, { Component } from 'react';
import { StyleSheet, View, FlatList,Text } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import db from '../config';
import {SwipableFlatlist} from '../components/SwipableFlatlist'
export default class Notifications extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          userId :  firebase.auth().currentUser.email,
          allNotifications : []
        };
    
        this.notificationRef = null
      }
      

  getNotifications=()=>{
    this.notificationRef = db.collection("all_notifications")
    .where("notification_status", "==", "unread")
    .where("targeted_user_Id",'==',this.state.userId)
    .onSnapshot((snapshot)=>{
      var allNotifications =  []
      snapshot.docs.map((doc) =>{
        var notification = doc.data()
        notification["doc_id"] = doc.id
        allNotifications.push(notification)
      });
      this.setState({
          allNotifications : allNotifications
      });
    })
  }

componentDidMount(){
    this.getNotifications()
  }

  componentWillUnmount(){
    this.notificationRef()
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({item,index}) =>{
      return (
        <ListItem
          key={index}
          leftElement={<Icon name="gift" type="font-awesome" color ='#696969'/>}
          title={item.itemName}
          titleStyle={{ color: 'black', fontWeight: 'bold' }}
          subtitle={item.message}
          bottomDivider
        />
      )
 }
   render(){
    return(
      <View style={styles.container}>
        <View style={styles.flex}>
           <MyHeader title="Notifications" navigation={this.props.navigation}></MyHeader>
        </View>
        <View style={{flex=0.9}}>
         {
             this.state.Notifications.length===0
             ?(
                 <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                   <Text style={{fontSize:25}}> You Have No Notifications</Text>
                 </View>
             )
             :(
               <SwipableFlatlist 
                 allNotifications={this.state.Notifications}
                 />
             )
         }
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container : {
    flex : 1
  }
})