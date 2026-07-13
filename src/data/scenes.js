export const scenes = [
  {
    id: 'cafe-ordering',
    name: '咖啡店点单',
    icon: '☕',
    category: 'daily-life',
    difficulty: 1,
    characters: {
      left: { name: '店员', avatar: '👨‍🍳' },
      right: { name: '顾客', avatar: '🧑' }
    },
    dialogue: [
      {
        id: 1,
        speaker: 'left',
        text: 'Good morning! Welcome to Bean & Brew. What can I get for you?',
        translation: '早上好！欢迎来到 Bean & Brew。您需要点什么？',
        userOptions: [
          { id: 'a', text: "I'd like a latte, please.", translation: '请给我一杯拿铁。', next: 2 },
          { id: 'b', text: 'Can I see the menu first?', translation: '我能先看看菜单吗？', next: 'menu_branch' }
        ]
      },
      {
        id: 2,
        speaker: 'left',
        text: 'Certainly! Would you like it with oat milk or regular milk?',
        translation: '好的！您想要燕麦奶还是普通牛奶？',
        userOptions: [
          { id: 'a', text: 'Regular milk, please.', translation: '普通牛奶，谢谢。', next: 3 },
          { id: 'b', text: 'Oat milk, please.', translation: '燕麦奶，谢谢。', next: 3 }
        ]
      },
      {
        id: 3,
        speaker: 'left',
        text: "That'll be $4.50. Would you like anything else?",
        translation: '一共4.50美元。您还需要别的吗？',
        userOptions: [
          { id: 'a', text: 'No, thank you.', translation: '不用了，谢谢。', next: 4 },
          { id: 'b', text: 'Can I also have a croissant?', translation: '我还能来一个羊角面包吗？', next: 5 }
        ]
      },
      {
        id: 4,
        speaker: 'left',
        text: 'Here you go! Enjoy your latte!',
        translation: '给您！祝您用餐愉快！',
        isEnd: true
      },
      {
        id: 5,
        speaker: 'left',
        text: "Absolutely! That's $3.00 more. Total is $7.50.",
        translation: '当然可以！再加3.00美元，总共7.50美元。',
        userOptions: [{ id: 'a', text: "That's fine.", translation: '好的。', next: 4 }]
      }
    ],
    branches: {
      menu_branch: [
        {
          id: 'menu_1',
          speaker: 'left',
          text: 'Of course! We have lattes, cappuccinos, americanos, and cold brew.',
          translation: '当然！我们有拿铁、卡布奇诺、美式咖啡和冷萃咖啡。',
          userOptions: [
            { id: 'a', text: "I'd like a latte, please.", translation: '请给我一杯拿铁。', next: 2 },
            { id: 'b', text: 'What is cold brew?', translation: '冷萃咖啡是什么？', next: 'cold_brew_branch' }
          ]
        }
      ],
      cold_brew_branch: [
        {
          id: 'cold_1',
          speaker: 'left',
          text: 'Cold brew is coffee steeped in cold water for 12 hours. It has a smooth, less acidic taste.',
          translation: '冷萃咖啡是用冷水浸泡12小时制成的。口感顺滑，酸度较低。',
          userOptions: [
            { id: 'a', text: 'I will try the cold brew.', translation: '我试试冷萃咖啡。', next: 3 },
            { id: 'b', text: "I'll stick with a latte.", translation: '我还是选拿铁吧。', next: 2 }
          ]
        }
      ]
    },
    tasks: [],
    reviewCriteria: []
  },
  {
    id: 'restaurant',
    name: '餐厅点餐',
    icon: '🍽️',
    category: 'daily-life',
    difficulty: 2,
    characters: {
      left: { name: '服务员', avatar: '👨‍💼' },
      right: { name: '顾客', avatar: '👩' }
    },
    dialogue: [
      {
        id: 1,
        speaker: 'left',
        text: 'Good evening, ma\'am. Do you have any dietary restrictions?',
        translation: '晚上好，女士。请问您有什么饮食禁忌吗？',
        userOptions: [
          { id: 'a', text: 'No, I have no restrictions.', translation: '没有，我没有禁忌。', next: 2 },
          { id: 'b', text: 'I am vegetarian.', translation: '我是素食者。', next: 'veggie_branch' }
        ]
      },
      {
        id: 2,
        speaker: 'left',
        text: 'Great! Our special tonight is grilled salmon with roasted vegetables. Would you like to try it?',
        translation: '太好了！我们今晚的特餐是烤三文鱼配烤蔬菜。您想试试吗？',
        userOptions: [
          { id: 'a', text: 'Yes, that sounds delicious.', translation: '好的，听起来很美味。', next: 3 },
          { id: 'b', text: 'What else do you recommend?', translation: '您还有什么推荐的吗？', next: 'recommend_branch' }
        ]
      },
      {
        id: 3,
        speaker: 'left',
        text: 'Excellent choice! Would you like a drink with that?',
        translation: '绝佳的选择！您想搭配什么饮品？',
        userOptions: [
          { id: 'a', text: 'A glass of red wine, please.', translation: '请给我一杯红酒。', next: 4 },
          { id: 'b', text: 'Just water, thank you.', translation: '只要水，谢谢。', next: 4 }
        ]
      },
      {
        id: 4,
        speaker: 'left',
        text: 'Perfect! Your order will be ready in about 15 minutes.',
        translation: '好的！您的餐点大约15分钟后准备好。',
        isEnd: true
      }
    ],
    branches: {
      veggie_branch: [
        {
          id: 'veggie_1',
          speaker: 'left',
          text: 'Wonderful! We have a delicious vegetable risotto and a mixed greens salad.',
          translation: '太好了！我们有美味的蔬菜烩饭和混合蔬菜沙拉。',
          userOptions: [
            { id: 'a', text: 'The risotto sounds great.', translation: '烩饭听起来很棒。', next: 3 },
            { id: 'b', text: 'I will have the salad.', translation: '我要沙拉。', next: 3 }
          ]
        }
      ],
      recommend_branch: [
        {
          id: 'rec_1',
          speaker: 'left',
          text: 'Our steak is very popular, cooked to your preference. Or we have fresh pasta options.',
          translation: '我们的牛排很受欢迎，可以按您的喜好熟度烹饪。我们也有新鲜的意大利面。',
          userOptions: [
            { id: 'a', text: 'I will have the steak, medium rare.', translation: '我要牛排，三分熟。', next: 3 },
            { id: 'b', text: 'Pasta sounds good.', translation: '意大利面听起来不错。', next: 3 }
          ]
        }
      ]
    },
    tasks: [],
    reviewCriteria: []
  },
  {
    id: 'directions',
    name: '问路导航',
    icon: '🗺️',
    category: 'travel',
    difficulty: 1,
    characters: {
      left: { name: '路人', avatar: '🧑‍🦱' },
      right: { name: '游客', avatar: '🧳' }
    },
    dialogue: [
      {
        id: 1,
        speaker: 'right',
        text: 'Excuse me, could you help me? I\'m looking for the city museum.',
        translation: '打扰一下，您能帮我吗？我在找城市博物馆。',
        userOptions: [
          { id: 'a', text: 'Go straight ahead and turn left at the next corner.', translation: '直走，在下一个路口左转。', next: 2 },
          { id: 'b', text: 'The museum is about 10 minutes walk from here.', translation: '博物馆离这里大约步行10分钟。', next: 2 }
        ]
      },
      {
        id: 2,
        speaker: 'right',
        text: 'Is it near the central park?',
        translation: '它在中央公园附近吗？',
        userOptions: [
          { id: 'a', text: 'Yes, it\'s right next to the park.', translation: '是的，就在公园旁边。', next: 3 },
          { id: 'b', text: 'No, it\'s on the other side of town.', translation: '不在，它在城镇的另一边。', next: 3 }
        ]
      },
      {
        id: 3,
        speaker: 'right',
        text: 'Thank you very much!',
        translation: '非常感谢您！',
        userOptions: [
          { id: 'a', text: 'You\'re welcome! Enjoy your visit.', translation: '不客气！祝您参观愉快。', next: 4 },
          { id: 'b', text: 'No problem. Have a good day!', translation: '没问题。祝您愉快！', next: 4 }
        ]
      },
      {
        id: 4,
        speaker: 'left',
        text: '😊',
        translation: '',
        isEnd: true
      }
    ],
    branches: {},
    tasks: [],
    reviewCriteria: []
  },
  {
    id: 'supermarket',
    name: '超市购物',
    icon: '🛒',
    category: 'daily-life',
    difficulty: 2,
    characters: {
      left: { name: '收银员', avatar: '👩‍💼' },
      right: { name: '顾客', avatar: '👨' }
    },
    dialogue: [
      {
        id: 1,
        speaker: 'left',
        text: 'Hi there! Did you find everything you needed?',
        translation: '您好！您找到所有需要的东西了吗？',
        userOptions: [
          { id: 'a', text: 'Yes, thank you.', translation: '是的，谢谢。', next: 2 },
          { id: 'b', text: 'I couldn\'t find the milk.', translation: '我找不到牛奶。', next: 'milk_branch' }
        ]
      },
      {
        id: 2,
        speaker: 'left',
        text: 'That will be $45.20. Cash or card?',
        translation: '一共45.20美元。现金还是刷卡？',
        userOptions: [
          { id: 'a', text: 'Card, please.', translation: '刷卡，谢谢。', next: 3 },
          { id: 'b', text: 'Cash.', translation: '现金。', next: 3 }
        ]
      },
      {
        id: 3,
        speaker: 'left',
        text: 'Here is your receipt. Have a nice day!',
        translation: '这是您的收据。祝您愉快！',
        isEnd: true
      }
    ],
    branches: {
      milk_branch: [
        {
          id: 'milk_1',
          speaker: 'left',
          text: 'It\'s in the dairy section, aisle 5. Would you like me to show you?',
          translation: '在乳制品区，第5排。需要我带您去吗？',
          userOptions: [
            { id: 'a', text: 'Yes, please.', translation: '好的，麻烦了。', next: 'show_branch' },
            { id: 'b', text: 'No, I can find it. Thanks.', translation: '不用了，我能找到。谢谢。', next: 2 }
          ]
        }
      ],
      show_branch: [
        {
          id: 'show_1',
          speaker: 'left',
          text: 'Follow me! It\'s right this way.',
          translation: '跟我来！这边走。',
          userOptions: [{ id: 'a', text: 'Thank you so much!', translation: '非常感谢！', next: 2 }]
        }
      ]
    },
    tasks: [],
    reviewCriteria: []
  },
  {
    id: 'interview',
    name: '英文面试',
    icon: '💼',
    category: 'business',
    difficulty: 3,
    characters: {
      left: { name: '面试官', avatar: '🧑‍💼' },
      right: { name: '求职者', avatar: '👨‍💼' }
    },
    tasks: [
      {
        id: 'diagnosis',
        name: '开口诊断',
        description: '初步评估您的英语口语水平',
        unlockCondition: null,
        status: 'in_progress',
        reviewCriteria: [
          { key: 'expression', label: '表达完整度', points: ['自我介绍', '工作背景', '职业目标'] },
          { key: 'naturalness', label: '语言自然度', points: ['词汇多样性', '句式变化'] },
          { key: 'fluency', label: '发音与流畅度', points: ['发音准确性', '语速控制'] }
        ]
      },
      {
        id: 'intro',
        name: '自我介绍',
        description: '用简洁有力的方式介绍自己',
        unlockCondition: { task: 'diagnosis', status: 'completed' },
        status: 'locked',
        reviewCriteria: [
          { key: 'expression', label: '表达完整度', points: ['身份定位', '核心优势', '职业动机'] },
          { key: 'naturalness', label: '语言自然度', points: ['主动语态', '具体例子'] }
        ]
      },
      {
        id: 'project_followup',
        name: '项目经历追问',
        description: '深入讲述你的项目经验',
        unlockCondition: { task: 'intro', status: 'completed' },
        status: 'locked',
        reviewCriteria: [
          { key: 'expression', label: '表达完整度', points: ['项目背景', '个人贡献', '量化结果'] },
          { key: 'naturalness', label: '语言自然度', points: ['专业术语', '逻辑连接'] },
          { key: 'adaptability', label: '应变能力', points: ['回答追问', '澄清问题'] }
        ]
      },
      {
        id: 'stress_response',
        name: '压力问题应对',
        description: '处理挑战性问题',
        unlockCondition: { task: 'project_followup', status: 'completed' },
        status: 'locked',
        reviewCriteria: [
          { key: 'expression', label: '表达完整度', points: ['诚实回答', '积极态度'] },
          { key: 'adaptability', label: '应变能力', points: ['情绪控制', '问题转化'] }
        ]
      },
      {
        id: 'review',
        name: '面试复盘与补弱',
        description: '回顾表现，制定提升计划',
        unlockCondition: { task: 'stress_response', status: 'completed' },
        status: 'locked',
        reviewCriteria: []
      }
    ],
    dialogue: [],
    branches: {}
  },
  {
    id: 'airport',
    name: '机场入境',
    icon: '✈️',
    category: 'travel',
    difficulty: 2,
    characters: {
      left: { name: '边检官员', avatar: '👮' },
      right: { name: '旅客', avatar: '🧳' }
    },
    dialogue: [],
    branches: {},
    tasks: [],
    reviewCriteria: [],
    comingSoon: true
  },
  {
    id: 'renting',
    name: '海外租房',
    icon: '🏠',
    category: 'daily-life',
    difficulty: 2,
    characters: {
      left: { name: '房东', avatar: '👩‍🦰' },
      right: { name: '租客', avatar: '🧑' }
    },
    dialogue: [],
    branches: {},
    tasks: [],
    reviewCriteria: [],
    comingSoon: true
  },
  {
    id: 'meeting',
    name: '英文会议',
    icon: '📋',
    category: 'business',
    difficulty: 3,
    characters: {
      left: { name: '同事', avatar: '👨‍💼' },
      right: { name: '参与者', avatar: '👩‍💼' }
    },
    dialogue: [],
    branches: {},
    tasks: [],
    reviewCriteria: [],
    comingSoon: true
  }
];

