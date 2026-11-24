// Phone scenes, 158 x 244. Each runs on one 5.2s loop; .clk lets the character read the time.
const I = '#06282A', T = '#06A4A5', Y = '#FAFD0F', G = '#33A77A', W = '#fff', M = '#E7F4F0', R = '#D9482B', D = '#0D5353', S = '#476163'
const Tx = ({ s = 11, f = I, b, a, children, ...p }) => <text className={b ? 'scr-b' : 'scr-t'} fontSize={s} fill={f} textAnchor={a} {...p}>{children}</text>
const Clk = () => <g className="clk" />
const at = t => ({ animationDelay: `${t}ms` })

const Milk = () => <><path d="M-9-6l4-8h10l4 8v22h-18z" fill={W} stroke={I} strokeWidth="1.600" strokeLinejoin="round" /><path d="M-9-6h18M-5-14h10" stroke={I} strokeWidth="1.600" /><path d="M-9 2h18v8h-18z" fill={T} /></>
const Apple = () => <><path d="M0-7C-6-13-15-8-14 2C-13 11-6 18 0 14C6 18 13 11 14 2C15-8 6-13 0-7Z" fill={R} /><path d="M-9-2q1-5 5-5" fill="none" stroke="#F2A08E" strokeWidth="2" strokeLinecap="round" /><path d="M0-7q0-6 4-9" fill="none" stroke={I} strokeWidth="2" strokeLinecap="round" /><path d="M3-11q7-5 10 0q-6 4-10 0z" fill={G} /></>
const Bread = () => <><path d="M-15 12V-3C-19-13-6-15 0-13C6-15 19-13 15-3V12z" fill="#E7B265" stroke="#A8712C" strokeWidth="1.600" strokeLinejoin="round" /><path d="M-11 9V-3q-1-6 5-6H6q6 0 5 6V9z" fill="#F8DFB0" /></>
const Juice = () => <><path d="M-4-16h8v6l4 6v18q0 2-2 2H-6q-2 0-2-2V-4l4-6z" fill="#F39A2B" /><path d="M-8 0h16v9H-8z" fill={W} /><path d="M-4.500-17h9v4h-9z" fill={I} /><circle cy="4.500" r="3" fill="#F39A2B" /></>
export function Quick() {
  return <><Clk /><path d="M0 0h158v244H0z" fill={W} /><path d="M0 0h158v58H0z" fill={T} /><Tx x="14" y="22" s="13">Groceries, now</Tx><rect x="12" y="31" width="134" height="20" rx="10" fill={W} /><circle cx="25" cy="40" r="4" fill="none" stroke={S} strokeWidth="1.800" /><path d="M28 43l3 3" stroke={S} strokeWidth="1.800" /><Tx b x="38" y="44.500" s="9" f={S}>Search milk, fruit, bread</Tx>
    {[[12, 66], [82, 66], [12, 126], [82, 126]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width="64" height="54" rx="9" fill={M} /><circle cx={x + 54} cy={y + 44} r="7" fill={G} /><path d={`M${x + 51} ${y + 44}h6m-3-3v6`} stroke={W} strokeWidth="1.800" /></g>)}
    {[[40, 92, Milk], [110, 92, Apple], [40, 152, Bread], [110, 152, Juice]].map(([x, y, C], i) => <g key={i} transform={`translate(${x} ${y})`}><C /></g>)}
    <path d="M0 188h158v56H0z" fill={W} /><path d="M0 188h158" stroke="#DDE6E3" strokeWidth="1.500" />
    {[[40, 92, Milk], [110, 92, Apple], [40, 152, Bread]].map(([x, y, C], i) => <g key={i} transform={`translate(${x} ${y})`}><g className={`fly fly${i}`}><g transform="scale(.9)"><C /></g></g></g>)}
    <rect x="12" y="200" width="134" height="32" rx="12" fill={I} /><g className="cart"><path d="M24 210h4l3 11h12l3-8H30" fill="none" stroke={Y} strokeWidth="2.400" strokeLinejoin="round" strokeLinecap="round" /><circle cx="33" cy="226" r="2" fill={Y} /><circle cx="42" cy="226" r="2" fill={Y} /></g><Tx x="134" y="220" s="11.500" f={Y} a="end">View cart</Tx></>
}

