import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Language } from '../i18n/translations';

interface LanguageState {
    language: Language;
    isReady: boolean;
}

const initialState: LanguageState = {
    language: 'en',
    isReady: false,
};

export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<Language>) => {
            state.language = action.payload;
        },
        setLanguageReady: (state, action: PayloadAction<boolean>) => {
            state.isReady = action.payload;
        },
        initializeLanguage: (state, action: PayloadAction<Language>) => {
            state.language = action.payload;
            state.isReady = true;
        },
    },
});

export const { setLanguage, setLanguageReady, initializeLanguage } = languageSlice.actions;

export default languageSlice.reducer;
