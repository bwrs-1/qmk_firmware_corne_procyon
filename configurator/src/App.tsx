import { useState, useEffect } from 'react'
import { Plug, Keyboard, Settings2, ShieldCheck, Activity, Smartphone, MousePointer2, ArrowLeft } from 'lucide-react'

type ViewMode = 'dashboard' | 'keymap' | 'settings';

function App() {
  const [deviceConnected, setDeviceConnected] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard')

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

  // Dashboard View
  const renderDashboard = () => (
    <div className="z-10 w-full max-w-5xl flex flex-col items-center animate-[fadeIn_0.5s_ease-out_forwards]">
      {/* Header Section */}
      <div className="text-center mb-16">
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

        <div
          onClick={() => deviceConnected && setCurrentView('keymap')}
          className={`glass-panel p-6 flex flex-col items-center text-center transition-all duration-300 ${deviceConnected ? 'cursor-pointer hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group' : 'cursor-not-allowed opacity-50 grayscale'}`}
        >
          <div className={`p-4 rounded-full mb-4 transition-colors ${deviceConnected ? 'bg-primary-500/20 text-primary-400 group-hover:bg-primary-400/30' : 'bg-dark-700/50 text-dark-300'}`}>
            <Keyboard size={32} />
          </div>
          <h3 className="text-lg font-medium mb-1 tracking-wide">キーマップエディタ</h3>
          <p className="text-sm text-dark-400">直感的な36キーマッピング。ドラッグ＆ドロップでレイヤーを編集します。</p>
          {deviceConnected && <span className="mt-4 text-xs font-semibold text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">開く &rarr;</span>}
        </div>

        <div
          onClick={() => deviceConnected && setCurrentView('settings')}
          className={`glass-panel p-6 flex flex-col items-center text-center transition-all duration-300 ${deviceConnected ? 'cursor-pointer hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] group' : 'cursor-not-allowed opacity-50 grayscale'}`}
        >
          <div className={`p-4 rounded-full mb-4 transition-colors ${deviceConnected ? 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-400/30' : 'bg-dark-700/50 text-dark-300'}`}>
            <Settings2 size={32} />
          </div>
          <h3 className="text-lg font-medium mb-1 tracking-wide">デバイス設定</h3>
          <p className="text-sm text-dark-400">RGBマトリクス、ポインティングデバイス感度、マクロレイヤーの調整。</p>
          {deviceConnected && <span className="mt-4 text-xs font-semibold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">開く &rarr;</span>}
        </div>
      </div>

      {/* Interaction Section */}
      <div className="flex flex-col items-center w-full max-w-md mx-auto glass-panel p-8">
        <button
          onClick={handleConnect}
          disabled={deviceConnected}
          className={`w-full py-4 px-6 rounded-xl font-medium text-lg tracking-wide transition-all select-none
            ${deviceConnected
              ? 'bg-dark-700 text-accent-400 cursor-default border border-dark-600 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
              : 'bg-primary-500 hover:bg-primary-400 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-400/40 hover:-translate-y-1'
            }`}
        >
          {deviceConnected ? '✓ 接続済み' : 'WebHID でキーボードと接続'}
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
  )

  const renderKeymapEditor = () => (
    <div className="z-10 w-full max-w-6xl flex flex-col h-[80vh] animate-[fadeIn_0.3s_ease-out_forwards]">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setCurrentView('dashboard')} className="p-3 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors border border-dark-600">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-blue-300">キーマップエディタ</h2>
      </div>

      <div className="flex-1 glass-panel p-8 flex flex-col items-center justify-center">
        <Keyboard size={64} className="text-dark-600 mb-6" />
        <h3 className="text-2xl font-medium mb-2">エディタを読み込み中...</h3>
        <p className="text-dark-400 max-w-lg text-center leading-relaxed">
          （開発中）ここに Corne Procyon 36 の物理レイアウトと、ドラッグ＆ドロップでキーコードを割り当てるUIを提供します。
          <br />現在は VIA プロトコルによる配列データの受信待機状態です。
        </p>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="z-10 w-full max-w-4xl flex flex-col h-[80vh] animate-[fadeIn_0.3s_ease-out_forwards]">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setCurrentView('dashboard')} className="p-3 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors border border-dark-600">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">デバイス設定</h2>
      </div>

      <div className="flex-1 glass-panel p-8 flex flex-col gap-6">
        <div className="p-6 border border-dark-600/50 rounded-xl bg-dark-800/80">
          <h4 className="text-xl font-medium mb-4 flex items-center gap-2"><Settings2 size={20} className="text-purple-400" /> トラックパッド（Auto Mouse）設定</h4>
          <p className="text-dark-400 text-sm mb-6">トラックパッドを触った時のみ有効になる「_MOUSE」レイヤーの切り替えや、カーソル感度の設定をデバイスに書き込みます。</p>

          <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-dark-700/50 mb-4">
            <span className="font-medium">Auto Mouse 切り替え機能</span>
            <div className="w-12 h-6 bg-accent-500 rounded-full cursor-not-allowed relative opacity-70">
              <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="flex flex-col p-4 bg-dark-900/50 rounded-lg border border-dark-700/50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">トラックパッド CPI (感度)</span>
              <span className="text-xs text-primary-400 bg-primary-900/40 px-2 py-1 rounded">1600 (Current)</span>
            </div>
            <input type="range" min="400" max="3200" step="400" defaultValue="1600" className="w-full accent-primary-500 cursor-not-allowed opacity-70" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-black text-white relative overflow-hidden flex flex-col items-center justify-center p-6">

      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl opacity-50 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-accent-500/10 rounded-full blur-3xl opacity-40 animate-float" style={{ animationDelay: '3s' }}></div>

      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'keymap' && renderKeymapEditor()}
      {currentView === 'settings' && renderSettings()}

      {/* Footer */}
      {currentView === 'dashboard' && (
        <div className="absolute bottom-6 text-dark-500 text-sm font-light">
          Powered by WebHID API &bull; QMK Firmware 対応
        </div>
      )}

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
