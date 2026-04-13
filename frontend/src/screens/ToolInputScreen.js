import React,{useState} from "react";
import {View,TextInput,Button} from "react-native";

export default function ToolInputScreen({route,navigation}){

const {tool}=route.params
const [text,setText]=useState("")

const generate=()=>{

navigation.navigate("Result",{result:"Generated text for "+text})

}

return(

<View style={{padding:20}}>

<TextInput
placeholder="Enter topic"
value={text}
onChangeText={setText}
style={{borderWidth:1,padding:10}}
/>

<Button title="Generate" onPress={generate} />

</View>

)

}