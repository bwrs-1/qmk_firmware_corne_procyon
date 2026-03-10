import { useState, useEffect } from 'react'
import { Plug, Keyboard, Settings2, ShieldCheck, Activity, Smartphone, MousePointer2 } from 'lucide-react'

function App() {
  const [deviceConnected, setDeviceConnected] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if WebHID is supported
    if ('hid' in navigator) {
      setIsSupported(true)
    }
  }, [])

  const handleConnect = async () => {
    try {
      if (!isSupported) {
        alert("WebHID API is not supported in this browser. Please use Chrome, Edge, or Opera.");
        return;
      }

      const filters = [
        { vendorId: 0xAFC6, productId: 0xBFC6 } // Corne Procyon 36 VID/PID
      ];

      const devices = await (navigator as any).hid.requestDevice({ filters });

      if (devices && devices.length > 0) {
        setDeviceConnected(true);
        // Here we would typically read device info and set up the session
      }
    } catch (error) {
      console.error("Connection failed:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-black text-white relative overflow-hidden flex flex-col items-center justify-center p-6">

      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl opacity-50 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-accent-500/10 rounded-full blur-3xl opacity-40 animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center">

        {/* Header Section */}
        <div className="text-center mb-16 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
            Corne Procyon 設定
          </h1>
          <p className="text-dark-300 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
            Corne Procyon 36 専用のプレミアム WebHID コンフィギュレータ。ブラウザから直接キーマップ変更、レイヤー操作、設定の微調整が可能です。
          </p>
        </div>

        {/* Status & Dashboard */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          <div className="glass-panel p-6 flex flex-col items-center text-center glow-hover group cursor-default">
            <div className={`p-4 rounded-full mb-4 transition-colors ${deviceConnected ? 'bg-accent-500/20 text-accent-400' : 'bg-dark-700/50 text-dark-300 group-hover:bg-primary-500/20 group-hover:text-primary-400'}`}>
              <Plug size={32} />
            </div>
            <h3 className="text-lg font-medium mb-1 tracking-wide">接続ステータス</h3>
            <p className="text-sm text-dark-400">
              {deviceConnected ? 'デバイス接続済み (VIA プロトコル対応)' : 'デバイス未検出。設定を開始するには「接続」をクリックしてください。'}
            </p>
          </div>

          <div className="glass-panel p-6 flex flex-col items-center text-center glow-hover cursor-default">
            <div className="p-4 rounded-full mb-4 bg-dark-700/50 text-dark-300">
              <Keyboard size={32} />
            </div>
            <h3 className="text-lg font-medium mb-1 tracking-wide">キーマップエディタ</h3>
            <p className="text-sm text-dark-400">直感的な36キーマッピング。ドラッグ＆ドロップ機能（近日公開予定）。</p>
          </div>

          <div className="glass-panel p-6 flex flex-col items-center text-center glow-hover cursor-default">
            <div className="p-4 rounded-full mb-4 bg-dark-700/50 text-dark-300">
              <Settings2 size={32} />
            </div>
            <h3 className="text-lg font-medium mb-1 tracking-wide">デバイス設定</h3>
            <p className="text-sm text-dark-400">RGBマトリクス、ポインティングデバイス感度、マクロレイヤーの調整。</p>
          </div>

        </div>

        {/* Interaction Section */}
        <div className="flex flex-col items-center w-full max-w-md mx-auto glass-panel p-8">
          <button
            onClick={handleConnect}
            disabled={deviceConnected}
            className={`w-full py-4 px-6 rounded-xl font-medium text-lg tracking-wide transition-all select-none
              ${deviceConnected
                ? 'bg-dark-700 text-dark-400 cursor-not-allowed border border-dark-600'
                : 'bg-primary-500 hover:bg-primary-400 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-400/40 hover:-translate-y-1'
              }`}
          >
            {deviceConnected ? 'コンフィギュレータ接続中' : 'WebHID でキーボードと接続'}
          </button>

          <div className="mt-8 grid grid-cols-2 gap-4 w-full text-xs text-dark-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-accent-400" />
              <span>セキュアなローカル接続</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary-400" />
              <span>リアルタイム更新</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-purple-400" />
              <span>レスポンシブ・PWA対応</span>
            </div>
            <div className="flex items-center gap-2">
              <MousePointer2 size={16} className="text-orange-400" />
              <span>ポインティングデバイス対応</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-dark-500 text-sm font-light">
        Powered by WebHID API &bull; QMK Firmware 対応
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default App
