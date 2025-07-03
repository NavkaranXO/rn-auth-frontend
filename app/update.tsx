import react, { useState } from 'react';
import { Text, TextInput, View, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function Update() {
    const [newUsername, setNewUsername] = useState('');

    const onSubmit = async (newUsername: string) => {

        const jwtToken = await SecureStore.getItemAsync('jwtToken');

        if(!jwtToken) {
            console.error('JwtToken not found');
            return;
        }

        try {
            const response = await fetch(`http://10.50.179.228:8080/update/${newUsername}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            const json = await response.json();

            if(!response.ok) {
                const error = await response.text();
                console.error(error);
                throw new Error(`Update failed ${response.status}`);
            }

            alert(json.message);
            
            console.log('Username updated successfully!');

        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    return (
        <>
            <View>
                <TextInput placeholder='new username' onChangeText={setNewUsername} />
                <Button title='Submit' onPress={() => onSubmit(newUsername)}></Button>
            </View>
        </>
    )
}