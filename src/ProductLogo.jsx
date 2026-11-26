'use client'
import { useLive } from './Brand.jsx'

const I = '#06282A', T = '#06A4A5', D = '#0D5353', Y = '#FAFD0F', G = '#33A77A', W = '#fff', R = '#D9482B'
const rd = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }
// Letter strokes with the brand's ink edge and slipped yellow outline
const Body = ({ d, f = T }) => <><g transform="translate(2 -4)"><path d={d} {...rd} stroke={I} strokeWidth="27" /><path d={d} {...rd} stroke={Y} strokeWidth="24" /></g><path d={d} {...rd} stroke={D} strokeWidth="26.500" /><path d={d} {...rd} stroke={f} strokeWidth="23" /></>
const Eye = ({ x, y, r = 12 }) => <g transform={`translate(${x} ${y})`}><g className="pl-blink"><circle r={r} fill={W} stroke={I} strokeWidth="2.400" /><g className="pl-look"><circle r={r * .48} fill={I} /><circle cx={-r * .15} cy={-r * .2} r={r * .15} fill={W} /></g></g></g>
const Leg = ({ c, far }) => <g className={c}><path d="M0 0L2 17" {...rd} stroke={I} strokeWidth="9" /><g transform="translate(2 17)"><g className="pl-shin"><path d="M0 0L-3 16" {...rd} stroke={I} strokeWidth="8" /><path d="M-6 17Q-6 12 0 12L9 15Q14 17 13 21H-6Z" fill={far ? '#E4D70A' : R} stroke={I} strokeWidth="2.400" strokeLinejoin="round" /></g></g></g>
const Glove = () => <><circle r="7" fill={W} stroke={I} strokeWidth="2.400" /><path d="M-3-6Q-1-11 3-7" fill={W} stroke={I} strokeWidth="2.400" strokeLinecap="round" /></>

