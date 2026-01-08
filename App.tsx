
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { SHANXI_CITIES } from './data';
import { CityData } from './types';

// UI 颜色常量
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

// 全局动画配置
const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedCity, setSelectedCity] = useState<CityData>(SHANXI_CITIES[0]);
  const [activeTab, setActiveTab] = useState<'trend' | 'structure'>('trend');
  const [selectedCulture, setSelectedCulture] = useState<{icon: string, title: string, detail: string} | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // 模拟载入进度与初始化
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const cityDistributionData = useMemo(() => {
    return SHANXI_CITIES.map(city => ({
      name: city.name,
      value: city.gdp2023,
      region: city.region
    }));
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (data.breakdown) {
        return (
          <div className="bg-white/95 p-4 border border-gray-100 shadow-2xl rounded-2xl backdrop-blur-xl ring-1 ring-black/5">
            <p className="font-bold text-gray-900 mb-2 text-lg border-b border-gray-100 pb-2">{`${label}年 GDP: ${data.gdp.toFixed(2)} 亿`}</p>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center gap-8">
                <span className="flex items-center gap-2 font-semibold text-blue-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span> 科技创新
                </span>
                <span className="text-gray-700 font-mono font-bold">{data.breakdown.tech}%</span>
              </div>
              <div className="flex justify-between items-center gap-8">
                <span className="flex items-center gap-2 font-semibold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span> 能源工业
                </span>
                <span className="text-gray-700 font-mono font-bold">{data.breakdown.energy}%</span>
              </div>
              <div className="flex justify-between items-center gap-8">
                <span className="flex items-center gap-2 font-semibold text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span> 房产基建
                </span>
                <span className="text-gray-700 font-mono font-bold">{data.breakdown.realEstate}%</span>
              </div>
            </div>
          </div>
        );
      }
      return (
        <div className="bg-white/90 p-3 border border-gray-100 shadow-xl rounded-xl font-bold text-gray-800 backdrop-blur-md">
          <p className="text-sm">{`${data.name}: ${data.value.toFixed(2)} 亿`}</p>
        </div>
      );
    }
    return null;
  };

  const cultureItems = [
    { 
      icon: "🎭", 
      title: "文旅融合示范", 
      detail: "深耕大唐不夜城、西安城墙等超级IP，通过沉浸式演艺带动千亿级文旅产业链。2023年旅游收入同比增长显著。" 
    },
    { 
      icon: "🏛️", 
      title: "数字文保科技", 
      detail: "利用VR/AR、高精度三维扫描技术，实现秦始皇陵、敦煌数字丝路工程，科技守护中华文明瑰宝。" 
    },
    { 
      icon: "🎨", 
      title: "非遗产业化", 
      detail: "整合秦腔、凤翔泥塑、安塞腰鼓等国家级非遗资源，打造现代化文创产品出口基地，文化出海步履稳健。" 
    }
  ];

  const navLinks = [
    { name: '首页', id: 'home' },
    { name: '经济看板', id: 'data' },
    { name: '文化底蕴', id: 'culture' },
    { name: '战略优势', id: 'advantages' },
    { name: '愿景展望', id: 'vision' },
  ];

  return (
    <div className="min-h-screen">
      {/* 载入动画层 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
            className="fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="text-blue-500 mb-8">
                <svg className="w-24 h-24 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-white tracking-[0.5em] mb-4">三秦之窗</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-10">正在同步全省经济数据资产...</p>
              <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]"
                />
              </div>
              <div className="mt-4 text-blue-400 font-mono font-bold text-sm">
                {loadingProgress}%
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 顶部导航栏 */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4 ${
          isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className={`text-xl font-black tracking-tighter cursor-pointer transition-colors ${isScrolled ? 'text-blue-600' : 'text-white'}`}
            onClick={() => scrollToSection('home')}
          >
            SHAANXI <span className={isScrolled ? 'text-slate-900' : 'text-blue-400'}>DATA</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-sm font-black uppercase tracking-widest transition-all hover:scale-110 active:scale-95 ${
                  isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* 首页板块 */}
      <section id="home" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.45)), url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070')`,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={!isLoading ? "visible" : "hidden"}
            className="w-full flex flex-col items-center"
          >
            <motion.h1 
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 1.2 }}
              className="text-6xl md:text-9xl font-black mb-10 tracking-tighter"
            >
              三秦之脊 · 经济大省
            </motion.h1>
            <motion.p 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl md:text-3xl max-w-4xl font-medium tracking-[0.15em] italic"
            >
              陕西省 GDP 十年演进全景数据可视化大屏
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 数据大屏核心区域 */}
      <motion.section 
        id="data"
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={sectionVariants}
        className="py-24 bg-[#f8fafc]"
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">GDP 核心指标看板</h2>
            <div className="inline-flex p-1.5 bg-slate-200/50 backdrop-blur rounded-2xl">
              <button onClick={() => setActiveTab('trend')} className={`px-10 py-3 rounded-xl transition-all ${activeTab === 'trend' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-500'}`}>趋势分析</button>
              <button onClick={() => setActiveTab('structure')} className={`px-10 py-3 rounded-xl transition-all ${activeTab === 'structure' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-500'}`}>结构分布</button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1 space-y-4">
              {SHANXI_CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => setSelectedCity(city)}
                  className={`w-full text-left p-6 rounded-[2rem] transition-all border-2 ${selectedCity.name === city.name ? 'border-blue-600 bg-blue-600 text-white shadow-xl' : 'border-transparent bg-white shadow-sm'}`}
                >
                  <span className="font-black text-xl">{city.name}</span>
                </button>
              ))}
            </div>
            <div className="lg:col-span-3 min-h-[500px]">
              <AnimatePresence mode="wait">
                {activeTab === 'trend' ? (
                  <motion.div 
                    key={`${selectedCity.name}-trend`}
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.98 }} 
                    className="bg-white rounded-[3.5rem] p-10 shadow-2xl h-full"
                  >
                    <h4 className="font-black text-3xl mb-10">{selectedCity.name} 走势分析</h4>
                    {/* 添加左至右缓慢展开动画容器 */}
                    <motion.div 
                      key={`${selectedCity.name}-chart-reveal`}
                      initial={{ clipPath: 'inset(0 100% 0 0)' }}
                      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                      viewport={{ once: true }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                      className="h-[400px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedCity.history}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} dx={-10} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area 
                            type="monotone" 
                            dataKey="gdp" 
                            stroke="#2563eb" 
                            fill="#2563eb33" 
                            strokeWidth={4} 
                            isAnimationActive={true}
                            animationDuration={2500}
                            animationEasing="ease-in-out"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div key="pie" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[3.5rem] p-10 shadow-2xl h-full">
                    <h4 className="font-black text-3xl mb-10 text-center">全省经济贡献版图</h4>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={cityDistributionData} 
                            innerRadius={100} 
                            outerRadius={140} 
                            dataKey="value" 
                            paddingAngle={8}
                            animationDuration={1500}
                          >
                            {cityDistributionData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 文化板块 */}
      <motion.section
        id="culture"
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={sectionVariants}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-16">厚植文化底蕴 · 赋能数字未来</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cultureItems.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedCulture(item)}
                className="group cursor-pointer p-12 bg-slate-50 rounded-[3rem] border border-slate-100 transition-all hover:bg-blue-600 hover:text-white"
              >
                <div className="text-6xl mb-6">{item.icon}</div>
                <h3 className="text-xl font-black mb-4">{item.title}</h3>
                <div className="w-10 h-1 bg-blue-500 group-hover:bg-white mx-auto rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 优势介绍板块 */}
      <motion.section 
        id="advantages"
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={sectionVariants}
        className="py-32 bg-slate-900 text-white"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <h2 className="text-5xl font-black mb-10 tracking-tighter">三秦腾飞的 <span className="text-blue-500">核心密码</span></h2>
              <div className="space-y-12">
                <div className="flex gap-8">
                  <div className="shrink-0 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">🏛️</div>
                  <div>
                    <h4 className="text-2xl font-black mb-2 text-blue-400">政策优势</h4>
                    <p className="text-slate-400 leading-relaxed">深度融入“一带一路”大格局，秦创原创新驱动平台正式起势，西部大开发3.0战略持续赋能。</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="shrink-0 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">🌍</div>
                  <div>
                    <h4 className="text-2xl font-black mb-2 text-blue-400">地理优势</h4>
                    <p className="text-slate-400 leading-relaxed">地处中国几何中心，承东启西、连接南北。西安国际港务区是全球最大的内陆港。</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[3rem] overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Advantage" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2025/2026愿景总结板块 */}
      <motion.section 
        id="vision" 
        initial="hidden" 
        whileInView="visible" 
        variants={sectionVariants} 
        className="py-32 bg-white overflow-hidden relative"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-blue-600 to-transparent"></div>
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-10 tracking-tighter text-slate-900">
              时代合奏 · 续写辉煌
            </h2>
            <div className="flex flex-col md:flex-row gap-12 items-stretch">
              <div className="flex-1 p-10 bg-slate-50 rounded-[3rem] border border-slate-100 text-left relative">
                <div className="absolute -top-4 left-10 px-4 py-1 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-full">2025 · 韧性跨越</div>
                <h3 className="text-2xl font-black mb-4 text-slate-800">总结：在挑战中屹立</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  2025年，陕西在多重挑战下展现出强大的经济韧性。秦创原驱动引擎火力全开，西安都市圈建设成效显著，全省高质量发展迈出坚实步伐。这一年，我们顺利完成了“十四五”规划的关键冲刺，不仅稳住了经济基本盘，更在科技创新与文化出海领域实现了历史性突破。
                </p>
              </div>
              <div className="flex-1 p-10 bg-blue-600 rounded-[3rem] text-left text-white relative shadow-2xl shadow-blue-200">
                <div className="absolute -top-4 left-10 px-4 py-1 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-full">2026 · 聚势启新</div>
                <h3 className="text-2xl font-black mb-4 text-white">展望：于新局中蝶变</h3>
                <p className="text-blue-50 leading-relaxed font-medium">
                  迈入2026年，三秦大地将蓄势聚能，深化产业升级与区域协同。在这一年，我们将迎来新一轮的高质量增长窗口，数智化转型将全面赋能传统工业。陕西将以更加开放、自信的姿态，深耕“一带一路”战略，开启从经济大省向经济强省跨越的新篇章。
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-2xl font-black text-blue-600 italic tracking-[0.2em]"
          >
            “ 往昔已展千重锦，明朝更进百尺竿 ”
          </motion.p>
        </div>
      </motion.section>

      {/* 页脚 */}
      <footer className="bg-slate-50 py-20 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <div className="text-xl font-black text-slate-900 mb-6">陕西经济数字化看板</div>
          <p className="text-xs">© 2024 Shaanxi Data Intelligence. 仅供演示用途。</p>
        </div>
      </footer>

      {/* --- 弹窗组件 --- */}
      <AnimatePresence>
        {selectedCulture && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCulture(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white p-10 rounded-[3rem] shadow-2xl z-10 overflow-hidden"
            >
              <button onClick={() => setSelectedCulture(null)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="text-7xl mb-8 text-center">{selectedCulture.icon}</div>
              <h4 className="text-3xl font-black text-slate-900 mb-6 text-center">{selectedCulture.title}</h4>
              <p className="text-slate-600 leading-relaxed font-medium text-center text-lg italic">“{selectedCulture.detail}”</p>
              <div className="mt-10 flex justify-center">
                <button onClick={() => setSelectedCulture(null)} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:scale-105 transition-transform">返回看板</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
