<template>
  <div class="game-play" :style="backgroundStyle">
    <van-nav-bar 
      title="比赛进行中" 
      left-text="返回" 
      fixed 
      @click-left="goBack"
    />
    
    <div class="content">
      <!-- 比赛信息 -->
      <div class="match-info">
        <div class="sport-header">
          <div class="sport-icon">{{ getSportIcon(gameData.sport) }}</div>
          <div class="match-format">
            {{ gameData.settings.totalSets }}局{{ gameData.settings.winsRequired }}胜制
          </div>
        </div>
        <div class="current-set">第{{ currentSet }}局</div>
      </div>

      <!-- 记分板 -->
      <div class="scoreboard">
        <!-- 选手1 -->
        <div class="player-section left">
          <div class="player-info">
            <input 
              v-model="player1Name" 
              class="player-name" 
              placeholder="选手A"
              readonly
            />
            <div class="sets-won">
              <van-icon 
                v-for="n in parseInt(gameData.settings.totalSets)" 
                :key="n"
                name="circle"
                :class="{ 'won': n <= player1Sets }"
                class="set-dot"
              />
            </div>
          </div>
          <div class="score-container">
            <div class="score-display player1-score">{{ player1Score }}</div>
            <div class="score-buttons">
              <van-button 
                type="danger" 
                size="large" 
                round
                @click="addPoint(1)"
                class="score-btn add-btn"
              >
                +1
              </van-button>
              <van-button 
                size="small" 
                @click="subtractPoint(1)"
                :disabled="player1Score === 0"
                class="minus-btn"
              >
                -1
              </van-button>
            </div>
          </div>
        </div>

        <!-- VS 区域 -->
        <div class="vs-section">
          <div class="vs-text">VS</div>
          <div class="set-score">{{ player1Sets }} - {{ player2Sets }}</div>
        </div>

        <!-- 选手2 -->
        <div class="player-section right">
          <div class="player-info">
            <input 
              v-model="player2Name" 
              class="player-name" 
              placeholder="选手B"
              readonly
            />
            <div class="sets-won">
              <van-icon 
                v-for="n in parseInt(gameData.settings.totalSets)" 
                :key="n"
                name="circle"
                :class="{ 'won': n <= player2Sets }"
                class="set-dot"
              />
            </div>
          </div>
          <div class="score-container">
            <div class="score-display player2-score">{{ player2Score }}</div>
            <div class="score-buttons">
              <van-button 
                type="primary" 
                size="large" 
                round
                @click="addPoint(2)"
                class="score-btn add-btn"
              >
                +1
              </van-button>
              <van-button 
                size="small" 
                @click="subtractPoint(2)"
                :disabled="player2Score === 0"
                class="minus-btn"
              >
                -1
              </van-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="control-section">
        <van-button 
          v-if="setEnded && !matchEnded" 
          type="success" 
          block 
          round 
          size="large"
          @click="nextSet"
          class="control-btn"
        >
          下一局
        </van-button>
        
        <van-button 
          type="warning" 
          block 
          round 
          size="large"
          @click="resetMatch"
          class="control-btn"
        >
          重新开始
        </van-button>
      </div>
    </div>

    <!-- 比赛结束弹窗 -->
    <van-dialog
      v-model:show="showMatchResult"
      title="🎉 比赛结束"
      :message="`${winner} 获胜！\n最终比分：${player1Sets} - ${player2Sets}`"
      confirm-button-text="重新开始"
      @confirm="resetMatch"
    />

    <!-- 局结束提示 -->
    <van-dialog
      v-model:show="showSetResult"
      title="本局结束"
      :message="`${setWinner} 获胜！\n本局比分：${player1Score} - ${player2Score}`"
      confirm-button-text="下一局"
      @confirm="nextSet"
    />
  </div>
</template>

