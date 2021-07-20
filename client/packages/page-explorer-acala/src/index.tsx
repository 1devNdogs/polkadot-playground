// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-query/types';

import React, { useContext, useRef } from 'react';
import { useTranslation } from './translate';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/react-components';
import { BlockAuthorsContext, EventsContext } from '@polkadot/react-query';

import Main from './Main';
import BlocksByQuery from './BlocksByQuery';
import EventsByQuery from './EventsByQuery';
import BlockInfo from './BlockInfo';


interface Props {
  basePath: string;
  className?: string;
  newEvents?: KeyedEvent[];
}

function ExplorerApp({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { lastHeader, lastHeaders } = useContext(BlockAuthorsContext);
  const { eventCount, events } = useContext(EventsContext);
  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'chain',
      text: t<string>('Chain info')
    },
    {
      hasParams: true,
      name: 'query-blocks',
      text: t<string>('Blocks by number')
    },
    {
      hasParams: true,
      name: 'query-events',
      text: t<string>('Events by blocks')
    },
    {
      hasParams: true,
      name: 'query',
      text: t<string>('Block details')
    },
  ]);

  if (lastHeader) {
    return (
      <main className={className}>
        <Tabs
          basePath={basePath}
          hidden={false}
          items={itemsRef.current}
        />
        <Switch>
          <Route path={`${basePath}/query-blocks/:from/:to`}><BlocksByQuery /></Route>
          <Route path={`${basePath}/query-blocks`}><BlocksByQuery />   </Route>
          <Route path={`${basePath}/query-events/:from/:to`}><EventsByQuery /></Route>
          <Route path={`${basePath}/query-events`}><EventsByQuery /> </Route>
          <Route path={`${basePath}/query/:value`}><BlockInfo /></Route>
          <Route path={`${basePath}/query`}><BlockInfo /></Route>
          <Route>
            <Main
              eventCount={eventCount}
              events={events}
              headers={lastHeaders}
            />
          </Route>
        </Switch>
      </main>
    );
  }
  else {
    return (
      <main className={className}>
      </main>
    );
  }
}

export default React.memo(ExplorerApp);;
