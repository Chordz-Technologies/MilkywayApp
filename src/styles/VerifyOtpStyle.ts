import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 130,
  },

  logo: {
    height: 90,
    width: 90,
    alignSelf: 'center',
    marginBottom: 15,
  },

  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 7,
  },

  label: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 20,
  },

  otpBox: {
    width: 65,
    height: 65,
    borderWidth: 1,
    borderColor: '#000',
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
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },

  timerText: {
    marginTop: 17,
    textAlign: 'center',
    color: '#444',
    fontSize: 14,
  },

  resend: {
    color: '#1e40af',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  backToLogin: {
    marginTop: 20,
    textAlign: 'center',
    color: '#1e40af',
    fontSize: 15,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
