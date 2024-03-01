// App.js

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:4000'); // Connect to your server address

const App = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  useEffect(() => {
    // Get user media (audio only)
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setLocalStream(stream);

        // Send offer to server
        socket.emit('offer', { stream });
      })
      .catch(error => console.error('Error accessing user media:', error));

    // Listen for incoming offers, answers, and ICE candidates
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('iceCandidate', handleIceCandidate);

    // Clean up on unmount
    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('iceCandidate', handleIceCandidate);
    };
  }, []);

  // Handle incoming offer from server
  const handleOffer = (data) => {
    const { stream } = data;
    // Create a new audio element for the remote stream
    const audio = new Audio();
    audio.srcObject = stream;
    audio.play();

    setRemoteStreams(prevStreams => [...prevStreams, audio.srcObject]);
  };

  // Handle incoming answer from server (not implemented in this basic example)
  const handleAnswer = (data) => {
    // Handle incoming answer
  };

  // Handle incoming ICE candidate from server (not implemented in this basic example)
  const handleIceCandidate = (data) => {
    // Handle incoming ICE candidate
  };

  return (
    <div>
      <h1>Voice Chat Application</h1>
      <h2>Your Stream</h2>
      {localStream && <audio ref={(ref) => (ref.srcObject = localStream)} autoPlay muted />}
      <h2>Remote Streams</h2>
      {remoteStreams.map((stream, index) => (
        <audio key={index} ref={(ref) => (ref.srcObject = stream)} autoPlay />
      ))}
    </div>
  );
};

export default App;
