import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Icon } from "react-native-elements";

const SpinCounter = ({ spins, resetSpins }) => {
  return (
    <View style={styles.counterContainer}>
      <View style={styles.counter}>
        <Text style={styles.text}>{spins}</Text>
        <Icon name="person" color="#a487c3" size="40px" />
        {spins > 0 ? (
          <Text style={styles.text}>SPINS</Text>
        ) : (
          <View style={styles.reset}>
            <Button onPress={resetSpins} color="#a487c3" title="RESET" />
          </View>
        )}
      </View>
      <Text style={styles.info}>Swipe the wheel to Spin</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  counterContainer: {
    position: "absolute",
    bottom: 30,
    alignItems: "center",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 32,
    paddingHorizontal: 10,
    color: "#FFF",
  },
  reset: {
    marginHorizontal: 10,
  },
  info: {
    fontSize: 15,
    color: "gray",
    marginTop: 10,
  },
});

export default SpinCounter;
