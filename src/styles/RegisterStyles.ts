// // import { StyleSheet } from 'react-native';

// // export const styles = StyleSheet.create({
// //     // Layout
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#f5f5f5',
// //         paddingBottom: 40,
// //         paddingTop: 40,
// //         paddingHorizontal: 24,
// //     },
// //     contentContainer: {
// //         paddingHorizontal: 24,
// //         paddingTop: 5,
// //         paddingBottom: 40,
// // },
// //     titleRow: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         marginTop: 15,
// //         marginBottom: 16,
// //         paddingLeft: 0,
// //     },

// //     // Typography
// //     title: {
// //         fontSize: 25,
// //         fontWeight: 'bold',
// //         color: '#00008b',
// //         marginBottom: 16,
// //         alignSelf: 'center',
// //         alignItems: 'center',
// //     },
// //     label: {
// //         fontSize: 16,
// //         color: '#333',
// //         marginBottom: 6,
// //         fontWeight: '500',
// //     },
// //     required: {
// //         color: '#d32f2f',
// //         fontWeight: 'bold',
// //     },
// //     inputText: {
// //         fontSize: 16,
// //         color: '#333',
// //     },
// //     cowTypeLabel: {
// //         fontSize: 15,
// //         color: '#333',
// //         marginLeft: 2,
// //     },
// //     terms: {
// //         fontSize: 13,
// //         color: '#444',
// //         marginVertical: 12,
// //         textAlign: 'center',
// //     },
// //     link: {
// //         color: '#4169e1',
// //         fontSize: 15,
// //         fontWeight: 'bold',
// //         textDecorationLine: 'underline',
// //     },
// //     buttonText: {
// //         color: '#fff',
// //         fontSize: 18,
// //         fontWeight: '600',
// //     },
// //     sectionTitle: {
// //         fontSize: 16,
// //         fontWeight: 'bold',
// //         color: '#007AFF',
// //         marginBottom: 8,
// //     },
// //     milkTypeText: {
// //         color: '#007AFF',
// //         fontWeight: 'bold',
// //         fontSize: 15,
// //     },
// //     milkTypeTextSelected: {
// //         color: '#fff',
// //     },

// //     // Form Elements
// //     formGroup: {
// //         width: '100%',
// //         marginBottom: 16,
// //     },
// //     input: {
// //         width: '100%',
// //         paddingVertical: 15,
// //         paddingHorizontal: 14,
// //         borderWidth: 1,
// //         borderColor: '#bbb',
// //         borderRadius: 8,
// //         fontSize: 16,
// //         color: '#333',
// //         backgroundColor: '#fff',
// //     },
// //     phoneInputContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         position: 'relative',
// //         width: '100%',
// //     },
// //     countryCode: {
// //         position: 'absolute',
// //         left: 14,
// //         zIndex: 1,
// //         fontSize: 16,
// //         color: '#333',
// //     },
// //     phoneInput: {
// //         width: '100%',
// //         paddingVertical: 15,
// //         paddingLeft: 50,
// //         paddingRight: 14,
// //         borderWidth: 1,
// //         borderColor: '#bbb',
// //         borderRadius: 8,
// //         fontSize: 16,
// //         color: '#333',
// //         backgroundColor: '#fff',
// //     },
// //     inputBoxRelative: {
// //         position: 'relative',
// //         width: '100%',
// //     },
// //     inputWithIcon: {
// //         paddingRight: 40,
// //     },
// //     inputWithLeftPadding: {
// //         paddingLeft: 45,
// //     },
// //     cowTypeCapacityInput: {
// //         borderWidth: 1,
// //         borderColor: '#bbb',
// //         borderRadius: 8,
// //         paddingVertical: 8,
// //         paddingHorizontal: 10,
// //         fontSize: 15,
// //         backgroundColor: '#fff',
// //         minWidth: 80,
// //         marginRight: 6,
// //     },
// //     flexGrowInput: {
// //         flex: 1,
// //     },

// //     // Buttons
// //     button: {
// //         backgroundColor: '#007AFF',
// //         paddingVertical: 14,
// //         borderRadius: 22,
// //         marginBottom: 18,
// //         width: '100%',
// //         alignItems: 'center',
// //         marginTop: 8,
// //     },
// //     milkTypeButton: {
// //         borderWidth: 1,
// //         borderColor: '#007AFF',
// //         borderRadius: 20,
// //         paddingVertical: 8,
// //         paddingHorizontal: 18,
// //         marginRight: 10,
// //         backgroundColor: '#fff',
// //     },
// //     milkTypeSelected: {
// //         backgroundColor: '#007AFF',
// //         borderColor: '#007AFF',
// //     },

