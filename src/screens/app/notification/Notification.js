import React from 'react'
import { createBox, createText } from '@shopify/restyle'

const Box = createBox()
const Text = createText()

const Notification = () => {
  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Text>Notification</Text>
    </Box>
  )
}

export default Notification

