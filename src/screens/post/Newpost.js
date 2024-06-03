import React, { useState } from 'react';
import { View } from 'react-native';
import { InstagramLikePicker } from 'react-native-instagram-like-picker';

const NewPost = () => {

    const onSelectImage = (data) => {
        console.log('onSelectImage =>', data);
    }

    const onCropped = (data) => {
        console.log('onCropped =>', data);
    }

    const onClose = () => {
        console.log('onClose');
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <InstagramLikePicker
                onClose={onClose}
                onCropped={(croppedUri) => onCropped(croppedUri)}
                onSelectImage={(result) => onSelectImage(result)}
                headerTitle="Last Post"
            />
        </View>
    );
}

export default NewPost;
