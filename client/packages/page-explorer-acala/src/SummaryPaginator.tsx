// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Button, CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from './translate';
import PageButton from './PageButton';

const PAGE_SIZE = 20;
interface Props {
  from: number;
  to: number;
  page: number;
}

function SummaryPaginator({ from, to, page }: Props): React.ReactElement {
  const { t } = useTranslation();

  // TODO move to new paginator comp
  const set = (p: string) => {
    const totalPages = (Number(to) - Number(from)) / PAGE_SIZE;
    if (!(Number(p) < 1 || Number(p) > totalPages)) {
      window.location.hash = `/explorer/query-blocks/${from}/${to}/${p}`;
    }
  };

  const getPages = (): Array<any> => {
    const totalPages = (Number(to) - Number(from)) / PAGE_SIZE;
    let renderPages = [];
    for (let i = 1; i <= totalPages; i++) {
      renderPages.push(i);
    }
    return renderPages;
  };

  return (
    <SummaryBox>
      <CardSummary
        className='media--1000'
        label={t<string>('From Block')}>
        {formatNumber(from - (page - 1) * PAGE_SIZE)}
      </CardSummary>
      <CardSummary
        className='media--1000'
        label={t<string>('To Block')}>
        {formatNumber(to - (page - 1) * PAGE_SIZE)}
      </CardSummary>
      <CardSummary
        className='media--800'
        label={t<string>('Page')}>
        {page + " / " + (to - from) / PAGE_SIZE}
      </CardSummary>
      <CardSummary
        className='media--800'
        label={t<string>('Page Size')}>
        {PAGE_SIZE}
      </CardSummary>
      <Button.Group isCentered>
        <Button
          icon='arrow-alt-circle-left'
          isDisabled={false}
          label={t<string>('Back')}
          onClick={() => { set((Number(page) - 1).toString()); }}
        />
        {getPages().map((i) => {
          return (
            <PageButton
              onClick={() => { set(i); }}
              label={i}
              isSelected={Number(page) === i}
            />
          );
        })}
        <Button
          icon='arrow-alt-circle-right'
          isDisabled={false}
          label={t<string>('Next')}
          onClick={() => { set((Number(page) + 1).toString()); }}
        />
      </Button.Group>
    </SummaryBox>
  );
}

export default React.memo(SummaryPaginator);
