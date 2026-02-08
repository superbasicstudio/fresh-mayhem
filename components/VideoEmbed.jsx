export default function VideoEmbed({ video }) {
  return (
    <div className="card bg-base-200">
      <div className="video-container rounded-t-box">
        <iframe
          src={video.url}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div className="card-body p-4">
        <h3 className="text-sm font-semibold font-body leading-snug">{video.title}</h3>
        <span className="badge badge-ghost badge-sm font-mono text-[10px]">{video.creator}</span>
      </div>
    </div>
  );
}
