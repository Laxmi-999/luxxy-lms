'use client'
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Page = () => {
  const [notification, setNotification] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish a connection to your server within useEffect
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

    // listening from the server
    newSocket.on('notificationId', (data) => {
      console.log('received notification from the server', data);
      setNotification(`New notification received from the server: ${data}`);
    });

    // clean up function, when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []); // The empty dependency array ensures this runs only once

  const sendNotification = () => {
    try {
      if (socket) {
        // Emit the 'notification' event using the socket instance from state
        const newNotificationId = '12345'; // Example ID
        socket.emit('notification', newNotificationId);
        console.log('sent');
      } else {
        console.log('Socket not connected.');
      }
    } catch (error) {
      console.log('error while sending notification', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Socket.IO Example</h1>
      <p>Click the button below to send a notification to the server, which will then broadcast it back to all connected clients.</p>
      <button 
        onClick={sendNotification} 
        className='bg-red-500'
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Send Test Notification
      </button>
      <br />
      <br />
      {notification && (
        <div style={{ 
          border: '1px solid #ccc', 
          padding: '15px', 
          backgroundColor: '#f9f9f9' 
        }}>
          <strong className='bg-green-500'>{notification}</strong>
        </div>
      )}
    </div>
  );
};

export default Page;