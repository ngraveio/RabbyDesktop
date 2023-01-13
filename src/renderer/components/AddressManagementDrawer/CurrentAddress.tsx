import { IDisplayedAccountWithBalance } from '@/renderer/hooks/rabbyx/useAccountToDisplay';
import { useWhitelist } from '@/renderer/hooks/rabbyx/useWhitelist';
import { ellipsis, isSameAddress } from '@/renderer/utils/address';
import {
  KEYRINGS_LOGOS,
  KEYRING_TYPE_TEXT,
  WALLET_BRAND_CONTENT,
  WALLET_BRAND_TYPES,
} from '@/renderer/utils/constant';
import { splitNumberByStep } from '@/renderer/utils/number';
import { Tooltip } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { useCopyToClipboard } from 'react-use';
import styles from './AddressManagementDrawer.module.less';

interface Props {
  account: IDisplayedAccountWithBalance;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

export const CurrentAccount: React.FC<Props> = ({ account, onClick }) => {
  const { whitelist, enable } = useWhitelist();
  const brandName = account.brandName as WALLET_BRAND_TYPES;

  const isInWhitelist = React.useMemo(() => {
    return enable && whitelist.some((e) => isSameAddress(e, account.address));
  }, [enable, whitelist, account.address]);

  const formatAddressTooltip = React.useMemo(() => {
    if (KEYRING_TYPE_TEXT[account.type]) {
      return KEYRING_TYPE_TEXT[account.type];
    }
    if (WALLET_BRAND_CONTENT[brandName]) {
      return WALLET_BRAND_CONTENT[brandName].name;
    }
    return '';
  }, [account.type, brandName]);

  const addressTypeIcon = React.useMemo(
    () =>
      WALLET_BRAND_CONTENT?.[account.brandName as WALLET_BRAND_TYPES]?.image ||
      KEYRINGS_LOGOS[account.type],
    [account]
  );
  const [, copyToClipboard] = useCopyToClipboard();

  const onCopy = React.useCallback(() => {
    copyToClipboard(account.address);
  }, [account.address, copyToClipboard]);

  return (
    <section onClick={onClick} className={styles.CurrentAccount}>
      <div className={styles.logo}>
        <img src={addressTypeIcon} alt={account.brandName} />
      </div>
      <div className={styles.content}>
        <div className={clsx(styles.part, styles.partName)}>
          <div className={styles.name}>{account.alianName}</div>
          {/* <div className={styles.index}>#2</div> */}
          {isInWhitelist && (
            <Tooltip
              overlayClassName="rectangle"
              placement="top"
              title="Whitelisted address"
            >
              <div className={styles.whitelist}>
                <img src="rabby-internal://assets/icons/address-management/whitelist.svg" />
              </div>
            </Tooltip>
          )}
        </div>
        <div className={clsx(styles.part, styles.partAddress)}>
          <div title={formatAddressTooltip} className={styles.address}>
            {ellipsis(account.address)}
          </div>
          <div onClick={onCopy} className={clsx(styles.copy, styles.icon)}>
            <img src="rabby-internal://assets/icons/address-management/copy-white.svg" />
          </div>
        </div>
      </div>
      <div className={styles.balance}>
        ${splitNumberByStep(account.balance?.toFixed(2))}
      </div>
      <div className={styles.action}>
        <img
          className={styles.arrow}
          src="rabby-internal://assets/icons/address-management/arrow-right-white.svg"
        />
      </div>
    </section>
  );
};