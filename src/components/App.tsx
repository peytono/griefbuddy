import React, { Suspense, lazy } from 'react';

import { Routes, Route, useLocation } from 'react-router-dom';
import { Container, ChakraProvider, Skeleton } from '@chakra-ui/react';
import HomePage from './HomePage';
import Navbar from './Navbar';
import Profile from './Profile';
import Buddy from './Buddy';
import ChatBot from './ChatBot';
import Events from './Events';
import Event from './EventsComponents/Event';
import Resources from './Resources';
import Resource from './Resource';
import Login from './Login';
import { UserContextProvider } from '../context/UserContext';
import BuddyChat from './buddyChildren/BuddyChat';
// import MeetupMap from './MeetupMap';
const MeetupMap = lazy(() => import('./MeetupMap'));

function App() {
  // trying to figure out how to keep user context updated through page refreshes
  // user context setUser is not a function here...
  return (
    <UserContextProvider>
      <ChakraProvider>
        <Container maxW="7xl" bg="blue.200" marginTop="0px" marginBottom="15px" h="125px">
          {useLocation().pathname === '/' ? <div /> : <Navbar />}
        </Container>
      </ChakraProvider>

      <Routes>
        <Route index element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/buddy" element={<Buddy />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/events" element={<Events />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resource" element={<Resource />} />
        <Route path="/buddychat" element={<BuddyChat />} />
        <Route path="/events/:id" element={<Event />} />
        <Route path="/map" element={<Suspense fallback={<Skeleton />}><MeetupMap /></Suspense>} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
