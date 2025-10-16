/**
 * 自动生成sitemap.xml的工具
 * 运行: node generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 配置选项
const config = {
    baseUrl: 'https://www.078465.xyz',
    pages: [
        { path: '/', priority: '1.0', changefreq: 'monthly' },
        { path: '/clock.html', priority: '0.8', changefreq: 'monthly' }
    ],
    outputFile: 'sitemap.xml'
};

/**
 * 获取当前日期（YYYY-MM-DD格式）
 */
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 生成sitemap XML内容
 */
function generateSitemap() {
    const lastmod = getCurrentDate();
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    config.pages.forEach(page => {
        xml += '    <url>\n';
        xml += `        <loc>${config.baseUrl}${page.path}</loc>\n`;
        xml += `        <lastmod>${lastmod}</lastmod>\n`;
        xml += `        <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `        <priority>${page.priority}</priority>\n`;
        xml += '    </url>\n';
    });
    
    xml += '</urlset>';
    return xml;
}

/**
 * 主函数
 */
function main() {
    try {
        const sitemapContent = generateSitemap();
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const outputPath = path.join(__dirname, config.outputFile);
        
        fs.writeFileSync(outputPath, sitemapContent, 'utf8');
        console.log(`✅ Sitemap生成成功: ${outputPath}`);
        console.log(`📄 包含页面数量: ${config.pages.length}`);
        console.log(`🔄 最后修改日期: ${getCurrentDate()}`);
        
        // 显示生成的内容预览
        console.log('\n📋 生成的sitemap内容预览:');
        console.log(sitemapContent.split('\n').slice(0, 10).join('\n') + '\n...');
        
    } catch (error) {
        console.error('❌ 生成sitemap失败:', error.message);
        process.exit(1);
    }
}

// 执行主函数
main();

export { generateSitemap, getCurrentDate, config };