import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {toHsv, TriangleColorPicker} from 'react-native-color-picker';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
      <TriangleColorPicker
        oldColor="purple"
        onColorSelected={color => alert(`Color selected: ${toHsv(color).h}`)}
        style={{flex: 1}}
      />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
