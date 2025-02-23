import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  videoContainer: { height, width },
  video: { ...StyleSheet.absoluteFillObject },
  userInfo: { position: 'absolute', top: "8%", left: 20, flexDirection: 'row', alignItems: 'center' },
  profilePic: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  actionsContainer: { position: 'absolute', bottom: '20%', right: 20, alignItems: 'center' },
  actionIcon: { width: 40, height: 40, marginBottom: 10, marginTop: 20 },
  actionText: { color: 'white', fontSize: 14, textAlign: 'center' },
  bottomContainer: { position: 'absolute', bottom: 50, width: '100%', paddingHorizontal: 20 },
  videoDescription: { color: 'white', fontSize: 16, fontWeight: 'semibold', lineHeight: 24 },
  readMore: { color: '#ddd', fontSize: 14, fontWeight: "medium", lineHeight: 22 },
  seekBar: { width: '90%' },
  muteButton: {
    position: 'absolute',
    top: "8%",
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 100,
    padding: 12,
  },
  muteIcon: {
    width: 25,
    height: 25,
    tintColor: "#fff",
  }
});