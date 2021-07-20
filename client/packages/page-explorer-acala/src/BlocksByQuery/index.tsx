import { Spinner } from "@polkadot/react-components";
import { useApi, useBestNumber } from "@polkadot/react-hooks";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Query from "../Query";
import BlockByHash from "./ByHash";
import { useTranslation } from '../translate';


function Entry(): React.ReactElement | null {
  const bestNumber = useBestNumber();
  const { from, to } = useParams<{ from: string; to: string; }>();
  const [stateValue, setStateValue] = useState<{ from: string; to: string; }>({ from, to });
  const [blockRange, setBlockRange] = useState<Array<any>>([]);
  const { t } = useTranslation();
  const { api, isApiReady } = useApi();

  useEffect((): void => {
    setStateValue(stateValue =>
      from && to && to !== stateValue.to || from !== stateValue.from ? { from, to } : stateValue
    );
  }, [from, to, stateValue,]);

  useEffect(() => {
    async function fetchHashes() {
      let hashes: Array<any> = [];
      setBlockRange(hashes);
      for (let index = Number(from); index < Number(to); index++) {
        const hash = await api.rpc.chain.getBlockHash(index.toString());
        hashes.push(hash);
      }
      setBlockRange(hashes);
    }
    fetchHashes();
  }, [from, to, stateValue]);


  useEffect((): void => {
    if ((!from || !to) && bestNumber !== undefined) {
      window.location.hash = `/explorer/query-blocks/${Number(bestNumber.toString()) - 20}/${Number(bestNumber.toString())}`;
    }
  }, [bestNumber, isApiReady]);

  return (
    <>
      <Query page="query-blocks" />
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

export default React.memo(Entry);
