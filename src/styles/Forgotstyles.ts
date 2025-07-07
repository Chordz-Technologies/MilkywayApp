import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 150,
  },

  logo: {
    height: 90,
    width: 90,
    alignSelf: 'center',
    marginBottom: 15,
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 8,
  },

  label: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 11,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 20,
  },

  icon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },

  continueBtn: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },

  btnText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  backToLogin: {
    marginTop: 24,
    textAlign: 'center',
    color: '#1e40af',
    fontSize: 15,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  countryCode: {
    fontSize: 16,
    paddingHorizontal: 8,
    color: '#555',
    alignSelf: 'center',
  }
});
