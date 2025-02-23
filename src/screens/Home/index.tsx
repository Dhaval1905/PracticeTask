import React, { useRef, useState, useEffect } from 'react';
import {
    View, FlatList, TouchableWithoutFeedback, Text, Image,
    Dimensions, Animated, TouchableOpacity
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import { Images } from '../../assets/images/index';
import { styles } from './styles';
import { videoData, VideoData } from '../../contants/mockData';

const { height } = Dimensions.get('window');

interface VideoItemProps {
    item: VideoData;
    isActive: boolean;
    onVideoEnd: () => void;
}

type ViewableItemsType = {
    index?: number | undefined;
}[];



const parseLikes = (likes: string | number): number => {
    if (typeof likes === "string") {
        if (likes.includes("K")) {
            return parseFloat(likes) * 1000;
        }
        return parseInt(likes, 10);
    }
    return likes;
};

const VideoItem: React.FC<VideoItemProps> = React.memo(({ item, isActive, onVideoEnd }) => {
    const videoRef = useRef(null);
    const [paused, setPaused] = useState(!isActive);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(1);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(parseLikes(item.likes));
    const [showMore, setShowMore] = useState(false);
    const heartScale = useRef(new Animated.Value(0)).current;
    const lastTap = useRef(0);
    const [muted, setMuted] = useState(false);  

    useEffect(() => {
        setPaused(!isActive);
        if (isActive) {
            videoRef.current?.seek(0);
        }
    }, [isActive]);

    const handleTap = () => {
        const now = Date.now();
        if (now - lastTap.current < 300) {
            clearTimeout(lastTap.timer);
            handleDoubleTapLike();
        } else {
            lastTap.current = now;
            lastTap.timer = setTimeout(() => {
                setPaused(prev => !prev);
            }, 300);
        }
    };

    const handleDoubleTapLike = () => {
        if (!liked) {
            setLiked(true);
            setLikeCount(prev => prev + 1);
            Animated.sequence([
                Animated.timing(heartScale, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                }),
                Animated.timing(heartScale, {
                    toValue: 0,
                    duration: 300,
                    delay: 400,
                    useNativeDriver: true
                })
            ]).start();
        } else {
            setLiked(false);
            setLikeCount(prev => prev - 1);
        }
    };

    const toggleMute = () => {
        setMuted(prev => !prev);
    };

    return (
        <TouchableWithoutFeedback onPress={handleTap}>
            <View style={styles.videoContainer}>
                <Video
                    ref={videoRef}
                    source={{ uri: item.videoUrl }}
                    style={styles.video}
                    resizeMode="cover"
                    repeat
                    paused={paused}
                    onLoad={(data) => setDuration(data.duration)}
                    onProgress={(data) => setProgress(data.currentTime)}
                    onEnd={onVideoEnd}
                    muted={muted} 
                    bufferConfig={{
                        minBufferMs: 5000,
                        maxBufferMs: 10000,
                        bufferForPlaybackMs: 2500,
                        bufferForPlaybackAfterRebufferMs: 5000,
                    }}
                />
                {/* Mute/Unmute Button */}
                <TouchableOpacity onPress={toggleMute} style={styles.muteButton}>
                    <Image
                        source={muted ? Images.mute : Images.unmute} 
                        style={styles.muteIcon}
                    />
                </TouchableOpacity>

                {
                    paused &&
                    <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
                        <Image source={Images.pause} style={{ height: 50, width: 50 }} />
                    </View>
                }
                {/* User Profile & Username */}
                <View style={styles.userInfo}>
                    <Image source={{ uri: item.user.profilePic }} style={styles.profilePic} />
                    <Text style={styles.username}>{item.user.username}</Text>
                </View>

                {/* Like & Comment Count */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={handleDoubleTapLike}>
                        <Image
                            source={liked ? Images.heart : Images.newHeart}
                            style={styles.actionIcon}
                            tintColor={liked ? null : "#fff"}
                        />
                    </TouchableOpacity>
                    <Text style={styles.actionText}>{likeCount}</Text>
                    <TouchableOpacity>
                        <Image source={Images.comment} style={styles.actionIcon} tintColor={"#fff"} />
                        <Text style={styles.actionText}>{item.comments}</Text>
                    </TouchableOpacity>
                </View>

                {/* Video Description with "Read More" */}
                <View style={styles.bottomContainer}>
                    <Text style={styles.videoDescription} numberOfLines={showMore ? undefined : 1}>
                        {showMore ? item.description : `${item.description.slice(0, 50)}...`}
                    </Text>
                    {item.description.length > 50 && (
                        <TouchableOpacity onPress={() => setShowMore(!showMore)}>
                            <Text style={styles.readMore}>{showMore ? "Show Less" : "Read More"}</Text>
                        </TouchableOpacity>
                    )}
                    <Slider
                        style={styles.seekBar}
                        minimumValue={0}
                        maximumValue={duration}
                        value={progress}
                        minimumTrackTintColor="white"
                        maximumTrackTintColor="gray"
                        thumbTintColor="transparent"
                        onValueChange={(val) => videoRef?.current?.seek(val)}
                    />
                </View>


            </View>
        </TouchableWithoutFeedback>
    );
});

const Home: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const flatListRef = useRef<FlatList<VideoData>>(null);
    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 80 }).current;

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewableItemsType }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0]?.index);
        }
    }).current;

    const handleVideoEnd = () => {
        if (activeIndex < videoData.length - 1) {
            setActiveIndex(activeIndex + 1);
            flatListRef?.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
        }
    };
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

    return (
        <FlatList
            ref={flatListRef}
            data={videoData}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
                <VideoItem item={item} isActive={index === activeIndex} onVideoEnd={handleVideoEnd} />
            )}
            pagingEnabled
            snapToInterval={height} 
            snapToAlignment="start"
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            initialNumToRender={2} 
            maxToRenderPerBatch={3} 
            windowSize={5} 
            getItemLayout={(data, index) => ({
                length: height,
                offset: height * index,
                index
            })}
            removeClippedSubviews={false}
            legacyImplementation={true}
        />

    );
};



export default Home;