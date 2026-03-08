import React from 'react';
import Svg, { Path, Circle as SvgCircle, Rect, Line } from 'react-native-svg';

type IconName =
  | 'home'
  | 'receipt'
  | 'pie-chart'
  | 'bar-chart'
  | 'settings'
  | 'plus'
  | 'search'
  | 'x'
  | 'chevron-right'
  | 'arrow-up'
  | 'arrow-down'
  | 'trending-up'
  | 'moon'
  | 'bell'
  | 'download'
  | 'trash'
  | 'star'
  | 'info'
  | 'dollar'
  | 'target'
  | 'wallet'
  | 'credit-card'
  | 'calendar'
  | 'clock'
  | 'message-square'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-up'
  | 'more-vertical'
  | 'user'
  | 'users'
  | 'mail'
  | 'file-text'
  | 'check-square';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function AppIcon({
  name,
  size = 24,
  color = '#1A1D28',
  strokeWidth = 1.5,
}: IconProps) {
  const sv = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
  };
  const sp = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'home':
      return (
        <Svg {...sv}>
          <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...sp} />
          <Path d="M9 22V12h6v10" {...sp} />
        </Svg>
      );
    case 'receipt':
      return (
        <Svg {...sv}>
          <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...sp} />
          <Path d="M14 2v6h6" {...sp} />
          <Path d="M16 13H8" {...sp} />
          <Path d="M16 17H8" {...sp} />
          <Path d="M10 9H8" {...sp} />
        </Svg>
      );
    case 'pie-chart':
      return (
        <Svg {...sv}>
          <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" {...sp} />
          <Path d="M22 12A10 10 0 0 0 12 2v10z" {...sp} />
        </Svg>
      );
    case 'bar-chart':
      return (
        <Svg {...sv}>
          <Path d="M18 20V10" {...sp} />
          <Path d="M12 20V4" {...sp} />
          <Path d="M6 20v-6" {...sp} />
        </Svg>
      );
    case 'settings':
      return (
        <Svg {...sv}>
          <SvgCircle cx={12} cy={12} r={3} {...sp} />
          <Path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            {...sp}
          />
        </Svg>
      );
    case 'plus':
      return (
        <Svg {...sv}>
          <Path d="M12 5v14" {...sp} />
          <Path d="M5 12h14" {...sp} />
        </Svg>
      );
    case 'search':
      return (
        <Svg {...sv}>
          <SvgCircle cx={11} cy={11} r={8} {...sp} />
          <Path d="M21 21l-4.35-4.35" {...sp} />
        </Svg>
      );
    case 'x':
      return (
        <Svg {...sv}>
          <Path d="M18 6L6 18" {...sp} />
          <Path d="M6 6l12 12" {...sp} />
        </Svg>
      );
    case 'chevron-right':
      return (
        <Svg {...sv}>
          <Path d="M9 18l6-6-6-6" {...sp} />
        </Svg>
      );
    case 'arrow-up':
      return (
        <Svg {...sv}>
          <Path d="M12 19V5" {...sp} />
          <Path d="M5 12l7-7 7 7" {...sp} />
        </Svg>
      );
    case 'arrow-down':
      return (
        <Svg {...sv}>
          <Path d="M12 5v14" {...sp} />
          <Path d="M19 12l-7 7-7-7" {...sp} />
        </Svg>
      );
    case 'trending-up':
      return (
        <Svg {...sv}>
          <Path d="M4 16l5-5 4 4 7-7" {...sp} />
          <Path d="M15 8h5v5" {...sp} />
        </Svg>
      );
    case 'moon':
      return (
        <Svg {...sv}>
          <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" {...sp} />
        </Svg>
      );
    case 'bell':
      return (
        <Svg {...sv}>
          <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...sp} />
          <Path d="M13.73 21a2 2 0 0 1-3.46 0" {...sp} />
        </Svg>
      );
    case 'download':
      return (
        <Svg {...sv}>
          <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...sp} />
          <Path d="M7 10l5 5 5-5" {...sp} />
          <Path d="M12 15V3" {...sp} />
        </Svg>
      );
    case 'trash':
      return (
        <Svg {...sv}>
          <Path d="M3 6h18" {...sp} />
          <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" {...sp} />
        </Svg>
      );
    case 'star':
      return (
        <Svg {...sv}>
          <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" {...sp} />
        </Svg>
      );
    case 'info':
      return (
        <Svg {...sv}>
          <SvgCircle cx={12} cy={12} r={10} {...sp} />
          <Line x1={12} y1={16} x2={12} y2={12} {...sp} />
          <Line x1={12} y1={8} x2={12.01} y2={8} {...sp} />
        </Svg>
      );
    case 'dollar':
      return (
        <Svg {...sv}>
          <Path d="M12 1v22" {...sp} />
          <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...sp} />
        </Svg>
      );
    case 'target':
      return (
        <Svg {...sv}>
          <SvgCircle cx={12} cy={12} r={10} {...sp} />
          <SvgCircle cx={12} cy={12} r={6} {...sp} />
          <SvgCircle cx={12} cy={12} r={2} {...sp} />
        </Svg>
      );
    case 'wallet':
      return (
        <Svg {...sv}>
          <Rect x={2} y={5} width={20} height={15} rx={2} {...sp} />
          <SvgCircle cx={17} cy={12.5} r={1} fill={color} stroke="none" />
          <Path d="M2 10h20" {...sp} />
        </Svg>
      );
    case 'credit-card':
      return (
        <Svg {...sv}>
          <Rect x={1} y={4} width={22} height={16} rx={2} ry={2} {...sp} />
          <Line x1={1} y1={10} x2={23} y2={10} {...sp} />
        </Svg>
      );
    case 'calendar':
      return (
        <Svg {...sv}>
          <Rect x={3} y={4} width={18} height={18} rx={2} ry={2} {...sp} />
          <Path d="M16 2v4" {...sp} />
          <Path d="M8 2v4" {...sp} />
          <Path d="M3 10h18" {...sp} />
        </Svg>
      );
    case 'clock':
      return (
        <Svg {...sv}>
          <SvgCircle cx={12} cy={12} r={10} {...sp} />
          <Path d="M12 6v6l4 2" {...sp} />
        </Svg>
      );
    case 'message-square':
      return (
        <Svg {...sv}>
          <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...sp} />
        </Svg>
      );
    case 'chevron-down':
      return (
        <Svg {...sv}>
          <Path d="M6 9l6 6 6-6" {...sp} />
        </Svg>
      );
    case 'chevron-left':
      return (
        <Svg {...sv}>
          <Path d="M15 18l-6-6 6-6" {...sp} />
        </Svg>
      );
    case 'chevron-up':
      return (
        <Svg {...sv}>
          <Path d="M18 15l-6-6-6 6" {...sp} />
        </Svg>
      );
    case 'more-vertical':
      return (
        <Svg {...sv}>
          <SvgCircle cx={12} cy={12} r={1} fill={color} stroke="none" />
          <SvgCircle cx={12} cy={5} r={1} fill={color} stroke="none" />
          <SvgCircle cx={12} cy={19} r={1} fill={color} stroke="none" />
        </Svg>
      );
    case 'user':
      return (
        <Svg {...sv}>
          <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...sp} />
          <SvgCircle cx={12} cy={7} r={4} {...sp} />
        </Svg>
      );
    case 'users':
      return (
        <Svg {...sv}>
          <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...sp} />
          <SvgCircle cx={9} cy={7} r={4} {...sp} />
          <Path d="M23 21v-2a4 4 0 0 0-3-3.87" {...sp} />
          <Path d="M16 3.13a4 4 0 0 1 0 7.75" {...sp} />
        </Svg>
      );
    case 'mail':
      return (
        <Svg {...sv}>
          <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" {...sp} />
          <Path d="M22 6l-10 7L2 6" {...sp} />
        </Svg>
      );
    case 'file-text':
      return (
        <Svg {...sv}>
          <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...sp} />
          <Path d="M14 2v6h6" {...sp} />
          <Line x1={16} y1={13} x2={8} y2={13} {...sp} />
          <Line x1={16} y1={17} x2={8} y2={17} {...sp} />
          <Line x1={10} y1={9} x2={8} y2={9} {...sp} />
        </Svg>
      );
    case 'check-square':
      return (
        <Svg {...sv}>
          <Path d="M9 11l3 3L22 4" {...sp} />
          <Path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" {...sp} />
        </Svg>
      );
    default:
      return null;
  }
}
