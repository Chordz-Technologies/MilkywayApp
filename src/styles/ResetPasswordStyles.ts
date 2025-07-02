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
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 17,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },


  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 21,
    paddingHorizontal: 15,
    paddingVertical: 22,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },

  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
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