<script>
export default {
  name: 'GamePlay',
  props: {
    gameData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      player1Name: '选手A',
      player2Name: '选手B',
      player1Score: 0,
      player2Score: 0,
      player1Sets: 0,
      player2Sets: 0,
      currentSet: 1,
      showMatchResult: false,
      showSetResult: false
    }
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundImage: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }
    },
    targetScore() {
      return parseInt(this.gameData.settings.pointsPerSet)
    },
    winsRequired() {
      return parseInt(this.gameData.settings.winsRequired)
    },
    setEnded() {
      return this.player1Score >= this.targetScore || this.player2Score >= this.targetScore
    },
    matchEnded() {
      return this.player1Sets >= this.winsRequired || this.player2Sets >= this.winsRequired
    },
    winner() {
      if (this.player1Sets >= this.winsRequired) return this.player1Name
      if (this.player2Sets >= this.winsRequired) return this.player2Name
      return null
    },
    setWinner() {
      if (this.player1Score > this.player2Score) return this.player1Name
      if (this.player2Score > this.player1Score) return this.player2Name
      return null
    }
  },
  watch: {
    setEnded(ended) {
      if (ended && !this.matchEnded) {
        setTimeout(() => {
          this.showSetResult = true
        }, 500)
      }
    },
    matchEnded(ended) {
      if (ended) {
        setTimeout(() => {
          this.showMatchResult = true
        }, 500)
      }
    }
  },
  methods: {
    getSportIcon(sport) {
      const icons = {
        badminton: '🏸',
        tennis: '🎾',
        pingpong: '🏓',
        volleyball: '🏐'
      }
      return icons[sport] || '🏸'
    },
    goBack() {
      this.$emit('go-back')
    },
    addPoint(player) {
      if (this.setEnded || this.matchEnded) return
      
      if (player === 1) {
        this.player1Score++
      } else {
        this.player2Score++
      }
    },
    subtractPoint(player) {
      if (player === 1 && this.player1Score > 0) {
        this.player1Score--
      } else if (player === 2 && this.player2Score > 0) {
        this.player2Score--
      }
    },
    nextSet() {
      if (this.player1Score > this.player2Score) {
        this.player1Sets++
      } else {
        this.player2Sets++
      }
      
      this.currentSet++
      this.player1Score = 0
      this.player2Score = 0
      this.showSetResult = false
    },
    resetMatch() {
      this.player1Score = 0
      this.player2Score = 0
      this.player1Sets = 0
      this.player2Sets = 0
      this.currentSet = 1
      this.showMatchResult = false
      this.showSetResult = false
    }
  }
}
</script>

<style scoped>
.game-play {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}

.content {
  padding: 80px 20px 20px;
  color: white;
}

.match-info {
  text-align: center;
  margin-bottom: 30px;
}

.sport-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
}

.sport-icon {
  font-size: 36px;
}

.match-format {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.current-set {
  font-size: 20px;
  font-weight: bold;
}

.scoreboard {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px 20px;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: center;
}

.player-section {
  text-align: center;
}

.player-info {
  margin-bottom: 20px;
}

.player-name {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #f5f5f5;
  text-align: center;
  font-size: 14px;
  color: #333;
}

.sets-won {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 8px;
}

.set-dot {
  font-size: 12px;
  color: #ddd;
}

.set-dot.won {
  color: #1989fa;
}

.score-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.score-display {
  font-size: 60px;
  font-weight: bold;
  color: #333;
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player1-score {
  color: #ee0a24;
}

.player2-score {
  color: #1989fa;
}

.score-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.score-btn {
  width: 60px;
  height: 60px;
  font-size: 18px;
  font-weight: bold;
}

.minus-btn {
  width: 40px;
  height: 30px;
  font-size: 14px;
}

.vs-section {
  text-align: center;
  color: #666;
}

.vs-text {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}

.set-score {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.control-btn {
  height: 50px;
  font-size: 16px;
  font-weight: bold;
}

@media (max-width: 480px) {
  .content {
    padding: 80px 15px 20px;
  }
  
  .scoreboard {
    padding: 20px 15px;
  }
  
  .score-display {
    font-size: 48px;
  }
  
  .score-btn {
    width: 50px;
    height: 50px;
    font-size: 16px;
  }
}
</style>