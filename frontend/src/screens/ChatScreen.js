import React,{useState} from "react";
import {View,TextInput,Button,Text} from "react-native";

export default function ChatScreen(){

const [msg,setMsg]=useState("")
const [reply,setReply]=useState("")

const send=()=>{
setReply("AI response for "+msg)
}

return(

<View style={{padding:20}}>

<TextInput
placeholder="Ask anything"
value={msg}
onChangeText={setMsg}
style={{borderWidth:1,padding:10}}
/>

<Button title="Send" onPress={send} />

<Text>{reply}</Text>

</View>

)

}