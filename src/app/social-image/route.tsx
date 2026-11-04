/* eslint-disable @next/next/no-img-element -- ImageResponse renders native image elements into a PNG. */
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const dynamic = 'force-static'

export async function GET() {
  const files = await Promise.all([
    readFile(join(process.cwd(), 'public/images/products/kitchen-cleaner-cutout.png')),
    readFile(join(process.cwd(), 'public/images/products/multipurpose-cleaner-cutout.png')),
    readFile(join(process.cwd(), 'public/images/products/shoe-cleaner-cutout.png')),
  ])
  return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%', background: '#fffbf0', color: '#171714', padding: 55, alignItems: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', width: 545 }}>
      <div style={{ display: 'flex', background: '#171714', border: '5px solid #f97316', borderRadius: 14, padding: '16px 22px', fontSize: 32, fontWeight: 700, alignSelf: 'flex-start', marginBottom: 35 }}><span style={{ color: '#f97316' }}>MR </span><span style={{ color: '#fff' }}> GRIME </span><span style={{ color: '#f97316' }}> GURU</span></div>
      <div style={{ display: 'flex', fontSize: 66, lineHeight: 1.06, fontWeight: 700 }}>Big on foam.</div>
      <div style={{ display: 'flex', fontSize: 66, lineHeight: 1.06, fontWeight: 700, color: '#b9460c' }}>Tough on grime.</div>
      <div style={{ display: 'flex', fontSize: 27, marginTop: 28, lineHeight: 1.45 }}>Kitchen, home & shoe foam cleaners</div>
      <div style={{ display: 'flex', fontSize: 22, marginTop: 40 }}>www.mrgrimeguru.com</div>
    </div>
    <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, height: 450 }}>
      {files.map((file, index) => <img key={index} alt="" src={`data:image/png;base64,${file.toString('base64')}`} style={{ objectFit: 'contain', width: 155, height: 440 }} />)}
    </div>
  </div>, { width: 1200, height: 630 })
}
