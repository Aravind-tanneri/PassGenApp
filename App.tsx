import './global.css'
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 p-4">
      {/* Main Card Container */}
      <View className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl shadow-slate-200 border border-slate-100">
        
        {/* Header / Avatar Area */}
        <View className="flex-row items-center mb-6">
          <View className="h-16 w-16 bg-[#8D3DAF] rounded-full items-center justify-center mr-4">
            <Text className="text-2xl text-white font-bold">TA</Text>
          </View>
          <View>
            <Text className="text-xl font-bold text-slate-900">T Aravind</Text>
            <Text className="text-sm font-medium text-[#8D3DAF]">MERN Stack Developer</Text>
          </View>
        </View>

        {/* Bio / Body */}
        <Text className="text-slate-600 mb-6 leading-relaxed">
          Building highly scalable full-stack applications. Currently exploring the React Native ecosystem to bring complex web architectures into seamless mobile experiences.
        </Text>

        {/* Action Buttons */}
        <View className="flex-row flex-wrap justify-between mt-2">
          <TouchableOpacity className="flex-1 bg-[#8D3DAF] py-3 rounded-xl items-center mr-2 shadow-md">
            <Text className="text-white font-semibold">View GitHub</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-1 bg-slate-100 py-3 rounded-xl items-center ml-2 border border-slate-200">
            <Text className="text-slate-800 font-semibold">Contact</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </View>
  );
}