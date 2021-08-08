import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const ParticipantList = ({ participantsArray, handleRemoveParticipant }) => {
  return (
    <View style={styles.listContainer}>
      <Text style={styles.title}>Participants</Text>
      <ScrollView style={styles.list}>
        {participantsArray.map((participant, index) => {
          return (
            <View style={styles.listItem} key={index}>
              <View style={styles.nameContainer}>
                <Text style={styles.index}>{index + 1}</Text>
                <Text style={styles.name} numberOfLines={1}>
                  {participant}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleRemoveParticipant(participant)}
              >
                <View style={styles.removeBtn}>
                  <Text style={styles.removeBtnText}>Remove</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
        <Text style={styles.info}>
          Only the first 6 characters of the participant name will be displayed
          on the Wheel
        </Text>
      </ScrollView>
    </View>
  );
};

export default ParticipantList;

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    position: "absolute",
    top: 110,
    shadowColor: "black",
    shadowRadius: 5,
  },
  title: {
    fontSize: 30,
    paddingVertical: 15,
    textAlign: "center",
  },
  info: {
    fontSize: 12,
    color: "gray",
    padding: 15,
    textAlign: "center",
  },
  list: {
    paddingHorizontal: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "row",
    marginBottom: 10,
    maxWidth: "70%",
  },
  index: {
    color: "gray",
    paddingRight: 10,
    fontSize: 20,
    width: 40,
    textAlign: "center",
  },
  name: {
    fontSize: 20,
    paddingRight: 20,
  },
  removeBtn: {
    backgroundColor: "#ff7b7b",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
  },
  removeBtnText: {
    color: "#FFF",
  },
});
