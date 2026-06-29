'use client'

import { useState, useCallback } from 'react'

interface CmdBlock {
  cmd: string
  lines: { text: string; color?: string }[]
}

const BLOCKS: CmdBlock[] = [
  {
    cmd: 'uname -a && whoami',
    lines: [
      { text: 'Darwin omar-rehan 24.1.0 Darwin Kernel', color: '#ffd23f' },
      { text: 'User: omar-rehan (uid=2024)', color: '#ffd23f' },
      { text: 'Shell: /bin/curiosity', color: '#9ae66e' },
      { text: 'Uptime: 25+ years of building', color: '#9ae66e' },
    ],
  },
  {
    cmd: 'neofetch',
    lines: [
      { text: '       .---.            ', color: '#b69cff' },
      { text: '      /     \\           ', color: '#b69cff' },
      { text: '     |  o  o |          ', color: '#b69cff' },
      { text: '      \\  ~  /           ', color: '#b69cff' },
      { text: '       \\___/            ', color: '#b69cff' },
      { text: 'OS: AI Engineer v24.04 LTS', color: '#ffd23f' },
      { text: 'Host: Portfolio Server', color: '#4cd4e8' },
      { text: 'Kernel: 6.8.0-build-solve', color: '#4cd4e8' },
      { text: 'Packages: 42 (passion)', color: '#ff7eb6' },
      { text: 'Resolution: 1920x1080 (vision)', color: '#ff8a3d' },
    ],
  },
  {
    cmd: 'ps aux --sort=-%cpu | head -6',
    lines: [
      { text: 'PID   CMD                            CPU  MEM', color: '#ffd23f' },
      { text: '4201  python3 train_model.py          94%  12%', color: '#4cd4e8' },
      { text: '3307  node server.js                   78%  8%', color: '#9ae66e' },
      { text: '2103  jupyter-lab                      45%  15%', color: '#ff7eb6' },
      { text: '9902  postgres -D /data               22%  30%', color: '#ff8a3d' },
      { text: '0007  systemd --user                   4%   2%', color: '#b69cff' },
    ],
  },
  {
    cmd: 'curl -s https://api.quote.engineer',
    lines: [
      { text: '"The best way to predict the future', color: '#9ae66e' },
      { text: ' is to build it."', color: '#9ae66e' },
      { text: '  — Alan Kay', color: '#ffd23f' },
      { text: '', color: undefined },
      { text: '"Any sufficiently advanced technology', color: '#4cd4e8' },
      { text: ' is indistinguishable from magic."', color: '#4cd4e8' },
      { text: '  — Arthur C. Clarke', color: '#ffd23f' },
    ],
  },
  {
    cmd: 'python3 -c "import this"',
    lines: [
      { text: 'The Zen of Python, by Tim Peters', color: '#ffd23f' },
      { text: 'Beautiful is better than ugly.', color: '#4cd4e8' },
      { text: 'Simple is better than complex.', color: '#9ae66e' },
      { text: 'Explicit is better than implicit.', color: '#ff7eb6' },
      { text: '>>> data.shape', color: '#9ae66e' },
      { text: '(972, 12) — ready to transform', color: '#b69cff' },
    ],
  },
  {
    cmd: 'systemctl status portfolio.service',
    lines: [
      { text: '● portfolio.service — active (running)', color: '#9ae66e' },
      { text: '    Loaded: loaded (heartbeat)', color: '#ffd23f' },
      { text: '    Active: active (running)', color: '#9ae66e' },
      { text: '    Memory: 100% passion', color: '#ff7eb6' },
      { text: '    Tasks: 42 (limit: infinity)', color: '#4cd4e8' },
      { text: '    CGroup: /system.slice/portfolio', color: '#b69cff' },
      { text: '            ├─ ai-models.service', color: '#ff8a3d' },
      { text: '            ├─ data-pipelines.service', color: '#ff8a3d' },
      { text: '            └─ fullstack-apps.service', color: '#ff8a3d' },
    ],
  },
  {
    cmd: 'df -h /knowledge',
    lines: [
      { text: 'Filesystem      Size  Used  Avail  Use%  Mounted', color: '#ffd23f' },
      { text: '/knowledge        ∞    42%    58%    —    /brain', color: '#4cd4e8' },
      { text: '/experience     512G   312G   200G   61%   /career', color: '#9ae66e' },
      { text: '/projects        10T   8.2T   1.8T   82%   /github', color: '#ff7eb6' },
    ],
  },
  {
    cmd: 'echo $LANG',
    lines: [
      { text: 'en_US.UTF-8', color: '#ffd23f' },
      { text: '', color: undefined },
      { text: '> system ready.', color: '#9ae66e' },
      { text: '> waiting for your next command...', color: '#4cd4e8' },
    ],
  },
]

