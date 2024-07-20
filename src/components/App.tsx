import React, { Suspense /* , lazy */ } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Skeleton, ChakraProvider } from '@chakra-ui/react';
import { io, Socket } from 'socket.io-client';

import theme from '../styling/theme';
import HomePage from './HomePage';
// import Profile from './Profile';
import Profile from './ProfileComponents/Profile';
// import Buddy from './Buddy';
import Chat from './Chat';
import Buddy from './BuddyComponents/Buddy';
import ChatBot from './ChatBot';
import Events from './Events';
import Event from './EventsComponents/Event';
import Resources from './Resources';
import Resource from './Resource';
import Login from './Login';
import { UserContextProvider } from '../context/UserContext';
// import BuddyChat from './buddyChildren/BuddyChat';
import Navbar from './Navbar';

// const MeetupMap = lazy(() => import('./MeetupMap'));

const socket: Socket = io();

function App() {
  // trying to figure out how to keep user context updated through page refreshes
  // user context setUser is not a function here...

  return (
    <BrowserRouter>
      <UserContextProvider>
        <ChakraProvider theme={theme}>
          <Navbar />
          <Suspense fallback={<Skeleton />}>
            <Routes>
              <Route index element={<Login />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<Chat socket={socket} />} />
              <Route path="/buddy" element={<Buddy socket={socket} />} />
              <Route path="/chatbot" element={<ChatBot />} />
              <Route path="/events" element={<Events />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resource" element={<Resource />} />
              <Route path="/events/:id" element={<Event />} />
              {/* <Route
                path="/map"
                element={(
                  <Suspense fallback={<Skeleton />}>
                    <MeetupMap />
                  </Suspense>
                )}
              /> */}
            </Routes>
          </Suspense>
        </ChakraProvider>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
