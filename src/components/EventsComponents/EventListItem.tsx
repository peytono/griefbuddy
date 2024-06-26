import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Image, Center, Link as ChakraLink, useColorModeValue } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

function EventListItem({
  event,
  eventFocus,
}: {
  event: { title: String; description: String; media_raw: any[]; id: Number; OgId: string };
  eventFocus: string;
}) {
  const {
    title,
    description,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    media_raw,
    id,
    OgId,
  } = event;

  const [boxShadow, setBoxShadow] = useState('base');

  const bg = useColorModeValue('blue.200', 'blue.600');

  const exShadow = useColorModeValue('dark-lg', 'outline');

  useEffect(() => {
    if (eventFocus === OgId) {
      setBoxShadow(exShadow);
    } else {
      setBoxShadow('base');
    }
  }, [eventFocus, OgId, exShadow]);

  return (
    <Box
      id={event.OgId}
      boxSize="320px"
      p="10px"
      boxShadow={boxShadow}
      borderRadius="md"
      // background="blue.200"
      background={bg}
    >
      <Center>
        <ChakraLink as={ReactRouterLink} to={`/events/${id}`}>
          <Heading pt="10px" size="sm" textAlign="center">{title}</Heading>
        </ChakraLink>
      </Center>
      <Center>
        <Text pt="2" fontSize="sm" textAlign="center">
          {description}
        </Text>
      </Center>
      <Center>
        <Image boxSize="200px" fit="contain" src={media_raw ? media_raw[0].mediaurl : 'https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,h_72,q_75,w_123/v1/clients/neworleans/NewOrleansLogo_Website_Dark_Grey_1a1a1a_123px_3c60c0e3-35b0-4efb-9685-d2f5ac92528a.jpg'} />
      </Center>
    </Box>
  );
}

export default EventListItem;
