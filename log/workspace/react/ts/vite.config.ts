import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    /**
     * 컴파일과 별개 스레드로 병렬 타입 체크 동작 단, 반영이 tsc 특성상 느릴 수 있음
     * @remark `concurrently -n vite,tsc -c blue,yellow \"vite\" \"tsc --noEmit --watch\"` 동일한 역할, dependency 관리 시 scripts로 변경 필요
    */
    checker({ typescript: true })
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    /**
     * 테스트 환경 설정: SRP를 위한 테스트 공통 초기화 path 설정
     * @remark 추후 확장성을 고려해서 테스트 환경 설정을 전역으로 설정 필요시 `./src/tdd/__tests__/setup.ts` 가능
    */
    setupFiles: ['./src/test/setup.ts']
  }
})
