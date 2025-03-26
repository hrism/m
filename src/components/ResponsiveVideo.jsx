import React, { useEffect, useRef, useState } from 'react'

export default function ResponsiveVideo({ src }) {
    const videoRef = useRef(null)
    const [isFullWidth, setIsFullWidth] = useState(false)

    useEffect(() => {
        const checkWidth = () => {
            const video = videoRef.current
            if (!video) {
                // console.log('[videoRef] null')
                return
            }

            const renderedWidth = video.clientWidth
            const intrinsicWidth = video.videoWidth
            const screenWidth = window.innerWidth

            //   console.log('[checkWidth] renderedWidth:', renderedWidth)
            //   console.log('[checkWidth] intrinsic videoWidth:', intrinsicWidth)
            //   console.log('[checkWidth] screenWidth:', screenWidth)

            if (renderedWidth < screenWidth) {
                // console.log('[class] → w-full 適用')
                setIsFullWidth(true)
            } else {
                // console.log('[class] → w-full 非適用')
                setIsFullWidth(false)
            }
        }

        const video = videoRef.current
        if (!video) {
            //   console.log('[videoRef] 初期取得失敗')
            return
        }

        if (video.readyState >= 1) {
            //   console.log('[readyState] メタデータ取得済み → 即チェック')
            requestAnimationFrame(checkWidth)
        } else {
            //   console.log('[readyState] 未取得 → イベント待機')
            video.addEventListener('loadedmetadata', () => {
                // console.log('[loadedmetadata] 発火')
                requestAnimationFrame(checkWidth)
            })
        }

        window.addEventListener('resize', checkWidth)

        return () => {
            window.removeEventListener('resize', checkWidth)
        }
    }, [src])

    return (
        <video
            ref={videoRef}
            src={src}
            loop
            muted
            autoPlay
            playsInline
            className={`h-screen object-cover ${isFullWidth ? 'w-full' : ''}`}
        />
    )
}
