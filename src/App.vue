<template>
  <div class="app">
    <header class="header">
      <h1>{{ currentSport.icon }} {{ currentSport.name }}计分器</h1>
      <div class="sport-selector" v-if="!gameStarted">
        <select v-model="selectedSport" @change="changeSport" class="sport-select">
          <option v-for="sport in sportsList" :key="sport.key" :value="sport.key">
            {{ sport.icon }} {{ sport.name }}
          </option>
        </select>
      </div>
    </header>
    
    <main class="main">
      <BaseScorekeeper 
        :key="selectedSport"
        :sport-config="currentSport"
        @game-started="onGameStarted"
        @game-ended="onGameEnded"
      />
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import BaseScorekeeper from './components/BaseScorekeeper.vue'
import { sportsConfig, getSportsList } from './configs/sportsConfig.js'

export default {
  name: 'App',
  components: {
    BaseScorekeeper
  },
  setup() {
    const selectedSport = ref('badminton')
    const gameStarted = ref(false)
    const sportsList = getSportsList()

    const currentSport = computed(() => sportsConfig[selectedSport.value])

    const changeSport = () => {
      if (!gameStarted.value) {
        // 切换球类时重置游戏状态
        gameStarted.value = false
      }
    }

    const onGameStarted = () => {
      gameStarted.value = true
    }

    const onGameEnded = () => {
      gameStarted.value = false
    }

    return {
      selectedSport,
      gameStarted,
      sportsList,
      currentSport,
      changeSport,
      onGameStarted,
      onGameEnded
    }
  }
}
</script>

<style scoped>
.app {
  max-width: 400px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #42b883;
  color: white;
  text-align: center;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header h1 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.sport-selector {
  display: flex;
  justify-content: center;
}

.sport-select {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: rgba(255,255,255,0.9);
  color: #2c3e50;
  font-size: 14px;
  cursor: pointer;
  outline: none;
}

.sport-select:hover {
  background: white;
}

.main {
  flex: 1;
  padding: 16px;
}

@media (max-width: 480px) {
  .app {
    max-width: 100%;
  }
  
  .main {
    padding: 12px;
  }
}
</style>