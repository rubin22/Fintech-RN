import Colors from '@/constants/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import * as LocalAuth from 'expo-local-authentication'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const Page = () => {
  const [isFaceIdAvailable, setIsFaceIdAvailable] = useState(false)
  const [code, setCode] = useState<number[]>([])
  const codeLength = Array(6).fill(0)
  const router = useRouter()

  const offset = useSharedValue(0)

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    }
  })

  const OFFSET = 10
  const TIME = 80

  useEffect(() => {
    async function checkForHardware() {
      const isPresent = await LocalAuth.hasHardwareAsync()

      setIsFaceIdAvailable(isPresent)
    }
    checkForHardware()
  }, [])

  useEffect(() => {
    if (code.length === 6) {
      if (code.join('') === '111111') {
        router.replace('/(main)/(tabs)/home')
      } else {
        offset.value = withSequence(
          withTiming(-OFFSET, { duration: TIME / 2 }),
          withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
          withTiming(0, { duration: TIME / 2 })
        )
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        setCode([])
      }
    }
  }, [code])

  const onNumberPressed = (number: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setCode([...code, number])
  }

  const numberBackspace = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setCode(code.slice(0, -1))
  }

  const onBiometricAuthPress = async () => {
    const { success } = await LocalAuth.authenticateAsync()

    if (success) {
      router.replace('/(main)/(tabs)/home')
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    }
  }

  return (
    <SafeAreaView>
      <Text style={styles.greeting}>Welcome back, John Doe</Text>
      <Text style={{ alignSelf: 'center' }}>Code: (111111)</Text>

      <Animated.View style={[styles.codeView, style]}>
        {codeLength.map((_, index) => (
          <View
            key={index}
            style={[
              styles.codeEmpty,
              {
                backgroundColor: code[index]
                  ? Colors.primary
                  : Colors.lightGray,
              },
            ]}
          />
        ))}
      </Animated.View>

      <View style={styles.numbersView}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {[1, 2, 3].map((number) => (
            <TouchableOpacity
              key={number}
              onPress={() => onNumberPressed(number)}
            >
              <Text style={styles.number}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {[4, 5, 6].map((number) => (
            <TouchableOpacity
              key={number}
              onPress={() => onNumberPressed(number)}
            >
              <Text style={styles.number}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {[7, 8, 9].map((number) => (
            <TouchableOpacity
              key={number}
              onPress={() => onNumberPressed(number)}
            >
              <Text style={styles.number}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ minWidth: 30 }}>
            {isFaceIdAvailable && (
              <TouchableOpacity onPress={onBiometricAuthPress}>
                <MaterialCommunityIcons
                  name={
                    Platform.OS === 'ios' ? 'face-recognition' : 'fingerprint'
                  }
                  size={22}
                  color="black"
                />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={() => onNumberPressed(0)}>
            <Text style={styles.number}>0</Text>
          </TouchableOpacity>

          <View style={{ minWidth: 30 }}>
            {code.length > 0 && (
              <TouchableOpacity onPress={numberBackspace}>
                <MaterialCommunityIcons
                  name="backspace-outline"
                  color="black"
                  size={26}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text
          style={{
            alignSelf: 'center',
            color: Colors.primary,
            fontWeight: '500',
            fontSize: 18,
          }}
        >
          Forgot your passcode?
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 80,
    alignSelf: 'center',
  },
  codeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginVertical: 80,
  },
  codeEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  numbersView: {
    marginHorizontal: 80,
    gap: 60,
  },
  number: {
    fontSize: 32,
  },
})

export default Page
