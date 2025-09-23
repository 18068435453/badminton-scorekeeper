// 球类配置文件
export const sportsConfig = {
  badminton: {
    name: '羽毛球',
    icon: '🏸',
    hasServing: true,
    // 判断是否结束一局
    isGameEnded: (score1, score2) => {
      return (score1 >= 21 && score1 - score2 >= 2) ||
             (score2 >= 21 && score2 - score1 >= 2) ||
             (score1 >= 30) || (score2 >= 30)
    },
    // 更新发球权
    updateServing: (score1, score2) => {
      const totalPoints = score1 + score2
      const serverChangeInterval = totalPoints >= 20 ? 1 : 2
      const serverNumber = Math.floor(totalPoints / serverChangeInterval) % 2
      return serverNumber === 0 ? 1 : 2
    }
  },
  
  tennis: {
    name: '网球',
    icon: '🎾',
    hasServing: true,
    // 网球计分系统（简化版：使用普通计分）
    isGameEnded: (score1, score2) => {
      return (score1 >= 6 && score1 - score2 >= 2) ||
             (score2 >= 6 && score2 - score1 >= 2) ||
             (score1 >= 7) || (score2 >= 7)
    },
    updateServing: (score1, score2) => {
      const totalGames = score1 + score2
      return (totalGames % 2 === 0) ? 1 : 2
    }
  },
  
  tableTennis: {
    name: '乒乓球',
    icon: '🏓',
    hasServing: true,
    // 乒乓球计分规则
    isGameEnded: (score1, score2) => {
      return (score1 >= 11 && score1 - score2 >= 2) ||
             (score2 >= 11 && score2 - score1 >= 2)
    },
    updateServing: (score1, score2) => {
      const totalPoints = score1 + score2
      const serverChangeInterval = totalPoints >= 20 ? 1 : 2
      const serverNumber = Math.floor(totalPoints / serverChangeInterval) % 2
      return serverNumber === 0 ? 1 : 2
    }
  },
  
  basketball: {
    name: '篮球',
    icon: '🏀',
    hasServing: false,
    // 篮球没有固定结束条件，可以自由计分
    isGameEnded: (score1, score2) => {
      // 可以设置一个较高的分数作为结束条件，或者让用户手动结束
      return false
    }
  },
  
  volleyball: {
    name: '排球',
    icon: '🏐',
    hasServing: true,
    // 排球计分规则
    isGameEnded: (score1, score2) => {
      return (score1 >= 25 && score1 - score2 >= 2) ||
             (score2 >= 25 && score2 - score1 >= 2)
    },
    updateServing: (score1, score2) => {
      // 排球发球权较复杂，这里简化处理
      const totalPoints = score1 + score2
      return (Math.floor(totalPoints / 2) % 2) + 1
    }
  }
}

// 获取所有可用的球类
export const getSportsList = () => {
  return Object.keys(sportsConfig).map(key => ({
    key,
    ...sportsConfig[key]
  }))
}