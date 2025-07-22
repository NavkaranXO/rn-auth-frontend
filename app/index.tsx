import React, { useState } from 'react';
import { Text, TextInput, View, Button, TouchableOpacity } from "react-native";
import "../global.css"
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch("Your_Login_EndPoint", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username, password
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const authHeader = response.headers.get('Authorization');

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const jwtToken = authHeader.substring(7);
        await SecureStore.setItemAsync('jwtToken', jwtToken);
        router.push('/stomp');
      }

      else {
        throw new Error("No Authorization Header found!")
      }
      
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return (
    <>
      <View className="flex-1 justify-center items-center">
        <View className="w-10/12 bg-white px-10 py-10 rounded-lg">
          <Text className="font-thin text-4xl mb-5">Log in</Text>
          <TextInput className="bg-gray-50 border border-gray-100 rounded-lg mb-4 p-2" placeholder="username" onChangeText={setUsername} />
          <TextInput className="bg-gray-50 border border-gray-100 rounded-lg mb-8 p-2" placeholder="password" onChangeText={setPassword} />
          <View className='flex flex-row justify-between'>
            <TouchableOpacity onPress={() => router.push('/signUp')} className='p-1'>
              <Text className='self-center'>Sign-up?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLogin(username, password)} className='w-1/4 border rounded-full bg-black'>
              <Text className='self-center text-white p-1'>log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