// //     // Error Handling
// //     errorBox: {
// //         backgroundColor: '#ffe6e6',
// //         borderColor: '#ff4d4d',
// //         borderWidth: 1,
// //         borderRadius: 8,
// //         padding: 10,
// //         marginBottom: 12,
// //         width: '100%',
// //     },
// //     errorText: {
// //         color: '#d32f2f',
// //         fontSize: 15,
// //         textAlign: 'center',
// //     },

// //     // Icons
// //     iconInside: {
// //         position: 'absolute',
// //         right: 10,
// //         top: 12,
// //         padding: 4,
// //     },
// //     backArrow: {
// //         marginRight: 20,
// //         marginLeft: -28,
// //         paddingBottom: 10,
// //     },

// //     // Sections
// //     milkDetailsSection: {
// //         width: '100%',
// //         marginBottom: 18,
// //         marginTop: 8,
// //         backgroundColor: '#f0f8ff',
// //         borderRadius: 8,
// //         padding: 10,
// //     },
// //     milkTypeRow: {
// //         flexDirection: 'row',
// //         justifyContent: 'flex-start',
// //         marginTop: 8,
// //     },
// //     milkTypeInputRow: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         marginBottom: 8,
// //     },
// // compactInputBox: {
// //   width: 70,
// //   height: 40,
// //   fontSize: 13,
// //   paddingHorizontal: 8,
// //   borderWidth: 1,
// //   borderColor: '#ccc',
// //   borderRadius: 5,
// //   backgroundColor: '#fff',
// //   color: '#333',
// // },

// // });

// import { StyleSheet } from 'react-native';

// export const styles = StyleSheet.create({
//   // Layout
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     paddingBottom: 40,
//     paddingTop: 40,
//     paddingHorizontal: 24,
//   },
//   contentContainer: {
//     paddingHorizontal: 24,
//     paddingTop: 5,
//     paddingBottom: 40,
//   },
//   titleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 15,
//     marginBottom: 16,
//     paddingLeft: 0,
//   },

//   // Typography
//   title: {
//     fontSize: 25,
//     fontWeight: 'bold',
//     color: '#00008b',
//     marginBottom: 16,
//     alignSelf: 'center',
//     alignItems: 'center',
//   },
//   label: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 6,
//     fontWeight: '500',
//   },
//   required: {
//     color: '#d32f2f',
//     fontWeight: 'bold',
//   },
//   cowTypeLabel: {
//     fontSize: 15,
//     color: '#333',
//     marginLeft: 2,
//   },
//   terms: {
//     fontSize: 13,
//     color: '#444',
//     marginVertical: 12,
//     textAlign: 'center',
//   },
//   link: {
//     color: '#4169e1',
//     fontSize: 15,
//     fontWeight: 'bold',
//     textDecorationLine: 'underline',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#007AFF',
//     marginBottom: 8,
//   },
//   milkTypeText: {
//     color: '#007AFF',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
//   milkTypeTextSelected: {
//     color: '#fff',
//   },

//   // Form Groups
//   formGroup: {
//     width: '100%',
//     marginBottom: 16,
//   },
//   input: {
//     width: '100%',
//     paddingVertical: 15,
//     paddingHorizontal: 14,
//     borderWidth: 1,
//     borderColor: '#bbb',
//     borderRadius: 8,
//     fontSize: 16,
//     color: '#333',
//     backgroundColor: '#fff',
//   },
//   phoneInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     position: 'relative',
//     width: '100%',
//   },
//   countryCode: {
//     position: 'absolute',
//     left: 14,
//     zIndex: 1,
//     fontSize: 16,
//     color: '#333',
//   },
//   phoneInput: {
//     width: '100%',
//     paddingVertical: 15,
//     paddingLeft: 50,
//     paddingRight: 14,
//     borderWidth: 1,
//     borderColor: '#bbb',
//     borderRadius: 8,
//     fontSize: 16,
//     color: '#333',
//     backgroundColor: '#fff',
//   },
//   inputBoxRelative: {
//     position: 'relative',
//     width: '100%',
//   },
//   inputWithIcon: {
//     paddingRight: 40,
//   },

//   // Milk Type block with capacity & rate inputs (matches sketch)
//   milkTypeBlock: {
//     marginBottom: 18,
//   },
//   milkTypeInputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 2,
//   },
//   cowTypeInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#bbb',
//     borderRadius: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     fontSize: 15,
//     backgroundColor: '#fff',
//     marginRight: 8,
//   },
//   cowCapacityInput: {
//     width: 70,
//     borderWidth: 1,
//     borderColor: '#bbb',
//     borderRadius: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     fontSize: 15,
//     backgroundColor: '#fff',
//     marginRight: 6,
//     textAlign: 'center',
//   },
//   ltrsLabel: {
//     fontSize: 15,
//     color: '#333',
//     fontWeight: '500',
//   },
//   rateRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//     marginLeft: 2,
//     marginBottom: 8,
//   },
//   rateLabel: {
//     fontSize: 15,
//     color: '#333',
//     marginRight: 12,
//     fontWeight: '500',
//   },
//   rateInput: {
//     width: 70,
//     borderWidth: 1,
//     borderColor: '#bbb',
//     borderRadius: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     fontSize: 15,
//     backgroundColor: '#fff',
//     textAlign: 'center',
//   },

