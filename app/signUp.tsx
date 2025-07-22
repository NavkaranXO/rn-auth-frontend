import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const router = useRouter();

const showAlert = (message: string) => {
    Alert.alert('Sign up Successful', message, [
        {
            text: 'Ok',
            onPress: () => router.back(),
        }
    ])
}

const handleSignup = async (username: string, email: string, password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
    }
    else {
        try {
            const response = await fetch("Your_Signup_Endpoint", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username, email, password
                })
            });

            const json = await response.json();

            if (response.status == 201) {
                showAlert(json.message);
            }

            else {
                alert(json.message);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    return (
        <>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1'>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1 }}>
                        <View className="flex-1 justify-center items-center">
                            <View className="w-10/12 bg-white px-10 py-10 rounded-lg">
                                <Text className="font-thin text-4xl mb-5">Sign up</Text>
                                <TextInput className="bg-gray-50 border border-gray-100 rounded-lg mb-4 p-2" placeholder="username" onChangeText={setUsername} />
                                <TextInput className="bg-gray-50 border border-gray-100 rounded-lg mb-4 p-2" placeholder='email' onChangeText={setEmail} />
                                <TextInput className="bg-gray-50 border border-gray-100 rounded-lg mb-4 p-2" placeholder="password" onChangeText={setPassword} />
                                <TextInput className="bg-gray-50 border border-gray-100 rounded-lg mb-4 p-2" placeholder='confirm password' onChangeText={setConfirmPassword} />
                                <View className='flex flex-row justify-between'>
                                    <TouchableOpacity onPress={() => router.back()} className='p-2'>
                                        <Text>Already a user?</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() =>
                                        handleSignup(username, email, password, confirmPassword)} className='w-1/4 border rounded-full bg-black p-1'>
                                        <Text className='self-center text-white p-1'>Sign up</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    );
};

export default SignUp;
