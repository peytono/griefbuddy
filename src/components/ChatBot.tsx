import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  ChakraProvider,
  Heading,
  Center,
  StackDivider,
  Input,
  Stack,
  Container,
  Text,
  Button,
  HStack,
  useToast,
  Box,
  Skeleton,
} from '@chakra-ui/react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { UserContext } from '../context/UserContext';
import '../../style/style.css';

function ChatBot() {
  const toast = useToast();

  const userContext = useContext(UserContext);

  // was destructuring user, but caused a failure on refresh
  const { user, setUser } = userContext;

  const [message, setMessage] = useState('');

  const startState = [
    { role: 'system', content: 'You are an inquisitive friend to users who are grieving.' },
  ];

  const [messages, addMessage] = useState(startState);

  const [isWaiting, setWaiting] = useState(false);

  const messagesEndRef = useRef(null);

  const bottomScroll = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onChange = (e: { target: { value: string } }) => {
    const { value } = e.target;
    setMessage(value);
  };

  type OpenaiMessageType = {
    role: string;
    content: string;
  };

  type DbMessageType = {
    role: string;
    content: string;
    id: Number;
    userId: Number;
  };

  const sendText = () => {
    // this comment is to keep eslint happy
    axios
      .post('/chatbot/text', { name: user.name, phone: user.emConNum })
      .then(() => {
        toast({ title: `Sent message to ${user.emConName}`, status: 'success', isClosable: true });
      })
      .catch((err) => {
        console.error('failed sending friend message', err);
        toast({
          title: `Failed sending message to ${user.emConName} at ${user.emConNum}`,
          status: 'error',
          isClosable: true,
        });
      });
  };

  const onSend = () => {
    setWaiting(true);
    const aiMessage = { role: 'user', content: message };

    // allMessages is so we can post before messages is done updating
    let allMessages: OpenaiMessageType[];

    // this if statement is because strict mode added two initial messages
    // also on first POST need to save the beginning of conversation
    if (messages.length === 2 || messages.length === 3) {
      // allMessages = [messages[0], messages[2], aiMessage];
      allMessages = messages.concat(aiMessage);
      addMessage(allMessages);
      axios
        .post('/chatbot/db1', { userId: user.id, messages: allMessages })
        .catch((err) => console.error('failed posted initial messages to db', err));
    } else {
      allMessages = messages.concat([aiMessage]);
      addMessage(allMessages);
      axios
        .post('/chatbot/db', { message: aiMessage, userId: user.id })
        .catch((err) => console.error('failed posting new message', err));
    }

    axios
      .post('/chatbot', { messages: allMessages })
      .then((response) => {
        setWaiting(false);
        addMessage((curMessages) => curMessages.concat([response.data.message]));
        axios.post('/chatbot/db', { message: response.data.message, userId: user.id });
      })
      .then(() => axios.post('/chatbot/moderate', { message: aiMessage }))
      .then(({ data }) => {
        if (data && user.emConNum) {
          // should let the user know a friend message was sent
          toast({
            title: `Sending message to ${user.emConName}`,
            status: 'warning',
            isClosable: true,
          });
          sendText();
        }
      })
      .catch((err) => console.error('failed sending new message', err));
    setMessage('');
  };

  const onPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  const onDelete = () => {
    axios
      .delete('/chatbot/convo', { data: { userId: user.id } })
      .then(() => axios.get('/chatbot/new'))
      .then(({ data }) => addMessage(startState.concat(data.message)))
      .catch((err) => console.error('failed deleting convo', err));
  };

  useEffect(() => {
    axios
      .get('/user')
      .then(({ data }) => {
        if (typeof data === 'object') {
          setUser({ ...data });
        }
      })
      .then(() => axios.get('/chatbot/convo', { params: { userId: user.id } }))
      .then(({ data }) => {
        if (data.length) {
          return addMessage(
            data.map((dbMessage: DbMessageType) => {
              const { role, content } = dbMessage;
              return { role, content };
            }),
          );
        }
        return axios.get('/chatbot/new').then((response: AxiosResponse) => {
          // strick mode causes two new messages to render
          // - the first is deleted on the first user response
          addMessage((curMessages) => curMessages.concat(response.data.message));
        });
      })
      .catch((err: AxiosError) => console.error('failed finding user/chat', err));
  }, [setUser, user.id]);

  useEffect(() => {
    bottomScroll();
  }, [messages]);

  return (
    <ChakraProvider>
      <Center>
        <Heading paddingBottom="15px" size="3xl" color="blue.200">
          Chat Bot
        </Heading>
      </Center>
      <Container>
        <Button marginBottom="15px" className="delete" onClick={onDelete}>
          Delete Conversation
        </Button>
        <Box overflowY="auto" maxHeight="70vh" marginBottom="10px">
          <Stack divider={<StackDivider />}>
            {messages.slice(1).map((text, index) => (
              <Text
                borderRadius="10px"
                background={text.role === 'assistant' ? 'lavender' : 'blue.600'}
                p="10px"
                // eslint-disable-next-line react/no-array-index-key
                key={`${text.role}-${index}`}
                color={text.role === 'assistant' ? 'purple' : 'white'}
              >
                {text.content}
              </Text>
            ))}
            {isWaiting ? <Skeleton height="20px" /> : null}
            <HStack ref={messagesEndRef}>
              <Input onChange={onChange} onKeyDown={onPress} value={message} />
              <Button onClick={onSend}>Send</Button>
            </HStack>
          </Stack>
        </Box>
      </Container>
    </ChakraProvider>
  );
}

export default ChatBot;