// Food: the F rides a delivery scooter, bag on the rack, wheels spinning
const Wheel = ({ x }) => <g transform={`translate(${x} 150)`}><g className="pl-spin"><circle r="15" fill="#14181B" stroke={I} strokeWidth="2.400" /><circle r="9" fill="none" stroke="#3A464C" strokeWidth="2" /><path d="M-9 0H9M0-9V9" stroke="#55646B" strokeWidth="2.400" /><circle r="4.500" fill={T} stroke={I} strokeWidth="1.800" /></g></g>
function Runner() {
  return <svg viewBox="0 -10 220 186" aria-hidden="true">
    {[44, 70, 96, 122].map((y, i) => <path key={y} className={`pl-wind w${i}`} d={`M${4 + i * 4} ${y}h${26 - i * 4}`} {...rd} stroke={I} strokeWidth="4.500" />)}
    <clipPath id="pl-gr"><path d="M0 160h220v14H0z" /></clipPath><g clipPath="url(#pl-gr)"><g className="pl-ground"><path d="M-40 167H300" stroke={I} strokeWidth="4" strokeDasharray="26 16" strokeLinecap="round" /></g></g>
    {[0, 1, 2].map(i => <circle key={i} className={`pl-dust d${i}`} cx="30" cy="146" r="6" fill={W} stroke={I} strokeWidth="2" />)}
    <g className="pl-ride">
      <path d="M26 146h10" {...rd} stroke={I} strokeWidth="5" />
      <Wheel x={58} /><Wheel x={172} />
      <g transform="translate(-24 34) scale(.8)"><g className="pl-bag"><path d="M58 48Q56 40 64 40H100Q106 40 106 48V94Q106 102 98 102H66Q58 102 58 94Z" fill={R} stroke={I} strokeWidth="3" /><path d="M58 56H106" stroke={I} strokeWidth="2.400" /><path d="M74 40V33Q82 28 90 33V40" {...rd} stroke={I} strokeWidth="3.500" /><circle cx="82" cy="78" r="14" fill="#FFD84A" stroke={I} strokeWidth="2.400" /><path d="M82 78L92 68M82 78L70 73M82 78L84 92" stroke={I} strokeWidth="1.800" /><circle cx="78" cy="69" r="2.200" fill={R} /><circle cx="90" cy="80" r="2.200" fill={R} /><circle cx="76" cy="83" r="2.200" fill={R} /></g></g>
      <path d="M20 117H66" {...rd} stroke={I} strokeWidth="4" />
      <path d="M34 146Q30 120 58 114H108Q116 114 114 124L108 146Z" fill={T} stroke={I} strokeWidth="3" strokeLinejoin="round" /><path d="M44 128Q60 122 92 124" {...rd} stroke={W} strokeWidth="3" opacity=".55" />
      <path d="M40 146Q58 128 76 146" fill="none" stroke={I} strokeWidth="3" />
      <path d="M100 138H156V146H100Z" fill={D} stroke={I} strokeWidth="2.600" strokeLinejoin="round" />
      <path d="M62 114Q62 104 74 104H104Q112 104 112 112V114Z" fill={I} />
      <path d="M166 92L172 150" {...rd} stroke={I} strokeWidth="6" /><path d="M156 148Q172 128 188 148" fill="none" stroke={I} strokeWidth="3.500" strokeLinecap="round" /><path d="M157 146Q172 131 187 146" fill="none" stroke={Y} strokeWidth="2" strokeLinecap="round" />
      <path d="M146 146L154 98Q156 88 166 88H170L174 100L160 146Z" fill={Y} stroke={I} strokeWidth="3" strokeLinejoin="round" />
      <path d="M164 88L160 70" {...rd} stroke={I} strokeWidth="5" /><path d="M148 70H170" {...rd} stroke={I} strokeWidth="5" /><circle className="pl-lamp" cx="175" cy="80" r="6" fill="#FFF3C4" stroke={I} strokeWidth="2.400" />
      <g className="pl-sit">
        <path d="M86 80L120 88L146 72" {...rd} stroke={I} strokeWidth="6" /><g transform="translate(146 71)"><Glove /></g>
        <g transform="translate(-14 -10) scale(.92)">
          <Body f={W} d="M112 122Q110 84 112 46M112 46Q136 41 160 46M112 86Q130 82 146 86" /><path d="M100 60Q108 64 106 84Q104 100 100 104" {...rd} stroke={I} strokeWidth="4" />
          <Eye x={122} y={50} /><Eye x={147} y={48} /><path d="M114 78Q122 88 132 82" {...rd} stroke={I} strokeWidth="3.600" />
          <path d="M98 36Q102 14 132 16Q158 18 162 36Z" fill={Y} stroke={I} strokeWidth="3" strokeLinejoin="round" /><path d="M150 36Q172 32 184 40Q168 45 150 41Z" fill={R} stroke={I} strokeWidth="2.600" strokeLinejoin="round" />
        </g>
        <path d="M88 104L120 104L124 134" {...rd} stroke={I} strokeWidth="9" /><path d="M116 140Q116 133 123 133L134 136Q139 138 138 142H116Z" fill={R} stroke={I} strokeWidth="2.400" strokeLinejoin="round" />
        <path d="M90 84L124 94L150 74" {...rd} stroke={I} strokeWidth="6" /><g transform="translate(151 73)"><Glove /></g>
      </g>
    </g>
  </svg>
}

