// mobile/src/screens/profile/LicensesScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import CustomHeader from '../../components/common/CustomHeader';
import { SimpleIcon } from '../../components/common/ProfessionalIcon';
import { COLORS, SPACING } from '../../utils/constants';

const LicensesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [expandedLicense, setExpandedLicense] = useState(null);

  const licenses = [
    {
      id: 'react-native',
      name: 'React Native',
      version: '0.72.0',
      license: 'MIT',
      author: 'Meta Platforms, Inc.',
      description: 'Framework pour développer des applications mobiles natives',
      url: 'https://github.com/facebook/react-native',
      licenseText: `MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.`
    },
    {
      id: 'expo',
      name: 'Expo',
      version: '49.0.0',
      license: 'MIT',
      author: 'Expo',
      description: 'Plateforme pour développer des applications React Native',
      url: 'https://github.com/expo/expo',
      licenseText: `MIT License

Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.`
    },
    {
      id: 'react-navigation',
      name: 'React Navigation',
      version: '6.0.0',
      license: 'MIT',
      author: 'React Navigation Contributors',
      description: 'Bibliothèque de navigation pour React Native',
      url: 'https://github.com/react-navigation/react-navigation',
      licenseText: `MIT License

Copyright (c) 2017 React Navigation Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.`
    },
    {
      id: 'async-storage',
      name: 'AsyncStorage',
      version: '1.19.0',
      license: 'MIT',
      author: 'React Native Async Storage',
      description: 'Système de stockage local asynchrone pour React Native',
      url: 'https://github.com/react-native-async-storage/async-storage',
      licenseText: `MIT License

Copyright (c) 2015-present, Facebook, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction.`
    },
    {
      id: 'vector-icons',
      name: 'Expo Vector Icons',
      version: '13.0.0',
      license: 'MIT',
      author: 'Expo',
      description: 'Collection d\'icônes vectorielles pour React Native',
      url: 'https://github.com/expo/vector-icons',
      licenseText: `MIT License

Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software").`
    },
    {
      id: 'ionicons',
      name: 'Ionicons',
      version: '7.0.0',
      license: 'MIT',
      author: 'Ionic Team',
      description: 'Icônes premium conçues pour le web, iOS, Android et desktop',
      url: 'https://github.com/ionic-team/ionicons',
      licenseText: `MIT License

Copyright (c) 2015-present Ionic (http://ionic.io/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software").`
    },
    {
      id: 'react',
      name: 'React',
      version: '18.2.0',
      license: 'MIT',
      author: 'Meta Platforms, Inc.',
      description: 'Bibliothèque JavaScript pour construire des interfaces utilisateur',
      url: 'https://github.com/facebook/react',
      licenseText: `MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software").`
    },
    {
      id: 'javascript',
      name: 'JavaScript (ECMAScript)',
      version: 'ES2022',
      license: 'Open Standard',
      author: 'Ecma International',
      description: 'Langage de programmation standardisé',
      url: 'https://www.ecma-international.org/ecma-262/',
      licenseText: `ECMAScript Language Specification

This Ecma Standard defines the ECMAScript 2022 Language. It is the thirteenth edition of the ECMAScript Language Specification. Since publication of the first edition in 1997, ECMAScript has grown to be one of the world's most widely used general-purpose programming languages.`
    }
  ];

  const handleOpenUrl = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erreur', 'Impossible d\'ouvrir le lien');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir le lien');
    }
  };

  const toggleLicense = (licenseId) => {
    setExpandedLicense(expandedLicense === licenseId ? null : licenseId);
  };

  const LicenseCard = ({ license }) => {
    const isExpanded = expandedLicense === license.id;
    
    return (
      <View style={[styles.licenseCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <TouchableOpacity
          style={styles.licenseHeader}
          onPress={() => toggleLicense(license.id)}
          activeOpacity={0.7}
        >
          <View style={styles.licenseInfo}>
            <View style={styles.licenseTitle}>
              <Text style={[styles.licenseName, { color: theme.text }]}>{license.name}</Text>
              <View style={[styles.licenseBadge, { backgroundColor: theme.primary + '15' }]}>
                <Text style={[styles.licenseType, { color: theme.primary }]}>{license.license}</Text>
              </View>
            </View>
            <Text style={[styles.licenseVersion, { color: theme.textSecondary }]}>
              v{license.version} • {license.author}
            </Text>
            <Text style={[styles.licenseDescription, { color: theme.textSecondary }]}>
              {license.description}
            </Text>
          </View>
          <SimpleIcon 
            iconKey={isExpanded ? "chevron-up" : "forward"} 
            containerSize={24} 
            size={14}
            style={{ backgroundColor: 'transparent' }}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.licenseContent}>
            <View style={styles.licenseActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }]}
                onPress={() => handleOpenUrl(license.url)}
                activeOpacity={0.8}
              >
                <SimpleIcon 
                  iconKey="forward" 
                  containerSize={16} 
                  size={10}
                  style={{ backgroundColor: 'transparent', marginRight: 6 }}
                />
                <Text style={[styles.actionButtonText, { color: theme.primary }]}>Voir le projet</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.licenseTextContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.licenseTextTitle, { color: theme.text }]}>Texte de la licence :</Text>
              <ScrollView 
                style={styles.licenseTextScroll}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                <Text style={[styles.licenseText, { color: theme.textSecondary }]}>
                  {license.licenseText}
                </Text>
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <CustomHeader title="Licences open source" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* En-tête informatif */}
        <View style={[styles.headerInfo, { backgroundColor: theme.background }]}>
          <SimpleIcon iconKey="licenses" containerSize={48} size={24} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Licences open source
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Cette application utilise des bibliothèques open source. 
            Nous remercions tous les contributeurs de ces projets.
          </Text>
        </View>

        {/* Statistiques */}
        <View style={[styles.statsContainer, { backgroundColor: theme.background }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>{licenses.length}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Bibliothèques</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {licenses.filter(l => l.license === 'MIT').length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Licences MIT</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>100%</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Open Source</Text>
          </View>
        </View>

        {/* Liste des licences */}
        <View style={styles.licensesContainer}>
          {licenses.map((license) => (
            <LicenseCard key={license.id} license={license} />
          ))}
        </View>

        {/* Informations légales */}
        <View style={[styles.legalInfo, { backgroundColor: theme.background }]}>
          <SimpleIcon iconKey="info" containerSize={32} size={16} />
          <View style={styles.legalTextContainer}>
            <Text style={[styles.legalTitle, { color: theme.text }]}>
              Informations légales
            </Text>
            <Text style={[styles.legalText, { color: theme.textSecondary }]}>
              Toutes les bibliothèques listées sont utilisées conformément à leurs licences respectives. 
              Les textes complets des licences sont disponibles en cliquant sur chaque élément.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Merci à la communauté open source
          </Text>
          <Text style={[styles.footerSubtext, { color: theme.textSecondary }]}>
            © 2024 EcommerceApp - Construit avec ❤️ et des technologies open source
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },

  // En-tête
  headerInfo: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Statistiques
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    marginHorizontal: SPACING.md,
  },

  // Licences
  licensesContainer: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  licenseCard: {
    borderRadius: 16,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    borderWidth: 1,
    overflow: 'hidden',
  },
  licenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  licenseInfo: {
    flex: 1,
  },
  licenseTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  licenseName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  licenseBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: SPACING.sm,
  },
  licenseType: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  licenseVersion: {
    fontSize: 12,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  licenseDescription: {
    fontSize: 13,
    lineHeight: 18,
  },

  // Contenu étendu
  licenseContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  licenseActions: {
    marginBottom: SPACING.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Texte de licence
  licenseTextContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  licenseTextTitle: {
    fontSize: 14,
    fontWeight: '600',
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  licenseTextScroll: {
    maxHeight: 200,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  licenseText: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: 'monospace',
  },

  // Informations légales
  legalInfo: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  legalTextContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  legalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  legalText: {
    fontSize: 13,
    lineHeight: 18,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default LicensesScreen;