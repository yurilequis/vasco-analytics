export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-background z-[100]">
      <div className="h-full bg-accent animate-pulse origin-left" style={{ animation: 'progress 1s ease-in-out infinite alternate' }} />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { width: 0%; opacity: 1; }
          50% { width: 70%; opacity: 0.8; }
          100% { width: 100%; opacity: 0.5; }
        }
      `}} />
    </div>
  );
}
