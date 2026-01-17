import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Accessibility, 
  Eye, 
  MousePointer, 
  Minus, 
  Plus, 
  RotateCcw,
  X,
  Pause,
  Link2,
  Contrast
} from 'lucide-react';

const WidgetButton = styled.button<{ $isOpen: boolean; $isOnDark: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $isOnDark, theme }) => $isOnDark ? '#ffffff' : theme.colors.primary};
  color: ${({ $isOnDark, theme }) => $isOnDark ? theme.colors.primary : '#ffffff'};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.card};
  z-index: 9999;
  transition: all ${({ theme }) => theme.transitions.normal};
  border: 2px solid ${({ $isOnDark, theme }) => $isOnDark ? theme.colors.primary : 'transparent'};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 3.5rem;
    height: 3.5rem;
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.shadows.elevated};
  }
  
  &:focus {
    outline: 3px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const Panel = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 5.5rem;
  right: 1rem;
  left: 1rem;
  max-width: 320px;
  margin-right: auto;
  max-height: calc(100vh - 8rem);
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.card};
  z-index: 9998;
  transform: ${({ $isOpen }) => $isOpen ? 'translateY(0)' : 'translateY(20px)'};
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transition: all ${({ theme }) => theme.transitions.normal};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    left: auto;
    right: 2rem;
    bottom: 6rem;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const PanelTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.foreground};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.destructive};
    color: ${({ theme }) => theme.colors.primaryForeground};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const PanelContent = styled.div`
  padding: 1rem 1.25rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin-bottom: 0.75rem;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const OptionButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ $isActive, theme }) => $isActive ? theme.colors.primary : theme.colors.secondary};
  color: ${({ $isActive, theme }) => $isActive ? theme.colors.primaryForeground : theme.colors.foreground};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ $isActive, theme }) => $isActive ? theme.colors.primary : theme.colors.primaryLight};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const SliderControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const SliderButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.foreground};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryForeground};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const SliderLabel = styled.span`
  flex: 1;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.foreground};
`;

const ResetButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.destructive};
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    opacity: 0.9;
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.destructive};
    outline-offset: 2px;
  }
`;

const LegalNote = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin-top: 1rem;
  text-align: center;
  line-height: 1.5;
