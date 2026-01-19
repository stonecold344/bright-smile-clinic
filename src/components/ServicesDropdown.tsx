import { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  ChevronDown, 
  Stethoscope, 
  Sparkles, 
  CircleDot, 
  Baby, 
  AlignCenter, 
  Smile,
  LucideIcon
} from 'lucide-react';
import { useTreatments } from '@/hooks/useTreatments';

const iconMap: Record<string, LucideIcon> = {
  'general-dentistry': Stethoscope,
  'teeth-whitening': Sparkles,
  'dental-implants': CircleDot,
  'pediatric-dentistry': Baby,
  'orthodontics': AlignCenter,
  'cosmetic-dentistry': Smile,
};

const DropdownContainer = styled.div`
  position: relative;

  &:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }

  &:hover .dropdown-trigger svg {
    transform: rotate(180deg);
  }
`;

const DropdownTrigger = styled.button<{ $active?: boolean; $scrolled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ $active, $scrolled, theme }) => 
    $active ? theme.colors.primary : ($scrolled ? theme.colors.foreground : 'white')};
  transition: color 0.3s ease;
  padding-bottom: 0.25rem;
  border-bottom: ${({ $active, theme }) => $active ? `2px solid ${theme.colors.primary}` : '2px solid transparent'};
  background: transparent;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    transition: transform ${({ theme }) => theme.transitions.normal};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  min-width: 220px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.elevated};
  padding: 0.5rem;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease-out, transform 0.2s ease-out, visibility 0.2s;

  &::before {
    content: '';
    position: absolute;
    top: -0.5rem;
    left: 0;
    right: 0;
    height: 0.5rem;
  }
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.foreground};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: background ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme }) => theme.colors.secondary}80;
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AllServicesLink = styled(Link)`
  display: block;
  text-align: center;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: opacity ${({ theme }) => theme.transitions.normal};

  &:hover {
    opacity: 0.8;
  }
`;

interface ServicesDropdownProps {
  onNavigate?: () => void;
  scrolled?: boolean;
}

const ServicesDropdown = ({ onNavigate, scrolled }: ServicesDropdownProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { data: treatments = [] } = useTreatments();

  const isActive = location.pathname.startsWith('/services') || location.pathname.startsWith('/treatment');

  const handleItemClick = () => {
    onNavigate?.();
  };

  const getIcon = (slug: string) => {
    const IconComponent = iconMap[slug] || Stethoscope;
    return <IconComponent size={18} />;
  };

  return (
    <DropdownContainer ref={containerRef}>
      <DropdownTrigger
        className="dropdown-trigger"
        $active={isActive}
        $scrolled={scrolled}
        aria-haspopup="true"
      >
        שירותים
        <ChevronDown size={16} />
      </DropdownTrigger>

      <DropdownMenu className="dropdown-menu" role="menu">
        {treatments.map((treatment) => (
          <MenuItem
            key={treatment.id}
            to={`/treatment/${treatment.slug}`}
            onClick={handleItemClick}
            role="menuitem"
          >
            {getIcon(treatment.slug)}
            {treatment.title}
          </MenuItem>
        ))}
        <AllServicesLink to="/services" onClick={handleItemClick}>
          לכל השירותים ←
        </AllServicesLink>
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default ServicesDropdown;
