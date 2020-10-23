import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Platform, PermissionsAndroid, 
    TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback
 } from 'react-native';

import * as Constants from '../Endpoints/Enpoints'
import { Card, CardItem, Icon, Button, Item, Header } from 'native-base';

import GeolocationAndroid from 'react-native-geolocation-service';

import StarRating from 'react-native-star-rating';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

export default class ListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        placesData:"",
        rerender:false,
        currentLatitude:0,
        currentLongitude:0
    };
  }
  componentDidMount(){
      this.getData();
  }

  getData = async () => {
    await fetch(URL,{
        method: "GET"
    })
    .then(response => response.json())
      .then(response => {
        this.setState({placesData:response,rerender:!this.state.rerender},()=> this.getCurrentPosition())
        console.log(this.state.placesData);
        
      })
      .catch(error => {
        alert(error);
      });
  }

  getCurrentPosition = async () => {
      if(Platform.OS == "android"){
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        GeolocationAndroid.getCurrentPosition(position => {
            this.setState({currentLatitude:position.coords.latitude,currentLongitude:position.coords.longitude},
                ()=>this.calculateDistance())
        },
        (error) => console.log(new Date(), error),
        {enableHighAccuracy: false, timeout: 10000, maximumAge: 3000})
    }
  }

  calculateDistance = () => {
    console.log("calculating");
    console.log(this.state.currentLatitude,this.state.currentLongitude);
    var calDis = this.state.placesData.map((p) => {
        console.log("p.Latitude,p.Longitude");
        console.log(p.Latitude,p.Longitude);
        p.Distance = this.calculate(this.state.currentLatitude,this.state.currentLongitude,p.Latitude,p.Longitude)
    })
    var order = this.state.placesData
    order.sort(function(a,b){ return a.Distance - b.Distance})
    this.setState({placesData:order})
    console.log(this.state.placesData);
    
  }

  calculate(lat1,lon1,lat2,lon2){
    var pi = Math.PI/180;
    var cose = Math.cos;
    var res = 0.5 - cose((lat2 - lat1) * pi)/2 +
              cose(lat1 * pi) * cose(lat2 * pi) * (1 - cose((lon2 - lon1) * pi))/2;
  
    return Math.round( 12742 * Math.asin(Math.sqrt(res)));
  }

  navDetails = (id) => {
    console.log("nav details");
    console.log(id);
    var items = this.state.placesData
    var item = items.find(element => element.PlaceId == id)
    this.props.navigation.navigate('Details',{item: item});
  }

  render() {
    return (
        <>
        <Header style={{backgroundColor:"white"}}>
            <Image style={styles.imageHeader} source={require('../img/Arkus.png')} />
        </Header>
        <View style={styles.containerStyle}>
            <FlatList
                data={this.state.placesData}
                extraData={this.state.rerender}
                renderItem={({item,index}) => (
                    <Card>
                        <CardItem button={true} onPress={()=>this.navDetails(item.PlaceId)}>
                            <View style={styles.cardItemView}>
                                <View style={{width:"20%",}}>
                                    <Image style={styles.placeImage} source={{uri:item.Thumbnail}} />
                                </View>
                                <View style={styles.bodyStyle}>
                                    <Text style={styles.placeTitle} numberOfLines={1}>{item.PlaceName}</Text>
                                    <View style={{width:"50%"}}>
                                        <StarRating disabled={true} maxStars={5} rating={item.Rating} 
                                                starSize={20} starStyle={{color:secColor}}/>
                                    </View>
                                    <View style={{marginTop:10}}>
                                        <Text style={styles.placeAddress}>{item.AddressLine1}</Text>
                                        <Text style={styles.placeAddress}>{item.AddressLine2}</Text>
                                    </View>
                                </View>
                                <View style={{width:"20%",}}>
                                    <Text style={styles.placeMeters}>{item.Distance} Km</Text>
                                    {item.IsPetFriendly ? 
                                        <>
                                            <Icon type="FontAwesome5" style={styles.petIcon} name="dog" />
                                            <Text style={styles.petFriendly}>Pet Friendly</Text>
                                        </>
                                    :
                                        null
                                    }
                                </View>
                            </View>
                        </CardItem>
                    </Card>
                )}
                key={(item,index) => index}
                keyExtractor={(item,index) => index.toString()}
                ListEmptyComponent={<Text style={styles.emptyComponent}>There's no places to see</Text>}
            />
        </View>
      </>
    );
  }
}

const URL = Constants.coffeeAPI;
const primColor = Constants.primColor;
const secColor = Constants.secColor;
const thirdColor = Constants.thirdColor;
const fourthColor = Constants.fourthColor;
const styles = StyleSheet.create({
    containerStyle:{
        flex:1,
        marginBottom:10
    },
    imageHeader:{
        width:"60%",
        height:"100%",
        resizeMode:"contain"
    },
    bodyStyle:{
        width:"60%",
        height:"100%",
        paddingHorizontal:10
    },
    cardItemView:{
        flexDirection:"row",
        width:"100%",
        height:"100%"
    },
    placeImage:{
      width:null,
      height:70,
      resizeMode:"contain"
    },
    placeTitle:{
        fontSize:16,
        alignSelf:"flex-start",
        color: primColor
    },
    placeAddress:{
        fontSize:14,
        color:fourthColor
    },
    placeMeters:{
        fontSize:16,
        alignSelf:"flex-end",
        color: primColor
    },
    petIcon:{
        color:thirdColor,
        fontSize:45,
        width:"75%",
        alignSelf:"center"
    },
    petFriendly:{
        fontSize:14,
        color:fourthColor,
        alignSelf:"center"
    },
    emptyComponent:{
        textAlign:"center",
        color:primColor
    }
})