<template>
  <div class="game-bg" :style="bgColorStyle">
    <div class="game-play" :style="bgImagesStyle">
      <div class="content">
        <!-- 竖屏计分板 -->
        <div class="scoreboard-vertical">
          <!-- 选手1 -->
          <div class="player-card player1">
            <div class="score-buttons rotate90">
              <van-button
                size="small"
                @click="subtractPoint(1)"
                :disabled="player1Score === 0"
                class="minus-btn"
              >
                -1
              </van-button>
            </div>
            <!-- <div class="player-name">选手A</div> -->
            <div class="score-content" @click="addPoint(1)">
              <div class="score-display">
                <div class="score-style rotate90">
                  {{
                    player1Score < 10
                      ? "0"
                      : String(player1Score).substring(0, 1)
                  }}
                </div>
              </div>
              <div class="score-display">
                <div class="score-style rotate90">
                  {{
                    player1Score < 10
                      ? player1Score
                      : String(player1Score).substring(1, 2)
                  }}
                </div>
              </div>
            </div>
          </div>

          <!-- 选手2 -->
          <div class="player-card player2">
            <!-- <div class="player-name">选手B</div> -->
            <div
              class="score-content"
              style="margin-top: 0"
              @click="addPoint(2)"
            >
              <div class="score-display">
                <div class="score-style rotate90">
                  {{
                    player2Score < 10
                      ? "0"
                      : String(player2Score).substring(0, 1)
                  }}
                </div>
              </div>
              <div class="score-display">
                <div class="score-style rotate90">
                  {{
                    player2Score < 10
                      ? player2Score
                      : String(player2Score).substring(1, 2)
                  }}
                </div>
              </div>
            </div>

            <div class="score-buttons" style="margin-top: 18%">
              <van-button
                size="small"
                @click="subtractPoint(2)"
                :disabled="player2Score === 0"
                class="minus-btn rotate90"
              >
                -1
              </van-button>
            </div>
          </div>
        </div>
        <!-- 大比分显示 -->
        <div class="match-score-section">
          <div class="match-score">
            <van-rate
              v-model="player1Sets"
              :count="parseInt(gameData.settings.winsRequired)"
              :readonly="true"
              :size="28"
              color="#ee0a24"
              void-color="#f5f5f5"
              class="rotate90"
            />
            <van-rate
              v-model="player2Sets"
              :count="parseInt(gameData.settings.winsRequired)"
              :readonly="true"
              :size="28"
              color="#1989fa"
              void-color="#f5f5f5"
              class="rotate90"
            />
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
        :message="getMatchResultMessage()"
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
  </div>
</template>

