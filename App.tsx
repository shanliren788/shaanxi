
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
      detail: "整合秦腔、凤翔泥塑、安塞腰鼓等国家级非遗资源，打造现代化文创产品出口基地，文化出海步履不停。" 
    }
  ];

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-64 h-2 bg-gray-100 rounded-full overflow-hidden"
        >
          <motion.div 
            className="absolute top-0 left-0 h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${loadingProgress}%` }}
          />
        </motion.div>
        <p className="mt-4 text-gray-500 font-medium tracking-widest">陕西经济发展概况载入中 {loadingProgress}%</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 selection:bg-blue-100">
      {/* 导航栏 */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
              秦
            </div>
            <span className="font-bold text-xl tracking-tight">陕西省经济数据看板</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-gray-500">
            <button onClick={() => scrollToSection('overview')} className="hover:text-blue-600 transition-colors">全省综述</button>
            <button onClick={() => scrollToSection('cities')} className="hover:text-blue-600 transition-colors">城市透视</button>
            <button onClick={() => scrollToSection('culture')} className="hover:text-blue-600 transition-colors">文化科技</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="overview" className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={sectionVariants}
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
                2023 年度报告
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-8">
                三秦大地 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                  高质量发展
                </span> 新篇章
              </h1>
              <p className="text-xl text-gray-500 max-w-xl leading-relaxed mb-10">
                陕西省2023年实现生产总值3.38万亿元，同比增长4.3%。作为古丝绸之路起点，正以科技创新引领现代化产业体系建设。
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1 min-w-[200px]">
                  <p className="text-gray-400 text-sm font-medium mb-1">全省 GDP 总额</p>
                  <p className="text-3xl font-bold">33,786.07 <span className="text-lg text-gray-400">亿</span></p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1 min-w-[200px]">
                  <p className="text-gray-400 text-sm font-medium mb-1">增长率</p>
                  <p className="text-3xl font-bold text-emerald-500">+4.3%</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/50 backdrop-blur-sm p-8 rounded-[40px] shadow-2xl border border-white/50 h-[500px]"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                省域各市 GDP 分布
              </h3>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={cityDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {cityDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {cityDistributionData.slice(0, 4).map((city, idx) => (
                  <div key={city.name} className="text-center">
                    <p className="text-[10px] text-gray-400 font-bold mb-1">{city.name}</p>
                    <div className="w-full h-1 rounded-full overflow-hidden bg-gray-100">
                      <div className="h-full" style={{ width: '100%', backgroundColor: COLORS[idx] }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* City Detail Section */}
      <section id="cities" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl font-bold mb-4">核心城市透视</h2>
              <p className="text-gray-500 text-lg">点击选择城市，查看深度行业结构与历史增长轨迹</p>
            </motion.div>
            <div className="flex flex-wrap gap-2">
              {SHANXI_CITIES.map(city => (
                <button
                  key={city.name}
                  onClick={() => setSelectedCity(city)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    selectedCity.name === city.name 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 space-y-8">
              <motion.div 
                key={selectedCity.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 h-full"
              >
                <div className="mb-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${
                    selectedCity.region === 'North' ? 'bg-orange-400' : 
                    selectedCity.region === 'Central' ? 'bg-blue-500' : 'bg-emerald-500'
                  }`}>
                    {selectedCity.region === 'North' ? '陕北地区' : 
                     selectedCity.region === 'Central' ? '关中地区' : '陕南地区'}
                  </span>
                  <h3 className="text-4xl font-bold mt-4">{selectedCity.name}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-10 text-lg">
                  {selectedCity.description}
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-100">
                    <span className="text-gray-400 font-medium text-sm">2023 GDP</span>
                    <span className="font-bold text-xl">{selectedCity.gdp2023} 亿</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-100">
                    <span className="text-gray-400 font-medium text-sm">省内排名</span>
                    <span className="font-bold text-xl">Top {SHANXI_CITIES.indexOf(selectedCity) + 1}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white p-4 sm:p-8 rounded-[40px] shadow-sm border border-gray-100 h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex bg-gray-50 p-1.5 rounded-2xl">
                    <button 
                      onClick={() => setActiveTab('trend')}
                      className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'trend' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                    >
                      增长趋势
                    </button>
                    <button 
                      onClick={() => setActiveTab('structure')}
                      className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'structure' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                    >
                      产业结构
                    </button>
                  </div>
                </div>

                <div className="h-[400px]">
                  <AnimatePresence mode="wait">
                    {activeTab === 'trend' ? (
                      <motion.div
                        key="trend"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full w-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={selectedCity.history}>
                            <defs>
                              <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                              dataKey="year" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fill: '#94a3b8', fontSize: 12}}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fill: '#94a3b8', fontSize: 12}}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                              type="monotone" 
                              dataKey="gdp" 
                              stroke="#2563eb" 
                              strokeWidth={3} 
                              fillOpacity={1} 
                              fill="url(#colorGdp)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="structure"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full flex flex-col justify-center"
                      >
                        <div className="space-y-10 px-4">
                          {[
                            { label: '科技创新', key: 'tech', color: 'bg-blue-600' },
                            { label: '能源工业', key: 'energy', color: 'bg-emerald-600' },
                            { label: '房产基建', key: 'realEstate', color: 'bg-amber-600' }
                          ].map((item) => (
                            <div key={item.key}>
                              <div className="flex justify-between items-end mb-4">
                                <span className="font-bold text-lg">{item.label}</span>
                                <span className="font-mono font-bold text-2xl">{(selectedCity.history[selectedCity.history.length-1].breakdown as any)[item.key]}%</span>
                              </div>
                              <div className="w-full h-4 bg-gray-50 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${(selectedCity.history[selectedCity.history.length-1].breakdown as any)[item.key]}%` }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                  className={`h-full ${item.color}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture & Innovation Section */}
      <section id="culture" className="py-24 px-6 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
          >
            <h2 className="text-4xl font-bold mb-4">文旅科技双轮驱动</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              陕西不仅有厚重的历史，更有现代产业的活力。科技赋能传统文化，非遗走入现代生活。
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
          >
            {cultureItems.map((item, idx) => (
              <motion.div
                key={idx}
                variants={sectionVariants}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedCulture(item)}
                className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 cursor-pointer transition-all hover:shadow-xl group"
              >
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed line-clamp-3">
                  {item.detail}
                </p>
                <div className="mt-8 flex items-center text-blue-600 font-bold text-sm">
                  了解更多 
                  <span className="ml-2 group-hover:ml-3 transition-all">→</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400 text-sm">
          <p>© 2024 陕西经济数据看板 · 数据仅供演示使用</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-blue-600 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-blue-600 transition-colors">使用条款</a>
            <a href="#" className="hover:text-blue-600 transition-colors">数据来源</a>
          </div>
        </div>
      </footer>

      {/* Culture Detail Modal */}
      <AnimatePresence>
        {selectedCulture && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCulture(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white max-w-lg w-full rounded-[40px] p-10 relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedCulture(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
              <div className="text-6xl mb-8">{selectedCulture.icon}</div>
              <h3 className="text-3xl font-bold mb-6">{selectedCulture.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {selectedCulture.detail}
              </p>
              <button 
                onClick={() => setSelectedCulture(null)}
                className="mt-10 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors"
              >
                关闭详情
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
