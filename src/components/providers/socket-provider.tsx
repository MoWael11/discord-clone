'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { io as ClientIO } from 'socket.io-client'

type SocketContextType = {
  socket: any | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  socket: null,
})

export const useSocket = () => useContext(SocketContext)

export const ScocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<any | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_BASE_URL!, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    })

    socketInstance.on('connect', () => {
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return <SocketContext.Provider value={{ isConnected, socket }}>{children}</SocketContext.Provider>
}
