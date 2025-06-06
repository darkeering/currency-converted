### 使用的技术栈

- react
- react-i18next
- tailwandcss
- react
- lodash
- ant-design

### 如何运行和测试项目

npm install(yarn)

npm run dev(yarn dev)

### 实现了哪些功能和加分项（可打勾）

- 基础兑换功能
  - [x] 用户可以选择“源货币（From）”和“目标货币（To）”。
  - [x] 用户可以输入兑换金额
  - [x] 实时显示兑换结果。
- 反转货币对
  - [x] 一键反转“源货币”和“目标货币”。
- 兑换历史记录
  - [x] 支持在表格中查看历史兑换记录。
  - [x] 数据保存在`localStorage`中
- 界面与体验
  - [x] UI 设计简洁现代
  - [x] 支持响应式设计，适配移动端和桌面端
- 加分项
  - [x] 使用 TypeScript 开发
  - [x] 使用图表展示近 7 天汇率变动（折线图）
  - [x] 支持中英文切换（i18n）。
  - [x] 使用 Tailwind CSS 或其他 UI 库。
  - [ ] 使用测试框架（如 Vitest / Jest）编写 1~2 个简单测试。
  - [x] 汇率数据缓存，减少重复 API 请求。
