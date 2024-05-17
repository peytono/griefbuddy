import React, { useMemo, cloneElement, Children, useState, useEffect, BaseSyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dayjsLocalizer, Views, Event } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './index.css';
import { Box, Button, ButtonGroup, Flex } from '@chakra-ui/react';

const localizer = dayjsLocalizer(dayjs);

const coloredDateCellWrapper = ({ children }: any) =>
  cloneElement(Children.only(children), {
    style: {
      background: 'lightblue',
    },
  });

// type for events out the db
type EventWId = {
  id: Number;
  OgId: string;
  allDay?: boolean | undefined;
  title?: React.ReactNode | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  resource?: any;
};

// types for events on calendar
interface CalEvent extends Event {
  id: Number;
  ogId: string;
}

type Keys = keyof typeof Views;

function EventsCalendar({
  events,
  setEventFocus,
}: {
  events: EventWId[];
  setEventFocus: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [doubleClickedEventId, setDoubleClickedEventId] = useState(null as Number);

  const viewsKeys = Object.entries(Views);

  const [view, setView] = useState<(typeof Views)[Keys]>(Views.MONTH);

  function viewClick(e: BaseSyntheticEvent) {
    // console.log(e.target.innerHTML);
    if (e.target.innerHTML === 'Month') {
      setView(Views.MONTH);
    } else if (e.target.innerHTML === 'Agenda') {
      setView(Views.AGENDA);
    }
  }

  const { components, defaultDate } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: coloredDateCellWrapper,
      },
      defaultDate: new Date(),
      views: viewsKeys.map((entry) => entry[1]),
    }),
    [viewsKeys],
  );

  function onDoubleClick(...args: [CalEvent, React.SyntheticEvent<HTMLElement, globalThis.Event>]) {
    const [event] = args;
    const { id } = event;

    setDoubleClickedEventId(id);
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (doubleClickedEventId) {
      navigate(`/events/${doubleClickedEventId}`);
    }
  }, [doubleClickedEventId, navigate]);

  function onSelect(...args: [CalEvent, React.SyntheticEvent<HTMLElement, globalThis.Event>]) {
    const [event] = args;
    // this is the same as key for event's card
    const { ogId } = event;
    setEventFocus(ogId);
  }

  return (
    <>
      <Flex>
        <Box>
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button>Today</Button>
            <Button>Back</Button>
            <Button>Next</Button>
          </ButtonGroup>
        </Box>
        <Box>
          <ButtonGroup size="sm" onClick={(e) => viewClick(e)} isAttached variant="outline">
            <Button isActive={view === Views.MONTH}>Month</Button>
            <Button isActive={view === Views.AGENDA}>Agenda</Button>
          </ButtonGroup>
        </Box>
      </Flex>
      <Box>
        <Calendar
          localizer={localizer}
          events={events.map((event) => ({
            title: event.title,
            // start and end must be date objects
            start: new Date(event.startDate),
            end: new Date(event.endDate),
            id: event.id,
            ogId: event.OgId,
          }))}
          onDoubleClickEvent={onDoubleClick}
          onSelectEvent={onSelect}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          showMultiDayTimes
          step={60}
          views={['month', 'agenda']}
          defaultView="month"
          // onView={(view) => view}
          // onView={() => {}}
          drilldownView="agenda"
          onDrillDown={() => setView(Views.AGENDA)}
          view={view}
          components={components}
          defaultDate={defaultDate}
          // toolbar={false}
        />
      </Box>
    </>
  );
}

export default EventsCalendar;
