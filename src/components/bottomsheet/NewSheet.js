import React, { forwardRef } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Grid } from '../../constants/assets';
import { Box } from '../../theme';
const NewSheet = forwardRef(({navigation}, ref) => {
  const Height = Dimensions.get('screen').height;

  return (
    <Box>
      <RBSheet
        closeOnPressBack
        draggable
        ref={ref}
        height={Height / 2}
        openDuration={100}
        customStyles={{
          container: {
            borderTopRightRadius: 45,
            borderTopLeftRadius: 45,
            justifyContent: 'center',
          },
        }}>
        <View style={{marginVertical: 10}}>
          <Text
            style={{
              fontSize: 16,
              color: '#000',
              marginVertical: 10,
              textAlign: 'center',
            }}>
            Create
          </Text>
        </View>
        <View style={styles.sheetContent}>
          <TouchableOpacity
            style={[
              styles.sheetItem,
              {flexDirection: 'row', gap: 10, justifyContent: 'center'},
            ]}
            onPress={() => {
              ref.current.close();
              navigation.navigate('NewPost');
            }}>
            <Grid />
            <Text style={styles.sheetItemText}>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sheetItem}>
            <Text style={styles.sheetItemText}>Story</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sheetItem}>
            <Text style={styles.sheetItemText}>Live</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sheetItem}>
            <Text style={styles.sheetItemText}>Reel</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </Box>
  );
});

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetItem: {
    paddingVertical: 20,
    width: '100%',
  },
  sheetItemText: {
    fontSize: 14,
    color: '#262626',
    textAlign: 'center',
  },
});

export default NewSheet;
