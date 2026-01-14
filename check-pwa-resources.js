#!/usr/bin/env node

/**
 * 检查PWA相关资源是否都存在
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, 'public');

// 必需的资源文件
const requiredResources = [
  {
    path: 'pwa-192x192.png',
    name: 'PWA图标 192x192',
    required: true,
    expectedSize: { min: 192, max: 192 }
  },
  {
    path: 'pwa-512x512.png',
    name: 'PWA图标 512x512',
    required: true,
    expectedSize: { min: 512, max: 512 }
  },
  {
    path: 'pwa-icon.svg',
    name: 'PWA矢量图标',
    required: false
  },
  {
    path: 'favicon.ico',
    name: 'Favicon',
    required: false
  },
  {
    path: 'apple-touch-icon.png',
    name: 'Apple Touch图标',
    required: false
  },
  {
    path: 'mask-icon.svg',
    name: 'Safari Mask图标',
    required: false
  }
];

// Screenshots
const screenshots = [
  { path: 'screenshots/home.png', name: '首页截图' },
  { path: 'screenshots/market.png', name: '行情截图' },
  { path: 'screenshots/trade.png', name: '交易截图' },
  { path: 'screenshots/assets.png', name: '资产截图' }
];

function checkFileExists(filePath) {
  const fullPath = path.join(PUBLIC_DIR, filePath);
  return fs.existsSync(fullPath);
}

function getFileInfo(filePath) {
  const fullPath = path.join(PUBLIC_DIR, filePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const stats = fs.statSync(fullPath);
  return {
    size: (stats.size / 1024).toFixed(2) + ' KB',
    sizeBytes: stats.size
  };
}

async function checkImageDimensions(filePath) {
  const fullPath = path.join(PUBLIC_DIR, filePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  try {
    const sizeOf = require('image-size');
    const dimensions = sizeOf(fullPath);
    return dimensions;
  } catch (error) {
    return null;
  }
}

console.log('🔍 检查PWA资源文件...\n');
console.log('=' .repeat(70));

let hasErrors = false;
let hasWarnings = false;

// 检查必需资源
console.log('\n📦 必需资源文件:\n');

for (const resource of requiredResources) {
  const exists = checkFileExists(resource.path);
  const info = getFileInfo(resource.path);

  if (exists) {
    console.log(`✅ ${resource.name}`);
    console.log(`   路径: ${resource.path}`);
    if (info) {
      console.log(`   大小: ${info.size}`);
    }

    // 检查图片尺寸
    if (resource.path.endsWith('.png')) {
      try {
        const sizeOf = require('image-size');
        const dimensions = sizeOf(path.join(PUBLIC_DIR, resource.path));
        console.log(`   尺寸: ${dimensions.width}x${dimensions.height}`);

        if (resource.expectedSize) {
          if (dimensions.width !== resource.expectedSize.min || 
              dimensions.height !== resource.expectedSize.max) {
            console.log(`   ⚠️  警告: 尺寸不匹配，期望 ${resource.expectedSize.min}x${resource.expectedSize.max}`);
            hasWarnings = true;
          }
        }
      } catch (error) {
        console.log(`   ⚠️  无法读取图片尺寸`);
      }
    }

    console.log('');
  } else {
    if (resource.required) {
      console.log(`❌ ${resource.name}`);
      console.log(`   路径: ${resource.path}`);
      console.log(`   状态: 文件不存在（必需）\n`);
      hasErrors = true;
    } else {
      console.log(`⚠️  ${resource.name}`);
      console.log(`   路径: ${resource.path}`);
      console.log(`   状态: 文件不存在（可选）\n`);
      hasWarnings = true;
    }
  }
}

// 检查截图
console.log('📸 截图文件:\n');

let allScreenshotsExist = true;
for (const screenshot of screenshots) {
  const exists = checkFileExists(screenshot.path);
  const info = getFileInfo(screenshot.path);

  if (exists) {
    console.log(`✅ ${screenshot.name}`);
    console.log(`   路径: ${screenshot.path}`);
    if (info) {
      console.log(`   大小: ${info.size}`);
    }

    // 检查图片尺寸
    try {
      const sizeOf = require('image-size');
      const dimensions = sizeOf(path.join(PUBLIC_DIR, screenshot.path));
      console.log(`   尺寸: ${dimensions.width}x${dimensions.height}`);

      // 检查推荐尺寸（9:16比例）
      const ratio = dimensions.width / dimensions.height;
      const expectedRatio = 9 / 16;
      if (Math.abs(ratio - expectedRatio) > 0.01) {
        console.log(`   ⚠️  警告: 宽高比不是9:16，当前为 ${ratio.toFixed(2)}`);
        hasWarnings = true;
      }
    } catch (error) {
      console.log(`   ⚠️  无法读取图片尺寸`);
    }

    console.log('');
  } else {
    console.log(`❌ ${screenshot.name}`);
    console.log(`   路径: ${screenshot.path}`);
    console.log(`   状态: 文件不存在\n`);
    allScreenshotsExist = false;
    hasWarnings = true;
  }
}

// 总结
console.log('=' .repeat(70));
console.log('\n📊 检查结果:\n');

if (hasErrors) {
  console.log('❌ 发现错误: 有必需的资源文件缺失');
  console.log('   请确保所有必需文件都已创建\n');
}

if (hasWarnings && !allScreenshotsExist) {
  console.log('⚠️  警告: 截图文件缺失');
  console.log('   运行以下命令生成截图:');
  console.log('   1. npm run dev  (启动开发服务器)');
  console.log('   2. node generate-screenshots.js  (生成截图)\n');
}

if (!hasErrors && !hasWarnings) {
  console.log('✅ 所有PWA资源文件完整！\n');
  console.log('🎉 你的PWA配置完美！');
} else if (!hasErrors) {
  console.log('✅ 必需的PWA资源文件完整');
  console.log('💡 建议补充可选资源以获得更好的体验\n');
}

console.log('');
process.exit(hasErrors ? 1 : 0);
