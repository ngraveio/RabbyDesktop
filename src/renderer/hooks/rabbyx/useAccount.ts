import { walletController } from '@/renderer/ipcRequest/rabbyx';
import { atom, useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

type AccountWithName = Account & { alianName: string };
const currentAccountAtom = atom<null | (RabbyAccount & { alianName: string })>(
  null
);
const accountsAtom = atom<AccountWithName[]>([]);

async function getAliasNameByAddress(address: string) {
  return walletController.getAlianName(address);
}

export function useCurrentAccount() {
  const [currentAccount, setCurrentAccount] = useAtom(currentAccountAtom);

  const fetchCurrentAccount = useCallback(() => {
    walletController.getCurrentAccount().then(async (account) => {
      let alianName = '';
      if (account?.address) {
        alianName = await getAliasNameByAddress(account.address);
      }
      setCurrentAccount((pre) => {
        return {
          ...pre,
          ...account,
          alianName,
        };
      });
    });
  }, [setCurrentAccount]);

  const switchAccount = useCallback(
    async (account: RabbyAccount | Account) => {
      await walletController.changeAccount(account);

      fetchCurrentAccount();
    },
    [fetchCurrentAccount]
  );

  useEffect(() => {
    fetchCurrentAccount();

    return window.rabbyDesktop.ipcRenderer.on(
      '__internal_push:rabbyx:session-broadcast-forward-to-main',
      (payload) => {
        switch (payload.event) {
          default:
            break;
          case 'unlock':
          case 'accountsChanged':
          case 'rabby:chainChanged': {
            fetchCurrentAccount();
          }
        }
      }
    );
  }, [fetchCurrentAccount]);

  return {
    switchAccount,
    fetchCurrentAccount,
    currentAccount,
  };
}

export function useAccounts() {
  const [accounts, setAccounts] = useAtom(accountsAtom);

  const fetchAccounts = useCallback(() => {
    walletController.getAccounts().then(async (newVal) => {
      const nextAccounts = await Promise.all(
        newVal.map(async (account) => {
          const alianName = await getAliasNameByAddress(account.address);
          return {
            ...account,
            alianName,
          };
        })
      );

      setAccounts(nextAccounts);
    });
  }, [setAccounts]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    fetchAccounts,
  };
}