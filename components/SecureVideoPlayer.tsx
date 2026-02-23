import React from 'react';

interface SecureVideoPlayerProps {
    provider: 'vimeo' | 'panda' | 'youtube';
    videoId: string;
    title?: string;
}

export const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({ provider, videoId, title }) => {
    // This component dynamically renders the corresponding Player Iframe
    // ensuring that we don't expose raw video files and leverage the CDN's DRM

    if (provider === 'panda') {
        // Panda Video uses a highly secured script + iframe combination 
        // to prevent downloads and piracy in the infoproduct market.
        return (
            <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[rgb(var(--color-swan))] bg-black aspect-video flex-shrink-0">
                <iframe
                    id={`panda-${videoId}`}
                    src={`https://player-vz-00000000.tv.pandavideo.com.br/embed/?v=${videoId}`}
                    className="absolute top-0 left-0 w-full h-full border-none"
                    allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                    allowFullScreen
                    title={title || "Aula em Vídeo Protegida"}
                ></iframe>
            </div>
        );
    }

    if (provider === 'vimeo') {
        // Vimeo Pro requires domain-level privacy (configured in Vimeo dashboard)
        // Set 'Where can this be embedded?' to your exact deployed domain.
        return (
            <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[rgb(var(--color-swan))] bg-black aspect-video flex-shrink-0">
                <iframe
                    src={`https://player.vimeo.com/video/${videoId}?h=00000000&color=1cb0f6&title=0&byline=0&portrait=0`}
                    className="absolute top-0 left-0 w-full h-full border-none"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={title || "Aula em Vídeo Protegida"}
                ></iframe>
            </div>
        );
    }

    // Fallback: YouTube (Public/Unlisted)
    return (
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[rgb(var(--color-swan))] bg-black aspect-video flex-shrink-0">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                className="absolute top-0 left-0 w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={title || "Aula em Vídeo Publica"}
            ></iframe>
        </div>
    );
};
