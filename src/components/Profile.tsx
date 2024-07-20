import React, { useState, useEffect, /* useId, */ useRef } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Grid,
  GridItem,
  Avatar,
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  Stack,
  StackDivider,
  useColorModeValue,
} from '@chakra-ui/react';

import { User as UserType } from '@prisma/client';
import UserInfo from './ProfileComponents/UserInfo';
import EditUserInfo from './ProfileComponents/EditUserInfo';
// import PhoneInput from './ProfileComponents/PhoneInput';

function Profile() {
  const [userObj, setUserObj] = useState({} as UserType);
  // these should not be set to states, but should show if user does not have value set
  const [friendName, setFriendName] = useState("Add your friend's name here");
  const [friendNumber, setFriendNumber] = useState("Add your friend's number here");
  const [friendRelationship, setFriendRelationship] = useState('What is your relationship?');
  const [nickname, setNickname] = useState('What name would you prefer to be addressed by?');
  const [location, setLocation] = useState('Add your city or state here');
  const [myMood, setMood] = useState('What is your current mental state?');
  const [age, setAge] = useState('Add age here');
  // const [myPhoneNumber, updateMyPhoneNumber] = useState('Add your phone number here');
  const [userPic, setUserPic] = useState('');
  const [inInputEditMode, setInputEditMode] = useState(false);
  const [inAgeInputEditMode, setAgeInputEditMode] = useState(false);
  const [inPhoneInputEditMode, setPhoneInputEditMode] = useState(false);
  const [inMoodInputEditMode, setMoodInputEditMode] = useState(false);
  const [inLocationInputEditMode, setLocationInputEditMode] = useState(false);
  const [inFriendsNameInputEditMode, setFriendsNameInputEditMode] = useState(false);
  const [inFriendsNumberInputEditMode, setFriendsNumberInputEditMode] = useState(false);
  const [inRelationshipInputEditMode, setRelationshipInputEditMode] = useState(false);
  // const contactWarningId = useId();

  const inputValRef = useRef(null);
  const inputAgeValRef = useRef(null);
  // const inputPhoneValRef = useRef(null);
  const inputMoodValRef = useRef(null);
  const inputLocationValRef = useRef(null);
  const inputFriendsNameValRef = useRef(null);
  const inputFriendsNumberValRef = useRef(null);
  const inputRelationshipValRef = useRef(null);
  const bg = useColorModeValue('blue.200', 'blue.600');

  function getUser() {
    return axios
      .get('/user')
      .then(({ data }) => axios.get('/chat/user', { params: { id: data.id } }))
      .then(({ data }) => {
        setUserObj(data);
        setUserPic(data.userPicture);
        setNickname(data.preferredName);
        setAge(data.agee);
        setMood(data.currMood);
        setLocation(data.myLocation);
        setFriendName(data.emConName);
        setFriendNumber(data.emConNum);
        setFriendRelationship(data.emConRelationship);
      })
      .catch((err: Error) => console.error('failed getting user pic', err));
  }
  useEffect(() => {
    getUser();
  }, []);

  function updateUser() {
    axios
      .patch('/profile/user', {
        where: {
          googleId: userObj.googleId,
        },
        data: {
          preferredName: nickname,
          currMood: myMood,
          myLocation: location,
          agee: age,
          emConName: friendName,
          emConNum: friendNumber,
          emConRelationship: friendRelationship,
        },
      })
      .then((response) => {
        setUserObj(response.data);
        setNickname(response.data.preferredName);
        setAge(response.data.agee);
        setMood(response.data.currMood);
        setLocation(response.data.myLocation);
        setFriendName(response.data.emConName);
        setFriendNumber(response.data.emConNumber);
        setFriendRelationship(response.data.emConRelationship);
        // console.log(response.data)
      })
      // .then(() => {
      //   const results = getUser();
      //   console.log(results);
      // })
      .catch((err: string) => {
        console.error(err);
      });
  }

  function updateEditComponentValue(typeClicked: String) {
    if (typeClicked === 'name') {
      setInputEditMode(false);
      setNickname(inputValRef.current.value);
    } else if (typeClicked === 'age') {
      setAgeInputEditMode(false);
      setAge(inputAgeValRef.current.value);
    } else if (typeClicked === 'mood') {
      setMoodInputEditMode(false);
      setMood(inputMoodValRef.current.value);
    } else if (typeClicked === 'location') {
      setLocationInputEditMode(false);
      setLocation(inputLocationValRef.current.value);
    } else if (typeClicked === 'friendsName') {
      setFriendsNameInputEditMode(false);
      setFriendName(inputFriendsNameValRef.current.value);
    } else if (typeClicked === 'friendsNumber') {
      setFriendsNumberInputEditMode(false);
      setFriendNumber(inputFriendsNumberValRef.current.value);
    } else if (typeClicked === 'relationship') {
      setRelationshipInputEditMode(false);
      setFriendRelationship(inputRelationshipValRef.current.value);
    }
  }

  function editInputMode(heading: String) {
    // console.log("is in edit mode")
    if (heading === 'Preferred Name') {
      setInputEditMode(!inInputEditMode);
    }
    if (heading === 'age') {
      setAgeInputEditMode(!inAgeInputEditMode);
    }
    if (heading === 'number') {
      setPhoneInputEditMode(!inPhoneInputEditMode);
    }
    if (heading === 'mood') {
      setMoodInputEditMode(!inMoodInputEditMode);
    }
    if (heading === 'location') {
      setLocationInputEditMode(!inLocationInputEditMode);
    }
    if (heading === 'friendsName') {
      setFriendsNameInputEditMode(!inFriendsNameInputEditMode);
    }
    if (heading === 'friendsNumber') {
      setFriendsNumberInputEditMode(!inFriendsNumberInputEditMode);
    }
    if (heading === 'relationship') {
      setRelationshipInputEditMode(!inRelationshipInputEditMode);
    }
  }

  function displayInputEdit(heading: String) {
    if (heading === 'Preferred Name') {
      return (
        <EditUserInfo
          heading={heading}
          defaultValue={nickname}
          propRef={inputValRef}
          setInfoState={setNickname}
          updateEditComponentValue={updateEditComponentValue}
          updateVal="name"
          updateUser={updateUser}
          editInputMode={editInputMode}
          editHeading="Preferred Name"
        />
      );
    }
    if (heading === 'Age') {
      return (
        <EditUserInfo
          heading={heading}
          defaultValue={age}
          propRef={inputAgeValRef}
          setInfoState={setAge}
          updateEditComponentValue={updateEditComponentValue}
          updateVal="age"
          updateUser={updateUser}
          editInputMode={editInputMode}
          editHeading="age"
        />
      );
    }
    if (heading === 'Current Mental State') {
      return (
        <EditUserInfo
          heading={heading}
          defaultValue={myMood}
          propRef={inputMoodValRef}
          setInfoState={setMood}
          updateEditComponentValue={updateEditComponentValue}
          updateVal="mood"
          updateUser={updateUser}
          editInputMode={editInputMode}
          editHeading="mood"
        />
      );
    }
    if (heading === 'Location') {
      return (
        <EditUserInfo
          heading={heading}
          defaultValue={location}
          propRef={inputLocationValRef}
          setInfoState={setLocation}
          updateEditComponentValue={updateEditComponentValue}
          updateVal="location"
          updateUser={updateUser}
          editInputMode={editInputMode}
          editHeading="location"
        />
      );
    }
    if (heading === "Friend's Name") {
      return (
        <EditUserInfo
          heading={heading}
          defaultValue={friendName}
          propRef={inputFriendsNameValRef}
          setInfoState={setFriendName}
          updateEditComponentValue={updateEditComponentValue}
          updateVal="friendsName"
          updateUser={updateUser}
          editInputMode={editInputMode}
          editHeading="friendsName"
        />
      );
    }
    if (heading === "Friend's Phone Number") {
      return (
        <EditUserInfo
          heading={heading}
          defaultValue={friendNumber}
          propRef={inputFriendsNumberValRef}
          setInfoState={setFriendNumber}
          updateEditComponentValue={updateEditComponentValue}
          updateVal="friendsNumber"
          updateUser={updateUser}
          editInputMode={editInputMode}
          editHeading="friendsNumber"
        />
      );
    }
    if (heading === 'Your Relationship') {
      return (
        <EditUserInfo
          heading={heading}
          defaultValue={friendRelationship}
          propRef={inputRelationshipValRef}
          setInfoState={setFriendRelationship}
          updateEditComponentValue={updateEditComponentValue}
          updateVal="relationship"
          updateUser={updateUser}
          editInputMode={editInputMode}
          editHeading="relationship"
        />
      );
    }
    // hit no predefined cases
    // console.log('display input edit hit no predefined cases');
    return null;
  }

  function displayInputDefault(heading: String) {
    if (heading === 'Preferred Name') {
      return (
        <UserInfo
          heading={heading}
          editInput={editInputMode}
          editHeading="Preferred Name"
          defaultInput={userObj.preferredName}
          ifNoDefault={userObj.name}
        />
      );
    }
    if (heading === 'Age') {
      return (
        <UserInfo
          heading={heading}
          editInput={editInputMode}
          editHeading="age"
          defaultInput={userObj.agee}
          ifNoDefault={age}
        />
      );
    }
    if (heading === 'Current Mental State') {
      return (
        <UserInfo
          heading={heading}
          editInput={editInputMode}
          editHeading="mood"
          defaultInput={userObj.currMood}
          ifNoDefault={myMood}
        />
      );
    }
    if (heading === 'Location') {
      return (
        <UserInfo
          heading={heading}
          editInput={editInputMode}
          editHeading="location"
          defaultInput={userObj.myLocation}
          ifNoDefault={location}
        />
      );
    }
    if (heading === "Friend's Name") {
      return (
        <UserInfo
          heading={heading}
          editInput={editInputMode}
          editHeading="friendsName"
          defaultInput={userObj.emConName}
          ifNoDefault={friendName}
        />
      );
    }
    if (heading === "Friend's Phone Number") {
      return (
        <UserInfo
          heading={heading}
          editInput={editInputMode}
          editHeading="friendsNumber"
          defaultInput={userObj.emConNum}
          ifNoDefault={friendNumber}
        />
      );
    }

    if (heading === 'Your Relationship') {
      return (
        <UserInfo
          heading={heading}
          editInput={editInputMode}
          editHeading="relationship"
          defaultInput={userObj.emConRelationship}
          ifNoDefault={friendRelationship}
        />
      );
    }
    // hit no predefined cases
    // console.log('display input default hit no cases');
    return null;
  }

  function doubleClickOnInput(heading: String) {
    if (heading === 'Preferred Name') {
      return inInputEditMode
        ? displayInputEdit('Preferred Name')
        : displayInputDefault('Preferred Name');
    }
    if (heading === 'Age') {
      return inAgeInputEditMode ? displayInputEdit('Age') : displayInputDefault('Age');
    }
    if (heading === 'Current Mental State') {
      return inMoodInputEditMode
        ? displayInputEdit('Current Mental State')
        : displayInputDefault('Current Mental State');
    }
    if (heading === 'Location') {
      return inLocationInputEditMode
        ? displayInputEdit('Location')
        : displayInputDefault('Location');
    }
    if (heading === "Friend's Name") {
      return inFriendsNameInputEditMode
        ? displayInputEdit("Friend's Name")
        : displayInputDefault("Friend's Name");
    }
    if (heading === "Friend's Phone Number") {
      return inFriendsNumberInputEditMode
        ? displayInputEdit("Friend's Phone Number")
        : displayInputDefault("Friend's Phone Number");
    }
    if (heading === 'Your Relationship') {
      return inRelationshipInputEditMode
        ? displayInputEdit('Your Relationship')
        : displayInputDefault('Your Relationship');
    }
    // hit no predefined cases
    // console.log('double click on input hit no predefined cases');
    return null;
  }
  useEffect(() => {
    axios.get('/user').then(({ data }) => {
      const refreshObj = { ...data };
      setUserObj(refreshObj);
    });
  }, []);

  return (
    <div>
      <Container maxW="7xl" h="550px">
        <Grid
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(5, 1fr)"
          gap={2}
          h="1000px"
          marginBottom="150px"
          paddingTop="40px"
          paddingLeft="30px"
        >
          <GridItem
            w={{ base: '80vw', lg: '300px' }}
            colSpan={1}
            bg={bg}
            h="420px"
            borderRadius="15px"
          >
            <Center padding="25px">
              <Avatar name="Kola Tioluwani" size="xl" src={userPic} />
            </Center>
            <Center>
              {userObj ? <h3 style={{ fontSize: '28px' }}>{userObj.name}</h3> : <div />}
            </Center>
            <Center>
              <h5>
                <b>I Live In: </b>
                {userObj ? userObj.myLocation : ''}
              </h5>
            </Center>
            <br />
            <br />
          </GridItem>

          <GridItem
            w={{ base: '80vw', lg: '800px' }}
            colSpan={{ base: 6, lg: 1 }}
            bg={bg}
            h="420px"
            borderRadius="15px"
          >
            <Tabs isLazy>
              <TabList paddingTop="15px">
                <Tab fontSize="20px">About Me</Tab>
                <Tab fontSize="20px">Friend Contact</Tab>
              </TabList>
              <TabPanels>
                {/* initially mounted */}
                <TabPanel>
                  <Card h="320px">
                    <CardBody>
                      <Stack divider={<StackDivider />} spacing="4">
                        <Box>{doubleClickOnInput('Preferred Name')}</Box>
                        {/* <Box>
                          {/* {doubleClickOnInput("Phone Number")} */}
                        {/* </Box> */}
                        <Box>{doubleClickOnInput('Age')}</Box>
                        <Box>{doubleClickOnInput('Current Mental State')}</Box>
                        <Box>{doubleClickOnInput('Location')}</Box>
                      </Stack>
                    </CardBody>
                  </Card>
                </TabPanel>
                {/* initially not mounted */}
                <TabPanel>
                  <Card h="80%">
                    <CardBody>
                      <Stack divider={<StackDivider />} spacing="4">
                        <Box>{doubleClickOnInput("Friend's Name")}</Box>
                        <Box>{doubleClickOnInput("Friend's Phone Number")}</Box>
                        <Box>{doubleClickOnInput('Your Relationship')}</Box>
                      </Stack>
                    </CardBody>
                  </Card>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>
        </Grid>
      </Container>
    </div>
  );
}

export default Profile;