const jobs = [['AC service', 'M0-9V9M-9 0H9M-6-6L6 6M-6 6L6-6'], ['Plumbing', 'M-9-4H4q5 0 5 5v6M-3-4v-5M-7-9H1'], ['Cleaning', 'M0-10v9M-5 9l1-9h8l1 9z'], ['Electrician', 'M2-10L-6 2h5l-2 8 9-13h-6z']]
export function Service() {
  return <><Clk /><path d="M0 0h158v244H0z" fill="#F6FAF9" /><Tx x="14" y="24" s="14">Home services</Tx><Tx b x="14" y="38" s="9.500" f={S}>Who do you need today?</Tx>
    {jobs.map(([n, p], i) => <g key={n} transform={`translate(0 ${48 + i * 34})`}><rect x="12" width="134" height="28" rx="9" fill={W} stroke="#DDE6E3" /><circle cx="28" cy="14" r="10" fill={[T, G, Y, I][i]} /><g transform="translate(28 14) scale(.62)"><path className={i === 0 ? 'fan' : ''} d={p} fill="none" stroke={i === 3 ? Y : I} strokeWidth="3.200" strokeLinecap="round" strokeLinejoin="round" /></g><Tx x="46" y="18" s="11">{n}</Tx><circle cx="132" cy="14" r="5.500" fill="none" stroke="#B9C8C4" strokeWidth="1.800" /></g>)}
    <g className="pickbar"><rect x="12" y="48" width="134" height="28" rx="9" fill="none" stroke={T} strokeWidth="2.600" /><circle cx="132" cy="62" r="4" fill={T} /></g>
    <g className="sheet"><path d="M0 186q0-9 9-9h140q9 0 9 9v62H0z" fill={D} /><circle cx="29" cy="208" r="15" fill={M} /><clipPath id="svp"><circle cx="29" cy="208" r="15" /></clipPath><g clipPath="url(#svp)"><circle cx="29" cy="206" r="6" fill="#A06A45" /><path d="M20 203q1-9 9-9t9 9z" fill={Y} /><path d="M18 203h22" stroke={I} strokeWidth="1.600" /><path d="M14 226q0-13 15-13t15 13z" fill={T} /></g><Tx x="52" y="205" s="12" f={W}>Expert booked</Tx><Tx b x="52" y="218" s="9.500" f="#B9D6D4">On the way to you</Tx><path d="M132 203l4 5 8-10" fill="none" stroke={Y} strokeWidth="3.500" strokeLinecap="round" strokeLinejoin="round" /></g></>
}

export function Hotel() {
  const win = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) win.push([44 + c * 19, 42 + r * 21, (r * 3 + c * 5) % 7])
  return <><Clk /><path d="M0 0h158v244H0z" fill={W} /><path d="M0 0h158v146H0z" fill="#123B4A" /><path d="M0 70h158v76H0z" fill="#1B5363" /><g className="moon"><circle cx="130" cy="26" r="11" fill="#FFF3C4" /><circle cx="135" cy="22" r="9" fill="#123B4A" /></g>{[[14, 18], [30, 40], [146, 60], [60, 12], [100, 16]].map(([x, y], i) => <circle key={x} className="star" style={at(i * 300)} cx={x} cy={y} r="1.300" fill={W} />)}
    <path d="M0 146V96h22v50M138 146V84h20v62" fill="#0D2E39" /><rect x="34" y="30" width="90" height="116" rx="3" fill="#EEE5D6" /><path d="M34 30h90v5H34z" fill="#C9B795" /><path d="M116 30h8v116h-8z" fill="#DDD0B8" /><path d="M58 22h42v10H58z" fill={T} /><Tx x="79" y="30" s="8.500" f={W} a="middle">HOTEL</Tx>
    {win.map(([x, y, n], i) => <g key={i}><rect x={x} y={y} width="12" height="14" rx="1.500" fill="#2A4A57" /><rect className="lit2" style={at(200 + n * 260)} x={x} y={y} width="12" height="14" rx="1.500" fill="#FFD774" /></g>)}
    <path d="M66 146v-18h26v18z" fill="#5B3A21" /><path d="M79 128v18" stroke="#C9B795" /><path d="M60 128h38l4-6H56z" fill={R} /><path d="M0 146h158v4H0z" fill="#0A2530" />
    <Tx x="14" y="170" s="13">Deluxe room</Tx><Tx b x="14" y="183" s="9.500" f={S}>Two guests</Tx><rect x="104" y="158" width="42" height="26" rx="8" fill={M} /><Tx x="125" y="175" s="9.500" a="middle">2 nights</Tx>
    <g className="bookbtn"><rect x="12" y="198" width="134" height="32" rx="12" fill={I} /><Tx x="79" y="218" s="12" f={Y} a="middle">Book room</Tx></g><g className="booked"><rect x="12" y="198" width="134" height="32" rx="12" fill={G} /><path d="M48 214l5 5 9-11" fill="none" stroke={I} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><Tx x="70" y="218" s="12">Booked</Tx></g></>
}

