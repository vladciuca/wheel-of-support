import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
} from "react-native";
import { Icon } from "react-native-elements";

const useKeyboardHeight = () => {
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardWillShow = (KeyboardEvent) => {
      Animated.timing(keyboardHeight, {
        duration: KeyboardEvent.duration,
        toValue: KeyboardEvent.endCoordinates.height,
        useNativeDriver: true,
      }).start();
    };

    const keyboardWillHide = (KeyboardEvent) => {
      Animated.timing(keyboardHeight, {
        duration: KeyboardEvent.duration,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    };

    const keyboardWillShowSub = Keyboard.addListener(
      "keyboardWillShow",
      keyboardWillShow
    );
    const keyboardWillHideSub = Keyboard.addListener(
      "keyboardWillHide",
      keyboardWillHide
    );

    return () => {
      keyboardWillHideSub.remove();
      keyboardWillShowSub.remove();
    };
  }, [keyboardHeight]);

  return keyboardHeight;
};

const AddParticipant = ({ handleAddParticipant }) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    handleAddParticipant(value);
    if (value.length > 3) {
      setValue("");
    }
  };

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={"Add Participant"}
        value={value}
        onChangeText={(text) => setValue(text)}
      ></TextInput>
      <TouchableOpacity onPress={() => handleSubmit()}>
        <View style={styles.addWrapper}>
          <Icon name="person-add-alt-1" color="#FFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AddParticipant;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    position: "absolute",
    zIndex: 1,
  },
  input: {
    padding: 10,
    width: 250,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "black",
    shadowRadius: 5,
  },
  addWrapper: {
    height: 40,
    width: 40,
    backgroundColor: "#a487c3",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
