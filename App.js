import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text as RNText,
  View,
  Dimensions,
  Animated,
  Keyboard,
} from "react-native";
import Svg, { Path, G, Text, TSpan } from "react-native-svg";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import * as d3Shape from "d3-shape";
import color from "randomcolor";
import { snap } from "@popmotion/popcorn";
import DateTimePicker from "@react-native-community/datetimepicker";
import WinnerPanel from "./components/WinnerPanel";
import SpinCounter from "./components/SpinCounter";
import MenuBar from "./components/MenuBar";
import AddParticipant from "./components/AddParticipant";
import ParticipantList from "./components/ParticipantList";
import InfoMessage from "./components/InfoMessage";

const employees = [
  "Mark Zuckerberg",
  "Jeff Bezos",
  "Warren Buffett",
  "Elon Musk",
  "Robert Kiyosaki",
  "Johnny Cash",
  "Vlad Cristian Ciuca",
  "Frankie Valli",
  "Spiderman Peter Parker",
  "Batman Bruce Wayne",
];

const App = () => {
  const [date, setDate] = useState(new Date());
  const [participantsArray, setParticipantsArray] = useState(employees);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [showParticipantList, setShowParticipantList] = useState(false);
  const [spins, setSpins] = useState(2);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSpinningFinished, setIsSpinningFinished] = useState(false);
  const [winnerArray, setWinnerArray] = useState([]);
  const [infoMessages, setInfoMessages] = useState([]);
  const [colors, setColors] = useState(
    color({
      luminosity: "bright",
      hue: "purple",
      count: participantsArray.length,
    })
  );

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const toggleAddParticipantInput = () => {
    setShowAddParticipant(!showAddParticipant);
    setShowParticipantList(false);
  };

  const toggleParticipantList = () => {
    setShowParticipantList(!showParticipantList);
    setShowAddParticipant(false);
  };

  const handleAddParticipant = (value) => {
    const name = value.trim();
    if (name === "") {
      const message = "Please add a participant name";
      setInfoMessages([...infoMessages, message]);
      return;
    }
    if (name.length < 3) {
      const message = "Please enter 3 characters minimum";
      setInfoMessages([...infoMessages, message]);
      return;
    }
    if (participantsArray.find((name) => name === value)) {
      const message = `A participant with this name ${value} already exists`;
      setInfoMessages([...infoMessages, message]);
      return;
    }

    Keyboard.dismiss();
    setParticipantsArray([...participantsArray, name]);
    const message = `Added ${name} to participants`;
    setInfoMessages([...infoMessages, message]);
    setShowAddParticipant(false);
  };

  const handleRemoveParticipant = (value) => {
    const newParticipantsArray = participantsArray.filter(
      (name) => name !== value
    );
    setParticipantsArray(newParticipantsArray);
    const message = `Removed ${value} from participants`;
    setInfoMessages([...infoMessages, message]);
  };

  const { width, height } = Dimensions.get("screen");
  const numberOfSegments = participantsArray.length;
  const wheelSize = width * 0.85;
  const wheelFontSize = 20;
  const oneTurn = 360;
  const angleBySegment = oneTurn / numberOfSegments;
  const angleOffset = angleBySegment / 2;

  const makeWheel = () => {
    const data = Array.from({ length: numberOfSegments }).fill(1);
    const arcs = d3Shape.pie()(data);

    return arcs.map((arc, index) => {
      const instance = d3Shape
        .arc()
        .padAngle(0.01)
        .outerRadius(width / 2)
        .innerRadius(20);

      return {
        path: instance(arc),
        color: colors[index],
        value: participantsArray[index],
        centroid: instance.centroid(arc),
      };
    });
  };

  const wheelPaths = makeWheel();

  const angle = useRef(new Animated.Value(0)).current;
  let angleValue = 0;

  const getWinnerIndex = () => {
    const deg = Math.abs(Math.round(angleValue % oneTurn));
    // wheel turning counterclockwise
    if (angleValue < 0) {
      return Math.floor(deg / angleBySegment);
    }
    // wheel turning clockwise
    return (
      (numberOfSegments - Math.floor(deg / angleBySegment)) % numberOfSegments
    );
  };

  const onPan = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      const { velocityY } = nativeEvent;

      Animated.decay(angle, {
        velocity: velocityY / 1000,
        deceleration: 0.999,
        useNativeDriver: true,
      }).start(() => {
        angle.setValue(angleValue % oneTurn);
        const snapTo = snap(oneTurn / numberOfSegments);
        Animated.timing(angle, {
          toValue: snapTo(angleValue),
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          const winnerIndex = getWinnerIndex();
          const winner = wheelPaths[winnerIndex].value;

          if (winnerArray.length > 0 && winnerArray[0] === winner) {
            const message = `${winner} do 2 shifts! FREE SPIN`;
            setInfoMessages([...infoMessages, message]);
            setIsEnabled(true);
            setIsSpinningFinished(true);
            return;
          } else {
            setIsEnabled(true);
            setIsSpinningFinished(true);
            setWinnerArray([...winnerArray, winner]);
            setSpins(spins - 1);
          }
        });
      });
    }
  };

  const resetSpins = () => {
    setSpins(2);
    setWinnerArray([]);
    const message = `FATE RESETED`;
    setInfoMessages([...infoMessages, message]);
  };

  const renderKnob = () => {
    return (
      <Svg
        width={20}
        height={(20 * 100) / 57}
        viewBox={`0 0 57 100`}
        style={{ transform: [{ translateY: 5 }], zIndex: 1 }}
      >
        <Path
          d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
          fill="white"
        />
      </Svg>
    );
  };

  const renderSvgWheel = () => {
    return (
      <View style={styles.container}>
        {renderKnob()}
        <Animated.View
          style={{
            alignItems: "center",
            justifyContent: "center",
            transform: [
              {
                rotate: angle.interpolate({
                  inputRange: [-oneTurn, 0, oneTurn],
                  outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`],
                }),
              },
            ],
          }}
        >
          <Svg
            width={wheelSize}
            height={wheelSize}
            viewBox={`0 0 ${width} ${width}`}
            style={{ transform: [{ rotate: `-${angleOffset}deg` }] }}
          >
            <G y={width / 2} x={width / 2}>
              {wheelPaths.map((arc, i) => {
                const [x, y] = arc.centroid;
                //add names from array here
                const number = arc.value
                  .toString()
                  .replace(" ", "")
                  .substring(0, 6)
                  .toUpperCase();
                return (
                  <G key={`arc-${i}`}>
                    <Path d={arc.path} fill={arc.color}></Path>
                    <G
                      rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                      originX={x}
                      originY={y}
                    >
                      <Text
                        x={x}
                        y={y - 70}
                        fill="white"
                        textAnchor="middle"
                        fontSize={wheelFontSize}
                      >
                        {Array.from({ length: number.length }).map((_, j) => {
                          return (
                            <TSpan
                              x={x}
                              dy={wheelFontSize}
                              key={`arc-${i}-slice-${j}`}
                            >
                              {number.charAt(j)}
                            </TSpan>
                          );
                        })}
                      </Text>
                    </G>
                  </G>
                );
              })}
            </G>
          </Svg>
        </Animated.View>
      </View>
    );
  };

  useEffect(() => {
    angle.addListener((event) => {
      if (isEnabled) {
        setIsEnabled(false);
        setIsSpinningFinished(false);
      }
      angleValue = event.value;
    });
  });

  useEffect(() => {
    setColors(
      color({
        luminosity: "bright",
        hue: "purple",
        count: participantsArray.length,
      })
    );
  }, [participantsArray]);

  useEffect(() => {
    if (isSpinningFinished === false) {
      setShowAddParticipant(false);
      Keyboard.dismiss();
    }
  }, [isSpinningFinished]);

  return (
    <View style={styles.container}>
      <View style={styles.infoMessage}>
        {infoMessages.map((message, index) => (
          <InfoMessage
            key={index}
            infoMessage={message}
            onHide={() => {
              setInfoMessages((messages) =>
                messages.filter((currentMessage) => currentMessage !== message)
              );
            }}
          />
        ))}
      </View>
      <View style={styles.date}>
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      </View>
      <MenuBar
        participants={participantsArray.length}
        toggleAddParticipantInput={toggleAddParticipantInput}
        toggleParticipantList={toggleParticipantList}
      />
      <WinnerPanel
        winnerArray={winnerArray}
        isSpinningFinished={isSpinningFinished}
        width={width}
      />
      {numberOfSegments > 2 ? (
        <>
          <PanGestureHandler
            onHandlerStateChange={onPan}
            enabled={spins === 0 ? false : isEnabled}
          >
            <View style={styles.wheel}>{renderSvgWheel()}</View>
          </PanGestureHandler>

          <SpinCounter spins={spins} resetSpins={resetSpins} />
        </>
      ) : (
        <RNText style={styles.warning}>
          Can't play with less than 3 participants :(
        </RNText>
      )}

      {showAddParticipant && (
        <AddParticipant handleAddParticipant={handleAddParticipant} />
      )}
      {showParticipantList && (
        <ParticipantList
          participantsArray={participantsArray}
          handleRemoveParticipant={handleRemoveParticipant}
        />
      )}
      <StatusBar />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#262335",
    color: "#a487c3",
    alignItems: "center",
    justifyContent: "center",
  },
  wheel: {
    marginTop: 100,
    zIndex: -2,
  },
  date: {
    position: "absolute",
    top: 50,
    zIndex: 10,
    width: 100,
  },
  infoMessage: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    marginLeft: 80,
    marginRight: 80,
    zIndex: 2,
  },
  warning: {
    fontSize: 36,
    color: "#FFF",
    textAlign: "center",
    padding: 40,
  },
});
