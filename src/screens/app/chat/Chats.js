import { StyleSheet,  } from 'react-native'
import React from 'react'
import { createBox, createText } from '@shopify/restyle'

const Box = createBox();
const Text = createText();

const Chats = () => {
  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Text>Chats</Text>
    </Box>
  )
}

export default Chats

const styles = StyleSheet.create({})