import React from 'react';
import { sortBy } from 'lodash';
import { useBTC } from './useBTC';
import { useBinance } from './useBinance';
import { useBundleAccount } from './useBundleAccount';
import { useETH } from './useETH';
import { bigNumberSum } from './util';

let lastUpdatedKey = '';

/**
 * - 地址列表
 *  - 返回所有类型的地址：eth btc bn
 *  - 新增地址
 *  - 删除地址
 *  - 修改备注
 * - 返回所有链的余额
 * - 返回所有 token 的余额
 * - 返回所有资产
 *  - eth 的汇总
 *  - bn 的汇总
 */
export const useBundleState = () => {
  const account = useBundleAccount();
  const binance = useBinance();
  const eth = useETH();
  const btc = useBTC();
  const updatedKey = JSON.stringify(account.inBundleList.map((acc) => acc.id));

  const hasEthAccount = React.useMemo(
    () => account.inBundleList.some((acc) => acc.type === 'eth'),
    [account.inBundleList]
  );
  const hasBnAccount = React.useMemo(
    () => account.inBundleList.some((acc) => acc.type === 'bn'),
    [account.inBundleList]
  );
  const hasBtcAccount = React.useMemo(
    () => account.inBundleList.some((acc) => acc.type === 'btc'),
    [account.inBundleList]
  );

  const getAllAssets = (force = false) => {
    eth.getAssets(force);
    binance.getAssets(force);
    btc.getAssets(force);
  };

  const refetchBundleAssets = () => {
    getAllAssets(true);
  };

  const bundleChainList = React.useMemo(() => {
    const list = [];
    if (hasEthAccount) {
      list.push(...eth.displayChainList);
    }
    if (hasBnAccount) {
      list.push(binance.chainData);
    }
    if (hasBtcAccount) {
      list.push(btc.chainData);
    }
    return sortBy(list, (item) => item.usd_value).reverse();
  }, [
    hasEthAccount,
    hasBnAccount,
    hasBtcAccount,
    eth.displayChainList,
    binance.chainData,
    btc.chainData,
  ]);

  const bundleBalance = React.useMemo(() => {
    return bigNumberSum(eth.balance, binance.balance, btc.balance) ?? '0';
  }, [eth.balance, binance.balance, btc.balance]);

  const bundleTokenList = React.useMemo(() => {
    const list = [];
    if (hasEthAccount) {
      list.push(...eth.tokenList);
    }
    if (hasBtcAccount && btc.tokenData) {
      list.push(btc.tokenData);
    }
    return list;
  }, [btc.tokenData, eth.tokenList, hasBtcAccount, hasEthAccount]);

  const bundleProtocolList = React.useMemo(() => {
    const list = [];
    if (hasEthAccount) {
      list.push(...eth.protocolList);
    }
    if (hasBnAccount && binance.protocolData) {
      list.push(binance.protocolData);
    }
    return list;
  }, [binance.protocolData, eth.protocolList, hasBnAccount, hasEthAccount]);

  // update when account list changed
  React.useEffect(() => {
    if (lastUpdatedKey === updatedKey) {
      return;
    }
    getAllAssets();
    lastUpdatedKey = updatedKey;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedKey]);

  const loadingToken = eth.loadingToken || btc.loading;
  const loadingProtocol = eth.loadingProtocol || binance.loading;
  const loadingUsedChain =
    eth.loadingUsedChain || btc.loading || binance.loading;

  return {
    refetchBundleAssets,
    bundleChainList,
    bundleBalance,
    bundleTokenList,
    bundleProtocolList,
    account,
    binance,
    eth,
    btc,
    loadingToken,
    loadingProtocol,
    loadingUsedChain,
  };
};