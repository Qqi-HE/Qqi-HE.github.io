# 何其锜的个人主页

内容、样式和交互已经分开。GitHub Pages 使用自带的 Jekyll，将各个板块自动合成网页。

## 修改文字

只需要编辑下列文件；提交到 main 后，GitHub Pages 会自动更新，无需手动复制到三个主页。

| 要修改的内容 | 文件 |
| --- | --- |
| 姓名、头像、自我介绍 | [_includes/sections/about.html](_includes/sections/about.html) |
| 动态 | [_includes/sections/updates.html](_includes/sections/updates.html) |
| 论文、专利、演讲 | [_includes/sections/publications.html](_includes/sections/publications.html) |
| 音乐介绍、乐队、演出记录 | [_includes/sections/music.html](_includes/sections/music.html) |
| 联系方式 | [_includes/sections/contact.html](_includes/sections/contact.html) |
| 碎碎念 | [_includes/sections/notes.html](_includes/sections/notes.html) |

- data-lang="cn" 内是中文，data-lang="en" 内是英文。语言切换共用同一组内容。
- 改现有文字时，只替换标签之间的文字，保留标签和属性。
- 论文、演出和碎碎念各用一个 li。新增一条时可复制相邻的一条。
- 论文中的 b 或 strong 标签表示加粗姓名。
- 碎碎念最新一条放在列表最前，用 br 标签换行。
- 链接地址在 href="..." 内。文字中的 & 写成 &amp;amp;，小于号写成 &amp;lt;。

## 其他文件

- assets/site.css：字号、间距和页面布局。
- assets/site.js：语言切换、锚点滚动和减速动画。
- _includes/header.html、_includes/footer.html：导航和页脚。
- _layouts/home.html：页面骨架，通过 include 引用各个板块。
- index.html、cn/index.html、en/index.html：语言和资源路径设置，不需要改正文。
- images/author.png、images/favicon.ico：头像和网站图标。
- cn/、en/ 中其余 HTML：旧链接兼容入口。

## 本地预览（可选）

不需要安装额外 Python 依赖：

    python3 scripts/render_preview.py
    python3 -m http.server 8000 --directory _preview

在浏览器打开 http://localhost:8000/。修改内容后重新运行第一条命令即可。

这个脚本只渲染本项目使用的简单模板语法；线上仍由 GitHub Pages 的 Jekyll 构建。
