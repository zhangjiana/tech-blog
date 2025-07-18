import { Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">前端架构师</h3>
            <p className="text-gray-600">
              专注于大型前端项目的架构设计与工程实践，分享真实的开发经验和技术洞察。
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">技术领域</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-600">React 生态系统</span></li>
              <li><span className="text-gray-600">Vue 全栈开发</span></li>
              <li><span className="text-gray-600">前端工程化</span></li>
              <li><span className="text-gray-600">微前端架构</span></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">联系方式</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © 2025 By Next.js 构建 专注技术分享
          </p>
        </div>
      </div>
    </footer>
  );
} 