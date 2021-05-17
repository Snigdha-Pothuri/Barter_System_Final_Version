import React, { Component } from 'react';
import { StyleSheet, View, FlatList,Text,Dimensions,Animated } from 'react-native';
import {ListItem,Icon} from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list-view';
import db from '../config';
 
export default class SwipableFlatlist extends React.Component { 
    constructor (props) {
        super(props);
        this.state = {
            allNotifications : this.props.allNotifications
        }
    }
    onSwipeValueChange = swipeData => {
        var allNotifications = this.state.allNotifications
        const {key,value} = swipeData
        if (value < -Dimensions.get("window").width) {
           const newData = [...allNotifications]
           const prevIndex = allNotifications.findIndex(item=>
               item.key === key
           )
           this.updateMarkAsRead(allNotifications[prevIndex])
           newData.splice(prevIndex,1)
           this.setState({
               allNotifications : newData
           })
        }
     } 

     updateMarkAsRead = (notification) => {
        db.collection("all_notifications").doc(notification.doc_id).update({
            notification_status : "read"
        })
     }
     renderItem = data => (
      <Animated.View>

        <ListItem
          
           title = {data.item.itemName}
           subtitle = {data.item.message} 
           leftElement = {<Icon
                     name = "gift" type="font-awesome" color = "yellow"
           />}
  
            
           bottomDivider 
        />
                 
      </Animated.View>
     )

      renderHiddenItem =()=>(
<View     style={styles.rowBack}>
<View style={[styles.backRightButton,styles.backRight]}>
<Text style={styles.backText}>  </Text>
</View>
</View>          
      )
    
    render () {
        return (
            <View style={{flex:1}}>
              <SwipeListView
                 disableRightSwipe
                 data = {this.state.allNotifications}
                 renderItem = {this.renderItem}
                 renderHiddenItem = {this.renderHiddenItem}
                 rightOpenValue = {-Dimensions.get("window").width}
                 previewRowKey = {"0"} 
                 previewOpenValue = {-40}
                 previewOpenDelay = {3000}
                 onSwipeValueChange = {this.onSwipeValueChange}
              />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    rowBack : {
        alignItems : "center",
        backgroundColor : "grey",
        flex : 1,
        flexDirection : "row",
justifyContent : "space-between",
paddingLeft  : 15
    },
    backRightButton : {
        alignItems : "center",
        bottom : 0,
        justifyContent : "center",
        position :  "absolute",
        top : 0,
        width : 100
    },
    backRight : {
        backgroundColor : "#29b8a3",
        right : 0
},
backText : {
color : "white",    
fontWeight : "bold",
fontSize : 20
}
})