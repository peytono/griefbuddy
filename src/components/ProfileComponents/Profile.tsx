import React, { useEffect, useState } from 'react';
import { User } from '@prisma/client';
import axios from 'axios';
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  // useColorModeValue,
} from '@chakra-ui/react';

import AboutMe from './AboutMe';

function Profile() {
  // const bg = useColorModeValue('blue.200', 'blue.600');

  const [user, setUser] = useState({} as User);

  // may need to be updated to call db too - incase a user updates, leaves, and returns...
  useEffect(() => {
    axios
      .get('/user')
      .then(({ data }: { data: User }) => axios.get('chat/user', { params: { id: data.id } }))
      .then(({ data }) => setUser(data))
      .catch((err) => console.error('failed finding user cookie: ', err));
    console.log('set user from cookie');
  }, [user.id]);

  return (
    <Card m=".5rem">
      <CardHeader>
        <Heading>
          <Center>
            <Avatar size="lg" src={user.userPicture} mr=".75rem" />
            {user.preferredName || user.name}
          </Center>
        </Heading>
      </CardHeader>
      <CardBody>
        <Tabs>
          <TabList>
            <Tab>About Me</Tab>
            <Tab>Posts</Tab>
            <Tab>Comments</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{user.id ? <AboutMe user={user} setUser={setUser} /> : null}</TabPanel>
          </TabPanels>
        </Tabs>
        {/* <Text>{user.age}</Text> */}
      </CardBody>
    </Card>
  );
}

export default Profile;
