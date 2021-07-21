// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { Button, FilterOverlay, Input } from "@polkadot/react-components";

import { useTranslation } from "./translate";
import { useParams } from "react-router-dom";

interface Props {
  className?: string;
  toNumber?: string;
  page: string;
}

interface State {
  fromNumber: string;
  toNumber: string;
  isValidTo: boolean;
  isValidFrom: boolean;
}

function stateFromValue(fromNumber: string, toNumber: string): State {
  return {
    isValidFrom: /^\d+$/.test(fromNumber) && Number(fromNumber) < Number(toNumber),
    isValidTo: /^\d+$/.test(toNumber) && Number(fromNumber) < Number(toNumber),
    fromNumber,
    toNumber
  };
}

function Query({ className = "", page }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { from, to } = useParams<{ from: string; to: string; }>();

  const [{ isValidFrom, isValidTo, fromNumber, toNumber }, setState] = useState(() =>
    stateFromValue(from, to)
  );

  useEffect((): void => {
    if (from && to) {
      setState(stateFromValue(from, to));
    }
  }, [from, to]);


  const _setHash = useCallback((_from: string): void => setState(stateFromValue(_from, toNumber)), [toNumber]);
  const _setHashTo = useCallback((_to: string): void => setState(stateFromValue(fromNumber, _to)), [fromNumber]);

  const _onQuery = useCallback((): void => {
    if (isValidFrom && isValidTo) {
      window.location.hash = `/explorer/${page}/${fromNumber}/${toNumber}`;
    }
  }, [isValidFrom, isValidTo, toNumber, fromNumber]);



  return (
    <FilterOverlay className={`ui--FilterOverlay hasOwnMaxWidth ${className}`}>
      <div className='label--query'>
        {"Loading " + (Number(to) - Number(from)).toString() + " last blocks"}
      </div>
      {from && (
        <Input
          defaultValue={from}
          className={"explorer--query"}
          isError={!isValidFrom}
          onChange={_setHash}
          onEnter={_onQuery}
          withLabel={false}
          placeholder={t<string>("From block")}
        ></Input>
      )}

      {to && (
        <Input
          defaultValue={to}
          className={"explorer--query"}
          isError={!isValidTo}
          onChange={_setHashTo}
          onEnter={_onQuery}
          placeholder={t<string>("To block")}
          withLabel={false}
        ></Input>
      )}
      {from && to && (
        <Button icon="play" onClick={_onQuery} />
      )}

    </FilterOverlay>
  );
}

export default React.memo(styled(Query)`
  .explorer--query {
          width: 10em;
        margin-right: 0.4em;
  }
  .label--query {
      padding: 1rem;
      line-height: 1.214rem;
      color: gray
     }
`);
