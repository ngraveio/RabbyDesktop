const MINIO_TEST = process.env.MINIO_TEST === 'true'

module.exports = {
  "productName": "Rabby Wallet",
  "appId": "com.debank.RabbyDesktop",
  "asar": true,
  "asarUnpack": "**\\*.{node,dll}",
  "copyright": "Copyright © 2022 rabby.io",
  "files": [
    "dist",
    "node_modules",
    "package.json"
  ],
  "afterSign": ".erb/scripts/notarize.js",
  "mac": {
    "identity": process.env.RABBY_APPLE_IDENTITY_NAME,
    "target": {
      "target": "default",
      "arch": [
        "arm64",
        "x64"
      ]
    },
    "type": "distribution",
    "hardenedRuntime": true,
    "entitlements": "assets/entitlements.mac.plist",
    "entitlementsInherit": "assets/entitlements.mac.plist",
    "gatekeeperAssess": false
  },
  "dmg": {
    "artifactName": "rabby-wallet-desktop-installer-${arch}-${version}.${ext}",
    "contents": [
      {
        "x": 130,
        "y": 220
      },
      {
        "x": 410,
        "y": 220,
        "type": "link",
        "path": "/Applications"
      }
    ]
  },
  "win": {
    "target": [
      "nsis"
    ]
  },
  "nsis": {
    "artifactName": "rabby-wallet-desktop-installer-${arch}-${version}.${ext}",
    "uninstallDisplayName": "${productName}",
    "deleteAppDataOnUninstall": true,
  },
  "linux": {
    "target": [
      "AppImage"
    ],
    "category": "Development"
  },
  "directories": {
    "app": "release/app",
    "buildResources": "assets",
    "output": "release/build"
  },
  "extraResources": [
    "./assets/**"
  ],
  "publish": [
    {
      "provider": "generic",
      // pointless now
      "url": `https://download.rabby.io/wallet-desktop/${process.platform === 'win32' ? 'win32' : 'mac'}/`,
    },
  ]
}