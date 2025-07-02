import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: -60,
    },
    logo: {
        width: 110,
        height: 110,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 27,
        fontWeight: 'bold',
        color: '#00008b',
        marginBottom: 6,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 24,
        paddingHorizontal: 12,
        marginTop: 21,
        backgroundColor: '#fff',
        elevation: 2,

    },
    icon: {
        marginRight: 11,
    },
    input: {
        flex: 1,
        paddingVertical: 21,
        fontSize: 17,
        color: '#333',
    },
    forgotWrapper: {
        alignSelf: 'flex-end',
        marginVertical: 18,
        right:7,
    },
    forgotText: {
        color: '#007AFF',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 22,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    loginText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    registerText: {
        fontSize: 16,
        color: '#444',
        marginVertical: 2,
    },
    registerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    link: {
        color: '#4169e1',
        fontSize: 15,
        fontWeight: 'bold',
        marginHorizontal: 5,
    },
});