//   // Buttons
//   button: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 14,
//     borderRadius: 22,
//     marginBottom: 18,
//     width: '100%',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   milkTypeButton: {
//     borderWidth: 1,
//     borderColor: '#007AFF',
//     borderRadius: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 18,
//     marginRight: 10,
//     backgroundColor: '#fff',
//   },
//   milkTypeSelected: {
//     backgroundColor: '#007AFF',
//     borderColor: '#007AFF',
//   },

//   // Error Handling
//   errorBox: {
//     backgroundColor: '#ffe6e6',
//     borderColor: '#ff4d4d',
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 12,
//     width: '100%',
//   },
//   errorText: {
//     color: '#d32f2f',
//     fontSize: 15,
//     textAlign: 'center',
//   },

//   // Icons
//   iconInside: {
//     position: 'absolute',
//     right: 10,
//     top: 12,
//     padding: 4,
//   },
//   backArrow: {
//     marginRight: 20,
//     marginLeft: -28,
//     paddingBottom: 10,
//   },

//   // Sections
//   milkDetailsSection: {
//     width: '100%',
//     marginBottom: 18,
//     marginTop: 8,
//     backgroundColor: '#f0f8ff',
//     borderRadius: 8,
//     padding: 10,
//   },
//   milkTypeRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     marginTop: 8,
//   },
// });

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 40,
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 5,
    paddingBottom: 40,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 16,
    paddingLeft: 0,
  },

  // Typography
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#00008b',
    marginBottom: 16,
    alignSelf: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },
  required: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  cowTypeLabel: {
    fontSize: 15,
    color: '#333',
    marginLeft: 2,
  },
  terms: {
    fontSize: 13,
    color: '#444',
    marginVertical: 12,
    textAlign: 'center',
  },
  link: {
    color: '#4169e1',
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  milkTypeText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  milkTypeTextSelected: {
    color: '#fff',
  },

  // Form Elements
  formGroup: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  countryCode: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
    fontSize: 16,
    color: '#333',
  },
  phoneInput: {
    width: '100%',
    paddingVertical: 15,
    paddingLeft: 50,
    paddingRight: 14,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  inputBoxRelative: {
    position: 'relative',
    width: '100%',
  },
  inputWithIcon: {
    paddingRight: 40,
  },
  inputWithLeftPadding: {
    paddingLeft: 45,
  },

  // Milk Type Blocks - Layout as per your sketch
  milkTypeBlock: {
    marginBottom: 18,
  },
  milkTypeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cowTypeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 15,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  cowCapacityInput: {
    width: 70,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 15,
    backgroundColor: '#fff',
    marginRight: 6,
    textAlign: 'center',
  },
  ltrsLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
 // Updated styles for the rate input section
rateRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 4,
  marginLeft: 2,
  marginBottom: 8,
},
rateLabel: {
  fontSize: 15,
  color: '#333',
  marginRight: 12,
  fontWeight: '500',
  minWidth: 50, // Adjusted for shorter "Rate" label
},
rateInput: {
  width: 152, // Increased width to match ltrs box (was 70)
  borderWidth: 1,
  borderColor: '#bbb',
  borderRadius: 8,
  paddingVertical: 8,
  paddingHorizontal: 10,
  fontSize: 15,
  backgroundColor: '#fff',
  textAlign: 'center',
},


  // Legacy styles for backward compatibility
  cowTypeCapacityInput: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 15,
    backgroundColor: '#fff',
    minWidth: 80,
    marginRight: 6,
  },
  flexGrowInput: {
    flex: 1,
  },

  // Buttons
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 22,
    marginBottom: 18,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  milkTypeButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  milkTypeSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },

  // Error Handling
  errorBox: {
    backgroundColor: '#ffe6e6',
    borderColor: '#ff4d4d',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    width: '100%',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 15,
    textAlign: 'center',
  },

  // Icons
  iconInside: {
    position: 'absolute',
    right: 10,
    top: 12,
    padding: 4,
  },
  backArrow: {
    marginRight: 20,
    marginLeft: -28,
    paddingBottom: 10,
  },

  // Sections
  milkDetailsSection: {
    width: '100%',
    marginBottom: 18,
    marginTop: 8,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 10,
  },
  milkTypeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },

  // Compact input for special cases (optional)
  compactInputBox: {
    width: 70,
    height: 40,
    fontSize: 13,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#333',
  },
});
