// We do this because @types/prismjs is for some reason defining it as ESM,
//   despite prismjs not exporting ESM.

declare global {
  var Prism: any
}

export {};
