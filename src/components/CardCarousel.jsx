import React, { useEffect, useRef, useState, useCallback } from 'react'

const works = [
  {
    id: 1,
    title: '宝石買取LP',
    client: 'モノループ株式会社',
    link: 'https://monoloop.co.jp/lp/jewery202503',
    img: 'monoloop_jewery.webp',
    year: 2025,
    days: 7,
    description: 'Figmaによるデザイン設計から、AstroによるSSG構築を経て、最終的にはPHP上での運用に対応しました。Astroで生成した静的ファイルをPHPに載せるにあたっては、特にクライアントサイドレンダリングまわりで調整が多く、実装には柔軟性が求められました。意思決定者の「コテコテにしたい」という要望を踏まえ、強めのコーポレートカラーを差し色に用い、CSSアニメーションとIntersection Observer APIを併用して動きのあるデコラティブなUIに仕上げています。すべてのUI要素は画像化せず、可能な限りHTMLとCSSで構成することで、将来的な修正のしやすさにも配慮しました。結果として、従来のLPと比較してCVRを140％に改善しています。',
    as: ["デザイナー", "エンジニア"],
  },
  {
    id: 2,
    title: 'BANDAI TCG CONNECT',
    client: '株式会社バンダイナムコホールディングス',
    link: 'https://www.bandai-tcgconnect.com/',
    img: 'bandai_tcg_connect.webp',
    year: 2020,
    days: 90,
    description: 'コロナ禍における非対面需要に応えるべく、WebRTCを活用したリモート型トレーディングカードゲーム対戦システムを構築しました。情報設計、UIデザイン、UXテストと改善、フロントエンド実装に加え、対戦開始時のムービーなど演出面にも注力。直接対面できない状況を補って余りある没入感と高揚感を意識し、カードバトル本来の臨場感をリモート環境でも体験できるよう設計しました。最盛期には同時接続5000名を超えるなど高い評価を得ました（現在はクローズ済み）。',
    as: ["UI/UXデザイナー", "映像クリエイター"],
  },
  {
    id: 3,
    title: 'Youtube「英語力ミライ会議」シリーズ',
    client: '株式会社ベネッセiキャリア',
    link: 'https://www.youtube.com/results?search_query=%22%E8%8B%B1%E8%AA%9E%E5%8A%9B%E3%83%9F%E3%83%A9%E3%82%A4%E4%BC%9A%E8%AD%B0%22',
    img: 'eigo_mirai.webp',
    year: 2023,
    days: "---",
    description: 'YouTubeチャンネル「英語力ミライ会議」シリーズにおいて、撮影・録音・編集からセットの設営、整音、CG制作、サムネイル作成に至るまで、すべての制作工程を一貫して担当しました。教育系の対談というカタめのテーマでありながら、視聴者の関心を引きつけるよう、キャッチーでドラマティックな構成・演出を意識し、学びに加えてストーリー性のある映像体験を提供しています。',
    as: ["撮影者", "編集者", "ディレクター"],
  },
  {
    id: 4,
    title: 'Appleギフト交換サイト比較LP',
    client: '株式会社ストックラボ',
    link: 'https://point.stock-lab.com/applev3/',
    img: 'point_apple.webp',
    year: 2025,
    days: 2,
    description: 'Appleギフト交換サイトの比較LPにおいて、求められているコテコテなLPデザイン・実装をベースに、スマホ閲覧時の体験最大化を目的とした縦スクロールスナップ構成を導入しました。ファーストビューも極力HTML要素で構築し、検索語句とのマッチ率を高めることで、リスティング広告における品質スコア向上と費用削減に貢献。さらに、複数のスマートフォンブラウザやOSでの検証・最適化を徹底し、従来型LPと比較して約130％のCVRを記録しました。',
    as: ["デザイナー", "エンジニア"],
  },
  {
    id: 5,
    title: 'SMBC 室町不動産クリエイト コーポレートサイト',
    client: '室町不動産クリエイト 株式会社',
    link: 'https://mfc-web.co.jp/',
    img: 'muromachi.webp',
    year: 2017,
    days: 20,
    description: 'もともと保守運用を担当していた企業様より、グループ内合併を機にサイトの全面リニューアルをお任せいただきました。デザインから実装、ホスティングまでを初めて一貫して担当。コーポレートカラーである緑を軸に、シンプルで親しみやすいトーンで設計しました。冊子ベースの情報をWebに落とし込む作業は難航しましたが、当時はまだ主流の一角を担っていたjQueryを活用し、構造はシンプルながら適度にリッチさを感じられる構成とすることで、高い満足をいただきました。',
    as: ["デザイナー", "エンジニア"],
  },
  {
    id: 6,
    title: 'FUJI ROCK FESTIVAL’15 完全版',
    client: 'フジテレビNEXT',
    link: 'https://otn.fujitv.co.jp/b_hp/915200126.html',
    img: 'fuji_2015.webp',
    year: 2015,
    days: 30,
    description: '当時は編集助手として、CG作成・テロップ制作・品質管理を担当。観客としても何度も足を運んでいたフェスの映像制作に携われたことは、自身にとって大きな誇りとなりました。テレビ映像の編集業は体力・集中力ともに求められる現場でしたが、この時期にハードワークに対する自分の適性を実感できたことは大きな収穫でした。この経験を通じて、フジテレビNEXT様だけでなく、WOWOW様など音楽系のソフトウェア制作にも継続的に携わる機会を得るなど、キャリアの礎となった案件です。',
    as: ["映像クリエイター"],
  },
  {
    id: 7,
    title: 'ビズリオ 理想のキャリアへ導くSNS',
    client: '株式会社Tety',
    link: 'https://otn.fujitv.co.jp/b_hp/915200126.html',
    img: 'bizreau.webp',
    year: 2021,
    days: 180,
    description: '現在は閉鎖済みのWebサービス「ビズリオ」にて、新規プロダクト立ち上げ時のMVP検証フェーズから参画しました。一身上の都合により一時離脱したものの、その後UI/UXデザイナー兼フロントエンドエンジニアとして再び参画。途中まで関わっていたプロジェクトに再度加わるという難しさがあるなかで、離脱期間中に蓄積されたデザイン負債の整理と再構築に取り組みました。読み物メディアとしてのリーダビリティを重視し、紙面デザインの原則や約物処理、1行あたりの最適な文字数といった観点についても研究論文を参照しながらUIを再設計。見た目だけでなく、読みやすさと構造の両面で価値のある設計を意識しました。プロダクトとしてはクローズしたものの、このときの縁から株式会社Tetyに参画、そのまま代表が同じ株式会社ストックラボにCOOとしてジョインしました。',
    as: ["UI/UXデザイナー", "フロントエンドエンジニア"],
  },
  {
    id: 7,
    title: '法律事務職員転職.jp',
    client: '株式会社C&Rリーガル・エージェンシー',
    link: 'https://legal-agent.jp/houritsujimushokuin/',
    img: 'legal_office_work.webp',
    year: 2020,
    days: 7,
    description: '構成案とキーカラー（ピンク）の指定のみを受けて、デザイン〜実装までを一貫して担当。軽量かつ動きのあるデザインを意識し、ファーストビューの印象づけと情報導線の整理を両立させました。1週間に満たない短期間でリリースまで完了。顧客とのやり取りも含めて、スピーディにプロジェクトを進行する姿勢はこの時点ですでに確立しており、納期と品質の両立を実現しました。',
    as: ["UI/UXデザイナー", "コーダー"],
  },
]