export const interviewTasks = {
  diagnosis: {
    taskId: 'diagnosis',
    taskName: '开口诊断',
    dialogue: [
      {
        id: 'd1',
        speaker: 'left',
        text: 'Welcome to your English interview preparation. Let\'s start with a quick warm-up. Could you tell me about yourself in 30 seconds?',
        translation: '欢迎来到您的英文面试准备。让我们先进行一个快速热身。您能用30秒介绍一下自己吗？',
        userOptions: [
          { 
            id: 'a', 
            text: 'I am a software developer with 5 years of experience building web applications.', 
            translation: '我是一名有5年经验的软件开发人员，擅长构建Web应用。',
            next: 'd2',
            followup: 'followup_exp'
          },
          { 
            id: 'b', 
            text: 'My name is Alex and I enjoy solving complex problems.', 
            translation: '我叫Alex，喜欢解决复杂问题。',
            next: 'd2',
            followup: 'followup_simple'
          }
        ]
      },
      {
        id: 'd2',
        speaker: 'left',
        text: 'Thank you. What is your biggest professional achievement so far?',
        translation: '谢谢。您迄今为止最大的职业成就是什么？',
        userOptions: [
          { 
            id: 'a', 
            text: 'I led a team to launch a product that increased revenue by 30%.', 
            translation: '我带领团队推出了一款产品，使收入增长了30%。',
            next: 'd_end'
          },
          { 
            id: 'b', 
            text: 'I learned a lot from my previous projects.', 
            translation: '我从之前的项目中学到了很多。',
            next: 'd_end'
          }
        ]
      },
      {
        id: 'd_end',
        speaker: 'left',
        text: 'Great job! This gives us a good baseline for your practice.',
        translation: '做得好！这为您的练习提供了良好的基础。',
        isEnd: true,
        nextTask: 'intro'
      }
    ],
    branches: {
      followup_exp: [
        {
          id: 'f1',
          speaker: 'left',
          text: 'That sounds impressive! Could you tell me more about the technical challenges you faced?',
          translation: '听起来很令人印象深刻！您能告诉我更多关于您遇到的技术挑战吗？',
          userOptions: [
            { 
              id: 'a', 
              text: 'We had to optimize the database queries to handle high traffic.', 
              translation: '我们必须优化数据库查询以处理高流量。',
              next: 'd2'
            },
            { 
              id: 'b', 
              text: 'There were many challenges but we overcame them all.', 
              translation: '有很多挑战，但我们都克服了。',
              next: 'd2'
            }
          ]
        }
      ],
      followup_simple: [
        {
          id: 'f2',
          speaker: 'left',
          text: 'Can you be more specific about your experience?',
          translation: '您能更具体地谈谈您的经验吗？',
          userOptions: [
            { 
              id: 'a', 
              text: 'I have experience with React, Node.js and cloud services.', 
              translation: '我有React、Node.js和云服务的经验。',
              next: 'd2'
            },
            { 
              id: 'b', 
              text: 'I have worked on various projects over the years.', 
              translation: '这些年来我参与过各种项目。',
              next: 'd2'
            }
          ]
        }
      ]
    }
  },
  intro: {
    taskId: 'intro',
    taskName: '自我介绍',
    dialogue: [
      {
        id: 'i1',
        speaker: 'left',
        text: 'Good morning. Thank you for coming in today. Please introduce yourself.',
        translation: '早上好。感谢您今天来面试。请介绍一下您自己。',
        userOptions: [
          { 
            id: 'a', 
            text: "I'm a software developer with 3 years of experience building scalable applications. I'm passionate about creating efficient solutions.", 
            translation: '我是一名有3年经验的软件开发人员，擅长构建可扩展的应用程序。我对创建高效的解决方案充满热情。',
            next: 'i2',
            followup: 'followup_detailed'
          },
          { 
            id: 'b', 
            text: "My name is John and I'm excited about this opportunity.", 
            translation: '我叫约翰，对这个机会感到很兴奋。',
            next: 'i2',
            followup: 'followup_brief'
          }
        ]
      },
      {
        id: 'i2',
        speaker: 'left',
        text: 'What makes you a good fit for this position?',
        translation: '为什么您适合这个职位？',
        userOptions: [
          { 
            id: 'a', 
            text: 'My technical skills and experience align perfectly with your requirements.', 
            translation: '我的技术能力和经验与您的要求完全匹配。',
            next: 'i_end'
          },
          { 
            id: 'b', 
            text: 'I believe I can contribute to your team.', 
            translation: '我相信我能为您的团队做出贡献。',
            next: 'i_end'
          }
        ]
      },
      {
        id: 'i_end',
        speaker: 'left',
        text: 'Thank you for your introduction. Let\'s move to the next section.',
        translation: '感谢您的介绍。让我们进入下一部分。',
        isEnd: true,
        nextTask: 'project_followup'
      }
    ],
    branches: {
      followup_detailed: [
        {
          id: 'fi1',
          speaker: 'left',
          text: 'Could you give me an example of a project that demonstrates your skills?',
          translation: '您能举一个展示您技能的项目例子吗？',
          userOptions: [
            { 
              id: 'a', 
              text: 'I built a real-time chat application that handled 10,000 concurrent users.', 
              translation: '我构建了一个实时聊天应用，能够处理10,000并发用户。',
              next: 'i2'
            },
            { 
              id: 'b', 
              text: 'I worked on many projects that showed my abilities.', 
              translation: '我参与过许多展示我能力的项目。',
              next: 'i2'
            }
          ]
        }
      ],
      followup_brief: [
        {
          id: 'fi2',
          speaker: 'left',
          text: 'Could you elaborate on your background and experience?',
          translation: '您能详细说明您的背景和经验吗？',
          userOptions: [
            { 
              id: 'a', 
              text: 'I have a computer science degree and 3 years of industry experience.', 
              translation: '我拥有计算机科学学位和3年行业经验。',
              next: 'i2'
            },
            { 
              id: 'b', 
              text: 'I have been working in this field for several years.', 
              translation: '我在这个领域工作了好几年。',
              next: 'i2'
            }
          ]
        }
      ]
    }
  },
  project_followup: {
    taskId: 'project_followup',
    taskName: '项目经历追问',
    dialogue: [
      {
        id: 'p1',
        speaker: 'left',
        text: 'Tell me about a challenging project you worked on.',
        translation: '谈谈您参与过的一个具有挑战性的项目。',
        userOptions: [
          { 
            id: 'a', 
            text: 'I led a cross-functional team to rebuild our core payment system, reducing latency by 40%.', 
            translation: '我带领跨职能团队重建了我们的核心支付系统，将延迟降低了40%。',
            next: 'p2',
            followup: 'followup_leadership'
          },
          { 
            id: 'b', 
            text: 'I worked on a project that had many technical difficulties.', 
            translation: '我参与过一个有很多技术困难的项目。',
            next: 'p2',
            followup: 'followup_general'
          }
        ]
      },
      {
        id: 'p2',
        speaker: 'left',
        text: 'What was your role and what did you learn from it?',
        translation: '您的角色是什么？从中学到了什么？',
        userOptions: [
          { 
            id: 'a', 
            text: 'I was the technical lead responsible for architecture design and team coordination. I learned how to balance technical excellence with business deadlines.', 
            translation: '我是技术负责人，负责架构设计和团队协调。我学会了如何平衡技术卓越性和业务截止日期。',
            next: 'p_end'
          },
          { 
            id: 'b', 
            text: 'I was a developer on the team. It was a good learning experience.', 
            translation: '我是团队中的一名开发人员。这是一次很好的学习经历。',
            next: 'p_end'
          }
        ]
      },
      {
        id: 'p_end',
        speaker: 'left',
        text: 'Great insights. Your ability to articulate your experiences is strong.',
        translation: '很好的见解。您表达经验的能力很强。',
        isEnd: true,
        nextTask: 'stress_response'
      }
    ],
    branches: {
      followup_leadership: [
        {
          id: 'fp1',
          speaker: 'left',
          text: 'That\'s impressive! How did you handle conflicts within the team?',
          translation: '令人印象深刻！您如何处理团队内部的冲突？',
          userOptions: [
            { 
              id: 'a', 
              text: 'I facilitated open communication and focused on finding win-win solutions.', 
              translation: '我促进开放沟通，并专注于寻找双赢解决方案。',
              next: 'p2'
            },
            { 
              id: 'b', 
              text: 'Conflicts were handled through discussion.', 
              translation: '通过讨论解决了冲突。',
              next: 'p2'
            }
          ]
        }
      ],
      followup_general: [
        {
          id: 'fp2',
          speaker: 'left',
          text: 'Can you provide more details about the technical difficulties?',
          translation: '您能提供更多关于技术困难的细节吗？',
          userOptions: [
            { 
              id: 'a', 
              text: 'We faced scalability issues with our database and had to implement caching strategies.', 
              translation: '我们的数据库面临可扩展性问题，不得不实施缓存策略。',
              next: 'p2'
            },
            { 
              id: 'b', 
              text: 'There were various technical issues that we resolved.', 
              translation: '有各种技术问题我们都解决了。',
              next: 'p2'
            }
          ]
        }
      ]
    }
  },
  stress_response: {
    taskId: 'stress_response',
    taskName: '压力问题应对',
    dialogue: [
      {
        id: 's1',
        speaker: 'left',
        text: 'What is your biggest weakness?',
        translation: '您最大的弱点是什么？',
        userOptions: [
          { 
            id: 'a', 
            text: 'I tend to be a perfectionist, which can slow me down. But I\'ve learned to balance quality with efficiency.', 
            translation: '我倾向于追求完美，这可能会让我放慢速度。但我学会了在质量和效率之间取得平衡。',
            next: 's2',
            followup: 'followup_good'
          },
          { 
            id: 'b', 
            text: 'I don\'t think I have any major weaknesses.', 
            translation: '我认为我没有任何重大弱点。',
            next: 's2',
            followup: 'followup_bad'
          }
        ]
      },
      {
        id: 's2',
        speaker: 'left',
        text: 'Describe a time when you failed at something.',
        translation: '描述一次您失败的经历。',
        userOptions: [
          { 
            id: 'a', 
            text: 'I missed a project deadline once because I underestimated the complexity. I learned to break down tasks and set realistic timelines.', 
            translation: '有一次我因为低估了复杂性而错过了项目截止日期。我学会了分解任务并设定现实的时间表。',
            next: 's_end'
          },
          { 
            id: 'b', 
            text: 'I haven\'t really experienced major failure.', 
            translation: '我没有真正经历过重大失败。',
            next: 's_end'
          }
        ]
      },
      {
        id: 's_end',
        speaker: 'left',
        text: 'Thank you for your honest responses. Let\'s wrap up with the final section.',
        translation: '感谢您的诚实回答。让我们进入最后一部分。',
        isEnd: true,
        nextTask: 'review'
      }
    ],
    branches: {
      followup_good: [
        {
          id: 'fs1',
          speaker: 'left',
          text: 'Great self-awareness! How do you ensure you meet deadlines despite this?',
          translation: '很好的自我意识！您如何确保尽管如此仍能按时完成任务？',
          userOptions: [
            { 
              id: 'a', 
              text: 'I use agile methodologies and prioritize tasks based on impact.', 
              translation: '我使用敏捷方法，并根据影响优先级排序任务。',
              next: 's2'
            },
            { 
              id: 'b', 
              text: 'I manage my time carefully.', 
              translation: '我仔细管理我的时间。',
              next: 's2'
            }
          ]
        }
      ],
      followup_bad: [
        {
          id: 'fs2',
          speaker: 'left',
          text: 'Everyone has areas for improvement. Can you think of something you\'re working on?',
          translation: '每个人都有改进的空间。您能想到一些您正在努力改进的事情吗？',
          userOptions: [
            { 
              id: 'a', 
              text: 'I\'m working on delegating tasks more effectively.', 
              translation: '我正在努力更有效地分配任务。',
              next: 's2'
            },
            { 
              id: 'b', 
              text: 'I\'m always looking to improve.', 
              translation: '我一直在寻求改进。',
              next: 's2'
            }
          ]
        }
      ]
    }
  },
  review: {
    taskId: 'review',
    taskName: '面试复盘与补弱',
    dialogue: []
  }
};

export const getSceneById = (id) => scenes.find(scene => scene.id === id);

export const getAllScenes = () => scenes;

export const getScenesByCategory = (category) => scenes.filter(scene => scene.category === category);

export const getInterviewTask = (taskId) => interviewTasks[taskId];

export const getAvailableTasks = (sceneId) => {
  const scene = getSceneById(sceneId);
  if (!scene || !scene.tasks) return [];
  return scene.tasks;
};
