const { description } = require("../../package");
var path = require("path");

module.exports = {
  // 部署站点的基础路径
  base: "/blog/",
  // 网站标题
  title: "小星星",
  // 网站描述
  description: description,
  // 网站header头部信息
  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" }
    ]
  ],
  // 默认主题配置
  themeConfig: {
    // logo，网站logo地址
    logo: "",
    // 导航栏
    nav: [
      {
        text: "博客",
        link: "/blog/"
      },
      {
        text: "关于我",
        link: "/about/"
      },
      {
        text: "github",
        link: "https://github.com/xiangkun123"
      }
    ],
    // 左侧栏
    sidebar: {
      "/blog/": [
        {
          title: "博客",
          collapsable: false,
          children: ["", "using-md", "flex", "you-not-know-js"]
        }
      ],
      "/about/": [
        {
          title: "关于",
          collapsable: false
        }
      ]
    }
  },
  // 配置路径别名
  configureWebpack: {
    resolve: {
      alias: {
        "@alias": path.resolve(__dirname, "..")
      }
    }
  },
  // 对markdown的配置
  markdown: {
    lineNumbers: true
  },
  // 使用插件
  plugins: ["@vuepress/plugin-back-to-top", "@vuepress/plugin-medium-zoom"]
};
