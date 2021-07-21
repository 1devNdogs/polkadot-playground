import { Spinner } from "@polkadot/react-components";
import { useApi, useBestNumber } from "@polkadot/react-hooks";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Query from "../Query";
import BlockByHash from "./ByHash";
import { useTranslation } from '../translate';
import SummaryPaginator from "../SummaryPaginator";

const PAGE_SIZE: number = 20;

function Entry(): React.ReactElement | null {
  const bestNumber = useBestNumber();
  const { from, to, page } = useParams<{ from: string; to: string; page: string; }>();
  const [stateValue, setStateValue] = useState<{ from: string; to: string; page: string; }>({ from, to, page });
  const [blockRange, setBlockRange] = useState<Array<any>>([]);
  const { t } = useTranslation();
  const { api, isApiReady } = useApi();

  useEffect((): void => {
    if (bestNumber && page && (Number(page) <= 0 || /^\d+$/.test(page) === false)) {
      window.location.hash = `/explorer/query-blocks/${Number(bestNumber.toString()) - 100}/${Number(bestNumber.toString())}/1`;
    } else
      setStateValue(stateValue =>
        from && to && page && to !== stateValue.to || from !== stateValue.from || page !== stateValue.page ? { from, to, page } : stateValue
      );
  }, [from, to, page, stateValue, bestNumber]);

  useEffect(() => {
    async function fetchHashes() {
      let hashes: Array<any> = [];
      setBlockRange(hashes);

      const pageFrom = Number(from) - ((Number(page) - 1) * PAGE_SIZE);
      const pageTo = Number(to) - ((Number(page) - 1) * PAGE_SIZE);

      for (let index = Number(pageTo); index > Number(pageFrom); index--) {
        const hash = await api.rpc.chain.getBlockHash(index.toString());
        hashes.push(hash);
      }
      setBlockRange(hashes);
    }
    fetchHashes();
  }, [from, to, page, stateValue]);

  useEffect((): void => {
    if ((!from || !to) && bestNumber !== undefined) {
      window.location.hash = `/explorer/query-blocks/${Number(bestNumber.toString()) - 100}/${Number(bestNumber.toString())}/1`;
    }
  }, [bestNumber, isApiReady]);

  return (
    <>
      <Query page="query-blocks" />
      <SummaryPaginator from={Number(from)} to={Number(to)} page={Number(page)} />

      {blockRange.length === 0 && (<div className='connecting'>
        <div className='connecting'>
          <Spinner label={t<string>('Scaning for blocks')} />
        </div>
      </div>)}

      {blockRange.map(value => {
        return <BlockByHash key={value} value={value.toString()}></BlockByHash>;
      })}
    </>
  );
}

export default React.memo((Entry));
