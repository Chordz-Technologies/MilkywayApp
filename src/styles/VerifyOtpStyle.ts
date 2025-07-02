import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 80,
  },

  logo: {
    height: 90,
    width: 90,
    alignSelf: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 4,
  },

  label: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 25,
  },

  otpBox: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    color: '#000',
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  otpBoxFocused: {
  borderColor: '#4169E1', 
  borderWidth: 2,
},


  continueBtn: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },

  timerText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#444',
    fontSize: 13,
  },

  resend: {
    color: '#1e40af',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  backToLogin: {
    marginTop: 24,
    textAlign: 'center',
    color: '#1e40af',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
