const I = '#06282A', T = '#06A4A5', W = '#fff', Y = '#FAFD0F'
const Tx = p => <text className="scr-t" fill={I} {...p} />

// Sedan seen from above, nose pointing right, centred on 0,0 (about 40 x 18)
export const TopCar = () => <>
  <path d="M-20 6C-21 13 21 13 22 5L22 9C20 13-18 14-20 10Z" fill="#000" opacity=".16" /><rect x="-19" y="-7" width="41" height="19" rx="8" fill="#000" opacity=".16" />
  <path d="M9-9.500l3-3 2.500.5-2 3.500zM9 9.500l3 3 2.500-.5-2-3.500z" fill="#14181B" />
  <path d="M-20-5C-20-8-18-9-14-9L10-9.300C16-9.300 21-7.500 21.500-3.500V3.500C21 7.500 16 9.300 10 9.300L-14 9C-18 9-20 8-20 5Z" fill="#1B2226" />
  <path d="M-18.500-4.500C-18.500-7-17-7.800-13.500-7.800L10-8C15-8 19.500-6.500 20-3V3C19.500 6.500 15 8 10 8L-13.500 7.800C-17 7.800-18.500 7-18.500 4.500Z" fill="#F7F9FA" />
  <path d="M10-8C15-8 19.500-6.500 20-3V3C19.500 6.500 15 8 10 8C12 3 12-3 10-8Z" fill="#E1E7EA" /><path d="M13-4.500L18-3.200M13 4.500L18 3.200" stroke="#C3CDD2" strokeWidth=".8" strokeLinecap="round" />
  <path d="M4.500-6.600L9.500-7.200C11.300-3 11.300 3 9.500 7.200L4.500 6.600C5.800 2.500 5.800-2.500 4.500-6.600Z" fill="#1F2E36" /><path d="M5.500-5.800L8.500-6.300C9.300-4 9.600-2 9.700 0L6.300 0C6.300-2 6-4 5.500-5.800Z" fill="#48626F" />
  <path d="M-10.500-6.200L-14-6.800C-15.600-3-15.600 3-14 6.800L-10.500 6.200C-11.500 2.500-11.500-2.500-10.500-6.200Z" fill="#1F2E36" />
  <path d="M-9.500-7.200H3.500L4.500-6.300H-10zM-9.500 7.200H3.500L4.500 6.300H-10z" fill="#2A3B44" /><rect x="-10" y="-5.800" width="14.500" height="11.600" rx="2.500" fill="#fff" /><path d="M-9-4.800H3.500" stroke="#E9EEF0" strokeWidth="1.200" />
  <path d="M-7-1.800h8v3.600h-8z" fill={T} /><path d="M18.500-6.200L20.600-4V-6.300zM18.500 6.200L20.600 4V6.300z" fill="#FFE9A8" /><path d="M-18.700-6.500h1.600v3.200h-1.600zM-18.700 3.300h1.600v3.200h-1.600z" fill="#E0342B" />
</>

