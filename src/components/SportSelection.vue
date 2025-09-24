<template>
  <div class="sport-selection">
    <van-nav-bar title="计分器" fixed />

    <div class="content">
      <!-- 运动选择 -->
      <div class="section">
        <div class="section-title">选择球类运动</div>
        <div class="sports-grid">
          <div v-for="sport in sports" :key="sport.id" class="sport-card"
            :class="{ active: selectedSport === sport.id }" @click="selectSport(sport.id)">
            <div class="sport-icon">{{ sport.icon }}</div>
            <div class="sport-name">{{ sport.name }}</div>
          </div>
        </div>
      </div>

      <!-- 比赛制式选择 -->
      <div class="section" v-if="selectedSport">
        <div class="section-title">选择比赛制式</div>
        <div class="format-grid">
          <div v-for="format in matchFormats" :key="format.value" class="format-card"
            :class="{ active: selectedFormat === format.value }" @click="selectFormat(format.value)">
            <div class="format-text">{{ format.text }}</div>
            <div class="format-desc">{{ format.desc }}</div>
          </div>
        </div>
      </div>

      <!-- 比分设置 -->
      <div class="section" v-if="selectedFormat">
        <div class="section-title">每局比分</div>
        <div class="points-grid">
          <div v-for="point in pointOptions" :key="point" class="point-card"
            :class="{ active: selectedPoints === point }" @click="selectPoints(point)">
            <div class="point-text">{{ point }}分</div>
          </div>
        </div>
      </div>

      <van-button type="primary" block round size="large" class="start-btn" :disabled="!canStart" @click="startMatch">
        开始比赛
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SportSelection',
  data() {
    return {
      selectedSport: '',
      selectedFormat: '',
      selectedPoints: '',
      sports: [],
      matchFormats: [],
      pointOptions: []
    }
  },
  async mounted() {
    await this.loadSportsData()
  },
  computed: {
    canStart() {
      return this.selectedSport && this.selectedFormat && this.selectedPoints
    }
  },
  methods: {
    async loadSportsData() {
      try {
        const response = await fetch('/json/sports.json')
        const data = await response.json()
        this.sports = data.sports
        this.matchFormats = data.matchFormats
        this.pointOptions = data.pointOptions
      } catch (error) {
        console.error('加载运动数据失败:', error)
      }
    },
    selectSport(sportId) {
      this.selectedSport = sportId
      // 根据运动类型设置默认值
      const sport = this.sports.find(s => s.id === sportId)
      if (sport) {
        this.selectedFormat = sport.defaultFormat
        this.selectedPoints = sport.defaultPoints
      }
    },
    selectFormat(format) {
      this.selectedFormat = format
    },
    selectPoints(points) {
      this.selectedPoints = points
    },
    startMatch() {
      if (this.canStart) {
        const [totalSets, winsRequired] = this.selectedFormat.includes('-')
          ? this.selectedFormat.split('-').map(Number)
          : [1, 1]

        this.$emit('start-game', {
          sport: this.selectedSport,
          settings: {
            totalSets: totalSets.toString(),
            winsRequired: winsRequired.toString(),
            pointsPerSet: this.selectedPoints.toString()
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.sport-selection {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content {
  padding: 80px 20px 20px;
}

.section {
  margin-bottom: 40px;
}

.section-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
}

.sports-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.sport-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sport-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.sport-card.active {
  background: #1989fa;
  color: white;
  transform: translateY(-2px);
}

.sport-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.sport-name {
  font-size: 14px;
  font-weight: 500;
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.format-card {
  background: white;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.format-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.format-card.active {
  background: #ee0a24;
  color: white;
  transform: translateY(-2px);
}

.format-text {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.format-desc {
  font-size: 12px;
  opacity: 0.7;
}

.points-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.point-card {
  background: white;
  border-radius: 8px;
  padding: 15px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.point-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.point-card.active {
  background: #07c160;
  color: white;
  transform: translateY(-1px);
}

.point-text {
  font-size: 14px;
  font-weight: bold;
}

.start-btn {
  margin-top: 30px;
  height: 50px;
  font-size: 18px;
  font-weight: bold;
}

@media (max-width: 480px) {
  .content {
    padding: 80px 15px 20px;
  }

  .section-title {
    font-size: 18px;
  }

  .sports-grid {
    gap: 12px;
  }

  .sport-card {
    padding: 15px;
  }

  .sport-icon {
    font-size: 30px;
  }

  .format-grid {
    gap: 10px;
  }

  .format-card {
    padding: 12px;
  }

  .format-text {
    font-size: 14px;
  }

  .points-grid {
    gap: 8px;
  }

  .point-card {
    padding: 12px 8px;
  }
}
</style>