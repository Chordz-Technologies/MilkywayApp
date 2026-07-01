import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../i18n/LanguageProvider';
import { Language } from '../i18n/translations';

const options: Language[] = ['en', 'mr'];

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useTranslation();

  return (
    <View accessibilityLabel={t('common.language')} style={styles.container}>
      {options.map((option) => {
        const isActive = option === language;

        return (
          <TouchableOpacity
            key={option}
            onPress={() => setLanguage(option)}
            style={[styles.option, isActive && styles.activeOption]}
          >
            <Text style={[styles.optionText, isActive && styles.activeText]}>
              {option === 'en' ? 'English' : 'मराठी'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default LanguageSwitcher;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D5D9E2',
    borderRadius: 18,
    padding: 3,
    backgroundColor: '#FFFFFF',
  },
  option: {
    minWidth: 40,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  activeOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    color: '#3A3A3A',
    fontSize: 13,
    fontWeight: '700',
  },
  activeText: {
    color: '#FFFFFF',
  },
});
