import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";

const InfoMessage = ({ infoMessage, onHide }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        padding: 8,
        marginVertical: 5,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 5,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 6,
        transform: [
          {
            translateY: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
      }}
    >
      <Text style={styles.message}>{infoMessage}</Text>
    </Animated.View>
  );
};

export default InfoMessage;

const styles = StyleSheet.create({
  message: {
    textAlign: "center",
  },
});
