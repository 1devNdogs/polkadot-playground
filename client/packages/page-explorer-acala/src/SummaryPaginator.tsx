// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Button, CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from './translate';
import PageButton from './PageButton';

const PAGE_SIZE = 10;
interface Props {
  from: number;
  to: number;
  page: number;
  route: string;
}

function SummaryPaginator({ from, to, page, route }: Props): React.ReactElement {
  const { t } = useTranslation();
  const pageTo = to - ((page - 1) * PAGE_SIZE);
  const pageFrom = pageTo - PAGE_SIZE;

  // TODO move to new paginator comp
  const set = (p: number) => {
    const totalPages = (to - from) / PAGE_SIZE;
    if (!(p < 1 || p > totalPages)) {
      window.location.hash = `/explorer/query-${route}/${from}/${to}/${p}`;
    }
  };

  const getPages = (): Array<any> => {
    const totalPages = (to - from) / PAGE_SIZE;
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
        {formatNumber(pageFrom)}
      </CardSummary>
      <CardSummary
        className='media--1000'
        label={t<string>('To Block')}>
        {formatNumber(pageTo)}
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
          onClick={() => { set((page - 1)); }}
        />
        {getPages().map((i) => {
          return (
            <PageButton
              onClick={() => { set(i); }}
              label={i}
              key={i}
              isSelected={Number(page) === i}
            />
          );
        })}
        <Button
          icon='arrow-alt-circle-right'
          isDisabled={false}
          label={t<string>('Next')}
          onClick={() => { set(page + 1); }}
        />
      </Button.Group>
    </SummaryBox>
  );
}

export default React.memo(SummaryPaginator);
