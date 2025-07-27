module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: {
          projectPath: 'ios/SmartBudgetTracker.xcodeproj',
          sharedLibraries: ['libRNVectorIcons'],
        },
        android: {
          sourceDir: '../node_modules/react-native-vector-icons/android',
          packageImportPath: 'import io.github.oblador.vectoricons.VectorIconsPackage;',
          mainFilePath: '../node_modules/react-native-vector-icons/lib/android/src/main/java/com/oblador/vectoricons/VectorIconsModule.java',
        },
      },
    },
  },
};