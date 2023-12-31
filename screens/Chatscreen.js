import { useContext, useEffect, React } from "react"
import {
  FlatList,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { GlobalContext } from "../context"
import { AntDesign } from "@expo/vector-icons"
import Chatcomponent from "../components/Chatcomponent"
import NewGroupModal from "../components/Modal"
import message from "../assets/message.jpeg"
import { socket } from "../utils"




export default function Chatscreen ({ navigation }) {


  const {
    currentUser,
    allChatRooms,
    setAllChatRooms,
    modalVisible,
    setModalVisible,
    setCurrentUser,
    setShowLoginView,
  } = useContext(GlobalContext)

  useEffect(() => {
    socket.emit("getAllGroups")

    socket.on("groupList", (groups) => {
      console.log(groups, ':::group')
      setAllChatRooms(groups)
    })
  }, [socket])

  function handleLogout () {
    setCurrentUser("")
    setShowLoginView(false)
  }

  useEffect(() => {
    if (currentUser.trim() === "") navigation.navigate("Homescreen")
  }, [currentUser])

  return (
    <View style={styles.mainWrapper}>
      <ImageBackground source={message} style={styles.homeImage}>
        <View style={styles.topContainer}>
          <View style={styles.header}>
            <Text style={styles.travelHeading}>Traveler {currentUser}!</Text>
            <Pressable onPress={handleLogout} style={styles.closeButton}>
              <AntDesign name="close" size={30} color={"white"} />
            </Pressable>
          </View>
        </View>

        <View style={styles.listContainer}>
          {allChatRooms && allChatRooms.length > 0 ? (
            <FlatList
              data={allChatRooms}
              renderItem={({ item }) => <Chatcomponent item={item} />}
              keyExtractor={(item) => item.id}
            />
          ) : null}
        </View>
        <View style={styles.bottomContainer}>
          <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
            <View>
              <Text style={styles.buttonText}>Find New Planet</Text>
            </View>
          </Pressable>
        </View>

        {modalVisible && <NewGroupModal />}
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: "#eee",
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  travelHeading: {

    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,

  },
  homeImage: {
    width: "100%",
    flex: 4,
    justifyContent: "center",
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  topContainer: {
    backgroundColor: "#000",
    height: 70,
    width: "100%",
    padding: 20,
    justifyContent: "center",
    marginBottom: 15,
    flex: 0.3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  listContainer: {
    flex: 3.4,
    paddingHorizontal: 10,
  },
  bottomContainer: {
    flex: 0.3,
    padding: 10,
  },
  button: {
    backgroundColor: "#703efe",
    padding: 12,
    width: "100%",
    elevation: 1,
    borderRadius: 50,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
})
