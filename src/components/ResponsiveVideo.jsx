import React, { useEffect, useRef, useState } from 'react'

export default function ResponsiveVideo({ src }) {
    const videoRef = useRef(null)
    const [isFullWidth, setIsFullWidth] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const checkWidth = () => {
            const video = videoRef.current
            if (!video) {
                return
            }

            const renderedWidth = video.clientWidth
            const intrinsicWidth = video.videoWidth
            const screenWidth = window.innerWidth

            if (renderedWidth < screenWidth) {
                setIsFullWidth(true)
            } else {
                setIsFullWidth(false)
            }
        }

        const video = videoRef.current
        if (!video) {
            return
        }

        // 動画の自動再生を確実にする
        const playVideo = async () => {
            try {
                console.log('動画の再生を試行中...')
                await video.play()
                console.log('動画の再生に成功しました')
                setIsLoaded(true)
            } catch (error) {
                console.log('動画の自動再生に失敗しました:', error)
                // ユーザーアクションを待つか、別の対策を実行
                setIsLoaded(false)
            }
        }

        if (video.readyState >= 1) {
            requestAnimationFrame(checkWidth)
            playVideo()
        } else {
            video.addEventListener('loadedmetadata', () => {
                requestAnimationFrame(checkWidth)
            })
            video.addEventListener('canplay', playVideo)
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
            preload="auto"
            className={`h-screen object-cover ${isFullWidth ? 'w-full' : ''}`}
            onError={(e) => {
                console.error('動画読み込みエラー:', e)
                console.error('Error details:', e.target.error)
            }}
            onLoadStart={() => console.log('動画読み込み開始')}
            onLoadedData={() => console.log('動画データ読み込み完了')}
            onCanPlay={() => console.log('動画再生可能')}
            onPlay={() => console.log('動画再生開始')}
            onPause={() => console.log('動画一時停止')}
            onStalled={() => console.log('動画ストール')}
            onSuspend={() => console.log('動画サスペンド')}
            onWaiting={() => console.log('動画待機中')}
        />
    )
}
