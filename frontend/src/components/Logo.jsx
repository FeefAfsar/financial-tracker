export default function Logo({ size = 24, className = "" }) {
  return (
    <img 
      src="/logo.svg" 
      alt="Fin-Core" 
      width={size} 
      height={size} 
      className={className} 
    />
  );
}