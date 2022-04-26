import { FormattedMessage } from 'react-intl';
import React from 'react';
import { Button, Collapse, Divider, Fade, Grid } from '@material-ui/core';

import TimelineUpdate from './TimelineUpdate';
import { ZetkinUpdate } from 'types/zetkin';

export interface TimelineProps {
  expandable?: boolean;
  showAll?: boolean;
  updates: ZetkinUpdate[];
}

export const SHOW_INITIALLY = 5;

const Timeline: React.FunctionComponent<TimelineProps> = ({
  expandable,
  showAll,
  updates,
}) => {
  const [expanded, setExpanded] = React.useState<boolean>(!!showAll);

  return (
    <Fade appear in timeout={1000}>
      <Grid container direction="column" spacing={3}>
        {renderUpdateList()}
        {expandable && renderExpandButton()}
      </Grid>
    </Fade>
  );

  function renderUpdateList() {
    return (
      <>
        {(expandable ? updates.slice(0, SHOW_INITIALLY) : updates).map(
          (update, idx) =>
            renderUpdate(
              update,
              idx <
                (!expandable || expanded ? updates.length : SHOW_INITIALLY) - 1
            )
        )}
        {expandable && renderExpandedUpdates()}
      </>
    );
  }

  function renderUpdate(update: ZetkinUpdate, divider: boolean) {
    return (
      <React.Fragment key={update.created_at + update.type}>
        <Grid aria-label="timeline update" item>
          <TimelineUpdate update={update} />
        </Grid>
        {divider && <Divider style={{ width: '100%' }} />}
      </React.Fragment>
    );
  }

  function renderExpandButton() {
    return (
      <Grid item>
        <Button onClick={() => setExpanded(!expanded)} variant="outlined">
          <FormattedMessage id="misc.timeline.expand" />
        </Button>
      </Grid>
    );
  }

  function renderExpandedUpdates() {
    return (
      <Collapse
        component={Grid}
        in={expanded}
        style={{ padding: expanded ? 12 : '0 12px' }}
      >
        <Grid container direction="column" spacing={3}>
          {updates
            .slice(SHOW_INITIALLY)
            .map((update, idx) =>
              renderUpdate(update, idx < updates.length - SHOW_INITIALLY - 1)
            )}
        </Grid>
      </Collapse>
    );
  }
};

export default Timeline;