<script>
export default {
  name: "GamePlay",
  props: {
    gameData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      player1Name: "蓝方",
      player2Name: "红方",
      player1Score: 0,
      player2Score: 0,
      player1Sets: 0,
      player2Sets: 0,
      currentSet: 1,
      showMatchResult: false,
      showSetResult: false,
      matchStartTime: null,
      setStartTime: null,
      pointStartTime: null,
      setHistory: [], // 每局的历史记录
      currentSetLongestRally: 0, // 当前局最长回合时间
    };
  },
  mounted() {
    this.matchStartTime = Date.now();
    this.setStartTime = Date.now();
    this.pointStartTime = Date.now();
  },
  computed: {
    bgColorStyle() {
      return {
        backgroundColor: "#000",
        height: "100vh",
        width: "100vw",
        alignContent: "center",
      };
    },
    bgImagesStyle() {
      return {
        backgroundImage: "url(/images/scorekeeper2.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      };
    },
    targetScore() {
      return parseInt(this.gameData.settings.pointsPerSet);
    },
    winsRequired() {
      return parseInt(this.gameData.settings.winsRequired);
    },
    setEnded() {
      return (
        this.player1Score >= this.targetScore ||
        this.player2Score >= this.targetScore
      );
    },
    matchEnded() {
      return (
        this.player1Sets >= this.winsRequired ||
        this.player2Sets >= this.winsRequired
      );
    },
    winner() {
      if (this.player1Sets >= this.winsRequired) return this.player1Name;
      if (this.player2Sets >= this.winsRequired) return this.player2Name;
      return null;
    },
    setWinner() {
      if (this.player1Score > this.player2Score) return this.player1Name;
      if (this.player2Score > this.player1Score) return this.player2Name;
      return null;
    },
  },
  watch: {
    setEnded(ended) {
      if (ended && !this.matchEnded) {
        setTimeout(() => {
          this.showSetResult = true;
        }, 500);
      }
    },
    matchEnded(ended) {
      if (ended) {
        setTimeout(() => {
          this.showMatchResult = true;
        }, 500);
      }
    },
  },
  methods: {
    getSportIcon(sport) {
      const icons = {
        badminton: "🏸",
        tennis: "🎾",
        pingpong: "🏓",
        volleyball: "🏐",
      };
      return icons[sport] || "🏸";
    },
    goBack() {
      this.$emit("go-back");
    },
    addPoint(player) {
      if (this.setEnded || this.matchEnded) return;

      // 计算本次得分的回合时间
      const now = Date.now();
      const rallyDuration = now - this.pointStartTime;

      // 更新当前局最长回合时间
      if (rallyDuration > this.currentSetLongestRally) {
        this.currentSetLongestRally = rallyDuration;
      }

      if (player === 1) {
        this.player1Score++;
      } else {
        this.player2Score++;
      }

      // 重置回合计时
      this.pointStartTime = now;
    },
    subtractPoint(player) {
      if (player === 1 && this.player1Score > 0) {
        this.player1Score--;
      } else if (player === 2 && this.player2Score > 0) {
        this.player2Score--;
      }
    },
    nextSet() {
      // 保存当前局的数据
      const setDuration = Date.now() - this.setStartTime;
      this.setHistory.push({
        setNumber: this.currentSet,
        player1Score: this.player1Score,
        player2Score: this.player2Score,
        duration: setDuration,
        longestRally: this.currentSetLongestRally,
      });

      if (this.player1Score > this.player2Score) {
        this.player1Sets++;
      } else {
        this.player2Sets++;
      }

      this.currentSet++;
      this.player1Score = 0;
      this.player2Score = 0;
      this.showSetResult = false;

      // 重置下一局的计时
      this.setStartTime = Date.now();
      this.pointStartTime = Date.now();
      this.currentSetLongestRally = 0;
    },
    resetMatch() {
      this.player1Score = 0;
      this.player2Score = 0;
      this.player1Sets = 0;
      this.player2Sets = 0;
      this.currentSet = 1;
      this.showMatchResult = false;
      this.showSetResult = false;
      this.setHistory = [];
      this.matchStartTime = Date.now();
      this.setStartTime = Date.now();
      this.pointStartTime = Date.now();
      this.currentSetLongestRally = 0;
    },
    formatDuration(milliseconds) {
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      if (minutes > 0) {
        return `${minutes}分${secs}秒`;
      }
      return `${seconds}秒`;
    },
    getMatchResultMessage() {
      // 保存最后一局数据（如果还没保存）
      if (this.matchEnded && this.player1Score + this.player2Score > 0) {
        const lastSetInHistory = this.setHistory.find(
          (set) => set.setNumber === this.currentSet
        );
        if (!lastSetInHistory) {
          const setDuration = Date.now() - this.setStartTime;
          this.setHistory.push({
            setNumber: this.currentSet,
            player1Score: this.player1Score,
            player2Score: this.player2Score,
            duration: setDuration,
            longestRally: this.currentSetLongestRally,
          });
        }
      }

      const totalDuration = this.formatDuration(
        Date.now() - this.matchStartTime
      );

      let message = `${this.winner} 获胜！\n最终比分：${this.player1Sets} - ${this.player2Sets}\n总时长：${totalDuration}\n\n`;

      message += "各局详情：\n";
      this.setHistory.forEach((set) => {
        message += `第${set.setNumber}局：${set.player1Score}-${set.player2Score} | 时长：${this.formatDuration(set.duration)} | 最长回合：${this.formatDuration(set.longestRally)}\n`;
      });

      return message;
    },
  },
};
</script>

<style scoped>
.landscape-lock {
  width: 100vw;
  height: 100vh;
  transform-origin: center;
}

@media (orientation: portrait) {
  .landscape-lock {
    transform: rotate(90deg);
    width: 100vh;
    height: 100vw;
  }
}

.game-play {
  min-height: 100vh;
  position: relative;
}

.game-play::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.nav-bar {
  background: rgba(255, 255, 255, 0.9) !important;
  z-index: 10;
}

.content {
  position: relative;
  z-index: 2;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
}

.match-score-section {
  display: flex;
  width: 30vw;
  height: 100vh;
  align-items: center;
}

.match-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.match-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: space-evenly;
}

.vs-text {
  font-size: 40px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  font-family: bebas-regular;
}

.rotate90 {
  transform: rotate(90deg);
  width: fit-content;
  height: fit-content;
}

.scoreboard-vertical {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  width: 70vw;
  height: 100vh;
}

.player-card {
  text-align: center;
  height: 50%;
}

.player-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.player-card .score-content {
  margin-top: 16%;
}

.score-content .score-display:nth-child(2) {
  margin-top: 8%;
}
.score-display {
  font-size: 80px;
  font-weight: bold;
  color: #333;
  line-height: 1;
  height: 41%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.score-style {
  color: #fff;
  font-family: bebas-regular;
  font-size: 17vh;
}

.score-buttons {
  height: 12%;
  display: flex;
}

.score-btn {
  width: 80px;
  height: 80px;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.minus-btn {
  width: 6vh;
  height: 100%;
  font-size: 16px;
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 0 0 auto;
  width: 200px;
  display: none;
}

.control-btn {
  height: 50px;
  font-size: 16px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}
</style>