import { Github, Twitter, Mail, Calendar, MapPin, Code } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
          <div className="text-center">
            <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
              <Code className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">前端架构师</h1>
            <p className="text-blue-100 text-lg">
              9年前端开发经验 | 大型ToB项目架构专家
            </p>
          </div>
        </div>

        <div className="px-8 py-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">关于我</h2>
              <p className="text-gray-600 mb-4">
                我是一名拥有9年前端开发经验的架构师，专注于大型ToB项目的前端架构设计与工程实践。
                从jQuery时代到现代前端框架，我见证并参与了前端技术的快速发展。
              </p>
              <p className="text-gray-600 mb-4">
                在职业生涯中，我负责过多个千万级用户的企业级应用，涉及电商、金融、教育等多个领域。
                擅长React、Vue生态系统，在微前端架构、性能优化、工程化方面有丰富的实践经验。
              </p>
              <p className="text-gray-600">
                我相信技术的价值在于解决实际问题，因此我的文章都基于真实项目经验，
                希望能为同行提供有价值的参考和启发。
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">技术栈</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">前端框架</h3>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Vue', 'Angular', 'Svelte'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">构建工具</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Webpack', 'Vite', 'Rollup', 'Parcel'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">后端技术</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Node.js', 'Express', 'Koa', 'Nest.js'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">项目经验</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-semibold text-gray-900 mb-2">企业级SaaS平台</h3>
                <div className="flex items-center gap-4 mb-2">
                  <span className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    2022-2024
                  </span>
                  <span className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    技术负责人
                  </span>
                </div>
                <p className="text-gray-600 mb-2">
                  负责千万级用户的企业级SaaS平台前端架构设计，采用微前端架构，
                  支持多团队并行开发，提升了50%的开发效率。
                </p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'qiankun', 'TypeScript', 'Webpack'].map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="font-semibold text-gray-900 mb-2">金融数据可视化平台</h3>
                <div className="flex items-center gap-4 mb-2">
                  <span className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    2020-2022
                  </span>
                  <span className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    前端架构师
                  </span>
                </div>
                <p className="text-gray-600 mb-2">
                  设计和实现了高性能的金融数据可视化平台，处理实时数据流，
                  支持百万级数据点的实时渲染，响应时间控制在100ms内。
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Vue', 'D3.js', 'WebSocket', 'Canvas'].map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="font-semibold text-gray-900 mb-2">电商中台系统</h3>
                <div className="flex items-center gap-4 mb-2">
                  <span className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    2018-2020
                  </span>
                  <span className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    高级前端工程师
                  </span>
                </div>
                <p className="text-gray-600 mb-2">
                  参与电商中台系统的前端开发，负责订单管理、库存管理等核心模块，
                  通过性能优化将页面加载时间减少60%。
                </p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Redux', 'Ant Design', 'Webpack'].map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">联系我</h2>
            <p className="text-gray-600 mb-6">
              如果你对我的文章有任何问题或建议，或者想要技术交流，欢迎通过以下方式联系我：
            </p>
            <div className="flex space-x-6">
              <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </a>
              <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <Twitter className="w-5 h-5 mr-2" />
                Twitter
              </a>
              <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <Mail className="w-5 h-5 mr-2" />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 