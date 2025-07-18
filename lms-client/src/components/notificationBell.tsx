import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Bell, CheckCircle, Volume2, XCircle } from 'lucide-react'; // Icons
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';

// Assuming you have shadcn/ui Card components for styling the notification list
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { useSelector } from 'react-redux';

// Adjust this to your backend's base URL for audio files
const BACKEND_BASE_URL = 'http://localhost:8000';

// NotificationBell now accepts an onClose prop
const NotificationBell = ({ onClose }) => { // Removed forwardRef, added onClose prop
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const {isLoggedIn} = useSelector((state) => state.auth)

  /**
   * Fetches notifications for the logged-in user.
   */
  const fetchNotifications = async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/notifications/my-notifications`);
      setNotifications(response.data.notifications);
      console.log('notifications are', notifications);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error(error.response?.data?.message || "Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Marks a specific notification as read.
   */
  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.put(`/notifications/mark-read/${notificationId}`);
      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      toast.success("Notification marked as read.");
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error(error.response?.data?.message || "Failed to mark notification as read.");
    }
  };

  /**
   * Plays the audio voice note from a given URL.
   */
  const playVoiceNote = (audioUrl) => {
    const fullAudioUrl = `${BACKEND_BASE_URL}${audioUrl}`;
    if (audioUrl) {
      const audio = new Audio(fullAudioUrl);
      audio.play().catch(e => {
        console.error("Error playing audio:", e);
        toast.error("Could not play the voice note. Make sure the server is running and the file exists.");
      });
    } else {
      toast.info("This notification does not have an associated voice note.");
    }
  };

  // Fetch notifications when the component mounts or login status changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  return (
    <Card className="fixed inset-0 z-50 bg-white p-6 rounded-lg shadow-xl overflow-y-auto">
      <CardHeader className="flex flex-row justify-between items-center border-b pb-4">
        <CardTitle className="text-2xl font-semibold text-gray-800">Your Notifications</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XCircle className="h-6 w-6 text-gray-500 hover:text-gray-700" />
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">No new notifications.</div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex items-start gap-3 p-3 rounded-md ${
                  notification.isRead ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-gray-900 border border-blue-200'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {notification.type === 'overdue-voice-note' ? (
                    <Volume2 className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Bell className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div className="flex-grow">
                  <p className={`text-sm ${notification.isRead ? 'font-normal' : 'font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {notification.audioUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playVoiceNote(notification.audioUrl)}
                        className="h-7 text-xs"
                      >
                        <Volume2 className="h-3.5 w-3.5 mr-1" /> Play Voice Note
                      </Button>
                    )}
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification._id)}
                        className="h-7 text-xs text-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationBell;
