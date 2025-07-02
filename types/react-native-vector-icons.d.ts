// types/react-native-vector-icons.d.ts

declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  const MaterialCommunityIcons: ComponentType<IconProps>;
  export default MaterialCommunityIcons;
}

declare module 'react-native-vector-icons/FontAwesome' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  const FontAwesome: ComponentType<IconProps>;
  export default FontAwesome;
}
