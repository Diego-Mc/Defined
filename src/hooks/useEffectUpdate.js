import { useEffect, useRef } from 'react'

export const useEffectUpdate = (effect, dependencies = []) => {
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      return effect()
    }
  }, dependencies)
}
