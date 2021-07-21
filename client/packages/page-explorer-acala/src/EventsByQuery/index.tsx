import React, { useEffect, useState } from "react";
import { HeaderExtended } from "@polkadot/api-derive/types";
import { Label, Progress } from "@polkadot/react-components";
import { useApi, useBestNumber } from "@polkadot/react-hooks";
import { KeyedEvent } from "@polkadot/react-query/types";
import { Vec } from "@polkadot/types";
import { EventRecord, SignedBlock } from "@polkadot/types/interfaces";
import { useParams } from "react-router-dom";
import Events from "./Events";
import Query from "../Query";
import SummaryPaginator from "../SummaryPaginator";


const PAGE_SIZE: number = 10;

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
  const { api, isApiReady } = useApi();
  const bestNumber = useBestNumber();
  const { from, to, page } = useParams<{ from: string; to: string; page: string; }>();
  const [stateValue, setStateValue] = useState<{ from: string; to: string; page: string; }>({ from, to, page });
  const [events, setState] = useState<[KeyedEvent[], SignedBlock, HeaderExtended][]>([]);
  const [count, setCount] = useState<number>(0);

  useEffect((): void => {
    if (bestNumber && page && (Number(page) <= 0 || /^\d+$/.test(page) === false)) {
      window.location.hash = `/explorer/query-events/${Number(bestNumber.toString()) - 100}/${Number(bestNumber.toString())}/1`;
    } else
      setStateValue(stateValue =>
        from && to && page && to !== stateValue.to || from !== stateValue.from || page !== stateValue.page ? { from, to, page } : stateValue
      );
  }, [from, to, page, stateValue, bestNumber]);

  useEffect(() => {
    async function fetchHashes() {
      let resultsEvents: [KeyedEvent[], SignedBlock, HeaderExtended][] = [];
      const pageTo = Number(to) - ((Number(page) - 1) * PAGE_SIZE);
      const pageFrom = pageTo - PAGE_SIZE;

      for (let index = Number(pageTo); index > Number(pageFrom); index--) {
        const hash = await api.rpc.chain.getBlockHash(index.toString());
        console.log("hash");
        const [a, b, c] = await Promise
          .all([
            api.query.system.events.at(hash),
            api.rpc.chain.getBlock(hash),
            api.derive.chain.getHeader(hash)
          ]);
        if (a && b && c) {
          resultsEvents.push(transformResult([a, b, c]));
          setCount(resultsEvents.length);
        }

      }
      console.log("resultsEvents", resultsEvents.length);
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
      <SummaryPaginator route="events" from={Number(from)} to={Number(to)} page={Number(page)} />


      {events.length < 10 && (
        <div style={{ textAlign: "center" }}>
          <Progress
            isDisabled={false}
            total={10}
            value={count}
          />
          <Label label={'Scaning for events in current blocks'} />
        </div>
      )}
      {events.length > 0 && (
        <Events events={events}></Events>
      )}
    </>
  );
}


export default React.memo(Entry);