import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { StackNavigationProp } from '@react-navigation/stack';
import SafeAreaWrapper from '../styles/SafeAreaWrapper';
import colors from '../theme/colors';
import { useTranslation } from '../i18n/LanguageProvider';

type RootStackParamList = {
    Login: undefined;
};

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const TermsConditionScreen: React.FC<Props> = ({ navigation }) => {
    const [accepted, setAccepted] = useState(false);
    const { t } = useTranslation();

    const handleLogin = async () => {
        await AsyncStorage.setItem('hasSeenSlides', 'true');
        await AsyncStorage.setItem('termsAccepted', 'true');

        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>

                <Text style={styles.header}>{t('terms.title')}</Text>

                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.text}>{t('terms.intro')}</Text>

                    <Text style={styles.text}>{t('terms.points')}</Text>

                    <View style={styles.checkboxRow}>
                        <CheckBox
                            value={accepted}
                            onValueChange={setAccepted}
                            tintColors={{ true: colors.primary, false: '#aaa' }}
                        />
                        <Text style={styles.checkboxText}>{t('terms.accept')}</Text>
                    </View>

                    {accepted && (
                        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                            <Text style={styles.loginText}>{t('common.login')}</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
        </SafeAreaWrapper>
    );
};

export default TermsConditionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: colors.white,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 18,
        marginTop: 8,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        marginBottom: 12,
    },
    content: {
        flex: 1,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingBottom: 20,
    },
    checkboxText: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    loginBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    loginText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
