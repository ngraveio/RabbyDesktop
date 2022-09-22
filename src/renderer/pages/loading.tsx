/// <reference path="../preload.d.ts" />

import { createRoot } from 'react-dom/client';
import '../css/style.less';

import { Progress } from 'antd';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import './loading.less';
import { DappFavicon } from '../components/DappFavicon';

export default function App() {
  const [percent, setPercent] = React.useState(10);
  const [dapp, setDapp] = React.useState<IDapp | null>(
    (window as any).dapp || null
  );

  console.log((window as any).dapp);
  const ref = useRef<any>(null);

  useEffect(() => {
    ref.current = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      setPercent((percent) => {
        if (percent > 98) {
          clearInterval(ref.current);
          return 98;
        }
        if (percent > 80) {
          return percent + 0.5;
        }
        return percent + Math.random() * 10;
      });
    }, 500);
  }, []);

  useLayoutEffect(() => {
    window.rabbyDesktop.ipcRenderer.on('did-finish-load' as any, () => {
      setPercent(100);
      clearInterval(ref.current);
    });
    window.rabbyDesktop.ipcRenderer.on('load-dapp' as any, (dapp: IDapp) => {
      console.log('???');
      setDapp(dapp);
    });
  }, []);

  return (
    <div className={`page-loading ${percent >= 100 ? 'hide' : ''}`}>
      <Progress
        percent={percent}
        status="active"
        showInfo={false}
        size="small"
        strokeLinecap="butt"
        strokeColor="#8697FF"
        strokeWidth={4}
      />
      <div className="container">
        <div className="content">
          {dapp ? (
            <DappFavicon
              src={dapp.faviconBase64 || dapp.faviconUrl}
              origin={dapp.origin}
              className="logo"
              alt=""
            />
          ) : null}
          <div className="text">Loading ...</div>
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);