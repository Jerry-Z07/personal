/**
 * 格式化大数字显示
 * @param {number} count - 要格式化的数字
 * @param {function} t - i18next翻译函数
 * @returns {string} 格式化后的字符串
 */
export const formatLargeNumber = (count, t) => {
  // 获取单位，如果没有提供翻译函数则默认为"万"
  const unit = t ? t('common.units.hundredThousand', '万') : '万';
  
  // 根据单位选择不同的除数和阈值
  if (unit === '万') {
    // 中文环境：10000以上显示为x.xx万
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}${unit}`;
    }
  } else if (unit === 'M') {
    // 英文环境：根据数字大小选择不同单位
    if (count >= 1000000) {
      // 百万级别显示为x.xxM
      return `${(count / 1000000).toFixed(1)}${unit}`;
    } else if (count >= 1000) {
      // 千级别显示为x.xxK
      return `${(count / 1000).toFixed(1)}K`;
    }
  }
  
  // 默认返回原始数字字符串
  return count.toString();
};