// Map tiles: real street hierarchy, park, water, then route. The whole map is turned a little.
export function RideMap({ still }) {
  return <g>
    <path d="M0 0h158v244H0z" fill="#E9EDEA" />
    <g transform="rotate(-7 79 90)">
      <path d="M-30 -30H30V62H-30z" fill="#CDE7CF" /><path d="M128 172C140 150 150 160 190 140V230H120z" fill="#B7DDE9" />
      {[[36, -24, 24, 24], [36, 6, 24, 18], [64, -24, 26, 46], [36, 32, 54, 22], [36, 72, 20, 30], [62, 72, 28, 14], [62, 92, 28, 28], [36, 108, 20, 14], [-20, 72, 40, 24], [-20, 104, 40, 18], [118, -20, 30, 34], [118, 22, 18, 30], [140, 22, 26, 30], [118, 70, 40, 24], [118, 102, 26, 20], [36, 166, 24, 30], [66, 166, 24, 30], [-20, 166, 40, 30]].map(([x, y, w, h]) => <rect key={x + '-' + y} x={x} y={y} width={w} height={h} rx="2" fill="#DDE2DF" />)}
      <path d="M28-40V230M-40 64H200M62 64V140M-40 100H28M146-40V230" stroke="#fff" strokeWidth="5" /><path d="M-40 144H200M104-40V230" stroke="#D3D9D6" strokeWidth="17" /><path d="M-40 144H200M104-40V230" stroke="#fff" strokeWidth="15" /><path d="M-40 144H90M118 144H200M104-40V130" stroke="#E3C86A" strokeWidth=".8" strokeDasharray="5 5" />
      <path d="M26 144H92Q104 144 104 132V46" fill="none" stroke="#0B5D63" strokeWidth="7" strokeLinecap="round" /><path d="M26 144H92Q104 144 104 132V46" fill="none" stroke={T} strokeWidth="4.500" strokeLinecap="round" />
      <circle cx="26" cy="144" r="6" fill={I} /><circle cx="26" cy="144" r="2.500" fill={W} />
      <g transform={still ? 'translate(62 144)' : undefined}><g className={still ? '' : 'cab'}><circle r="20" fill={T} opacity=".22" className="ping" /><g transform="scale(1.22)"><TopCar /></g></g></g>
      <ellipse cx="104" cy="44" rx="7" ry="3" fill="#000" opacity=".2" />
      <g className="pin"><path d="M104 44V30" stroke={I} strokeWidth="3" strokeLinecap="round" /><circle cx="104" cy="22" r="12" fill={I} /><circle cx="104" cy="22" r="4.500" fill={Y} /></g>
    </g>
    <path d="M0 176q0-10 10-10h138q10 0 10 10v78H0z" fill={W} /><path d="M0 176q0-10 10-10h138q10 0 10 10" fill="none" stroke="#C9D3D0" strokeWidth="1" /><path d="M68 173h22" stroke="#C9D3D0" strokeWidth="3" strokeLinecap="round" />
    <circle cx="27" cy="198" r="14" fill="#DDF3EC" /><clipPath id="avt"><circle cx="27" cy="198" r="14" /></clipPath><g clipPath="url(#avt)"><circle cx="27" cy="194" r="5.500" fill="#8A5A3B" /><path d="M21 193q0-8 6-8t6 8q-2-4-6-4t-6 4z" fill={I} /><path d="M14 216q0-14 13-14t13 14z" fill={I} /><path d="M24 202l3 4 3-4z" fill={W} /></g>
    <Tx x="47" y="196" fontSize="11.500">Arriving soon</Tx><text x="47" y="208" fontSize="9" className="scr-b" fill="#476163">White sedan</text>
    <circle cx="136" cy="198" r="12" fill={I} /><path transform="translate(129.500 191.500) scale(.54)" d="M6 3h3l2 5-2.500 2a12 12 0 0 0 5.500 5.500l2-2.500 5 2v3a3 3 0 0 1-3 3A16 16 0 0 1 3 6a3 3 0 0 1 3-3z" fill={W} />
    <path d="M16 228h126" stroke="#DDE6E3" strokeWidth="5" strokeLinecap="round" /><g className={still ? '' : 'eta'}><path d="M16 228h126" stroke={T} strokeWidth="5" strokeLinecap="round" transform={still ? 'translate(16 0) scale(.5 1) translate(-16 0)' : undefined} /></g>
  </g>
}

