import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ 
  className = "", 
  size = 40, 
  href = "/", 
  showText = true
}) {
  return (
    <Link href={href} className={`flex items-center gap-3 group ${className}`}>
      <div 
        className="relative shrink-0" 
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt="HeritageGuard"
          fill
          className="object-contain"
          priority
        />
      </div>
      
      {showText && (
        <div className="flex flex-col transition-colors">
          <span className="font-bold text-lg leading-none tracking-tight text-gray-900 dark:text-dark-text">
            HeritageGuard
          </span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-widest leading-none text-gray-500 dark:text-dark-text-muted">
            AI Structural Monitoring
          </span>
        </div>
      )}
    </Link>
  );
}
