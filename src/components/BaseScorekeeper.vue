<template>
  <div class="scorekeeper">
    <div class="match-info">
      <div class="game-status">
        <span class="current-game">第{{ currentGame }}局</span>
        <span class="best-of">{{ bestOf }}局{{ Math.ceil(bestOf/2) }}胜制</span>
      </div>
    </div>

    <div class="scoreboard">
      <div class="player-section">
        <div class="player-info">
          <input 
            v-model="player1Name" 
            class="player-name" 
            placeholder="选手A"
            :disabled="gameStarted"
          />
          <div class="games-won">
            <span 
              v-for="n in bestOf" 
              :key="n" 
              class="game-dot"
              :class="{ 'won': n <= player1Games }"
            ></span>
          </div>
        </div>
        <div class="score-display">{{ player1Score }}</div>
        <div class="score-buttons">
          <button @click="addPoint(1)" class="btn btn-primary score-btn">+1</button>
          <button @click="subtractPoint(1)" class="btn btn-secondary score-btn" :disabled="player1Score === 0">-1</button>
        </div>
      </div>

      <div class="vs-section">
        <div class="vs">VS</div>
        <div class="serving-indicator" v-if="gameStarted && showServing">
          <div class="serve-arrow" :class="{ 'serve-left': servingPlayer === 1, 'serve-right': servingPlayer === 2 }">
            {{ servingPlayer === 1 ? '◀' : '▶' }}
          </div>
        </div>
      </div>

      <div class="player-section">
        <div class="player-info">
          <input 
            v-model="player2Name" 
            class="player-name" 
            placeholder="选手B"
            :disabled="gameStarted"
          />
          <div class="games-won">
            <span 
              v-for="n in bestOf" 
              :key="n" 
              class="game-dot"
              :class="{ 'won': n <= player2Games }"
            ></span>
          </div>
        </div>
        <div class="score-display">{{ player2Score }}</div>
        <div class="score-buttons">
          <button @click="addPoint(2)" class="btn btn-primary score-btn">+1</button>
          <button @click="subtractPoint(2)" class="btn btn-secondary score-btn" :disabled="player2Score === 0">-1</button>
        </div>
      </div>
    </div>

    <div class="game-controls">
      <div class="settings" v-if="!gameStarted">
        <label class="setting-item">
          比赛制式：
          <select v-model="bestOf" class="setting-select">
            <option :value="1">1局定胜负</option>
            <option :value="3">3局2胜</option>
            <option :value="5">5局3胜</option>
          </select>
        </label>
      </div>

      <div class="control-buttons">
        <button 
          v-if="!gameStarted" 
          @click="startMatch" 
          class="btn btn-primary"
          :disabled="!player1Name.trim() || !player2Name.trim()"
        >
          开始比赛
        </button>
        
        <template v-else>
          <button @click="nextGame" class="btn btn-primary" v-if="gameEnded && !matchEnded">
            下一局
          </button>
          <button @click="resetMatch" class="btn btn-danger">
            重新开始
          </button>
        </template>
      </div>
    </div>

    <div class="match-result" v-if="matchEnded">
      <h2>🎉 比赛结束!</h2>
      <p class="winner">
        {{ winner }} 获胜!
      </p>
      <p class="final-score">
        最终比分: {{ player1Games }} - {{ player2Games }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'BaseScorekeeper',
  props: {
    sportConfig: {
      type: Object,
      required: true
    }
  },
  emits: ['game-started', 'game-ended'],
  setup(props, { emit }) {
    const player1Name = ref('选手A')
    const player2Name = ref('选手B')
    const player1Score = ref(0)
    const player2Score = ref(0)
    const player1Games = ref(0)
    const player2Games = ref(0)
    const currentGame = ref(1)
    const bestOf = ref(3)
    const gameStarted = ref(false)
    const servingPlayer = ref(1)

    const showServing = computed(() => props.sportConfig.hasServing || false)

    const gameEnded = computed(() => {
      return props.sportConfig.isGameEnded(player1Score.value, player2Score.value)
    })

    const matchEnded = computed(() => {
      const winsNeeded = Math.ceil(bestOf.value / 2)
      return player1Games.value >= winsNeeded || player2Games.value >= winsNeeded
    })

    const winner = computed(() => {
      const winsNeeded = Math.ceil(bestOf.value / 2)
      if (player1Games.value >= winsNeeded) return player1Name.value
      if (player2Games.value >= winsNeeded) return player2Name.value
      return null
    })

    const addPoint = (player) => {
      if (gameEnded.value || matchEnded.value) return
      
      if (player === 1) {
        player1Score.value++
      } else {
        player2Score.value++
      }
      
      updateServing()
    }

    const subtractPoint = (player) => {
      if (player === 1 && player1Score.value > 0) {
        player1Score.value--
      } else if (player === 2 && player2Score.value > 0) {
        player2Score.value--
      }
      
      updateServing()
    }

    const updateServing = () => {
      if (!props.sportConfig.hasServing) return
      
      if (props.sportConfig.updateServing) {
        servingPlayer.value = props.sportConfig.updateServing(player1Score.value, player2Score.value)
      }
    }

    const startMatch = () => {
      if (!player1Name.value.trim() || !player2Name.value.trim()) return
      gameStarted.value = true
      emit('game-started')
      resetGame()
    }

    const resetGame = () => {
      player1Score.value = 0
      player2Score.value = 0
      servingPlayer.value = 1
    }

    const nextGame = () => {
      if (!gameEnded.value) return
      
      if (player1Score.value > player2Score.value) {
        player1Games.value++
      } else {
        player2Games.value++
      }
      
      currentGame.value++
      resetGame()
    }

    const resetMatch = () => {
      player1Score.value = 0
      player2Score.value = 0
      player1Games.value = 0
      player2Games.value = 0
      currentGame.value = 1
      gameStarted.value = false
      servingPlayer.value = 1
      emit('game-ended')
    }

    watch(gameEnded, (ended) => {
      if (ended) {
        setTimeout(() => {
          if (!matchEnded.value) {
            const gameWinner = player1Score.value > player2Score.value ? player1Name.value : player2Name.value
            alert(`本局结束！${gameWinner} 获胜！`)
          }
        }, 500)
      }
    })

    return {
      player1Name,
      player2Name,
      player1Score,
      player2Score,
      player1Games,
      player2Games,
      currentGame,
      bestOf,
      gameStarted,
      servingPlayer,
      showServing,
      gameEnded,
      matchEnded,
      winner,
      addPoint,
      subtractPoint,
      startMatch,
      nextGame,
      resetMatch
    }
  }
}
</script>

