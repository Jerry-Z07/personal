import React, { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import BentoCard from '../components/BentoCard'
import { Link } from 'react-router'

const PLAYLIST = [
  {
    id: 'mux-x36',
    title: '演示流：x36xhzz',
    desc: 'MUX 官方测试流，含多码率',
    icon: 'ri-broadcast-line',
    color: 'bg-pink-500/20 text-pink-500',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  },
  {
    id: 'mux-pts',
    title: '演示流：PTS',
    desc: '时间戳测试流',
    icon: 'ri-broadcast-line',
    color: 'bg-blue-500/20 text-blue-500',
    url: 'https://test-streams.mux.dev/pts/pts.m3u8',
  },
  {
    id: 'mux-alt',
    title: '演示流：ALT',
    desc: '备用演示流',
    icon: 'ri-broadcast-line',
    color: 'bg-green-500/20 text-green-500',
    url: 'https://test-streams.mux.dev/alt/main.m3u8',
  },
]

function Live() {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const [current, setCurrent] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    setErrorMsg('')
    const video = videoRef.current
    if (!video) return
    const source = PLAYLIST[current].url

    // 清理旧实例
    if (hlsRef.current) {
      try { hlsRef.current.destroy() } catch {}
      hlsRef.current = null
    }

    // 初始化播放
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferLength: 15,
        maxBufferSize: 60 * 1000 * 1000,
      })
      hlsRef.current = hls
      hls.loadSource(source)
      hls.attachMedia(video)

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data?.fatal) {
          setErrorMsg('播放发生错误，请切换其他源或刷新页面。')
          try { hls.destroy() } catch {}
          hlsRef.current = null
        }
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari / iOS 原生支持
      video.src = source
    } else {
      setErrorMsg('当前浏览器不支持 HLS 播放。')
    }

    return () => {
      if (hlsRef.current) {
        try { hlsRef.current.destroy() } catch {}
        hlsRef.current = null
      }
    }
  }, [current])

  useEffect(() => {
    // 尝试静音自动播放（可能被浏览器策略阻止）
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.play().catch(() => {})
    }
  }, [current])

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 text-zinc-800 dark:bg-[#0a0a0a] dark:text-gray-100">
      <div className="mx-auto w-full max-w-7xl">
        {/* 顶部标题与返回 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="ri-broadcast-line text-2xl text-pink-500"></i>
            <h1 className="text-xl font-bold">Live / 直播</h1>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white/50 px-3 py-1.5 text-sm font-medium transition-all hover:bg-white hover:shadow-md dark:bg-white/5 dark:hover:bg-white/10"
          >
            <i className="ri-arrow-left-line text-gray-500 dark:text-gray-400"></i>
            返回主页
          </Link>
        </div>

        {/* 主体：播放器 + 播放列表 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 播放器卡片 */}
          <BentoCard className="md:col-span-2 md:row-span-2">
            <div className="flex flex-col h-full">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  controls
                  playsInline
                  poster="/psg.jpg"
                />
                {errorMsg && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <p className="text-sm text-red-400">{errorMsg}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  正在播放：<span className="font-semibold">{PLAYLIST[current].title}</span>
                </p>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                  <i className="ri-information-line"></i>
                  M3U8/HLS 支持，Safari 原生播放，其他浏览器通过 Hls.js。
                </div>
              </div>
            </div>
          </BentoCard>

          {/* 播放列表卡片 */}
          <BentoCard className="md:col-span-1 md:row-span-2">
            <div className="mb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Playlist / 播放列表
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              {PLAYLIST.map((item, index) => {
                const active = index === current
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrent(index)}
                    className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-pink-500/10 border border-pink-500/20'
                        : 'hover:bg-white/10 dark:hover:bg-white/5'
                    }`}
                    aria-label={`播放 ${item.title}`}
                  >
                    <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                      <i className={`${item.icon} text-xl`}></i>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className={`text-sm font-medium truncate ${active ? 'text-pink-500' : ''}`}>
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.desc}</p>
                    </div>
                    {active && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-500">
                        播放中
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  )
}

export default Live