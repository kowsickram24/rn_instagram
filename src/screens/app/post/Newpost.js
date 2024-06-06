import React, { useState } from 'react';
import { View } from 'react-native';

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

        </View>
    );
}

export default NewPost;
