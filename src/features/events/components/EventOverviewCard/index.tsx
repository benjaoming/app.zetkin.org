import { Add } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditIcon from '@mui/icons-material/Edit';
import { FormattedTime } from 'react-intl';
import MapIcon from '@mui/icons-material/Map';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  ClickAwayListener,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useState } from 'react';

import EventDataModel from 'features/events/models/EventDataModel';
import { getWorkingUrl } from 'features/events/utils/getWorkingUrl';
import LocationModal from '../LocationModal';
import LocationsModel from 'features/events/models/LocationsModel';
import messageIds from 'features/events/l10n/messageIds';
import theme from 'theme';
import useEditPreviewBlock from 'zui/hooks/useEditPreviewBlock';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';
import ZUIDate from 'zui/ZUIDate';
import ZUIPreviewableInput from 'zui/ZUIPreviewableInput';
import {
  endDateIsBeforeStartDate,
  isSameDate,
  isSameTime,
  removeOffset,
} from 'utils/dateUtils';

type EventOverviewCardProps = {
  dataModel: EventDataModel;
  locationsModel: LocationsModel;
};

const EventOverviewCard: FC<EventOverviewCardProps> = ({
  dataModel,
  locationsModel,
}) => {
  const eventData = dataModel.getData().data;
  const locations = locationsModel.getLocations().data;
  const messages = useMessages(messageIds);
  const [editable, setEditable] = useState(false);
  const [link, setLink] = useState(eventData?.url ?? '');
  const [infoText, setInfoText] = useState(eventData?.info_text ?? '');
  const [locationId, setLocationId] = useState(
    eventData?.location.id ?? undefined
  );

  const [startDate, setStartDate] = useState<Dayjs | undefined>(
    eventData?.start_time
      ? dayjs(removeOffset(eventData.start_time))
      : undefined
  );
  const [endDate, setEndDate] = useState<Dayjs | undefined>(
    eventData?.end_time ? dayjs(removeOffset(eventData.end_time)) : undefined
  );

  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const { clickAwayProps, containerProps, previewableProps } =
    useEditPreviewBlock({
      editable,
      onEditModeEnter: () => setEditable(true),
      onEditModeExit: () => setEditable(false),
      save: () => {
        dataModel.updateEventData({
          end_time: dayjs(endDate)
            .hour(endDate ? endDate.hour() : 0)
            .minute(endDate ? endDate.minute() : 0)
            .format(),
          info_text: infoText,
          location_id: locationId,
          start_time: dayjs(startDate)
            .hour(startDate ? startDate.hour() : 0)
            .minute(startDate ? startDate.minute() : 0)
            .format(),

          url: link,
        });
      },
    });

  if (!eventData) {
    return null;
  }

  return (
    <ClickAwayListener {...clickAwayProps}>
      <Box {...containerProps}>
        <Card>
          {!editable && (
            <Box display="flex" justifyContent="flex-end" m={2}>
              <Button startIcon={<EditIcon />} variant="outlined">
                {messages.eventOverviewCard.editButton().toUpperCase()}
              </Button>
            </Box>
          )}
          <Grid container spacing={2} sx={{ marginTop: '100px' }}>
            <Grid
              container
              item
              sm
              sx={{ justifyContent: 'space-evenly' }}
              xs={8}
            >
              <Grid container direction="row" item spacing={2} xs>
                <Grid
                  direction="column"
                  item
                  spacing={2}
                  sx={{
                    display: 'flex',
                    flexDirection: 'inherit',
                  }}
                  xs
                >
                  <Grid item>
                    <ZUIPreviewableInput
                      {...previewableProps}
                      renderInput={(props) => {
                        return (
                          <DatePicker
                            inputFormat="DD-MM-YYYY"
                            label={messages.eventOverviewCard.startDate()}
                            onChange={(newValue) => {
                              setStartDate(dayjs(newValue));
                            }}
                            renderInput={(params) => {
                              return (
                                <TextField
                                  {...params}
                                  inputProps={{
                                    ...params.inputProps,
                                    ...props,
                                  }}
                                  sx={{ marginBottom: '15px' }}
                                />
                              );
                            }}
                            value={dayjs(startDate)}
                          />
                        );
                      }}
                      renderPreview={() => {
                        if (startDate) {
                          return (
                            <Box ml={1}>
                              <Typography
                                color="secondary"
                                component="h3"
                                variant="subtitle1"
                              >
                                {messages.eventOverviewCard
                                  .startDate()
                                  .toUpperCase()}
                              </Typography>
                              <ZUIDate
                                datetime={new Date(
                                  dayjs(startDate).format()
                                ).toISOString()}
                              />
                            </Box>
                          );
                        } else {
                          return <></>;
                        }
                      }}
                      value={dayjs(startDate).format() ?? ''}
                    />

                    <ZUIPreviewableInput
                      {...previewableProps}
                      renderInput={(props) => {
                        return (
                          <TimePicker
                            ampm={false}
                            inputFormat="HH:mm"
                            label={messages.eventOverviewCard.startTime()}
                            onChange={(newValue) => {
                              setStartDate(dayjs(newValue));
                            }}
                            open={false}
                            renderInput={(params) => {
                              return (
                                <TextField
                                  {...params}
                                  inputProps={{
                                    ...params.inputProps,
                                    ...props,
                                  }}
                                />
                              );
                            }}
                            value={dayjs(startDate)}
                          />
                        );
                      }}
                      renderPreview={() => {
                        if (startDate) {
                          return (
                            <Box ml={1}>
                              <FormattedTime
                                hour12={false}
                                value={new Date(
                                  dayjs(startDate).format()
                                ).toISOString()}
                              />
                            </Box>
                          );
                        } else {
                          return <></>;
                        }
                      }}
                      value={dayjs(startDate).format()}
                    />
                  </Grid>

                  <Grid item ml={1}>
                    <ZUIPreviewableInput
                      {...previewableProps}
                      renderInput={(props) => {
                        return (
                          <DatePicker
                            inputFormat="DD-MM-YYYY"
                            label={messages.eventOverviewCard.endDate()}
                            onChange={(newValue) => {
                              setEndDate(dayjs(newValue));
                              if (
                                startDate &&
                                newValue &&
                                endDateIsBeforeStartDate(
                                  startDate.toDate(),
                                  newValue.toDate()
                                )
                              ) {
                                setStartDate(newValue);
                              }
                            }}
                            renderInput={(params) => {
                              return (
                                <TextField
                                  {...params}
                                  inputProps={{
                                    ...params.inputProps,
                                    ...props,
                                  }}
                                  sx={{ marginBottom: '15px' }}
                                />
                              );
                            }}
                            value={dayjs(endDate)}
                          />
                        );
                      }}
                      renderPreview={() => {
                        if (
                          endDate &&
                          startDate &&
                          !isSameDate(startDate.toDate(), endDate.toDate())
                        ) {
                          return (
                            <Box ml={4}>
                              <Typography
                                color="secondary"
                                component="h3"
                                variant="subtitle1"
                              >
                                {messages.eventOverviewCard
                                  .endDate()
                                  .toUpperCase()}
                              </Typography>
                              <ZUIDate
                                datetime={new Date(
                                  dayjs(endDate).format()
                                ).toISOString()}
                              />
                            </Box>
                          );
                        } else if (
                          endDate &&
                          startDate &&
                          isSameDate(startDate.toDate(), endDate.toDate())
                        ) {
                          return (
                            <Button variant="outlined">
                              {messages.eventOverviewCard.buttonEndDate()}
                            </Button>
                          );
                        } else {
                          return <></>;
                        }
                      }}
                      value={dayjs(endDate).format() ?? ''}
                    />

                    <ZUIPreviewableInput
                      {...previewableProps}
                      renderInput={(props) => {
                        return (
                          <TimePicker
                            ampm={false}
                            inputFormat="HH:mm"
                            label={messages.eventOverviewCard.endTime()}
                            onChange={(newValue) => {
                              setEndDate(dayjs(newValue));
                            }}
                            open={false}
                            renderInput={(params) => {
                              return (
                                <TextField
                                  {...params}
                                  inputProps={{
                                    ...params.inputProps,
                                    ...props,
                                  }}
                                />
                              );
                            }}
                            value={dayjs(endDate)}
                          />
                        );
                      }}
                      renderPreview={() => {
                        if (
                          endDate &&
                          startDate &&
                          !isSameTime(startDate.unix(), endDate.unix())
                        ) {
                          return (
                            <Box ml={4}>
                              <FormattedTime
                                hour12={false}
                                value={new Date(
                                  dayjs(endDate).format()
                                ).toISOString()}
                              />
                            </Box>
                          );
                        } else {
                          return <></>;
                        }
                      }}
                      value={dayjs(endDate).format()}
                    />
                  </Grid>
                </Grid>

                <Divider
                  flexItem
                  orientation="vertical"
                  sx={{ marginLeft: '10px' }}
                />

                <Grid sx={{ marginLeft: '10px', marginTop: 2 }} xs>
                  <Grid item>
                    <ZUIPreviewableInput
                      {...previewableProps}
                      renderInput={() => {
                        return (
                          <Box alignItems="center" display="flex">
                            <Autocomplete
                              disableClearable
                              fullWidth
                              onChange={(ev, value) => {
                                if (value === 'CREATE_NEW_LOCATION') {
                                  setLocationModalOpen(true);
                                }
                                const location = locations?.find(
                                  (location) => location.title === value
                                );
                                if (!location) {
                                  return;
                                }
                                setLocationId(location.id);
                              }}
                              options={
                                locations
                                  ?.map((location) => location.title)
                                  .concat(['CREATE_NEW_LOCATION']) || []
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label={messages.eventOverviewCard.location()}
                                  sx={{
                                    backgroundColor: 'white',
                                    borderRadius: '5px',
                                  }}
                                />
                              )}
                              renderOption={(params, option) =>
                                option === 'CREATE_NEW_LOCATION' ? (
                                  <li {...params}>
                                    <Add sx={{ marginRight: 2 }} />
                                    {messages.eventOverviewCard.createLocation()}
                                  </li>
                                ) : (
                                  <li {...params}>{option}</li>
                                )
                              }
                              value={
                                locations?.find(
                                  (location) => location.id === locationId
                                )?.title
                              }
                            />
                            <MapIcon
                              color="secondary"
                              onClick={() => setLocationModalOpen(true)}
                              sx={{ cursor: 'pointer', marginLeft: 1 }}
                            />
                            <LocationModal
                              locationId={locationId}
                              locations={locations || []}
                              onMapClose={() => setLocationModalOpen(false)}
                              onSelectLocation={(location: ZetkinLocation) =>
                                setLocationId(location.id)
                              }
                              open={locationModalOpen}
                            />
                          </Box>
                        );
                      }}
                      renderPreview={() => {
                        if (eventData.location) {
                          return (
                            <Box ml={4}>
                              <Box sx={{ display: 'flex' }}>
                                <Typography
                                  color="secondary"
                                  component="h3"
                                  variant="subtitle1"
                                >
                                  {messages.eventOverviewCard
                                    .location()
                                    .toUpperCase()}
                                </Typography>
                                <MapIcon
                                  color="secondary"
                                  onClick={() => setLocationModalOpen(true)}
                                  sx={{ cursor: 'pointer', marginLeft: 2 }}
                                />
                              </Box>
                              <Typography
                                sx={{
                                  alignItems: 'flex-start',
                                  display: 'flex',
                                }}
                                variant="body2"
                              >
                                {eventData.location.title}
                              </Typography>
                            </Box>
                          );
                        } else {
                          return (
                            <Box ml={4}>
                              <Typography
                                color="secondary"
                                component="h3"
                                variant="subtitle1"
                              >
                                {messages.eventOverviewCard
                                  .location()
                                  .toUpperCase()}
                              </Typography>
                              <Typography
                                sx={{
                                  alignItems: 'flex-start',
                                  display: 'flex',
                                }}
                                variant="body2"
                              >
                                {messages.eventOverviewCard.noLocation()}
                              </Typography>
                            </Box>
                          );
                        }
                      }}
                      value={locationId || ''}
                    />
                  </Grid>

                  <Grid item mt={2}>
                    <ZUIPreviewableInput
                      {...previewableProps}
                      renderInput={(props) => (
                        <TextField
                          fullWidth
                          inputProps={props}
                          label={messages.eventOverviewCard.url()}
                          onChange={(ev) => setLink(ev.target.value)}
                          sx={{ marginBottom: 2 }}
                          value={link}
                        />
                      )}
                      renderPreview={() => {
                        if (eventData.url && eventData.url !== '') {
                          return (
                            <Box ml={4}>
                              <Typography
                                color={theme.palette.text.secondary}
                                component="h3"
                                variant="subtitle1"
                              >
                                {messages.eventOverviewCard.url().toUpperCase()}
                              </Typography>
                              <Typography
                                sx={{
                                  alignItems: 'flex-start',
                                  display: 'flex',
                                }}
                                variant="body2"
                              >
                                {eventData.url}
                                <Link
                                  href={getWorkingUrl(eventData.url)}
                                  sx={{ marginLeft: '8px' }}
                                  target="_blank"
                                >
                                  <OpenInNewIcon color="primary" />
                                </Link>
                              </Typography>
                            </Box>
                          );
                        } else {
                          return <></>;
                        }
                      }}
                      value={link || ''}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box>
            <ZUIPreviewableInput
              {...previewableProps}
              renderInput={(props) => (
                <TextField
                  fullWidth
                  inputProps={props}
                  label={messages.eventOverviewCard.description()}
                  multiline
                  onChange={(ev) => setInfoText(ev.target.value)}
                  rows={4}
                  sx={{ marginBottom: 2, marginLeft: 1, paddingRight: 2 }}
                  value={infoText}
                />
              )}
              renderPreview={() => {
                if (eventData.info_text !== '') {
                  return (
                    <Box mb={2} ml={2}>
                      <Typography
                        color={theme.palette.text.secondary}
                        component="h3"
                        variant="subtitle1"
                      >
                        {messages.eventOverviewCard.description().toUpperCase()}
                      </Typography>
                      <Typography variant="body2">
                        {eventData.info_text}
                      </Typography>
                    </Box>
                  );
                } else {
                  return <></>;
                }
              }}
              value={infoText}
            />
          </Box>
        </Card>
      </Box>
    </ClickAwayListener>
  );
};

export default EventOverviewCard;
