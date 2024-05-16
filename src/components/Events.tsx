import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Heading,
  Center,
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
  VStack,
  Box,
  SimpleGrid,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

import EventListItem from './EventsComponents/EventListItem';
import EventsBigCalendar from './EventsComponents/EventsCalendar';

function Events() {
  const [events, setEvents] = useState([]);
  const [eventsToday, setEventsToday] = useState([]);

  const [eventFocus, setEventFocus] = useState('');

  function scrollToEvent(ogId: string) {
    const eventNode = document.getElementById(ogId);

    eventNode.scrollIntoView({
      behavior: 'smooth',
      // block: 'nearest',
      block: 'center',
      inline: 'center',
    });
  }

  useEffect(() => {
    if (eventFocus) {
      scrollToEvent(eventFocus);
    }
  }, [eventFocus]);

  useEffect(() => {
    axios
      .get('/events/all')
      .then(({ data }) => {
        setEvents(data);
        const today = new Date().toISOString();
        const curEvents = data.filter(
          (event: { startDate: String }) => event.startDate.slice(0, 10) === today.slice(0, 10),
        );
        setEventsToday(curEvents);
      })
      .catch();
  }, []);

  return (
    <VStack divider={<StackDivider />} spacing="4">
      <Box>
        <Center>
          <Heading size="3xl" color="blue.200">
            Events
          </Heading>
        </Center>
      </Box>
      <Box>
        <Card>
          <CardHeader>
            <Heading size="md">Events Starting Today</Heading>
          </CardHeader>
          <CardBody>
            <Wrap spacingY="40px" spacingX="80px" justify="center">
              {eventsToday.map((event) => (
                <WrapItem>
                  <Center>
                    <EventListItem key={event.OgId} event={event} eventFocus="" />
                  </Center>
                </WrapItem>
              ))}
              {/* this is for testing tons of events */}
              {/* {events.map((event) => (
                  <EventListItem key={event.OgId} event={event} />
                ))} */}
              {/* this is just to force grid to only have one card */}
              {/* {events.length ? (
                  <WrapItem>
                    <Center>
                      <EventListItem event={events[0]} />
                    </Center>
                  </WrapItem>
                ) : null} */}
            </Wrap>
          </CardBody>
        </Card>
      </Box>
      <Box>
        <Card>
          <Stack>
            <EventsBigCalendar setEventFocus={setEventFocus} events={events} />
          </Stack>
        </Card>
      </Box>
      <Box>
        <Card>
          <Stack>
            <CardHeader>
              <Heading size="md">All Events</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid
                className="simpleGrid"
                columns={[1, 1, 2, 3, 3, 4]}
                // minChildWidth="300px"
                spacingY="40px"
                spacingX="80px"
              >
                {events.map((event) => (
                  <EventListItem key={event.OgId} event={event} eventFocus={eventFocus} />
                ))}
              </SimpleGrid>
            </CardBody>
          </Stack>
        </Card>
      </Box>
    </VStack>
  );
}

export default Events;
