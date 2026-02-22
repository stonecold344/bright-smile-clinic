import { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Share2, X, MessageCircle, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;

  @media (max-width: 480px) {
    position: static;
  }
`;

const ShareTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.secondary};
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.full};
  color: ${({ theme }) => theme.colors.foreground};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover { background: ${({ theme }) => theme.colors.primaryLight}; color: ${({ theme }) => theme.colors.primary}; }
`;

const Dropdown = styled.div`
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.elevated};
  padding: 0.5rem;
  min-width: 200px;
  z-index: 50;
  animation: ${fadeIn} 0.2s ease-out;

  @media (max-width: 480px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    transform: none;
    border-radius: ${({ theme }) => theme.radii['2xl']} ${({ theme }) => theme.radii['2xl']} 0 0;
    min-width: 100%;
    padding: 1rem;
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }
`;

const ShareOption = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: none;
  background: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.foreground};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};
  direction: rtl;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const IconCircle = styled.div<{ $bg: string; $color: string }>`
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: transparent;

  @media (max-width: 480px) {
    background: rgba(0, 0, 0, 0.4);
  }
`;

// Social platform SVG icons
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

interface SocialShareProps {
  title: string;
  url?: string;
  description?: string;
  image?: string;
}

const SocialShare = ({ title, url, description, image }: SocialShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const shareUrl = url || window.location.href;
  const shareText = description || title;

  const platforms = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={16} />,
      bg: '#25D366',
      color: 'white',
      onClick: () => {
        const text = `${title}\n\n${shareUrl}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      },
    },
    {
      name: 'Facebook',
      icon: <FacebookIcon />,
      bg: '#1877F2',
      color: 'white',
      onClick: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      },
    },
    {
      name: 'X (Twitter)',
      icon: <TwitterIcon />,
      bg: '#000000',
      color: 'white',
      onClick: () => {
        const text = `${title}\n${shareUrl}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
      },
    },
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon />,
      bg: '#0A66C2',
      color: 'white',
      onClick: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
      },
    },
    {
      name: 'Telegram',
      icon: <TelegramIcon />,
      bg: '#0088cc',
      color: 'white',
      onClick: () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, '_blank');
      },
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('הקישור הועתק!');
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <Wrapper ref={wrapperRef}>
      <ShareTrigger onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={16} /> : <Share2 size={16} />}
        שיתוף
      </ShareTrigger>

      {isOpen && (
        <>
          <Backdrop onClick={() => setIsOpen(false)} />
          <Dropdown>
            {platforms.map((p) => (
              <ShareOption key={p.name} onClick={() => { p.onClick(); setIsOpen(false); }}>
                <IconCircle $bg={p.bg} $color={p.color}>
                  {p.icon}
                </IconCircle>
                {p.name}
              </ShareOption>
            ))}
            <ShareOption onClick={handleCopyLink}>
              <IconCircle $bg="hsl(200, 20%, 90%)" $color="hsl(200, 50%, 30%)">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </IconCircle>
              {copied ? 'הקישור הועתק!' : 'העתק קישור'}
            </ShareOption>
          </Dropdown>
        </>
      )}
    </Wrapper>
  );
};

export default SocialShare;
