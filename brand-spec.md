# Agent 架构师大赛 · 品牌与资产规范（v6）

## 项目定位

- 名称：Agent 架构师大赛
- 发起机构：长江商学院数字化转型研究中心
- 首要合作方：润泽科技
- 受众：合作高校本科生、硕士生、博士生
- 视觉语言：暖白机构编辑设计 × AI 架构蓝图 × 技术网格 × 高信息可读性
- 设计模式：Redesign · Preserve
- 视觉实验性：5 / 10
- 动画强度：6 / 10
- 信息密度：7 / 10
- 资产依赖：9 / 10
- 品牌保真：9 / 10

## 设计决策

- 颜色：`#F7F6F1` 暖白主背景、`#17171D` 主文字、`#3157C8` 统一品牌蓝。浅蓝只作为背景层级，按钮、滚动动画、章节强调和单色 Logo 全部使用同一品牌蓝。
- 字体：主 Logo 承担品牌展示；标题采用窄体中文字体栈，正文优先等宽字体栈。
- 网格：桌面双层网格；内容区以左侧章节轨道组织 01—07，移动端转换为顶部章节条。
- 动效：桌面与手机分别使用专属 KV，并在页面中转换为统一蓝色调；每个 Section 配置一张不同的 AI 架构蓝图，随滚动依次绘制连线、节点、模块与数据包。正文、表格和 Logo 保持稳定，所有动效支持环境动画开关与 `prefers-reduced-motion`。
- 无障碍：所有动效响应 `prefers-reduced-motion`，交互控件保留键盘焦点，页面提供跳转主内容链接。

## 主品牌资产

- `assets/brand/mark.png`：用户提供的赛事图形标。
- `assets/brand/lockup.png`：用户提供的横版赛事组合 Logo。
- `assets/brand/kv-architect-field-v4.png`：桌面端蓝青 AI 架构主 KV，左侧保留赛事标题安全区。
- `assets/brand/kv-architect-field-mobile-v4.png`：手机端专属纵向主 KV，顶部保留品牌与按钮安全区。
- `assets/brand/kv-spectrum-field-v3.png`、`assets/brand/kv-spectrum-field-mobile-v3.png`：上一版多彩主 KV，作为回退资产保留。
- `assets/brand/kv-infinite-field.png`：上一版黑白主 KV，作为回退资产保留。
- `assets/brand/ckgsb-mobile-logo.png`：长江商学院官网公开 Logo，页面以原透明轮廓作为品牌蓝蒙版显示。
- `assets/brand/ckgsb-logo.png`：长江商学院官网公开的标准 Logo 备用资产。

## 企业品牌资产

- `range-logo.png`：润泽科技官网公开 Logo；首屏以“首要合作方”最高层级展示。
- `vipshop-logo.png`：唯品会官网公开 Logo。
- `transfar-logo.png`：传化集团官网公开 Logo。
- `sunshine-logo.png`：阳光保险官网公开 Logo。
- `neolix-logo.svg`：新石器无人车官网公开矢量 Logo，页面版本统一为赛事品牌蓝。

源文件保持原始比例。原本具有官方品牌色的企业与院校 Logo 继续保留；赛事图形标、长江商学院、新石器与浙江大学原单色资产统一使用赛事品牌蓝，减少整页黑白块与多色竞争。

## 支持院校资产

支持院校名单按当前赛事口径更新为 7 所，Logo 均来自学校官网或官方视觉规范页面：

- `assets/schools/cuhk-logo.png`：香港中文大学；官方物理系站点公开的透明彩色校徽。
- `assets/schools/cuhksz-logo.png`：香港中文大学（深圳）；官网透明中英文组合标。
- `assets/schools/ustc-logo.png`：中国科学技术大学；官网透明中英文组合标。
- `assets/schools/tsinghua-logo.png`：清华大学；官方视觉识别页校徽，仅去除原图白底并裁切。
- `assets/schools/pku-logo.png`：北京大学；官方标识管理办公室下载包中的透明彩色校徽。
- `assets/schools/nju-logo.png`：南京大学；官网品牌标识页透明紫色组合标。
- `assets/schools/zju-logo.svg`：浙江大学；官网使用的透明矢量组合标，页面版本统一为赛事品牌蓝。

官方来源：

- 香港中文大学：https://wp.phy.cuhk.edu.hk/wp-content/assets/images/cuhk_logo.png
- 香港中文大学（深圳）：https://www.cuhk.edu.cn/sites/webmaster.prod1.dpsite04.cuhk.edu.cn/files/zh-hans_logo.png
- 中国科学技术大学：https://www.ustc.edu.cn/images/zkdlogo.png
- 清华大学：https://vi.tsinghua.edu.cn/gk/xxbz/xh.htm
- 北京大学：https://vim.pku.edu.cn/xzzq/index.htm
- 南京大学：https://www.nju.edu.cn/ndgk/ndbs.htm
- 浙江大学：https://www.zju.edu.cn/572/main.htm

## 信息结构

1. 大赛介绍：只呈现四个核心价值——AI Native、无限算力支持、解决企业真实问题、交付可运行产品。
2. 奖项激励：9 个综合奖项，基础奖金池 75,000 元；一等奖 1 个（20,000 元或 Offer 直通卡）、二等奖 3 个（每个 10,000 元或终面直通卡）、三等奖 5 个（每个 5,000 元或面试直通卡）。页面保留精简对照表，详细适用规则由正式赛事文件承载。
3. 算力无限：无限 Token Access、128 张 A100 GPU 集群。
4. 赛事安排：初赛、半决赛、决赛分别说明本阶段具体任务与交付成果。
5. 企业案例：用四步流程说明真实业务命题的推进方式；以“物流异常订单处置需求”展示当前问题、企业可提供、期待结果和一次完整任务的五步执行链路。
6. 如何组队：集中说明合作高校在校生的两种参赛形式——1 人独立参赛或 3 人组队参赛。
7. 支持网络：发起机构、首要合作方、支持院校与支持企业。

## 报名数据状态

本网站就是报名入口，不跳转到外部报名页。当前原型只将草稿保存在访问者本机浏览器，不向服务器发送数据。正式上线前仍需配置数据接收端点、隐私说明、访问控制和报名成功回执。