`;

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  highlightLinks: boolean;
  bigCursor: boolean;
  pauseAnimations: boolean;
  grayscale: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  highlightLinks: false,
  bigCursor: false,
  pauseAnimations: false,
  grayscale: false,
};

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnDarkBackground, setIsOnDarkBackground] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // Detect if button is over a dark background
  useEffect(() => {
    const checkBackground = () => {
      // Get the button position
      const buttonBottom = window.innerHeight - 48; // approximate center of button
      const buttonRight = window.innerWidth - 48;
      
      // Temporarily hide the widget to check element behind it
      const widgetButtons = document.querySelectorAll('[aria-label="פתח תפריט נגישות"]');
      widgetButtons.forEach(btn => {
        (btn as HTMLElement).style.visibility = 'hidden';
      });
      
      const element = document.elementFromPoint(buttonRight, buttonBottom);
      
      // Restore visibility
      widgetButtons.forEach(btn => {
        (btn as HTMLElement).style.visibility = 'visible';
      });
      
      if (element) {
        // Walk up the DOM tree to find a background color
        let currentElement: Element | null = element;
        let bgColor = 'rgba(0, 0, 0, 0)';
        
        while (currentElement && currentElement !== document.body) {
          const computedStyle = window.getComputedStyle(currentElement);
          const bg = computedStyle.backgroundColor;
          
          // Check if background is not transparent
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            bgColor = bg;
            break;
          }
          
          // Also check for background-image (gradients, images)
          const bgImage = computedStyle.backgroundImage;
          if (bgImage && bgImage !== 'none') {
            // If there's a background image or gradient, assume dark
            setIsOnDarkBackground(true);
            return;
          }
          
          currentElement = currentElement.parentElement;
        }
        
        // Parse RGB values
        const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const [, r, g, b] = match.map(Number);
          // Calculate luminance - lower values = darker background
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          setIsOnDarkBackground(luminance < 0.5);
        } else {
          // Default to light background if can't detect
          setIsOnDarkBackground(false);
        }
      }
    };

    // Initial check with a small delay to ensure DOM is ready
    const initialTimeout = setTimeout(checkBackground, 100);
    
    window.addEventListener('scroll', checkBackground);
    window.addEventListener('resize', checkBackground);
    
    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener('scroll', checkBackground);
      window.removeEventListener('resize', checkBackground);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    const root = document.documentElement;
    
    root.style.fontSize = `${settings.fontSize}%`;
    
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (settings.highlightLinks) {
      root.classList.add('highlight-links');
    } else {
      root.classList.remove('highlight-links');
    }
    
    if (settings.bigCursor) {
      root.classList.add('big-cursor');
    } else {
      root.classList.remove('big-cursor');
    }
    
    if (settings.pauseAnimations) {
      root.classList.add('pause-animations');
    } else {
      root.classList.remove('pause-animations');
    }
    
    if (settings.grayscale) {
      root.classList.add('grayscale');
    } else {
      root.classList.remove('grayscale');
    }
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const increaseFontSize = () => {
    if (settings.fontSize < 150) {
      updateSetting('fontSize', settings.fontSize + 10);
    }
  };

  const decreaseFontSize = () => {
    if (settings.fontSize > 80) {
      updateSetting('fontSize', settings.fontSize - 10);
    }
  };

  return (
    <>
      <WidgetButton
        $isOpen={isOpen}
        $isOnDark={isOnDarkBackground}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="פתח תפריט נגישות"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <Accessibility size={24} />
      </WidgetButton>

      <Panel 
        $isOpen={isOpen} 
        id="accessibility-panel"
        role="dialog"
        aria-label="הגדרות נגישות"
      >
        <PanelHeader>
          <PanelTitle>
            <Accessibility size={20} />
            הגדרות נגישות
          </PanelTitle>
          <CloseButton 
            onClick={() => setIsOpen(false)}
            aria-label="סגור תפריט נגישות"
          >
            <X size={18} />
          </CloseButton>
        </PanelHeader>

        <PanelContent>
          <Section>
            <SectionTitle>גודל טקסט</SectionTitle>
            <SliderControl>
              <SliderButton 
                onClick={decreaseFontSize}
                aria-label="הקטן גודל טקסט"
                disabled={settings.fontSize <= 80}
              >
                <Minus size={16} />
              </SliderButton>
              <SliderLabel>{settings.fontSize}%</SliderLabel>
              <SliderButton 
                onClick={increaseFontSize}
                aria-label="הגדל גודל טקסט"
                disabled={settings.fontSize >= 150}
              >
                <Plus size={16} />
              </SliderButton>
            </SliderControl>
          </Section>

          <Section>
            <SectionTitle>תצוגה</SectionTitle>
            <OptionGrid>
              <OptionButton
                $isActive={settings.highContrast}
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                aria-pressed={settings.highContrast}
              >
                <Contrast size={20} />
                ניגודיות גבוהה
              </OptionButton>
              <OptionButton
                $isActive={settings.grayscale}
                onClick={() => updateSetting('grayscale', !settings.grayscale)}
                aria-pressed={settings.grayscale}
              >
                <Eye size={20} />
                גווני אפור
              </OptionButton>
              <OptionButton
                $isActive={settings.highlightLinks}
                onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
                aria-pressed={settings.highlightLinks}
              >
                <Link2 size={20} />
                הדגש קישורים
              </OptionButton>
              <OptionButton
                $isActive={settings.bigCursor}
                onClick={() => updateSetting('bigCursor', !settings.bigCursor)}
                aria-pressed={settings.bigCursor}
              >
                <MousePointer size={20} />
                סמן גדול
              </OptionButton>
            </OptionGrid>
          </Section>

          <Section>
            <SectionTitle>תנועה</SectionTitle>
            <OptionButton
              $isActive={settings.pauseAnimations}
              onClick={() => updateSetting('pauseAnimations', !settings.pauseAnimations)}
              aria-pressed={settings.pauseAnimations}
              style={{ width: '100%' }}
            >
              <Pause size={20} />
              עצור אנימציות
            </OptionButton>
          </Section>

          <ResetButton onClick={resetSettings}>
            <RotateCcw size={16} />
            איפוס כל ההגדרות
          </ResetButton>

          <LegalNote>
            אתר זה מונגש בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013
          </LegalNote>
        </PanelContent>
      </Panel>
    </>
  );
};

export default AccessibilityWidget;
