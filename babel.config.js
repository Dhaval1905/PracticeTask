module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-react', 
    '@babel/preset-typescript'
  ],
  plugins: [
    'react-native-reanimated/plugin',
    ['@babel/plugin-transform-private-methods', { loose: true }],
  ],
};