// Taxi: the T drives toward you
function Driver() {
  return <svg viewBox="0 0 220 176" aria-hidden="true">
    <path d="M76 70H144L214 170H6Z" fill={I} /><path d="M76 70L6 170M144 70L214 170" stroke={T} strokeWidth="3" />
    <clipPath id="pl-road"><path d="M76 70H144L214 170H6Z" /></clipPath><g clipPath="url(#pl-road)">{[0, 1, 2].map(i => <g key={i} transform="translate(110 70)"><path className={`pl-dash h${i}`} d="M-3 0H3L5 26H-5Z" fill={Y} /></g>)}</g>
    {[0, 1].map(i => <g key={i} transform={`translate(${i ? 150 : 70} 68)`}><g className={`pl-tree ${i ? 'tr' : 'tl'}`}><path d="M-2 0h4v12h-4z" fill="#5B3A21" /><circle cy="-6" r="10" fill={G} stroke={I} strokeWidth="1.600" /></g></g>)}
    <g className="pl-drive"><ellipse cx="110" cy="164" rx="80" ry="7" fill="#000" opacity=".35" />
      <path d="M40 142h24v18q0 5-5 5H45q-5 0-5-5zM156 142h24v18q0 5-5 5h-14q-5 0-5-5z" fill="#14181B" />
      <path d="M62 92Q68 42 82 38Q110 33 138 38Q152 42 158 92Z" fill="#F7F9FA" stroke={I} strokeWidth="3" strokeLinejoin="round" /><path d="M70 91Q76 50 86 46Q110 42 134 46Q144 50 150 91Z" fill="#1F2E36" />
      <clipPath id="pl-glass"><path d="M70 91Q76 50 86 46Q110 42 134 46Q144 50 150 91Z" /></clipPath>
      <g clipPath="url(#pl-glass)"><path d="M118 100V76Q120 70 128 70H138Q146 70 148 78V100Z" fill="#2F444E" /><g className="pl-sway"><g transform="translate(58 31) scale(.86)"><Body d="M14 40Q36 34 64 38M64 38Q64 60 64 96" /><path d="M44 100V50" stroke={T} strokeWidth="23" /><path d="M14 40Q44 33 76 40" {...rd} stroke={T} strokeWidth="23" /><Eye x={31} y={41} r={13} /><Eye x={59} y={41} r={13} /><path d="M35 62Q44 71 54 62" {...rd} stroke={I} strokeWidth="3.600" /><path d="M14 27Q16 8 45 8T76 27Z" fill={Y} stroke={I} strokeWidth="3" /><path d="M12 25Q45 36 78 25L84 32Q45 44 8 32Z" fill={I} /></g></g>
        <path d="M128 44L108 92H118L138 46Z" fill={W} opacity=".14" /></g>
      <g transform="translate(96 97)"><g className="pl-wheel"><circle r="17" fill="none" stroke="#14181B" strokeWidth="6" /><path d="M-15 0H15M0 0V15" stroke="#14181B" strokeWidth="5" /><circle r="5" fill={T} /><g transform="translate(-16 -5)"><Glove /></g><g transform="translate(16 -5)"><Glove /></g></g></g>
      <path d="M34 112Q36 96 56 93Q110 87 164 93Q184 96 186 112L188 142Q188 150 180 150H40Q32 150 32 142Z" fill="#F7F9FA" stroke={I} strokeWidth="3" strokeLinejoin="round" /><path d="M56 99Q110 93 164 99" {...rd} stroke="#C3CDD2" strokeWidth="2" />
      <path d="M78 118H142L136 134H84Z" fill="#1B2226" /><path d="M82 123H138M83 128H137" stroke="#48626F" strokeWidth="1.800" /><circle cx="110" cy="126" r="7" fill={Y} stroke={I} strokeWidth="2" /><path d="M107 129.500L110 122l3 7.500M108.200 127h3.600" {...rd} stroke={I} strokeWidth="1.600" />
      <path className="pl-lamp" d="M42 114Q56 110 70 118L66 128Q52 130 41 126ZM178 114Q164 110 150 118L154 128Q168 130 179 126Z" fill="#FFF3C4" stroke={I} strokeWidth="2.400" strokeLinejoin="round" /><path d="M32 138H188V143Q188 150 180 150H40Q32 150 32 143Z" fill={T} stroke={I} strokeWidth="2.600" /><rect x="90" y="137" width="40" height="10" rx="2" fill={W} stroke={I} strokeWidth="1.800" />
      <path d="M50 84q-12-4-14 6 4 8 16 5zM170 84q12-4 14 6-4 8-16 5z" fill="#F7F9FA" stroke={I} strokeWidth="2.600" /><path d="M90 36L94 24H126L130 36Z" fill={Y} stroke={I} strokeWidth="2.600" strokeLinejoin="round" /><text x="110" y="34" textAnchor="middle" fontSize="10" className="scr-t" fill={I}>TAXI</text>
    </g>
  </svg>
}
const set = { food: Runner, taxi: Driver }
export default function ProductLogo({ id }) { const C = set[id]; return C ? <LogoBox><C /></LogoBox> : null }
function LogoBox({ children }) { const ref = useLive(); return <div className="plogo" ref={ref}>{children}</div> }
