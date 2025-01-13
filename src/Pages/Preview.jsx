import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
const Preview = ({ filter }) => {
  const [videoData, setVideoData] = useState([]); // Store full video data
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Track play/pause state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState("00:00:00"); // Current playback time
  const videoRef = useRef(null); // Reference to the video element
  const nextVideoRef = useRef(null); // Reference for preloading next video
  const currentVideo = videoData[currentVideoIndex];
  useEffect(() => {
    axios.post("https://test2sever.onrender.com/signal", { action: "start" });
    fetchVideos();
  }, []);

  useEffect(() => {
    axios.post("https://test2sever.onrender.com/signal", { action: "start" });
    fetchVideos();
  }, [filter]);

  const toggleLive = async () => {

    const checkLive = await axios.get("https://test2sever.onrender.com/check-live");
 
    if (checkLive.data.isLive) {
      setCurrentVideoIndex(videoData.length -2);
      
       // axios.post("http://localhost:3000/signal", { action: "start" });
        
    }else{
      setError("Device is Not Live")
      setTimeout(() => {
        window.location.reload()
      }, 3000);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch(
        `https://test2sever.onrender.com/find?fromdate=${filter?.fromDate}&todate=${filter?.toDate}&fromtime=${filter?.fromTime}&totime=${filter?.toTime}&divisename=${filter?.selectedDevice}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      const data = await response.json();

      // Sort the video data by fromtime
      const sortedData = data.sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.fromtime}Z`).getTime();
        const timeB = new Date(`1970-01-01T${b.fromtime}Z`).getTime();
        return timeA - timeB; // Ascending order
      });

      setVideoData(sortedData); // Store sorted video data
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause(); // Pause the video
    } else {
      videoRef.current.play(); // Play the video
    }
    setIsPlaying(!isPlaying); // Toggle play/pause state
  };

  const handleSliderChange = (e) => {
    fetchVideos();
    // Update the video index based on the slider value
    const newIndex = Number(e.target.value);
    setCurrentVideoIndex(newIndex);
    setIsPlaying(true); // Reset to pause state
  };

  const handleVideoEnd = () => {
    console.log("sdf")
    if (currentVideoIndex < videoData.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      setCurrentVideoIndex(0); // Loop back to the first video
    }
    setIsPlaying(true); // Automatically start the next video
  };

  const updateCurrentTime = () => {
    // Update the current playback time
    const time = videoRef.current.currentTime;
    const hours = Math.floor(time / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((time % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    setCurrentTime(`${hours}:${minutes}:${seconds}`);
  };
  // function togleLive() {
  //   console.log("fd");
  //   setInterval(() => {
  //     fetchVideos();
  //   }, 10000);

  //   setCurrentVideoIndex(videoData.length - 2);
  // }

  useEffect(() => {
    if (videoData.length > 0 && currentVideoIndex < videoData.length - 1) {
      nextVideoRef.current = new Audio(videoData[currentVideoIndex + 1]?.url); // Use optional chaining
    }
  }, [currentVideoIndex, videoData]);

  useEffect(() => {
    if (videoData.length > 0 && currentVideoIndex < videoData.length - 2) {
      nextVideoRef.current = new Audio(videoData[currentVideoIndex + 2]?.url); // Use optional chaining
    }
  }, [currentVideoIndex, videoData]);

  if (loading) return <p>Loading videos...</p>;
  if (error) return <p>Error: {error}</p>;

 

  return (
    <div>
      {videoData.length > 0 ? (
        <div>
          <h3>
            Playing Video: {currentVideo?.filename} ({currentVideo?.fromtime} -{" "}
            {currentVideo.totime})
          </h3>

          {/* Custom Video Player */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <video
              ref={videoRef}
              src={currentVideo.url}
              onEnded={handleVideoEnd}
              autoPlay
              onTimeUpdate={updateCurrentTime} // Update the current time dynamically
              style={{ width: "640px", height: "360px" }}
              preload="auto" // Preload the current video
            />

            {/* Play/Pause Button */}

            <div style={{ display: "flix" }}>
              <button
                onClick={togglePlayPause}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>{" "}
              {"  "}
              <button
                onClick={toggleLive}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Live
              </button>
            </div>
          </div>

          {/* Video Timeline Slider */}
          <div
            style={{ marginTop: "20px", width: "100%", textAlign: "center" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{currentVideo.fromtime}</span>
              <span>{videoData[videoData.length - 1].totime}</span>
            </div>
            <input
              type="range"
              min="0"
              max={videoData.length - 1}
              value={currentVideoIndex}
              onChange={handleSliderChange}
              style={{ width: "100%" }}
            />
            <p>
              Current Video: {currentVideoIndex + 1} of {videoData.length}
            </p>
          </div>

          {/* Current Playback Time */}
          <div style={{ marginTop: "10px" }}>
            <p>
              Current Playback Time: <strong>{currentTime}</strong>
            </p>
          </div>
        </div>
      ) : (
        <p style={{ color: "black" }}>
          No videos available for the selected date range.
        </p>
      )}
    </div>
  );
};

export default Preview;
