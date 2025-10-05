import { execSync } from 'child_process';
import { existsSync } from 'fs';

const distDir = 'dist';

// 检查 dist 目录是否存在
if (!existsSync(distDir)) {
  console.error('错误: dist 目录不存在，请先运行 npm run build');
  process.exit(1);
}

try {
  console.log('开始部署到 Gitee Pages...');

  // 进入 dist 目录
  process.chdir(distDir);

  // 初始化 git 仓库
  execSync('git init', { stdio: 'inherit' });

  // 添加所有文件
  execSync('git add -A', { stdio: 'inherit' });

  // 提交
  execSync('git commit -m "deploy to gitee pages"', { stdio: 'inherit' });

  // 配置 git 以解决大文件推送问题
  execSync('git config http.postBuffer 524288000', { stdio: 'inherit' });
  execSync('git config http.lowSpeedLimit 0', { stdio: 'inherit' });
  execSync('git config http.lowSpeedTime 999999', { stdio: 'inherit' });

  // 推送到 gitee-pages 分支
  execSync('git push -f https://gitee.com/tang-you-org/badminton-scorekeeper.git master:gitee-pages', { stdio: 'inherit' });

  console.log('部署成功！');
  console.log('请在 Gitee 仓库设置中启用 Pages 服务，选择 gitee-pages 分支');

} catch (error) {
  console.error('部署失败:', error.message);
  process.exit(1);
}
