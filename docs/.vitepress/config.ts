import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "tyoi-server",
  description: "Small local API and static file server framework built with Express and TypeScript.",
  base: '/tyoi-api-node-server/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '使用例', link: '/usage' }
    ],

    sidebar: [
      {
        text: '説明',
        items: [
          { text: 'cli コマンドについて', link: '/cli' },
          { text: 'config ファイル設定', link: '/config' },
          { text: '使用例', link: '/usage' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/donneko/tyoi-api-node-server' }
    ]
  }
})