// CARD_WIDTH に基づいて全てのサイズ・位置を統一
const CARD_WIDTH = 260
const SPEED = 1.2
const SPAWN_INTERVAL = CARD_WIDTH / SPEED * 18

export default function AbsoluteScrollingCards() {
  const [cards, setCards] = useState([])
  const [selectedWork, setSelectedWork] = useState(null)
  const cardIdRef = useRef(0)
  const workIndexRef = useRef(0)

  // カード生成
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTop = Math.random() * (window.innerHeight * 0.75 - 300)

      const newCard = {
        id: cardIdRef.current++,
        workIndex: workIndexRef.current % works.length,
        right: -CARD_WIDTH,
        top: randomTop,
      }

      setCards(prev => [...prev, newCard])
      workIndexRef.current += 1
    }, SPAWN_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  // アニメーション（右→左に流す）
  useEffect(() => {
    let frame

    const animate = () => {
      setCards(prev =>
        prev
          .map(card => ({ ...card, right: card.right + SPEED }))
          .filter(card => card.right < window.innerWidth + CARD_WIDTH)
      )
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="relative w-full h-64">
      {cards.map(card => {
        const work = works[card.workIndex]
        return (
          <div
            key={card.id}
            onClick={() => setSelectedWork(work)}
            className="absolute top-[50px] p-4 bg-gray-800/75 backdrop-blur-3xl rounded-lg shadow hover:brightness-50 cursor-pointer transition mix-blend-color-dodge flex flex-col gap-2 justify-center items-center"
            style={{
              right: `${card.right}px`,
              top: `${card.top}px`,
              width: `${CARD_WIDTH}px`,
            }}
          >
            <img src={`/img/${work.img}`} alt={work.title} className="w-full"/>
            <div className="text-lg text-white font-semibold mt-1 text-center">{work.title}</div>
            <div className="text-sm text-white text-center">{work.client}様（{work.year}）</div>
            {/* <div className="text-sm text-gray-500">{work.year}</div>
            <div className="text-lg font-semibold">{work.title}</div>
            <div className="text-sm text-gray-600">{work.client}</div> */}
          </div>
        )
      })}

      {/* モーダル */}
      {selectedWork && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedWork(null)}
        >
          <div
            className="bg-white p-2 md:p-6 rounded-lg w-full shadow-lg max-w-[90vw] flex flex-col items-center justify-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={`/img/${selectedWork.img}`} alt={selectedWork.title} className="shadow-md"/>
            <a href={selectedWork.link} target="_blank" rel="noopener noreferrer" className="underline hover:underline-offset-2 text-cyan-600">
              <h2 className="text-xl font-bold">{selectedWork.title}</h2>
            </a>
            <p className="text-gray-600">
              <strong>クライアント:</strong> {selectedWork.client}様
            </p>
            <p className="text-gray-600">
              <strong>制作年:</strong> {selectedWork.year}
            </p>
            <p className="text-gray-600">
              <strong>所要日数:</strong> 約{selectedWork.days}日間
            </p>
            <p className="text-gray-700 max-h-24 md:max-h-48 overflow-y-scroll">{selectedWork.description}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setSelectedWork(null)}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  )
}