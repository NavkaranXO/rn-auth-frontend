import react, { useState, useRef } from 'react';
import { Text, View, TextInput, Button, FlatList } from 'react-native';
import { Client, IMessage } from '@stomp/stompjs';
import * as SecureStore from 'expo-secure-store';

type ChatMessage = {
    receiver: string;
    message: string;
    [key: string]: any;
};


export default function Stomp() {

    const [recipient, setRecipient] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const clientRef = useRef<Client | null>(null);

    const connectWebSocket = async () => {
        const jwtToken = await SecureStore.getItemAsync('jwtToken');
        const client = new Client({
            brokerURL: 'ws://10.170.188.124:8080/websocket',
            connectHeaders: {
                Authorization: `Bearer ${jwtToken}`,
            },
            debug: function (str) {
                console.log('[STOMP DEBUG]:', str);
            },
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
            reconnectDelay: 5000,

            onConnect: () => {
                console.log("Connected");
                client.subscribe('/user/queue/messages', (message: IMessage) => {
                    try {
                        const body = JSON.parse(message.body);
                        setMessages(prev => [...prev, body]);
                    } catch (err) {
                        console.error(err);
                    }
                });
            },

            onStompError: frame => {
                console.error('Broker error', frame.headers['message']);
            },
        });

        client.activate();
        clientRef.current = client;
    }

    const disconnectWebSocket = () => {
        clientRef.current?.deactivate();
        clientRef.current = null;
    };

    const sendMessage = (recipient: string, message: string) => {
        clientRef.current?.publish({
            destination: '/chat/private',
            body: JSON.stringify({
                receiver: recipient,
                message: message,
            }),
        });
    }

    return (
        <>
            <View className='flex flex-col gap-2'>
                <Button title='Connect' onPress={connectWebSocket}></Button>
                <TextInput placeholder='Enter Recepient' onChangeText={setRecipient}></TextInput>
                <TextInput placeholder='Enter Message' onChangeText={setMessage}></TextInput>
                <Button title='Send' onPress={() => sendMessage(recipient, message)}></Button>
                <Button title='Disconnect' onPress={disconnectWebSocket}></Button>
            </View>
            <View>
                <FlatList
                    data={messages}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => <Text>{item.message}</Text>}
                />
            </View>
        </>
    )
}