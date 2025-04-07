import 'react-native-gesture-handler'
import React from 'react'
import Navigation  from '@navigation/Navigation'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const App = () => {
  return (
    <GestureHandlerRootView>
    <Navigation />
    </GestureHandlerRootView>
  )
}

export default App