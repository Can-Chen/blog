---
title: "patch-package：优雅修复第三方依赖的方案"
date: "2025-12-05"
excerpt: "当第三方依赖出现bug时，无需等待官方修复。patch-package让你能够快速打补丁，确保项目稳定运行，同时保持代码的可维护性。"
readTime: "5分钟阅读"
---

## 背景

在使用 ice.js 3.x 脚手架开发项目时，遇到了一个路由生成的问题：当项目采用 page router 模式且存在复杂的文件嵌套结构时，自动生成的组件路由会出现覆盖问题。

**问题：** ice.js 的路由生成逻辑在拼接路由地址时，没有完整地包含文件路径和文件名，而是只截取了部分路径，导致不同层级的文件生成了相同的路由，造成路由冲突和覆盖。

**解决方案：** 需要修改 ice.js 源码中的路由生成规则代码来修复这个问题。官方尚未发布补丁修复，只能通过修改 `node_modules` 中的源码来解决。但直接修改 `node_modules` 存在明显问题：每次重新安装依赖时修改都会丢失。

**最佳实践：** 使用 `patch-package` 工具来管理对第三方依赖的修改，既能快速修复问题，又能保证修改的持久化和可维护性。

## patch-package 的优势

### 与其他解决方案对比

#### 1. **直接修改 node_modules**
- 每次 `npm install` 后修改都会丢失
- 无法追踪修改内容，团队成员无法同步
- CI/CD 环境中无法保证修改生效

#### 2. **Fork 仓库并发布私有包**
- 需要维护自己的 npm 包，增加维护成本
- 需要处理版本管理和更新同步问题
- 官方更新时需要手动合并，容易产生冲突

#### 3. **使用 patch-package**
- 修改持久化，不会因重新安装而丢失
- 补丁文件可版本控制，团队协作方便
- 补丁文件清晰展示修改内容，易于审查
- 自动在 `postinstall` 时应用，无需手动操作
- 轻量级，无需维护额外的包
- 官方更新后，补丁会自动尝试应用（如果代码结构未大变）

### 适用场景

- 第三方依赖存在 bug，但官方尚未修复
- 需要临时修改第三方依赖以满足项目需求
- 不想 fork 仓库或维护私有包
- 需要快速修复并保证团队环境一致性

## 完整使用指南

### 第一步：安装 patch-package

在项目中安装 `patch-package` 作为开发依赖：

```bash
npm install patch-package postinstall-postinstall --save-dev
```

**说明：** `postinstall-postinstall` 用于确保 `postinstall` 脚本在每次安装依赖时都能正确执行。

### 第二步：配置 postinstall 脚本

在 `package.json` 的 `scripts` 中添加 `postinstall` 脚本：

```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

### 第三步：定位并修改源码

1. **找到需要修改的包和源码：**
   - 在 `node_modules` 目录下找到目标包
   - 例如：`node_modules/@ice/lib/route-manifest/esm/routes.js`

2. **测试修改效果：**
   - 需要重启开发服务器

### 第四步：生成补丁文件

运行以下命令生成补丁文件：

```bash
npx patch-package <package-name>
```

例如：

```bash
npx patch-package @ice/route-manifest
```

**执行结果：**
- 会在项目根目录创建 `patches` 文件夹（如果不存在）
- 在 `patches` 文件夹中生成补丁文件，格式为：`<package-name>+<version>.patch`
- 例如：`patches/@ice+route-manifest+1.3.0.patch`

### 第五步：验证补丁文件

1. **查看补丁文件：**
   ```bash
   cat patches/@ice+route-manifest+1.3.0.patch
   ```

2. **删除 node_modules 并重新安装：**
   ```bash
   rm -rf node_modules
   yarn add
   ```

3. **验证补丁是否自动应用：**
   - 检查 `node_modules` 中的文件是否已包含你的修改
   - 运行项目验证功能是否正常

### 第六步：提交到Git

将 `patches` 文件夹提交到 Git：

**重要：** 必须将 `patches` 文件夹纳入版本控制，这样团队成员在克隆项目后，运行 `npm i` 时会自动应用补丁。

### 第七步：团队协作

团队成员clone项目后：运行 `npm install`，`postinstall` 脚本会自动执行 `patch-package`，补丁会自动应用到 `node_modules` 中。

### 常见问题处理

#### 1. 补丁应用失败

如果补丁应用失败，可能的原因：
- 包的版本发生了变化
- 官方更新了相关代码，导致补丁失效

**解决方法：**
- 检查补丁文件是否与当前版本匹配
- 如果版本不匹配，需要重新生成补丁：
  ```bash
  # 重新修改 node_modules 中的代码
  # 然后重新生成补丁
  npx patch-package <package-name>
  ```

## 包管理器内置的 Patch 功能

值得一提的是，**Yarn 最新版（Yarn 2+）** 和 **pnpm** 都内置了 patch 功能，无需安装 `patch-package` 即可使用。

### pnpm 内置 Patch 功能

pnpm 同样提供了内置的 patch 功能，使用方式与 Yarn 类似：

1. **提取包到临时目录：**
   ```bash
   pnpm patch <package-name>@<version>
   ```
   例如：
   ```bash
   pnpm patch lodash@4.17.21
   ```
   执行后会输出临时目录路径，例如：`/node_modules/.pnpm_patches/lodash@4.17.21`

2. **修改临时目录中的代码：**

3. **提交补丁：**
   ```bash
   pnpm patch-commit <临时目录路径>
   ```
   例如：
   ```bash
   pnpm patch-commit ./node_modules/.pnpm_patches/lodash@4.17.21
   ```

4. **自动应用补丁：**
   - pnpm 会在 `pnpm-lock.yaml` 中添加 `patchedDependencies` 字段来记录补丁
   - 补丁文件会保存在 `patches` 目录中
   - 每次运行 `pnpm install` 时会自动应用补丁


