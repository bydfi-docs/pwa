#!/usr/bin/env node

/**
 * 自动生成PWA截图预览
 * 使用Puppeteer在headless模式下截取各个页面
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, 'public', 'screenshots');
const DEV_SERVER = 'http://localhost:5173';
const VIEWPORT = { width: 540, height: 960 };

const pages = [
  { path: '/', name: 'home', label: '首页 - 市场行情' },
  { path: '/market', name: 'market', label: '行情 - 实时数据' },
  { path: '/trade', name: 'trade', label: '交易 - 快捷买卖' },
  { path: '/assets', name: 'assets', label: '资产 - 数字钱包' },
];

async function generateScreenshots() {
  console.log('🚀 开始生成PWA截图...\n');

  // 确保目录存在
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    console.log('✅ 创建截图目录:', SCREENSHOTS_DIR);
  }

  let browser;
  try {
    console.log('📱 启动浏览器...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    console.log(`📐 设置视口: ${VIEWPORT.width}x${VIEWPORT.height}\n`);

    for (const pageInfo of pages) {
      const url = `${DEV_SERVER}${pageInfo.path}`;
      const outputPath = path.join(SCREENSHOTS_DIR, `${pageInfo.name}.png`);

      console.log(`📸 截取页面: ${pageInfo.label}`);
      console.log(`   URL: ${url}`);

      try {
        await page.goto(url, { 
          waitUntil: 'networkidle0',
          timeout: 30000 
        });

        // 等待页面完全加载和动画完成
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 截图
        await page.screenshot({
          path: outputPath,
          fullPage: false,
        });

        const stats = fs.statSync(outputPath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`   ✅ 保存成功: ${pageInfo.name}.png (${sizeKB} KB)\n`);

      } catch (error) {
        console.error(`   ❌ 截取失败: ${error.message}\n`);
      }
    }

    console.log('🎉 所有截图生成完成！');
    console.log(`📁 输出目录: ${SCREENSHOTS_DIR}\n`);

  } catch (error) {
    console.error('❌ 发生错误:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 检查开发服务器是否运行
async function checkDevServer() {
  try {
    const response = await fetch(DEV_SERVER);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// 主函数
(async () => {
  console.log('🔍 检查开发服务器...');
  const serverRunning = await checkDevServer();

  if (!serverRunning) {
    console.error('❌ 开发服务器未运行！');
    console.error('请先运行: npm run dev\n');
    process.exit(1);
  }

  console.log('✅ 开发服务器正在运行\n');
  await generateScreenshots();
})();
