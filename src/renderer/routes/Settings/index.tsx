import React from 'react';
import classNames from 'classnames';
import { openExternalUrl, requestResetApp } from '@/renderer/ipcRequest/app';

import { useAppVersion } from '@/renderer/hooks/useMainBridge';
import {
  IconChevronRight,
  IconLink,
  IconTooltipInfo,
} from '@/../assets/icons/mainwin-settings';

import { Modal, Switch, SwitchProps, Tooltip } from 'antd';
import { useSettings } from '@/renderer/hooks/useSettings';
import styles from './index.module.less';

type TypedProps = {
  name: React.ReactNode;
  className?: string;
  icon?: string;
  iconBase64?: string;
} & (
  | {
      type: 'text';
      text?: string;
    }
  | {
      type: 'action';
      onClick?: () => void;
    }
  | {
      type: 'switch';
      checked: SwitchProps['checked'];
      onChange?: SwitchProps['onChange'];
    }
  | {
      type: 'link';
      link: string;
      useChevron?: boolean;
    }
);

function ItemPartialLeft({ name, icon }: Pick<TypedProps, 'name' | 'icon'>) {
  return (
    <div className={styles.itemLeft}>
      {icon && <img className={styles.itemIcon} src={icon} />}
      <div className={styles.itemName}>{name}</div>
    </div>
  );
}

function ItemLink({
  children,
  useChevron = false,
  ...props
}: React.PropsWithChildren<Omit<TypedProps & { type: 'link' }, 'type'>>) {
  return (
    <div
      className={classNames(styles.typedItem, styles.pointer, props.className)}
      onClick={() => {
        openExternalUrl(props.link);
      }}
    >
      <ItemPartialLeft name={props.name} icon={props.icon} />
      <div className={styles.itemRight}>
        <div className={styles.itemArrow}>
          {useChevron ? <img src={IconChevronRight} /> : <img src={IconLink} />}
        </div>
      </div>
    </div>
  );
}

function ItemText({
  children,
  ...props
}: React.PropsWithChildren<Omit<TypedProps & { type: 'text' }, 'type'>>) {
  return (
    <div className={classNames(styles.typedItem, props.className)}>
      <ItemPartialLeft name={props.name} icon={props.icon} />
      <div className={styles.itemRight}>{props.text || children}</div>
    </div>
  );
}

function ItemAction({
  children,
  ...props
}: React.PropsWithChildren<Omit<TypedProps & { type: 'action' }, 'type'>>) {
  return (
    <div
      className={classNames(styles.typedItem, styles.pointer, props.className)}
      onClick={props.onClick}
    >
      <ItemPartialLeft name={props.name} icon={props.icon} />
      <div className={styles.itemRight}>{children}</div>
    </div>
  );
}

function ItemSwitch({
  children,
  ...props
}: React.PropsWithChildren<Omit<TypedProps & { type: 'switch' }, 'type'>>) {
  return (
    <div className={classNames(styles.typedItem, props.className)}>
      <ItemPartialLeft name={props.name} icon={props.icon} />
      <div className={styles.itemRight}>
        <Switch checked={props.checked} onChange={props.onChange} />
      </div>
    </div>
  );
}

export function MainWindowSettings() {
  const appVerison = useAppVersion();
  const { settings, toggleEnableContentProtection } = useSettings();

  return (
    <div className={styles.settingsPage}>
      {/* TODO: implement Update Area */}
      <div />

      <div className={styles.settingBlock}>
        <h4 className={styles.blockTitle}>Security</h4>
        <div className={styles.itemList}>
          <ItemSwitch
            checked={settings.enableContentProtected}
            name={
              <>
                <Tooltip
                  trigger="hover"
                  title="When Enabling this feature, Rabby App would be transparent on Screen Recording/Capturing."
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    Content Protection
                    <img
                      className={styles.nameTooltipIcon}
                      src={IconTooltipInfo}
                      style={{
                        position: 'relative',
                        top: 1,
                      }}
                    />
                  </span>
                </Tooltip>
              </>
            }
            icon="rabby-internal://assets/icons/mainwin-settings/content-protection.svg"
            onChange={(nextEnabled: boolean) => {
              Modal.confirm({
                title: 'Restart Confirmation',
                content: (
                  <>
                    It's required to restart Rabby App to apply this change.{' '}
                    <br />
                    Do you confirm to {nextEnabled ? 'enable' : 'disable'} it?
                  </>
                ),
                onOk: () => {
                  toggleEnableContentProtection(nextEnabled);
                },
              });
            }}
          />
        </div>
      </div>

      <div className={styles.settingBlock}>
        <h4 className={styles.blockTitle}>About</h4>
        <div className={styles.itemList}>
          <ItemText
            name="Version"
            text={appVerison || '-'}
            icon="rabby-internal://assets/icons/mainwin-settings/info.svg"
          />
          {/* <ItemLink name='User Agreement' /> */}
          <ItemLink
            name="Privacy Policy"
            link="https://rabby.io/docs/privacy/"
            icon="rabby-internal://assets/icons/mainwin-settings/privacy.svg"
            useChevron
          />
          <ItemLink
            name="Website"
            link="https://rabby.io/"
            icon="rabby-internal://assets/icons/mainwin-settings/homesite.svg"
          />
          <ItemLink
            name="Discord"
            link="https://discord.gg/seFBCWmUre"
            icon="rabby-internal://assets/icons/mainwin-settings/discord.svg"
          />
          <ItemLink
            name="Twitter"
            link="https://twitter.com/Rabby_io"
            icon="rabby-internal://assets/icons/mainwin-settings/twitter.svg"
          />
        </div>
      </div>

      <div className={styles.settingBlock}>
        <div className={styles.itemList}>
          <ItemAction
            name={<span className={styles.dangerText}>Reset App</span>}
            icon="rabby-internal://assets/icons/mainwin-settings/reset.svg"
            onClick={() => {
              requestResetApp();
            }}
          />
        </div>
      </div>
    </div>
  );
}