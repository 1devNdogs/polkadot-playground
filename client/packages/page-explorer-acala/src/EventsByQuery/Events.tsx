// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-query/types';

import type { DigestItem } from '@polkadot/types/interfaces';
import type { Codec, TypeDef } from '@polkadot/types/types';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Table } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import Event from './Event';
import { useTranslation } from '../translate';
import { SignedBlock } from "@polkadot/types/interfaces";
import { HeaderExtended } from "@polkadot/api-derive/types";
import Params from '@polkadot/react-params';
import { Raw, Struct, Tuple, Vec } from '@polkadot/types';
import { getTypeDef } from '@polkadot/types/create';

interface Props {
  className?: string;
  emptyLabel?: React.ReactNode;
  events?: [KeyedEvent[], SignedBlock, HeaderExtended];
  eventClassName?: string;
  label?: React.ReactNode;
}

function formatU8a(value: Raw): React.ReactNode {
  return (
    <Params
      isDisabled
      params={[{ type: getTypeDef('Bytes') }]}
      values={[{ isValid: true, value }]}
    />
  );
}

function formatStruct(struct: Struct): React.ReactNode {
  const params = Object.entries(struct.Type).map(([name, value]): { name: string; type: TypeDef; } => ({
    name,
    type: getTypeDef(value)
  }));
  const values = struct.toArray().map((value): { isValid: boolean; value: Codec; } => ({
    isValid: true,
    value
  }));

  return (
    <Params
      isDisabled
      params={params}
      values={values}
    />
  );
}

function formatTuple(tuple: Tuple): React.ReactNode {
  const params = tuple.Types.map((type): { type: TypeDef; } => ({
    type: getTypeDef(type)
  }));
  const values = tuple.toArray().map((value): { isValid: boolean; value: Codec; } => ({
    isValid: true,
    value
  }));

  return (
    <Params
      isDisabled
      params={params}
      values={values}
    />
  );
}

function formatVector(vector: Vec<Codec>): React.ReactNode {
  const type = getTypeDef(vector.Type);
  const values = vector.toArray().map((value): { isValid: boolean; value: Codec; } => ({
    isValid: true,
    value
  }));
  const params = values.map((_, index): { name: string; type: TypeDef; } => ({
    name: `${index}`,
    type
  }));

  return (
    <Params
      isDisabled
      params={params}
      values={values}
    />
  );
}


function formatItem(item: DigestItem): React.ReactNode {
  if (item.value instanceof Struct) {
    return formatStruct(item.value);
  } else if (item.value instanceof Tuple) {
    return formatTuple(item.value);
  } else if (item.value instanceof Vec) {
    return formatVector(item.value);
  } else if (item.value instanceof Raw) {
    return formatU8a(item.value);
  }

  return <div>{item.value.toString().split(',').join(', ')}</div>;
}

function Events({ className = '', emptyLabel, eventClassName, events, label }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const header = useMemo(() => [
    [label || t<string>('recent events'), 'start']
  ], [label, t]);



  return (
    <Table
      className={className}
      empty={emptyLabel || t<string>('No events available')}
      header={header}
    >
      {events && events[0].map(({ indexes, key, record }): React.ReactNode => (
        <tr
          className={eventClassName}
          key={key}
        >
          <td className='overflow'>
            <Event value={record} />
            {events[1] && (
              <div className='event-link'>
                {indexes.length !== 1 && <span>({formatNumber(indexes.length)}x)&nbsp;</span>}
                <Link to={`/explorer/query/${events[1].block.hash || ''}`}>{formatNumber(events[2].number.toNumber())}-{indexes[0]}</Link>
              </div>
            )}
          </td>
        </tr>
      ))}
    </Table>
  );
}

export default React.memo(styled(Events)`
  td.overflow {
    position: relative;

    .event-link {
      position: absolute;
      right: 0.75rem;
      top: 0.5rem;
    }
  }
`);