<style scoped>
.scorekeeper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.match-info {
  text-align: center;
}

.game-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.current-game {
  font-weight: 600;
  color: #42b883;
}

.best-of {
  font-size: 14px;
  color: #666;
}

.scoreboard {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: center;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.player-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.player-info {
  text-align: center;
  width: 100%;
}

.player-name {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  background: #f9f9f9;
}

.player-name:disabled {
  background: #f0f0f0;
  color: #666;
}

.games-won {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 8px;
}

.game-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
  transition: background 0.2s;
}

.game-dot.won {
  background: #42b883;
}

.score-display {
  font-size: 48px;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-buttons {
  display: flex;
  gap: 8px;
}

.score-btn {
  width: 50px;
  height: 40px;
  font-size: 14px;
  border-radius: 6px;
}

.vs-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.vs {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

.serving-indicator {
  height: 20px;
}

.serve-arrow {
  font-size: 16px;
  color: #42b883;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.game-controls {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.settings {
  margin-bottom: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.setting-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 14px;
}

.control-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.control-buttons .btn {
  flex: 1;
  max-width: 120px;
}

.match-result {
  text-align: center;
  background: linear-gradient(135deg, #42b883, #369870);
  color: white;
  padding: 24px;
  border-radius: 12px;
  margin-top: 16px;
}

.match-result h2 {
  font-size: 24px;
  margin-bottom: 12px;
}

.winner {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.final-score {
  font-size: 16px;
  opacity: 0.9;
}

@media (max-width: 480px) {
  .scoreboard {
    padding: 16px;
  }
  
  .score-display {
    font-size: 36px;
  }
}
</style>