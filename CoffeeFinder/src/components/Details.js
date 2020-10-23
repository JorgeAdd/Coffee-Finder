import React, { Component } from 'react';
import { View, Text, StyleSheet,Linking,Platform } from 'react-native';
import { Body, Left, Icon, Header, Right, Title, Container, Image, Content, H2, H3, Item } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import StarRating from 'react-native-star-rating';
import {WebView} from 'react-native-webview';
import Modal from 'react-native-modal';
import * as Constants from '../Endpoints/Enpoints'

import MapView,{PROVIDER_GOOGLE,Marker} from 'react-native-maps';

export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
        placeData:"",
        webModal:false
    };
    
  }

  componentDidMount(){
    const { params } = this.props.route;
    this.setState({placeData:params.item})
  }

  goBack(){
    this.props.navigation.goBack();
  }

  render() {
    return (
        <Container>
            <Header style={{backgroundColor:"#FFF",alignItems:"center",alignContent:"center",justifyContent:"center"}}>
                <Left style={{paddingRight:"20%"}}>
                    <TouchableOpacity onPress={()=>this.goBack()}><Icon style={{color:secColor}} name="arrow-back"/></TouchableOpacity>
                </Left>
                <Body style={{alignContent:"center",alignItems:"center"}}>
                    <Title style={{color:secColor,fontSize:24,textAlign:"center"}}>Details</Title>
                </Body>
                <Right/>
            </Header>
            <Modal isVisible={this.state.webModal} onBackButtonPress={()=>this.setState({webModal:false})}>
                <WebView source={{uri:this.state.placeData.Site}} />
            </Modal>
            <Content padder>
                <MapView
                    initialRegion={{
                    latitude:this.state.placeData.Latitude,
                    longitude:this.state.placeData.Longitude,
                    latitudeDelta:0.0122,
                    longitudeDelta:0.0121
                    }}
                    style={{width:"100%",height:200}}>
                    <Marker
                        draggable={false}
                        coordinate={{
                        latitude:this.state.placeData.Latitude,
                        longitude:this.state.placeData.Longitude
                        }}
                        title={"It's here!"}
                    />
                </MapView>
                <View style={{flexDirection:"row",justifyContent:"space-between", width:"100%",marginTop:10}}>
                    <H3 style={styles.h3Title}>{this.state.placeData.PlaceName}</H3>
                    <Text style={{alignSelf:"flex-end",color:secColor}}>{this.state.placeData.Distance} Km</Text>
                </View>
                <View style={{flexDirection:"row",justifyContent:"space-between", width:"100%"}}>
                    <View>
                        <View style={{width:"30%"}}>
                        <StarRating disabled={true} maxStars={5} rating={this.state.placeData.Rating} 
                                starSize={20} starStyle={{color:secColor}}/>
                        </View>
                        <Text style={styles.placeAddress}>American{this.state.placeData.IsPetFriendly ? ", Dogs Allowed" : null}</Text>
                    </View>
                    {this.state.placeData.IsPetFriendly ? 
                        <View>
                            <Icon type="FontAwesome5" style={styles.petIcon} name="dog" />
                        </View>
                    :
                        null
                    }
                </View>
                <Item style={{flexDirection:"column"}}>
                    <Text style={styles.placeAddress}>{this.state.placeData.AddressLine1}</Text>
                    <Text style={styles.placeAddress}>{this.state.placeData.AddressLine2}</Text>
                </Item>
                
                <Item style={styles.itemStyle} 
                onPress={()=>Linking.openURL(Platform.OS="android" ? 
                        'geo:0,0?q='+this.state.placeData.Latitude+","+this.state.placeData.Longitude+
                        "(Custom Label)":null)}>
                    <Left style={{flexDirection:"row"}}>
                        <Icon type="FontAwesome5" style={styles.petIcon} name="directions" />
                        <View style={{marginHorizontal:10}}>
                            <Text style={[styles.itemTitle,{fontSize:20}]}>Directions</Text>
                            <Text style={styles.itemTitle}>{Math.round(+this.state.placeData.Distance/60)} hrs</Text>
                        </View>
                    </Left>
                    <Right>
                        <Icon type="FontAwesome5" style={styles.arrowIcon} name="arrow-right" />
                    </Right>
                </Item>
                
                <Item style={styles.itemStyle} onPress={()=>Linking.openURL(`tel:${this.state.placeData.PhoneNumber}`)}>
                    <Left style={{flexDirection:"row"}}>
                        <Icon type="FontAwesome5" style={styles.petIcon} name="phone" />
                        <View style={{marginHorizontal:10}}>
                            <Text style={[styles.itemTitle,{fontSize:20}]}>Call</Text>
                            <Text style={styles.itemTitle}>{this.state.placeData.PhoneNumber}</Text>
                        </View>
                    </Left>
                    <Right>
                        <Icon type="FontAwesome5" style={styles.arrowIcon} name="arrow-right" />
                    </Right>
                </Item>

                <Item style={styles.itemStyle} onPress={()=>this.setState({webModal:true})}>
                    <Left style={{flexDirection:"row"}}>
                        <Icon type="FontAwesome5" style={styles.petIcon} name="link" />
                        <View style={{marginHorizontal:10}}>
                            <Text style={[styles.itemTitle,{fontSize:20}]}>Visit Website</Text>
                            <Text style={styles.itemTitle}>{this.state.placeData.Site}</Text>
                        </View>
                    </Left>
                    <Right>
                        <Icon type="FontAwesome5" style={styles.arrowIcon} name="arrow-right" />
                    </Right>
                </Item>
            </Content>
        </Container>
    );
  }
}


const primColor = Constants.primColor;
const secColor = Constants.secColor;
const thirdColor = Constants.thirdColor;
const fourthColor = Constants.fourthColor;
const styles = StyleSheet.create({
    placeAddress:{
        fontSize:16,
        color:thirdColor,
        width:"100%",
        textAlign:"left"
    },
    itemTitle:{
        fontSize:16,
        color:secColor,
        width:"100%",
        textAlign:"left"
    },
    h3Title:{
        color:primColor
    },
    petIcon:{
        color:thirdColor,
        fontSize:45,
        alignSelf:"center"
    },
    arrowIcon:{
        color:thirdColor,
        fontSize:24,
    },
    petFriendly:{
        fontSize:14,
        color:fourthColor,
        alignSelf:"center"
    },
    itemStyle:{
        flexDirection:"row",
        paddingVertical:10, 
        width:"100%"
    }
})