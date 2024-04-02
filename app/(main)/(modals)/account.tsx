import Colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useAssets } from 'expo-asset'
import { BlurView } from 'expo-blur'
import { getAppIcon, setAppIcon } from 'expo-dynamic-app-icon'
import { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const ICONS = [
  {
    name: 'Default',
    icon: require('@/assets/images/icon.png'),
  },
  {
    name: 'Dark',
    icon: require('@/assets/images/icon-dark.png'),
  },
  {
    name: 'Vivid',
    icon: require('@/assets/images/icon-vivid.png'),
  },
]

const Page = () => {
  const [edit, setEdit] = useState(false)
  const [activeIcon, setActiveIcon] = useState('Default')
  const [assets] = useAssets([require('@/assets/images/profile.png')])

  useEffect(() => {
    const loadCurrentIconPref = () => {
      const icon = getAppIcon()
      setActiveIcon(icon)
    }
    loadCurrentIconPref()
  }, [])

  const onChangeAppIcon = (icon: string) => {
    setAppIcon(icon.toLowerCase())
    setActiveIcon(icon)
  }

  return (
    <BlurView
      intensity={80}
      tint={'dark'}
      style={{ flex: 1, paddingTop: 100, backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <View style={{ alignItems: 'center' }}>
        {assets && (
          <TouchableOpacity style={styles.captureBtn}>
            <Image source={{ uri: assets[0].uri }} style={styles.avatar} />
          </TouchableOpacity>
        )}

        <View style={{ flexDirection: 'row', gap: 6 }}>
          <View style={styles.editRow}>
            <Text style={{ fontSize: 26, color: '#fff' }}>John Doe</Text>
            <TouchableOpacity>
              <Ionicons name="pencil-sharp" size={24} color={'#fff'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="log-out" size={24} color={'#fff'} />
          <Text style={{ color: '#fff', fontSize: 18 }}>Log out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="person" size={24} color={'#fff'} />
          <Text style={{ color: '#fff', fontSize: 18 }}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="bulb" size={24} color={'#fff'} />
          <Text style={{ color: '#fff', fontSize: 18 }}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="megaphone" size={24} color={'#fff'} />
          <Text style={{ color: '#fff', fontSize: 18, flex: 1 }}>Inbox</Text>
          <View
            style={{
              backgroundColor: Colors.primary,
              paddingHorizontal: 10,
              borderRadius: 10,
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 12 }}>14</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        {ICONS.map((icon) => (
          <TouchableOpacity
            key={icon.name}
            style={styles.btn}
            onPress={() => onChangeAppIcon(icon.name)}
          >
            <Image source={icon.icon} style={{ width: 24, height: 24 }} />
            <Text style={{ color: '#fff', fontSize: 18 }}>{icon.name}</Text>
            {activeIcon.toLowerCase() === icon.name.toLowerCase() && (
              <Ionicons name="checkmark" size={24} color={'#fff'} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </BlurView>
  )
}

const styles = StyleSheet.create({
  editRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray,
  },
  captureBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    width: 140,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  actions: {
    backgroundColor: 'rgba(256, 256, 256, 0.1)',
    borderRadius: 16,
    gap: 0,
    margin: 20,
  },
  btn: {
    padding: 14,
    flexDirection: 'row',
    gap: 20,
  },
})

export default Page
