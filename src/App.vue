<template>
  <div class="app">
    <!-- 运动选择和设置页面 -->
    <SportSelection 
      v-if="currentPage === 'sport-selection'"
      @start-game="onStartGame"
    />
    
    <!-- 游戏进行页面 -->
    <GamePlay 
      v-else-if="currentPage === 'game-play'"
      :game-data="gameData"
      @go-back="currentPage = 'sport-selection'"
    />
  </div>
</template>

<script>
import SportSelection from './components/SportSelection.vue'
import GamePlay from './components/GamePlay.vue'

export default {
  name: 'App',
  components: {
    SportSelection,
    GamePlay
  },
  data() {
    return {
      currentPage: 'sport-selection',
      gameData: null
    }
  },
  methods: {
    onStartGame(data) {
      this.gameData = data
      this.currentPage = 'game-play'
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
  line-height: 1.4;
}

.app {
  min-height: 100vh;
}

@media (max-width: 480px) {
  body {
    font-size: 14px;
  }
}
</style>