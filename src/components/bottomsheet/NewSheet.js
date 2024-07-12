import React, {forwardRef} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Grid} from '../../constants/assets';
import {Box} from '../../theme';
import Icon from 'react-native-vector-icons/Ionicons';
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
        <Box style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
          <TouchableOpacity
            onPress={() => {
              ref.current.close();
              navigation.navigate('NewPost');
            }}>
            <Box gap={'s'} alignItems="center" flexDirection="row">
              <Grid />
              <Text style={styles.sheetItemText}>Post</Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              ref.current.close();
              navigation.navigate('NewStory');
            }}>
            <Box gap={'s'} alignItems="center" flexDirection="row">
              <Icon name="timer-outline" color={'#262626'} size={30} />
              <Text style={styles.sheetItemText}>Story</Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity >
            <Box gap={'s'} alignItems="center" flexDirection="row">
            <Text style={styles.sheetItemText}>Live</Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity >
            <Box gap={'s'} alignItems="center" flexDirection="row">
            <Text style={styles.sheetItemText}>Reel</Text>
            </Box>
          </TouchableOpacity>
        </Box>
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
