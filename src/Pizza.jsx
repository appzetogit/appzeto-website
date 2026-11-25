'use client'
import { letterPath } from './Mascot.jsx'
const I = '#06282A', W = '#fff', Y = '#FAFD0F', CR = '#E39A3B', CH = '#FFD84A', PE = '#D9482B', GR = '#33A77A'
const flame = 'M0 0c-9-5-8-13-3-18c0 4 3 4 3 0c0-4-1-6 1-9c6 6 11 20-1 27z'
// Pizza drawn face-on; the toss tilts it between "lying in the pan" and "facing you".
const Pizza = () => <><circle r="31" fill={CR} stroke={I} strokeWidth="2.500" /><circle r="25.500" fill={CH} />
  {[[-11, -11], [10, -13], [15, 6], [-2, 14], [-16, 5], [1, -1]].map(([x, y]) => <g key={x + '' + y}><circle cx={x} cy={y} r="5.200" fill={PE} /><circle cx={x - 1.5} cy={y - 1.5} r="1.300" fill="#F2836B" /></g>)}
  {[[-3, -19, 30], [19, -4, 80], [7, 13, -40], [-13, 15, 20], [-20, -5, 70]].map(([x, y, r]) => <path key={x} transform={`translate(${x} ${y}) rotate(${r})`} d="M-4 0q4-5 8 0q-4 5-8 0z" fill={GR} />)}</>
export function PanScene({ solo }) {
  return <g className={`pz ${solo ? 'solo' : ''}`}><g className="pz-stove"><g transform="translate(-10 -15) scale(1.14)">
    <g transform="translate(74 128)"><path d="M-36 0h72" stroke={I} strokeWidth="5" strokeLinecap="round" />{[-22, 0, 22].map((x, i) => <g key={x} transform={`translate(${x} -2)`}><g className={`fl fl${i}`}><path d={flame} fill={PE} /><path d={flame} transform="scale(.55)" fill={Y} /></g></g>)}</g>
    <g className="pz-pan"><path d="M110 84h38" stroke={I} strokeWidth="9" strokeLinecap="round" /><path d="M120 84h26" stroke={GR} strokeWidth="4" strokeLinecap="round" />
      <path d="M32 84c0 18 12 24 42 24s42-6 42-24z" fill="#12474A" stroke={I} strokeWidth="2.500" /><ellipse cx="74" cy="84" rx="42" ry="15" fill={I} /><ellipse cx="74" cy="84" rx="37" ry="12" fill="#0D5353" /></g>
    <g transform="translate(74 82)"><g className="pz-toss"><g className="pz-spin"><Pizza /></g></g></g>
    <g className="pz-pan"><path d="M32.500 86c4 14 20 14 41.500 14s37.500 0 41.500-14c-1 17-14 22-41.500 22s-40.500-5-41.500-22z" fill="#12474A" /></g>
    {[[46, 72], [98, 70], [70, 66]].map(([x, y], i) => <circle key={x} className={`spit sp${i}`} cx={x} cy={y} r="2.500" fill={Y} />)}
    <g className="pz-steam"><path d="M54 58c-5-6 5-9 0-15M94 58c-5-6 5-9 0-15" fill="none" stroke={W} strokeWidth="3.500" strokeLinecap="round" /></g>
  </g>
  </g>{!solo && <g className="pz-ride"><g className="pz-bump">
    <path d="M-6 118h-22M-2 104h-16M-4 90h-24" stroke={W} strokeWidth="3" strokeLinecap="round" className="wind" />
    <g transform="translate(46 38) scale(.46)"><path d={letterPath('F')} fill="none" stroke={I} strokeWidth="34" strokeLinecap="round" /><path d={letterPath('F')} fill="none" stroke={PE} strokeWidth="25" strokeLinecap="round" />{[33, 62].map(x => <g key={x}><circle cx={x} cy="22" r="13" fill={W} stroke={I} strokeWidth="4" /><circle cx={x + 4} cy="23" r="6" fill={I} /></g>)}</g>
    <path d="M28 112c2-16 12-18 24-18h24l8 14h10L88 72h-8" fill="none" stroke={I} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" /><path d="M26 114c2-18 14-20 26-20h22l10 16 14 2-2 8H28z" fill={Y} stroke={I} strokeWidth="2.500" strokeLinejoin="round" />
    <rect x="18" y="60" width="32" height="32" rx="5" fill={PE} stroke={I} strokeWidth="2.500" /><path d="M26 70h16l-8 15z" fill={CH} stroke={I} strokeWidth="1.500" strokeLinejoin="round" /><circle cx="34" cy="75" r="2.200" fill={PE} />
    {[40, 100].map(x => <g key={x} transform={`translate(${x} 122)`}><g className="wh"><circle r="10" fill={I} /><circle r="4.500" fill={W} /><path d="M-9 0h18M0-9v18" stroke={W} strokeWidth="1.500" /></g></g>)}
  </g></g>}</g>
}
