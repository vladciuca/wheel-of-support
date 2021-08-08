import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";

const WinnerPanel = ({ winnerArray, width }) => {
  return (
    <View style={{ ...styles.panel, width: width }}>
      <View style={{ ...styles.person, width: width / 2 }}>
        <Icon name="person" color="#a487c3" size="40px" />
        <Text style={styles.shift}>1st Shift</Text>
        <Text style={styles.winner}>{winnerArray[0]}</Text>
      </View>

      <View style={{ ...styles.person, width: width / 2 }}>
        <Icon name="person" color="#a487c3" size="40px" />
        <Text style={styles.shift}>2nd Shift</Text>
        <Text style={styles.winner}>{winnerArray[1]}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    top: 110,
    flexDirection: "row",
  },
  shift: {
    color: "gray",
    fontSize: 15,
    textAlign: "center",
  },
  person: {
    alignItems: "center",
  },
  winner: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "#FFF",
    flexWrap: "wrap",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
});

export default WinnerPanel;
