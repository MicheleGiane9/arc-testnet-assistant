
import { Wallet, RefreshCw, GitBranch, Database, Droplets, Bot, User, Send, ChevronRight, BookOpen, ExternalLink, Globe, Image, Plus } from 'lucide-react';

interface IconWrapperProps {
  name: string;
  className?: string;
  size?: number;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ name, className, size = 20 }) => {
  switch (name) {
    case 'wallet': return <Wallet className={className} size={size} />;
    case 'refresh': return <RefreshCw className={className} size={size} />;
    case 'branch': return <GitBranch className={className} size={size} />;
    case 'database': return <Database className={className} size={size} />;
    case 'droplets': return <Droplets className={className} size={size} />;
    case 'globe': return <Globe className={className} size={size} />;
    case 'image': return <Image className={className} size={size} />;
    case 'plus': return <Plus className={className} size={size} />;
    case 'bot': return <Bot className={className} size={size} />;
    case 'user': return <User className={className} size={size} />;
    case 'send': return <Send className={className} size={size} />;
    case 'chevron-right': return <ChevronRight className={className} size={size} />;
    case 'book': return <BookOpen className={className} size={size} />;
    case 'external': return <ExternalLink className={className} size={size} />;
    default: return <Bot className={className} size={size} />;
  }
};

export default IconWrapper;
