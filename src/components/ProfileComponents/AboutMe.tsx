import React, { useState } from 'react';
import { Text, Editable, EditableInput, EditablePreview, Divider } from '@chakra-ui/react';
import { User } from '@prisma/client';
import axios from 'axios';

function AboutMe({
  user,
  setUser,
}: {
  user: User;
  setUser: React.Dispatch<
  React.SetStateAction<{
    id: number;
    name: string;
    googleId: string;
    emConName: string | null;
    emConNum: string | null;
    emConRelationship: string | null;
    preferredName: string | null;
    userPicture: string | null;
    currMood: string | null;
    myLocation: string | null;
    age: string | null;
    myPhoneNumber: string | null;
  }>
  >;
}) {
  const [updatedMood, updateMood] = useState(user.currMood);
  const [updatedLocation, updateLocation] = useState(user.myLocation);
  const [updatedFriendName, updateFriendName] = useState(user.emConName);
  const [updatedFriendNumber, updateFriendNumber] = useState(user.emConNum);

  function updateUser(updateKey: string, updateValue: string) {
    axios
      .patch('/profile', { id: user.id, data: { [updateKey]: updateValue } })
      .then(({ data }) => setUser(data))
      .catch((err) => console.log('failed patching user: ', err));
  }

  return (
    <>
      <Text fontWeight="bold">{'Last recorded mood: '}</Text>
      <Editable
        value={updatedMood || 'add current mood'}
        onChange={(curValue) => updateMood(curValue)}
        onSubmit={() => updateUser('currMood', updatedMood)}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
      <Text fontWeight="bold">{'I live in: '}</Text>
      <Editable
        value={updatedLocation || 'set location'}
        onChange={(curValue) => updateLocation(curValue)}
        // onSubmit={}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
      <Divider my=".5rem" />
      <Text>If you add a friend contact, they will receive an SMS upon alarming behavior.</Text>
      <Text fontWeight="bold">{'Friend Name: '}</Text>
      <Editable
        value={updatedFriendName || 'add name here'}
        onChange={(curValue) => updateFriendName(curValue)}
        // onSubmit={}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
      <Text fontWeight="bold">{'Friend Number: '}</Text>
      <Editable
        value={updatedFriendNumber || '(XXX)XXX-XXXX'}
        onChange={(curValue) => updateFriendNumber(curValue)}
        // onSubmit={}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    </>
  );
}

export default AboutMe;
