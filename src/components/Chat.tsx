import React, { useRef, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import {
  Center,
  Container,
  Heading,
  Stack,
  StackDivider,
  useColorModeValue,
  Text,
  Box,
  Grid,
  GridItem,
  Button,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import { User } from '@prisma/client';
import { Message, Dm, DmPreview } from '../types/chat';

import ChatInput from './ChatComponents/ChatInput';
import UserSearchInput from './ChatComponents/UserSearchInput';
import FoundUsers from './ChatComponents/FoundUsers';
import DmPreviews from './ChatComponents/DmPreviews';

const socket: Socket = io();

function Chat() {
  const [user, setUser] = useState({} as User);

  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState([] as Message[]);

  const [userSearch, setUserSearch] = useState('');

  const [foundUsers, setFoundUsers] = useState([] as User[]);

  const [dm, setDm] = useState('');

  const [dms, setDms] = useState([] as Dm[]);

  const [room, setRoom] = useState('');

  const [selectedUser, setSelectedUser] = useState({} as User);

  const [dmPreviews, setDmPreviews] = useState([] as DmPreview[]);

  const messagesEndRef = useRef(null);

  const bottomScroll = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(bottomScroll, [messages]);

  const getDmPreviews: (userId: number) => void = (userId) => {
    axios
      .get('/chat/dmPreviews', { params: { userId } })
      .then((dmPreviewsResponse: { data: DmPreview[] }) => {
        const reducedPreviews: DmPreview[] = dmPreviewsResponse.data.reduce((acc, curDm) => {
          if (!acc.length) {
            acc.push(curDm);
            return acc;
          }
          for (let i = acc.length - 1; i >= 0; i -= 1) {
            if (acc[i].senderId === curDm.recipientId && acc[i].recipientId === curDm.senderId) {
              return acc;
            }
          }
          acc.push(curDm);
          return acc;
        }, [] as DmPreview[]);
        setDmPreviews(reducedPreviews);
      });
  };

  useEffect(() => {
    axios.get('/user').then((userResponse: { data: User }) => {
      setUser(userResponse.data);
      getDmPreviews(userResponse.data.id);
      // axios
      //   .get('/chat/dmPreviews', { params: { userId: userResponse.data.id } })
      //   .then((dmPreviewsResponse: { data: DmPreview[] }) => {
      //     const reducedPreviews: DmPreview[] = dmPreviewsResponse.data.reduce((acc, curDm) => {
      //       if (!acc.length) {
      //         acc.push(curDm);
      //         return acc;
      //       }
      //       for (let i = acc.length - 1; i >= 0; i -= 1) {
      //         if (acc[i].senderId === curDm.recipientId &&
      // acc[i].recipientId === curDm.senderId) {
      //           return acc;
      //         }
      //       }
      //       acc.push(curDm);
      //       return acc;
      //     }, [] as DmPreview[]);
      //     setDmPreviews(reducedPreviews);
      //   });
    });
  }, [setUser, setDmPreviews]);

  useEffect(() => {
    if (selectedUser.id) {
      axios
        .get('/chat/dms', { params: { senderId: user.id, recipientId: selectedUser.id } })
        .then((dmResponse) => setDms(dmResponse.data))
        .catch((err) => console.error('Failed finding existing messages: ', err));
      setFoundUsers([] as User[]);
      // setDmPreviews([] as DmPreview[]);
    }
  }, [selectedUser.id, user.id]);

  const onChange = (e: { target: { value: string; id: string } }) => {
    const { value, id } = e.target;
    switch (id) {
      case 'chat':
        setMessage(value);
        break;
      case 'user':
        setUserSearch(value);
        break;
      case 'dm':
        setDm(value);
        break;
      default:
        throw new Error('input id has no matching valid case');
    }
  };

  useEffect(() => {
    const addMessage = (msg: string, clientOffset: string) => {
      setMessages((curMessages) => curMessages.concat([{ msg, clientOffset }]));
    };
    socket.on('sendMsg', addMessage);
  }, [setMessages]);

  const onSendDm = () => {
    if (dm && room) {
      socket.emit('dm', dm, room, user.id, selectedUser.id);
    }
    setDm('');
  };

  useEffect(() => {
    const addDm = (msg: string, senderId: number, recipientId: number) => {
      setDms((curDms) => curDms.concat([{ msg, senderId, recipientId }]));
    };
    socket.on('sendDm', addDm);
  }, [setDms]);

  const onSend = () => {
    if (message) {
      socket.emit('msg', message, socket.id);
    }
    setMessage('');
  };

  const onSearch = async () => {
    axios
      .get('/chat/userSearch', { params: { userSearch } })
      .then((usersResponse) => setFoundUsers(usersResponse.data));
    setUserSearch('');
  };

  const onPress = (
    e: React.KeyboardEvent<HTMLInputElement> & {
      target: React.ButtonHTMLAttributes<HTMLButtonElement>;
    },
  ) => {
    const { id } = e.target;
    const { key } = e;
    if (key === 'Enter') {
      if (id === 'chat') {
        onSend();
      } else if (id === 'user') {
        onSearch();
      } else if (id === 'dm') {
        onSendDm();
      }
    }
  };

  const userSelect = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent> & {
      target: React.ButtonHTMLAttributes<HTMLButtonElement>;
    },
  ) => {
    axios.get('/chat/user', { params: { id: e.target.id } }).then((userResponse) => {
      setSelectedUser(userResponse.data);
      const roomName: string =
        user.googleId < userResponse.data.googleId
          ? `${user.googleId}-${userResponse.data.googleId}`
          : `${userResponse.data.googleId}-${user.googleId}`;
      setRoom(roomName);
      socket.emit('room', roomName);
    });
  };

  const dmPreviewSelect = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent> & {
      target: React.ButtonHTMLAttributes<HTMLButtonElement>;
    },
  ) => {
    const ids: string[] = e.target.id.split('-');
    const firstId: number = Number(ids[0]);
    const secondId: number = Number(ids[1]);
    let selectedUserId: number;
    if (firstId !== user.id) {
      selectedUserId = firstId;
    } else if (secondId !== user.id) {
      selectedUserId = secondId;
    } else {
      selectedUserId = user.id;
    }
    axios.get('/chat/user', { params: { id: selectedUserId } }).then((userResponse) => {
      setSelectedUser(userResponse.data);
      const roomName: string =
        user.googleId < userResponse.data.googleId
          ? `${user.googleId}-${userResponse.data.googleId}`
          : `${userResponse.data.googleId}-${user.googleId}`;
      setRoom(roomName);
      socket.emit('room', roomName);
    });
  };

  const backToPreview = () => {
    setSelectedUser({} as User);
    setDms([] as Dm[]);
    getDmPreviews(user.id);
  };

  const onMouseHover = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent> & {
      target: React.ButtonHTMLAttributes<HTMLButtonElement>;
    },
  ) => {
    e.target.style.textDecoration = 'underline';
  };

  const onMouseLeave = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent> & {
      target: React.ButtonHTMLAttributes<HTMLButtonElement>;
    },
  ) => {
    e.target.style.textDecoration = 'none';
  };

  const color = useColorModeValue('blue.600', 'blue.200');

  const otherUserBG = useColorModeValue('lavender', 'purple.700');

  const otherUserColor = useColorModeValue('purple', 'lavender');

  return (
    <Container>
      <Center>
        <Heading color={color}>Chat</Heading>
      </Center>
      {dms.length ? (
        <Box>
          <Grid mt=".5rem" templateColumns="repeat(5, 1fr)" gap={1}>
            <GridItem>
              <Button p="0" minW="30px" height="30px">
                <ArrowBackIcon onClick={backToPreview} width="20px" height="20px" />
              </Button>
            </GridItem>
            <GridItem colSpan={1} />
            <GridItem>
              <Center>
                <Text>{selectedUser.preferredName || selectedUser.name}</Text>
              </Center>
            </GridItem>
            <GridItem colSpan={2} />
          </Grid>
          <Stack divider={<StackDivider />} margin="8px">
            {dms.map((msg, index) => (
              <Text
                // eslint-disable-next-line react/no-array-index-key
                key={`${msg.senderId}-${index}`}
                borderRadius="10px"
                background={msg.senderId === user.id ? 'blue.600' : otherUserBG}
                p="10px"
                color={msg.senderId === user.id ? 'white' : otherUserColor}
                textAlign={msg.senderId === user.id ? 'right' : 'left'}
                marginLeft={msg.senderId === user.id ? 'auto' : 0}
                width="fit-content"
              >
                {msg.msg}
              </Text>
            ))}
          </Stack>
          <ChatInput
            messagesEndRef={messagesEndRef}
            message={dm}
            onChange={onChange}
            onSend={onSendDm}
            onPress={onPress}
            id="dm"
          />
        </Box>
      ) : (
        <>
          <UserSearchInput
            userSearch={userSearch}
            onChange={onChange}
            onSearch={onSearch}
            onPress={onPress}
          />
          <FoundUsers
            foundUsers={foundUsers}
            userSelect={userSelect}
            onMouseHover={onMouseHover}
            onMouseLeave={onMouseLeave}
          />
          <DmPreviews
            dmPreviews={dmPreviews}
            select={dmPreviewSelect}
            onMouseHover={onMouseHover}
            onMouseLeave={onMouseLeave}
          />
        </>
      )}
    </Container>
  );
}

export default Chat;
