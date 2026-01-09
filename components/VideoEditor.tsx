import React, { useState } from 'react';
import { Play, Pause, Scissors, Type, Download, ChevronLeft, Save, Sliders, Music, Crop, PenTool, LayoutTemplate, X } from 'lucide-react';

interface VideoEditorProps {
  file: File | null;
  onSave: () => void;
  onCancel: () => void;
}

const VideoEditor: React.FC<VideoEditorProps> = ({ file, onSave, onCancel }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTool, setActiveTool] = useState<'trim' | 'text' | 'crop' | 'draw' | null>(null);

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="text-gray-400 hover:text-white flex items-center gap-2">
            <ChevronLeft size={20} />
            Back
          </button>
          <div className="h-6 w-px bg-gray-700"></div>
          <h2 className="text-white font-medium">{file?.name || 'Untitled Project'}</h2>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Auto-saved 2m ago</span>
          <button onClick={onSave} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Save size={16} />
            Save & Finish
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 gap-4">
            <button 
                onClick={() => setActiveTool('trim')}
                className={`p-3 rounded-xl transition-all ${activeTool === 'trim' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                title="Trim Video"
            >
                <Scissors size={20} />
            </button>
            <button 
                onClick={() => setActiveTool('crop')}
                className={`p-3 rounded-xl transition-all ${activeTool === 'crop' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                title="Crop Frame"
            >
                <Crop size={20} />
            </button>
            <button 
                onClick={() => setActiveTool('text')}
                className={`p-3 rounded-xl transition-all ${activeTool === 'text' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                title="Add Text/Annotation"
            >
                <Type size={20} />
            </button>
             <button 
                onClick={() => setActiveTool('draw')}
                className={`p-3 rounded-xl transition-all ${activeTool === 'draw' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                title="Draw"
            >
                <PenTool size={20} />
            </button>
            <div className="w-8 h-px bg-gray-700 my-2"></div>
            <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl">
                <Music size={20} />
            </button>
            <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl">
                <Sliders size={20} />
            </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-gray-950 flex items-center justify-center p-8 relative">
            <div className={`aspect-video w-full max-w-4xl bg-black rounded-lg shadow-2xl relative overflow-hidden border ${activeTool ? 'border-blue-500' : 'border-gray-800'}`}>
                {/* Mock Preview Content */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <span className="text-6xl font-black opacity-20">PREVIEW</span>
                </div>
                {/* Simulated Overlay Elements based on active tool */}
                {activeTool === 'text' && (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-blue-400 bg-black/50 px-4 py-2 rounded text-white font-bold backdrop-blur-md cursor-move">
                        Enter Annotation...
                    </div>
                )}
                {activeTool === 'crop' && (
                    <div className="absolute inset-8 border-2 border-white/50 shadow-[0_0_0_100vh_rgba(0,0,0,0.5)] pointer-events-none">
                         <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-white"></div>
                         <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-white"></div>
                         <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-white"></div>
                         <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-white"></div>
                    </div>
                )}
            </div>
            {/* Tool-specific floating panel */}
             {activeTool && (
                <div className="absolute top-8 right-8 bg-gray-800 border border-gray-700 p-4 rounded-xl shadow-xl w-64 animate-in slide-in-from-right-4">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-white font-bold text-sm capitalize">{activeTool} Settings</h4>
                        <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-white"><X size={14}/></button>
                    </div>
                    {activeTool === 'trim' && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Start: 00:00</span>
                                <span>End: 00:45</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-full"></div>
                            </div>
                        </div>
                    )}
                     {activeTool === 'text' && (
                        <input type="text" placeholder="Text content..." className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-xs mb-2" />
                    )}
                    <button onClick={() => setActiveTool(null)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold mt-2">Apply Changes</button>
                </div>
            )}
        </div>
      </div>

      {/* Timeline Area */}
      <div className="h-64 bg-gray-900 border-t border-gray-700 flex flex-col">
        {/* Timeline Controls */}
        <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
            <span className="text-xs text-gray-400">00:14:23 / 00:45:00</span>
            <div className="flex gap-4 text-gray-300">
                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-blue-400">
                    {isPlaying ? <Pause size={16} className="fill-current"/> : <Play size={16} className="fill-current"/>}
                </button>
            </div>
            <div className="w-20 bg-gray-700 h-1 rounded-full"></div>
        </div>

        {/* Tracks */}
        <div className="flex-1 p-2 overflow-x-auto relative">
            {/* Time Indicators */}
            <div className="flex justify-between text-xs text-gray-600 mb-2 px-2 select-none">
                <span>00:00</span><span>00:15</span><span>00:30</span><span>00:45</span><span>01:00</span>
            </div>

            {/* Video Track */}
            <div className="h-16 bg-gray-800 rounded-lg mb-2 relative overflow-hidden group border border-gray-700">
                <div className="absolute inset-0 flex">
                     {[...Array(20)].map((_, i) => (
                         <div key={i} className="flex-1 bg-blue-900/20 border-r border-gray-800/50 h-full"></div>
                     ))}
                </div>
                <div className="absolute top-2 left-2 bg-blue-600/80 px-2 py-0.5 rounded text-xs text-white">Main_Camera_01.mp4</div>
            </div>

            {/* Audio Track */}
            <div className="h-12 bg-gray-800 rounded-lg relative overflow-hidden border border-gray-700">
                 <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center opacity-30">
                    <svg height="100%" width="100%" preserveAspectRatio="none">
                        <path d="M0,20 Q10,5 20,20 T40,20 T60,20 T80,20 T100,20 T120,20 T140,20 T160,20 T180,20 T200,20" stroke="lime" strokeWidth="2" fill="none" />
                    </svg>
                 </div>
                 <div className="absolute top-2 left-2 bg-green-600/80 px-2 py-0.5 rounded text-xs text-white">Mic_Input.wav</div>
            </div>

            {/* Playhead */}
            <div className="absolute top-0 bottom-0 w-px bg-red-500 z-10 left-[30%] pointer-events-none">
                <div className="w-3 h-3 bg-red-500 -ml-1.5 rotate-45"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;