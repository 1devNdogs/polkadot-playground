import React, { useEffect, useState } from "react";
import { HeaderExtended } from "@polkadot/api-derive/types";
import { Spinner } from "@polkadot/react-components";
import { useApi, useBestNumber } from "@polkadot/react-hooks";
import { KeyedEvent } from "@polkadot/react-query/types";
import { Vec } from "@polkadot/types";
import { EventRecord, SignedBlock } from "@polkadot/types/interfaces";
import { useParams } from "react-router-dom";
import Events from "./Events";
import Query from "../Query";
import { useTranslation } from '../translate';
import SummaryPaginator from "../SummaryPaginator";


const PAGE_SIZE: number = 20;

function transformResult([events, getBlock, getHeader]: [Vec<EventRecord>, SignedBlock, HeaderExtended]): [KeyedEvent[], SignedBlock, HeaderExtended] {
  return [
    events.map((record, index) => ({
      indexes: [index],
      key: `${Date.now()}-${index}-${record.hash.toHex()}`,
      record
    })),
    getBlock,
    getHeader
  ];
}

function Entry(): React.ReactElement | null {
  const { t } = useTranslation();
  const { api, isApiReady } = useApi();
  const bestNumber = useBestNumber();
  const { from, to, page } = useParams<{ from: string; to: string; page: string; }>();
  const [stateValue, setStateValue] = useState<{ from: string; to: string; page: string; }>({ from, to, page });
  const [[events], setState] = useState<Array<[KeyedEvent[], SignedBlock, HeaderExtended]>>([]);

  useEffect((): void => {
    setStateValue(stateValue =>
      from && to && page && to !== stateValue.to || from !== stateValue.from || page !== stateValue.page ? { from, to, page } : stateValue
    );
  }, [from, to, page]);

  useEffect(() => {
    async function fetchHashes() {
      let resultsEvents: Array<[KeyedEvent[], SignedBlock, HeaderExtended]> = [];
      setState(resultsEvents);

      const pageFrom = Number(from) - ((Number(page) - 1) * PAGE_SIZE);
      const pageTo = Number(to) - ((Number(page) - 1) * PAGE_SIZE);

      for (let index = Number(pageTo); index > Number(pageFrom); index--) {
        const hash = await api.rpc.chain.getBlockHash(index.toString());
        const [a, b, c] = await Promise
          .all([
            api.query.system.events.at(hash),
            api.rpc.chain.getBlock(hash),
            api.derive.chain.getHeader(hash)
          ]);
        if (a && b && c)
          resultsEvents.push(transformResult([a, b, c]));

      }
      setState(resultsEvents);
    }
    fetchHashes();
  }, [from, to, stateValue]);

  useEffect((): void => {
    if ((!from || !to) && bestNumber !== undefined) {
      window.location.hash = `/explorer/query-events/${Number(bestNumber.toString()) - 100}/${Number(bestNumber.toString())}/1`;
    }
  }, [bestNumber, isApiReady]);


  return (
    <>
      <Query page="query-events" />
      <SummaryPaginator from={Number(from)} to={Number(to)} page={Number(page)} />


      {!events ? (<div className='connecting'>
        <div className='connecting'>
          <Spinner label={t<string>('Scaning for blocks and events')} />
        </div>
      </div>) : (
        <Events events={events}></Events>
      )}
    </>
  );
}

export default React.memo(Entry);
