import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

const MenuBar = ({
  participants,
  toggleAddParticipantInput,
  toggleParticipantList,
}) => {
  return (
    <View style={styles.menu}>
      <TouchableOpacity onPress={() => toggleAddParticipantInput()}>
        <View style={styles.menuItem}>
          <Icon name="person-add-alt-1" color="#a487c3" size="35px" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => toggleParticipantList()}>
        <View style={styles.menuItem}>
          <Text style={styles.text}>{participants}</Text>
          <Icon name="person" color="#a487c3" size="35px" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    top: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    width: 40,
  },
  text: {
    fontWeight: "bold",
    color: "#a487c3",
    fontSize: 18,
  },
});

export default MenuBar;
