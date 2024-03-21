import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";
import recoTheme from "vuepress-theme-reco";

export default defineUserConfig({
  title: "xdd-blog",
  description: "Just playing around",
  theme: recoTheme({
    style: "@vuepress-reco/style-default",
    logo: "/logo.png",
    author: "xdd",
    authorAvatar: "/avatar.png",
    // docsRepo: "https://github.com/vuepress-reco/vuepress-theme-reco-next",
    docsBranch: "main",
    docsDir: "example",
    lastUpdatedText: "最近更新",
    autoSetSeries: true,
    // series 为原 sidebar
    series: {
      "/docs/theme-reco/": [
        {
          text: "知识点总结",
          children: ["info-mation", "short-message", "desgin-pattern", "data-structure", "learn-notes", "axios", "cli", "dayjs", "inquirer", "js", "nginx"]
        },
      ],
      "/records/algorithm/": [
        {
          text: "react",
          children: ['react-source', "react-hook"]
        }
      ]
    },
    navbar: [
      {
        "text": "学习文档",
        children: [
          {
            "text": "文档学习",
            "link": "/docs/theme-reco/info-mation"
          },
          {
            "text": "React源码解析",
            "link": "/records/algorithm/react-source"
          },
        ]
      }
    ],
  }),
});