const Ic = {
  Food: <><circle r="11" fill="#E39A3B" /><circle r="8.500" fill="#FFD84A" /><circle cx="-3" cy="-3" r="2" fill={R} /><circle cx="4" cy="1" r="2" fill={R} /><circle cx="-2" cy="4" r="1.800" fill={R} /></>,
  Taxi: <><path d="M-13 5V1l4-1.500 3.500-6h10l4 6 4.500 1.500v4z" fill={W} /><path d="M-7-1l2.500-4.500h4V-1zM1-1v-4.500h3L7-1z" fill={I} /><circle cx="-7" cy="5.500" r="3.200" fill={I} /><circle cx="7" cy="5.500" r="3.200" fill={I} /></>,
  Quick: <g transform="scale(.72)"><Apple /></g>,
  Services: <path d="M8-9a6.500 6.500 0 0 0-9 8L-9 7a3 3 0 0 0 4 4l8-8a6.500 6.500 0 0 0 8-9l-4 4-3.500-1-1-3.500z" fill={Y} />,
  Hotels: <><path d="M-9 10V-10H9V10z" fill="#EEE5D6" /><path d="M-5-6h3v3h-3zM2-6h3v3H2zM-5 0h3v3h-3zM2 0h3v3H2z" fill="#B98B2E" /><path d="M-2.500 10V5.500h5V10z" fill="#5B3A21" /></>,
  AI: <><path d="M-8-5h16v13H-8z" fill={W} /><path d="M0-5v-5" stroke={W} strokeWidth="2" /><circle cy="-11" r="2.400" fill={Y} /><circle cx="-3.500" cy="1" r="2" fill={I} /><circle cx="3.500" cy="1" r="2" fill={I} /></>,
}
const tiles = Object.entries(Ic).map(([n, g], i) => ({ n, g, x: 30 + (i % 3) * 49, y: 78 + Math.floor(i / 3) * 64, f: [D, T, '#DDF3EC', I, '#1B5363', G][i], i }))
export function Super() {
  return <><Clk /><path d="M0 0h158v244H0z" fill={Y} /><Tx x="79" y="28" s="17" a="middle">One app</Tx><Tx b x="79" y="43" s="10" a="middle">Everything inside</Tx>
    {tiles.map(t => <g key={t.n} transform={`translate(${t.x} ${t.y})`}><g className="tile" style={at(t.i * 110)}><g className="tp" style={at(1100 + t.i * 600)}><rect x="-19" y="-19" width="38" height="38" rx="12" fill={t.f} /><rect x="-16.500" y="-16.500" width="38" height="38" rx="12" fill="none" stroke={I} strokeWidth="1.500" />{t.g}</g><Tx x="1" y="34" s="10" a="middle">{t.n}</Tx></g></g>)}
    <rect x="12" y="196" width="134" height="36" rx="16" fill={I} /><g className="dock">{[0, 1, 2, 3].map(i => <circle key={i} cx={40 + i * 26} cy="214" r="7" fill={[T, Y, G, W][i]} />)}</g></>
}

export function Ai() {
  const N = [[34, 58], [79, 38], [124, 58], [44, 98], [79, 80], [114, 98]], L = [[0, 1], [1, 2], [0, 4], [1, 4], [2, 4], [3, 4], [4, 5], [0, 3], [2, 5]]
  return <><Clk /><path d="M0 0h158v244H0z" fill="#071F22" />{[...Array(5)].map((_, i) => <path key={i} d={`M0 ${i * 28 + 12}H158M${i * 34 + 12} 0V124`} stroke="#0D3A3E" strokeWidth="1" />)}
    {L.map(([a, b]) => <path key={a + '-' + b} d={`M${N[a]}L${N[b]}`} stroke={T} strokeWidth="1.600" opacity=".7" />)}{N.map(([x, y], i) => <g key={x + '' + y} transform={`translate(${x} ${y})`}><g className="node" style={at(i * 260)}><circle r={i === 4 ? 13 : 7} fill={i === 4 ? Y : T} /></g></g>)}<Tx x="79" y="84" s="11" a="middle">AI</Tx>
    <rect x="12" y="122" width="134" height="26" rx="13" fill={W} /><Tx b x="24" y="139" s="10.500">Build my idea</Tx><g className="caret"><path d="M87 130v11" stroke={T} strokeWidth="2" /></g><circle cx="133" cy="135" r="9" fill={I} /><path d="M133 139v-8m-3.500 3.500l3.500-3.500 3.500 3.500" fill="none" stroke={Y} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <g className="bld b0"><rect x="12" y="158" width="134" height="20" rx="7" fill={T} /><rect x="22" y="165" width="46" height="6" rx="3" fill={W} /></g><g className="bld b1"><rect x="12" y="184" width="63" height="46" rx="9" fill={G} /><path d="M22 218l12-14 9 9 7-6 12 14z" fill={W} opacity=".9" /><circle cx="58" cy="196" r="4" fill={Y} /></g><g className="bld b2"><rect x="82" y="184" width="64" height="20" rx="7" fill="#12474A" /><rect x="91" y="191" width="40" height="6" rx="3" fill="#8FC9C8" /></g><g className="bld b3"><rect x="82" y="210" width="64" height="20" rx="10" fill={Y} /><Tx x="114" y="224" s="10.500" a="middle">Launch</Tx></g></>
}