export default function TerminalEasterEgg() {
  const [blockIndex, setBlockIndex] = useState(0)
  const [typedLines, setTypedLines] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  const current = BLOCKS[blockIndex % BLOCKS.length]

  const advanceLine = useCallback(() => {
    setTypedLines((prev) => {
      if (prev >= current.lines.length + 1) return prev
      return prev + 1
    })
  }, [current.lines.length])

  const runCommand = useCallback(() => {
    setBlockIndex((prev) => prev + 1)
    setTypedLines(0)
    setShowCursor(false)
    setTimeout(() => setShowCursor(true), 100)
    let i = 0
    const total = current.lines.length + 1
    const tick = () => {
      if (i >= total) return
      i++
      setTimeout(tick, 40 + Math.random() * 30)
    }
    setTimeout(tick, 200)
  }, [current.lines.length])

  return (
    <div
      className="w-full neo-card !p-0 !shadow-neo-sm overflow-hidden group focus:outline-none"
      tabIndex={0}
    >
      <div className="flex items-center gap-1.5 px-3 py-2 border-b-[3px] border-[color:var(--neo-border)]" style={{ background: 'var(--neo-surface-2)' }}>
        <span className="w-3 h-3 rounded-full border-[2px] border-[color:var(--neo-border)]" style={{ background: '#ff5a5f' }} />
        <span className="w-3 h-3 rounded-full border-[2px] border-[color:var(--neo-border)]" style={{ background: '#ffd23f' }} />
        <span className="w-3 h-3 rounded-full border-[2px] border-[color:var(--neo-border)]" style={{ background: '#9ae66e' }} />
        <span className="ml-2 text-xs font-extrabold tracking-wider opacity-70">dev console</span>
        <span className="ml-auto text-[10px] font-bold opacity-50 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
          click to run
        </span>
      </div>
      <div className="px-3 py-2.5 sm:px-4 sm:py-3 font-mono text-xs leading-relaxed min-h-[120px]" style={{ background: '#0d0d1a', color: '#c8d6e5' }}>
        <div className="max-h-[180px] sm:max-h-[200px] min-h-[100px] overflow-y-auto">
          <div className="flex items-start gap-2 mb-2">
            <span style={{ color: '#4cd4e8' }}>$</span>
            <span style={{ color: '#ffd23f' }}>{current.cmd}</span>
          </div>
          {current.lines.slice(0, typedLines - 1).map((line, i) => (
            <div key={i} className="whitespace-pre-wrap pl-4" style={{ color: line.color || '#c8d6e5' }}>
              {line.text}
            </div>
          ))}
          {typedLines <= current.lines.length && (
            <span className="inline-block w-2 h-4 ml-4 animate-pulse" style={{ background: '#4cd4e8' }} />
          )}
        </div>

        {blockIndex > 0 && blockIndex < BLOCKS.length - 1 && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4cd4e8' }}>→ next command</span>
              <button
                onClick={runCommand}
                className="ml-auto text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 border-2 border-[color:var(--neo-border)] transition-colors hover:opacity-80"
                style={{ background: 'var(--neo-surface-2)' }}
              >
                run
              </button>
            </div>
          </div>
        )}

        {blockIndex === 0 && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <button
              onClick={runCommand}
              className="w-full text-[10px] font-extrabold uppercase tracking-widest py-1 border-2 border-[color:var(--neo-border)] transition-colors hover:opacity-80"
              style={{ background: 'var(--neo-surface-2)' }}
            >
              click to start
            </button>
          </div>
        )}

        {blockIndex >= BLOCKS.length - 1 && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9ae66e' }}>all commands executed</span>
              <button
                onClick={() => { setBlockIndex(0); setTypedLines(0) }}
                className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 border-2 border-[color:var(--neo-border)] transition-colors hover:opacity-80"
                style={{ background: 'var(--neo-surface-2)' }}
              >
                restart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