// Side view for the road on the home page
const Wheel = ({ x }) => <g transform={`translate(${x} 52)`}><circle r="14" fill="#14181B" /><g className="wh2"><circle r="9.500" fill="#C9D3D8" /><circle r="8" fill="#8FA0A8" />{[0, 72, 144, 216, 288].map(a => <path key={a} transform={`rotate(${a})`} d="M-1.600 0L-2.400-8.500H2.400L1.600 0z" fill="#EEF2F4" />)}<circle r="2.400" fill="#5E6E76" /></g></g>
// Car pulls up, the passenger opens the rear door, gets in, and they leave.
export function Boarding() {
  return <svg className="board" viewBox="0 0 208 70" aria-hidden="true">
    <g className="bd-car"><ellipse cx="104" cy="66" rx="94" ry="3.500" fill="#000" opacity=".35" />
    <path d="M5 45C4 36 8 31 18 29L48 26C58 14 70 7 88 6H114C132 6 144 14 157 25L187 30C199 32 204 38 203 47C203 52 200 54 195 54H12C7 54 5 51 5 45Z" fill="#F7F9FA" />
    <path d="M5 45C5 51 7 54 12 54H195C200 54 203 52 203 47L202 43C150 47 60 47 6 41Z" fill="#CFD8DC" /><path d="M14 33C70 36 140 36 196 36" fill="none" stroke="#fff" strokeWidth="1.500" />
    <path d="M57 26C65 16 74 11.500 88 11H99V27z" fill="#1F2E36" /><path d="M104 11H113C127 11 137 17 147 26.500L104 27z" fill="#1F2E36" /><path d="M66 22C72 16 78 13 86 12.500L76 26.200 60 26.200zM112 12L104 22V12z" fill="#48626F" />
    <path d="M101.500 10V50M58 28C56 36 57 44 60 50M149 28C152 36 151 44 147 50" fill="none" stroke="#B4C0C6" strokeWidth="1.200" /><path d="M86 33h8M130 33h8" stroke="#8FA0A8" strokeWidth="2.200" strokeLinecap="round" /><path d="M146 25l8-1 1 4-7 1z" fill="#1B2226" />
    <path d="M66 41H140L136 46H63z" fill={T} /><path d="M188 31C196 32 200 35 201 39L190 37z" fill="#FFF3C4" stroke="#B4C0C6" strokeWidth=".8" /><path d="M7 33L17 31 16 37 6 38z" fill="#E0342B" /><path d="M198 46h5v5h-7z" fill="#1B2226" />
    <path d="M30 54a16.500 16.500 0 0 1 33 0zM146 54a16.500 16.500 0 0 1 33 0z" fill="#1B2226" /><Wheel x={46.500} /><Wheel x={162.500} />
  
      <g className="bd-hole"><path d="M60 27L99 27V50H63C58 44 57 34 60 27Z" fill="#0B1215" /><path d="M64 43h30v5H66z" fill="#3A2A22" /></g>
      <g className="bd-door"><path d="M57 26C65 16 74 11.500 88 11H101V51H62C57 45 55 34 57 26Z" fill="#EDF1F3" stroke="#9FB0B8" strokeWidth="1.200" /><path d="M61 25.500C68 17.500 76 14.500 88 14H98V26.500z" fill="#1F2E36" /><path d="M70 23C76 17.500 80 16 86 15.800L78 25.500H66z" fill="#48626F" /><path d="M64 41H101V46H62z" fill={T} /><path d="M66 33h8" stroke="#8FA0A8" strokeWidth="2.200" strokeLinecap="round" /></g>
     <g className="bd-sit"><circle cx="84" cy="19" r="6" fill="#B57A52" /><path d="M77.500 19q0-8 7-8t6.500 6q-4-2-7-1.500t-6.500 3.500z" fill="#14181B" /><path d="M73 27q1-5 11-5t11 5z" fill="#FAFD0F" /></g>
    </g>
    <g className="bd-man"><ellipse cx="0" cy="66" rx="11" ry="2" fill="#000" opacity=".35" />
      <g transform="translate(0 42)"><g className="bd-l1"><path d="M0 0V20" stroke="#22384A" strokeWidth="6" strokeLinecap="round" /><path d="M0 21.500h5" stroke={W} strokeWidth="3.500" strokeLinecap="round" /></g><g className="bd-l2"><path d="M0 0V20" stroke="#2F4C63" strokeWidth="6" strokeLinecap="round" /><path d="M0 21.500h5" stroke={W} strokeWidth="3.500" strokeLinecap="round" /></g></g>
      <path d="M-6.500 41V24Q-6.500 17 0 17T6.500 24V41Q0 44-6.500 41Z" fill={Y} /><path d="M-6.500 20Q-12 22-11 34Q-9 38-6 36z" fill={T} /><g transform="translate(1 22)"><g className="bd-arm"><path d="M0 0L5 13" stroke="#E0E30C" strokeWidth="5" strokeLinecap="round" /><circle cx="5.500" cy="15" r="2.800" fill="#B57A52" /></g></g>
      <path d="M-2 13h4v5h-4z" fill="#A06A45" /><circle cx="0.500" cy="8.500" r="6.500" fill="#B57A52" /><path d="M-6.500 9C-8-1 7-2 7 5.500C3 4 0 4-2 6C-2 9-4 11-5 11Z" fill="#14181B" /><circle cx="4" cy="8.500" r=".9" fill="#14181B" /></g>
  </svg>
}
