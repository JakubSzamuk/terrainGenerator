'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { createNoise2D } from 'simplex-noise'
import Cube from '@/components/Cube'
import Water from '@/components/Water'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  const [waterLevel, setWaterLevel] = useState(-2)
  const [amplitude, setAmplitude] = useState(8)
  const [size, setSize] = useState(40)
  const [frequency, setFrequency] = useState(0.06)
  const [showArray, setShowArray] = useState()
  const [normalise, setNormalise] = useState(false)


  const [regen, setRegen] = useState(false)
  const [menuFold, setMenuFold] = useState(true)

  const startRender = () => {
    const genNoise = () => {
      const noise = createNoise2D()
      setShowArray(noiseArray(size, size, noise))
    }
    const noiseArray = (x, y, noise) => {
      let arr = []
      for (let i = 0; i < x; i++) {
        arr[i] = []
        for (let j = 0; j < y; j++) {
          arr[i][j] = normalise ? ((noise(i * frequency, j * frequency) * amplitude) * 10) * ((noise(i * frequency, j * frequency) * amplitude) * 10) / 1000 - 6 : noise(i * frequency, j * frequency) * amplitude
        }
      }
      return arr
    }
    genNoise()
    setRegen(!regen)
  }
  useEffect(() => {
    startRender()
  }, [])
  return (
    <div className='relative'>
      <div className='w-screen h-screen m-0 p-0 relative bg-gray-400 hideSmall'>
        <div className='h-screen w-screen z-10'>
          <Canvas camera={{ position: [5, 20, 5] }} className='w-screen h-screen'>
            <OrbitControls />
            <ambientLight intensity={1.4} />
            {isLoaded ? <pointLight position={[ 55, 15, 55 ]} intensity={800}/> : null}
            {showArray ? (
              <Cube array={showArray} regen={regen} isLoaded={setIsLoaded} dimension={size} />
            ) : null}
            <Water regen={regen} size={size} level={waterLevel} />
          </Canvas>
        </div>
        <div className={`absolute top-[20vh] right-0 w-[20vw] h-[60vh] flex flex-col bg-gray-700 borderRadius p-8 opacity-90 z-60 ${menuFold ? "" : "foldAway"}`}>
          <div className='flex'>
            <h1 className='displayFont text-2xl text-white w-1/2'>Terrain generator!</h1>
            <button onClick={() => setMenuFold(!menuFold)} className={`p-4 bg-white ml-28 text-black displayFont ${menuFold ? "translate" : "negateFold"}`}><span className="material-symbols-outlined">arrow_forward</span></button>
          </div>
          <div className='flex mb-4 items-center mt-16 relative w-full'>
            <p className='text-white text-xl displayFont'>Normalise?</p>
            <input onChange={() => setNormalise(!normalise)} value="normalise" type='checkbox' className='absolute right-0'/>
          </div>
          <p className='text-white text-xl displayFont'>Amplitude:</p>
          <input type="range" min="3" max="16" value={amplitude} onChange={(e) => setAmplitude(e.target.value)} />
          <p className='text-white text-xl displayFont mt-4'>Size:</p>
          <input type="range" min="10" max="200" value={size} onChange={(e) => setSize(e.target.value)} />
          <p className='text-white text-xl displayFont mt-4'>Frequency:</p>
          <input type="range" min="1" max="14" value={frequency * 100} onChange={(e) => setFrequency(e.target.value / 100)} />
          <p className='text-white text-xl displayFont mt-4'>Water Level:</p>
          <input type="range" min="-6" max="6" value={waterLevel} onChange={(e) => setWaterLevel(e.target.value)} />
          <button className='bg-white text-black mt-8 rounded-md p-8 displayFont hover:opacity-80 transition-all' onClick={() => startRender()}>Generate!</button>
        </div>
      </div>
      <div className='w-screen h-[50vh] hideLarge flex justify-center items-center absolute top-0'>
        <p className='displayFont text-3xl w-[90%]'>This Terrain Generator is unavailable on mobile devices</p>
      </div>
    </div>
  )
}
