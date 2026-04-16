import './global.css'; 
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState } from 'react';

// External Libraries
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Slider from '@react-native-community/slider';
import * as Yup from 'yup';
import { Formik } from 'formik';
import * as Clipboard from 'expo-clipboard'; 
import Toast from 'react-native-toast-message';

const PasswordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(4, 'Should be min of 4 characters')
    .max(16, 'Should be max of 16 characters')
    .required('Length is required')
});

export default function App() {
  const [password, setPassword] = useState('');
  const [isPassGenerated, setIsPassGenerated] = useState(false);
  const [strength, setStrength] = useState({ label: '', color: '' });
  const [history, setHistory] = useState<string[]>([]);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [lowerCase, setLowerCase] = useState(true);
  const [upperCase, setUpperCase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);

  // Theme Config
  const themeBg = isDarkMode ? 'bg-slate-900' : 'bg-slate-50';
  const cardBg = isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100';
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-300' : 'text-slate-700';

  const handleCheckboxToggle = (currentState: boolean, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    const activeCount = [lowerCase, upperCase, numbers, symbols].filter(Boolean).length;
    if (currentState === true && activeCount === 1) {
      Toast.show({
        type: 'error',
        text1: 'Hold up! ✋',
        text2: 'At least one character type must be selected.',
        position: 'bottom'
      });
      return; 
    }
    setter(!currentState);
  };

  const copyToClipboard = async (textToCopy: string) => {
    if (!textToCopy) return;
    await Clipboard.setStringAsync(textToCopy);
    setIsCopied(true);
    Toast.show({ type: 'success', text1: 'Copied to clipboard! 📋', position: 'top' });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const generatePasswordString = (passwordLength: number) => {
    let characterList = '';
    if (upperCase) characterList += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowerCase) characterList += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) characterList += '0123456789';
    if (symbols) characterList += '!@#$%^&*()_+';

    const passwordResult = createPassword(characterList, passwordLength);
    setPassword(passwordResult);
    setIsPassGenerated(true);
    evaluateStrength(passwordResult);
    setHistory(prevHistory => [passwordResult, ...prevHistory].slice(0, 5));
  };

  const createPassword = (characters: string, passwordLength: number) => {
    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(characterIndex);
    }
    return result;
  };

  const evaluateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;

    if (score <= 2) setStrength({ label: 'Weak', color: 'bg-red-500' });
    else if (score === 3 || score === 4) setStrength({ label: 'Good', color: 'bg-orange-500' });
    else setStrength({ label: 'Strong', color: 'bg-green-500' });
  };

  const resetPasswordState = () => {
    setPassword('');
    setIsPassGenerated(false);
    setStrength({ label: '', color: '' });
    setLowerCase(true);
    setUpperCase(false);
    setNumbers(false);
    setSymbols(false);
  };

  // Reusable Component for Label-style Rows
  const CheckboxRow = ({ label, state, setter, color, isLast = false }: any) => (
    <TouchableOpacity 
      activeOpacity={1}
      onPress={() => handleCheckboxToggle(state, setter)}
      className={`w-full flex-row justify-between items-center py-4 ${!isLast ? `border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}` : ''}`}
    >
      <Text className={`text-base font-medium ${textSub}`}>{label}</Text>
      <View pointerEvents="none">
        <BouncyCheckbox
          size={22}
          fillColor={color}
          disableBuiltInState={true}
          useBuiltInState={false}
          isChecked={state}
          onPress={() => {}}
          textContainerStyle={{ width: 0 }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled" className={`flex-1 ${themeBg}`}>
        <SafeAreaView className="flex-1 px-4 mt-12 mb-10">
          
          <View className="flex-row justify-between items-center mb-8">
            <Text className={`text-3xl font-extrabold ${textMain}`}>PassGen</Text>
            <TouchableOpacity 
              onPress={() => setIsDarkMode(!isDarkMode)}
              className={`px-4 py-2 rounded-full border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-200 border-slate-300'}`}
            >
              <Text className={textMain}>{isDarkMode ? '🌙 Dark' : '☀️ Light'}</Text>
            </TouchableOpacity>
          </View>

          <Formik
            initialValues={{ passwordLength: 8 }} 
            validationSchema={PasswordSchema}
            onSubmit={values => generatePasswordString(Number(values.passwordLength))}
          >
            {({ values, isValid, setFieldValue, handleSubmit, handleReset }) => (
              <View>
                <View className={`mb-6 p-5 rounded-2xl shadow-sm border ${cardBg}`}>
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className={`text-base font-semibold ${textMain}`}>Length</Text>
                    <Text className="text-xl font-bold text-blue-500">{values.passwordLength}</Text>
                  </View>
                  <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={4}
                    maximumValue={16}
                    step={1}
                    value={values.passwordLength}
                    onValueChange={(val) => setFieldValue('passwordLength', val)}
                    minimumTrackTintColor="#3b82f6" 
                    maximumTrackTintColor={isDarkMode ? '#475569' : '#cbd5e1'} 
                    thumbTintColor="#3b82f6"
                  />
                </View>

                <View className={`p-4 rounded-2xl shadow-sm border mb-8 ${cardBg}`}>
                  <CheckboxRow label="Lowercase (a-z)" state={lowerCase} setter={setLowerCase} color="#29AB87" />
                  <CheckboxRow label="Uppercase (A-Z)" state={upperCase} setter={setUpperCase} color="#FED85D" />
                  <CheckboxRow label="Numbers (0-9)" state={numbers} setter={setNumbers} color="#8D3DAF" />
                  <CheckboxRow label="Symbols (@#$)" state={symbols} setter={setSymbols} color="#FC80A5" isLast={true} />
                </View>

                <View className="flex-row justify-between items-center mb-8 gap-x-4">
                  <TouchableOpacity
                    disabled={!isValid}
                    className={`flex-1 py-4 rounded-xl items-center ${isValid ? 'bg-blue-600 shadow-md' : 'bg-slate-400'}`}
                    onPress={() => handleSubmit()}
                  >
                    <Text className="text-white font-bold text-lg">Generate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 py-4 rounded-xl items-center border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-200 border-slate-300'}`}
                    onPress={() => { handleReset(); resetPasswordState(); }}
                  >
                    <Text className={`font-bold text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>

          {isPassGenerated && (
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => copyToClipboard(password)}
              className={`p-6 rounded-2xl shadow-lg border items-center mb-8 ${isDarkMode ? 'bg-slate-800 border-blue-900' : 'bg-white border-blue-100'}`}
            >
              <View className="w-full flex-row justify-between items-center mb-4">
                 <Text className="text-lg font-bold text-slate-500">Result</Text>
                 <View className={`px-3 py-1 rounded-full ${strength.color}`}>
                    <Text className="text-white font-bold text-xs">{strength.label}</Text>
                 </View>
              </View>
              <Text className={`text-3xl font-extrabold tracking-widest text-center px-4 py-4 rounded-lg w-full mb-3 ${isDarkMode ? 'bg-slate-900 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                {password}
              </Text>
              <Text className={`text-sm font-bold ${isCopied ? 'text-green-500' : 'text-slate-400'}`}>
                {isCopied ? '✅ Copied!' : '👆 Tap to copy'}
              </Text>
            </TouchableOpacity>
          )}

          {history.length > 0 && (
            <View className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
              <Text className={`text-base font-bold mb-4 ${textMain}`}>Recent History</Text>
              {history.map((pastPass, index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => copyToClipboard(pastPass)}
                  className={`px-4 py-3 rounded-lg mb-2 flex-row justify-between border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}
                >
                  <Text className={`font-mono text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{pastPass}</Text>
                  <Text className="text-blue-500 text-xs font-bold">Copy</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

        </SafeAreaView>
      </ScrollView>
      <Toast />
    </>
  );
}