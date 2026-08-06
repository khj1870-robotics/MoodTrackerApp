import type { AppData } from './types';

const KEY = 'moodtracker_v1';

const today = new Date();
const daysAgo = (n: number) => new Date(today.getTime() - 86400000 * n).toISOString();
const daysLater = (n: number) => new Date(today.getTime() + 86400000 * n).toISOString();
const dateStr = (iso: string) => iso.split('T')[0];

const defaultData: AppData = {
  moodEntries: [
    {
      id: 'me1',
      date: daysAgo(0),
      emotion: 'anxious',
      intensity: 3,
      answers: [
        { question: '이 감정이 언제부터 시작됐나요?', answer: '오전 회의 이후부터' },
        { question: '어젯밤 수면은 어떠셨나요?', answer: '6시간, 자주 깼음' },
        { question: '무슨 일이 있었나요? (선택)', answer: '중요한 발표가 내일이라 신경 쓰임' },
        { question: '몸 상태는 어떤가요? (선택)', answer: '가슴이 좀 답답함' },
      ],
      note: '내일 발표만 지나가면 괜찮아질 것 같다.',
    },
    {
      id: 'me2',
      date: daysAgo(1),
      emotion: 'calm',
      intensity: 3,
      answers: [
        { question: '이 감정이 언제부터 시작됐나요?', answer: '아침부터' },
        { question: '어젯밤 수면은 어떠셨나요?', answer: '7시간 반, 잘 잔 편' },
      ],
      note: '산책을 해서 기분이 나쁘지 않았다.',
    },
    {
      id: 'me3',
      date: daysAgo(3),
      emotion: 'depressed',
      intensity: 4,
      answers: [
        { question: '이 감정이 언제부터 시작됐나요?', answer: '일어나자마자' },
        { question: '어젯밤 수면은 어떠셨나요?', answer: '10시간인데 피곤함' },
        { question: '몸 상태는 어떤가요? (선택)', answer: '몸이 무거운 느낌' },
      ],
    },
    {
      id: 'me4',
      date: daysAgo(5),
      emotion: 'sad',
      intensity: 3,
      answers: [
        { question: '이 감정이 언제부터 시작됐나요?', answer: '저녁부터' },
        { question: '어젯밤 수면은 어떠셨나요?', answer: '5시간, 잠을 못 이룸' },
      ],
    },
    {
      id: 'me5',
      date: daysAgo(7),
      emotion: 'happy',
      intensity: 4,
      answers: [
        { question: '이 감정이 언제부터 시작됐나요?', answer: '오전 내내' },
        { question: '어젯밤 수면은 어떠셨나요?', answer: '8시간, 개운하게 잠' },
        { question: '무슨 일이 있었나요? (선택)', answer: '친구를 오랜만에 만남' },
      ],
      note: '오랜만에 기분 좋은 하루였다.',
    },
    {
      id: 'me6',
      date: daysAgo(10),
      emotion: 'anxious',
      intensity: 5,
      answers: [
        { question: '이 감정이 언제부터 시작됐나요?', answer: '밤새 잠을 못 자면서' },
        { question: '어젯밤 수면은 어떠셨나요?', answer: '3시간, 거의 못 잠' },
        { question: '몸 상태는 어떤가요? (선택)', answer: '손 떨림, 심장 두근거림' },
      ],
    },
    {
      id: 'me7',
      date: daysAgo(12),
      emotion: 'lethargic',
      intensity: 4,
      answers: [
        { question: '이 감정이 언제부터 시작됐나요?', answer: '이틀째 이 상태' },
        { question: '어젯밤 수면은 어떠셨나요?', answer: '9시간인데 일어나기 싫었음' },
      ],
    },
  ],
  hospital: {
    diagnoses: ['주요우울장애 (F32.1)', 'ADHD 복합형 (F90.0)'],
    medications: [
      { id: 'md1', name: '에스시탈로프람 10mg', dosage: '1정', frequency: '매일 아침 식후', startDate: '2024-03-15', active: true },
      { id: 'md2', name: '아토목세틴 40mg', dosage: '1정', frequency: '매일 아침 식후', startDate: '2024-06-01', active: true },
      { id: 'md3', name: '알프라졸람 0.25mg', dosage: '0.5정', frequency: '불안 심할 때 복용', startDate: '2024-03-15', active: true },
      { id: 'md4', name: '졸피뎀 5mg', dosage: '1정', frequency: '취침 전', startDate: '2024-01-10', active: false },
    ],
    visits: [
      {
        id: 'v1',
        date: daysAgo(10),
        memo: '수면 불안정 지속 중이라고 말씀드렸음. 에스시탈로프람 용량 현행 유지, 다음 달 다시 평가하기로. 요즘 불안 증상이 심해진 것 같아 알프라졸람 처방 유지.',
        nextAppointment: dateStr(daysLater(20)),
      },
      {
        id: 'v2',
        date: daysAgo(40),
        memo: 'ADHD 진단 추가. 아토목세틴 시작. 집중력 저하, 충동성, 시간 관리 어려움 호소. 4주 후 경과 확인 예정.',
        nextAppointment: dateStr(daysAgo(10)),
      },
    ],
  },
  therapyPrograms: [
    {
      id: 'tp1',
      therapistName: '김지은 선생님',
      institution: '마음채 심리상담센터',
      startDate: '2024-05-10',
      active: true,
      nextAppointment: dateStr(daysLater(5)),
      sessions: [
        {
          id: 's1',
          sessionNumber: 1,
          date: '2024-05-10',
          topics: '초기 상담 · 주호소 탐색',
          notes: '어릴 때부터 감정 표현이 어려웠던 것, 현재 직장 스트레스, 대인관계 어려움에 대해 이야기함. 인지행동치료 방향으로 진행하기로.',
          homework: '이번 주 하루 한 번 감정 일지 써보기',
          nextSessionDate: '2024-05-24',
        },
        {
          id: 's2',
          sessionNumber: 2,
          date: '2024-05-24',
          topics: '가족 관계 · 감정 억압 패턴',
          notes: '부모님과의 관계에서 감정을 억눌러야 했던 경험들 탐색. 현재 대인관계에서도 비슷한 패턴이 반복되고 있음. 어릴 때의 패턴이 지금에도 영향을 미치고 있다는 것 인식.',
          homework: '감정을 억눌렀던 어린 시절 기억 한두 개 적어오기',
          nextSessionDate: '2024-06-07',
        },
        {
          id: 's3',
          sessionNumber: 3,
          date: dateStr(daysAgo(7)),
          topics: '자기 비판 · 내면 비평가',
          notes: '완벽주의 성향과 자기 비판이 심함. 실수했을 때 스스로를 몰아붙이는 패턴 확인. 자기 자신에게 친구한테 말하듯 말해주는 연습 시작.',
          homework: '실수했을 때 나에게 친절하게 말하기 연습, 하루 한 번',
          nextSessionDate: dateStr(daysLater(5)),
        },
      ],
    },
    {
      id: 'tp2',
      therapistName: '박성호 선생님',
      institution: '온마음상담소',
      startDate: '2023-09-01',
      endDate: '2024-02-28',
      active: false,
      sessions: [
        {
          id: 'ps1',
          sessionNumber: 1,
          date: '2023-09-01',
          topics: '초기 상담',
          notes: '직장 내 번아웃 문제로 시작. 스트레스 관리 기법 탐색.',
        },
      ],
    },
  ],
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultData;
    return JSON.parse(raw) as AppData;
  } catch {
    return defaultData;
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}
