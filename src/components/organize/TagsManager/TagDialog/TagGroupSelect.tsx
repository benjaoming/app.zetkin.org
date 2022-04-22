import { ChangeEvent } from 'react';
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  createFilterOptions,
} from '@material-ui/lab';
import { Box, TextField } from '@material-ui/core';

import { NewTagGroup } from '../types';
import { ZetkinTagGroup } from 'types/zetkin';

type GroupOptions = ZetkinTagGroup | { inputValue: string; title: string };
const filter = createFilterOptions<GroupOptions>();

const TagGroupSelect: React.FunctionComponent<{
  groups: ZetkinTagGroup[];
  onChange: (
    e: ChangeEvent<{ [key: string]: never }>,
    value: ZetkinTagGroup | NewTagGroup | null | undefined,
    reason: AutocompleteChangeReason,
    details: AutocompleteChangeDetails<ZetkinTagGroup> | undefined
  ) => void;
  value?: ZetkinTagGroup | null | undefined;
}> = ({ groups, value, onChange }) => {
  return (
    <Box mb={0.8} mt={1.5}>
      <Autocomplete
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          // Suggest the creation of a new value
          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              title: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        getOptionLabel={(group) => group.title}
        onChange={(event, newValue, reason, details) => {
          if (newValue && 'inputValue' in newValue) {
            // Creating a new group with no id
            onChange(
              event,
              { title: newValue.inputValue },
              reason,
              details as AutocompleteChangeDetails<ZetkinTagGroup>
            );
          } else {
            // Selecting an existing group
            onChange(
              event,
              newValue,
              reason,
              details as AutocompleteChangeDetails<ZetkinTagGroup> | undefined
            );
          }
        }}
        options={(groups as GroupOptions[]) || []}
        renderInput={(params) => (
          <TextField
            {...params}
            id="TagManager-TagDialog-tagGroupSelect"
            inputProps={{
              ...params.inputProps,
            }}
            label={'Group'}
            placeholder="Type to search or create a group"
            variant="outlined"
          />
        )}
        value={value}
      />
    </Box>
  );
};

export default TagGroupSelect;
