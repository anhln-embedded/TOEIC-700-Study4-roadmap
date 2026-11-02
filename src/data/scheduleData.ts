// TOEIC 700+ Study4 Roadmap Dataset
// Current Study4 catalogue verified on 2026-11-02.

export interface Study4Link {
  label: string;
  url: string;
}

export interface DaySchedule {
  week: string;
  day_num: string;
  day_of_week: string;
  phase: string;
  source: string;
  test_name: string;
  mode: string;
  duration: string;
  study4_settings: string;
  tasks: string;
  target: string;
  study4_link: string;
  study4_links: Study4Link[];
  status: string;
  score_note: string;
}

export interface DayProgress {
  status: 'pending' | 'inprogress' | 'completed';
  lcScore?: number | string;
  rcScore?: number | string;
  totalScore?: number | string;
  notes?: string;
  completedAt?: string;
}

export type UserProgressMap = Record<number, DayProgress>;

interface TestRef {
  collection: 3 | 4;
  test: number;
  label: string;
  url: string;
}

interface WeekPlan {
  phase: string;
  focus: string;
  tests: TestRef[];
}

const DAY_NAMES = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

const makeTest = (collection: 3 | 4, test: number): TestRef => {
  const id = collection === 3 ? 7049 + test : 7059 + test;
  return {
    collection,
    test,
    label: `Collection ${collection} · Test ${test}`,
    url: `https://study4.com/tests/${id}/toeic-lr-collection-${collection}-test-${test}/`,
  };
};

const C3 = Array.from({ length: 10 }, (_, index) => makeTest(3, index + 1));
const C4 = Array.from({ length: 10 }, (_, index) => makeTest(4, index + 1));

const WEEK_PLANS: WeekPlan[] = [
  { phase: 'Giai đoạn 1: Đo điểm & sửa nền tảng', focus: 'Đo điểm đầu vào, làm quen giao diện thi và xây quy trình chữa lỗi', tests: [C3[0], C3[1]] },
  { phase: 'Giai đoạn 1: Củng cố kỹ năng cốt lõi', focus: 'Ổn định Part 1, 2, 5, 6 và kiểm soát thời gian Part 7', tests: [C3[2], C3[3]] },
  { phase: 'Giai đoạn 2: Tăng tốc xử lý', focus: 'Tăng phản xạ Part 3, 4 và tốc độ đọc các đoạn đơn, kép', tests: [C3[4], C3[5], C3[6]] },
  { phase: 'Giai đoạn 2: Chuẩn hóa phong độ 700+', focus: 'Hoàn tất Collection 3 và giữ điểm ổn định qua ba đề liên tiếp', tests: [C3[7], C3[8], C3[9]] },
  { phase: 'Giai đoạn 3: Nâng độ khó', focus: 'Bắt đầu Collection 4, ưu tiên độ chính xác trước tốc độ', tests: [C4[0], C4[1]] },
  { phase: 'Giai đoạn 3: Xử lý bẫy nâng cao', focus: 'Luyện paraphrase, suy luận và câu trả lời gián tiếp', tests: [C4[2], C4[3]] },
  { phase: 'Giai đoạn 4: Nước rút cường độ cao', focus: 'Thi–chữa liên tục, khóa các nhóm lỗi lặp lại trước tuần cuối', tests: [C4[4], C4[5], C4[6]] },
  { phase: 'Giai đoạn 4: Mô phỏng & chốt phong độ', focus: 'Ba lần mô phỏng cuối, giảm tải sau đề cuối và chuẩn bị ngày thi', tests: [C4[7], C4[8], C4[9]] },
];

const linksFor = (tests: TestRef[]): Study4Link[] => tests.map(({ label, url }) => ({ label, url }));

const baseDay = (
  weekIndex: number,
  dayIndex: number,
  plan: WeekPlan,
  tests: TestRef[],
  details: Omit<DaySchedule, 'week' | 'day_num' | 'day_of_week' | 'phase' | 'source' | 'study4_link' | 'study4_links' | 'status' | 'score_note'>,
): DaySchedule => ({
  week: `Tuần ${weekIndex + 1}`,
  day_num: `Ngày ${weekIndex * 7 + dayIndex + 1}`,
  day_of_week: DAY_NAMES[dayIndex],
  phase: plan.phase,
  source: tests.map((test) => `TOEIC LR Collection ${test.collection}`).filter((value, index, values) => values.indexOf(value) === index).join(' & '),
  ...details,
  study4_link: tests[0].url,
  study4_links: linksFor(tests),
  status: 'Chưa làm',
  score_note: '',
});

const fullTestDay = (weekIndex: number, dayIndex: number, plan: WeekPlan, test: TestRef): DaySchedule => baseDay(weekIndex, dayIndex, plan, [test], {
  test_name: `${test.label} · Full Test 200 câu`,
  mode: 'Exam Mode (Thi thử đủ 120 phút)',
  duration: '120 phút làm đề + 30 phút ghi nhận lỗi',
  study4_settings: "Mở đúng link đề → Chọn 'Làm Full Test' → Giới hạn 120 phút → Tắt giải thích trong lúc làm → Audio 1.0x → Không tạm dừng.",
  tasks: `1. Làm đủ 200 câu của ${test.label} trong một lượt.\n2. Ghi điểm Listening, Reading và số câu đúng từng Part.\n3. Đánh dấu câu đoán, câu thiếu thời gian và ba nhóm lỗi lớn nhất.`,
  target: weekIndex === 0 ? 'Lấy điểm baseline trung thực, không tra cứu trong lúc làm' : weekIndex < 4 ? 'Ổn định tốc độ và tiến dần đến 700+' : 'Giữ độ chính xác khi độ khó tăng; không hoảng nếu điểm tạm giảm',
});

const listeningReviewDay = (weekIndex: number, dayIndex: number, plan: WeekPlan, test: TestRef): DaySchedule => baseDay(weekIndex, dayIndex, plan, [test], {
  test_name: `${test.label} · Chữa Listening Part 1–4`,
  mode: 'Practice Mode + Review',
  duration: '150–180 phút',
  study4_settings: "Mở đúng đề → Luyện tập từng phần → Chọn Part 1–4. Với câu sai: nghe lại trước khi mở transcript, sau đó bật giải thích chi tiết.",
  tasks: '1. Nghe lại mỗi câu sai 2 lần không nhìn transcript.\n2. Mở transcript, gạch clue và xác định bẫy paraphrase/đồng âm/câu trả lời gián tiếp.\n3. Shadowing các câu Part 3–4 sai ở 1.0x rồi 1.15x.\n4. Lưu từ và cụm mới vào Flashcard Study4.',
  target: 'Hiểu rõ lý do sai; Part 1 ≥ 5/6, Part 2 ≥ 19/25 khi làm lại',
});

const readingReviewDay = (weekIndex: number, dayIndex: number, plan: WeekPlan, test: TestRef): DaySchedule => baseDay(weekIndex, dayIndex, plan, [test], {
  test_name: `${test.label} · Chữa Reading Part 5–7`,
  mode: 'Review Mode + luyện có bấm giờ',
  duration: '150–180 phút',
  study4_settings: "Mở đúng đề → Xem lịch sử làm bài/giải thích → Chọn Part 5–7. Bấm lại riêng Part 5 trong 11 phút và Part 6 trong 9 phút sau khi chữa.",
  tasks: '1. Phân loại lỗi Part 5–6: từ loại, thì, giới từ, liên từ, từ vựng.\n2. Với Part 7, tìm câu chứa bằng chứng và cặp paraphrase giữa bài đọc–đáp án.\n3. Ghi các đoạn làm quá lâu; luyện thứ tự P5 → P6 → đoạn đơn → đoạn kép/ba.\n4. Tạo tối đa 20 flashcard có ngữ cảnh.',
  target: 'Part 5 + 6 hoàn thành trong 20 phút; Part 7 còn tối thiểu 52–55 phút',
});

const combinedReviewDay = (weekIndex: number, dayIndex: number, plan: WeekPlan, test: TestRef): DaySchedule => baseDay(weekIndex, dayIndex, plan, [test], {
  test_name: `${test.label} · Chữa đề theo sổ lỗi`,
  mode: 'Review sâu Listening & Reading',
  duration: '180–210 phút',
  study4_settings: "Mở đúng đề → Xem kết quả và giải thích. Chỉ làm lại câu sai/câu đã đoán; nghe không transcript trước, Reading phải chỉ ra bằng chứng trong bài.",
  tasks: '1. Chữa toàn bộ câu sai theo thứ tự Part có tỷ lệ đúng thấp nhất.\n2. Mỗi lỗi ghi đủ: nguyên nhân sai → dấu hiệu đúng → cách tránh lặp lại.\n3. Shadowing 10 câu Listening khó và làm lại 10 câu Reading chậm nhất.\n4. Ôn flashcard của chính đề này trước khi kết thúc.',
  target: 'Không còn câu sai nào chưa giải thích được bằng lời của chính mình',
});

const weeklyReviewDay = (weekIndex: number, dayIndex: number, plan: WeekPlan): DaySchedule => baseDay(weekIndex, dayIndex, plan, plan.tests, {
  test_name: `Tổng kết Tuần ${weekIndex + 1} · Ôn ${plan.tests.map((test) => test.label).join(', ')}`,
  mode: 'Error Log + Flashcard + luyện Part yếu',
  duration: weekIndex === 7 ? '90–120 phút nhẹ nhàng' : '150–180 phút',
  study4_settings: "Dùng các nút đề bên dưới để mở lại đúng bài. Chọn 'Luyện tập từng phần' cho Part yếu; không làm lại toàn bộ Full Test trong ngày tổng kết.",
  tasks: weekIndex === 7
    ? '1. Xem lại sổ lỗi của ba đề cuối, không làm thêm đề mới.\n2. Ôn flashcard trọng tâm và chiến thuật thời gian.\n3. Chuẩn bị giấy tờ, đường đi và ngủ đủ trước ngày thi.'
    : `1. So sánh điểm và tỷ lệ đúng của ${plan.tests.map((test) => test.label).join(', ')}.\n2. Chọn một Part yếu nhất để luyện lại 30–45 phút.\n3. Ôn flashcard, xóa thẻ đã thuộc và giữ lại lỗi còn lặp.\n4. Viết mục tiêu cụ thể cho tuần kế tiếp.`,
  target: weekIndex === 7 ? 'Kết thúc lộ trình với tinh thần ổn định và chiến thuật rõ ràng' : plan.focus,
});

const buildWeek = (plan: WeekPlan, weekIndex: number): DaySchedule[] => {
  const [first, second, third] = plan.tests;
  if (third) {
    return [
      fullTestDay(weekIndex, 0, plan, first),
      combinedReviewDay(weekIndex, 1, plan, first),
      fullTestDay(weekIndex, 2, plan, second),
      combinedReviewDay(weekIndex, 3, plan, second),
      fullTestDay(weekIndex, 4, plan, third),
      combinedReviewDay(weekIndex, 5, plan, third),
      weeklyReviewDay(weekIndex, 6, plan),
    ];
  }
  return [
    fullTestDay(weekIndex, 0, plan, first),
    listeningReviewDay(weekIndex, 1, plan, first),
    readingReviewDay(weekIndex, 2, plan, first),
    fullTestDay(weekIndex, 3, plan, second),
    listeningReviewDay(weekIndex, 4, plan, second),
    readingReviewDay(weekIndex, 5, plan, second),
    weeklyReviewDay(weekIndex, 6, plan),
  ];
};

export const SCHEDULE_DATA: DaySchedule[] = WEEK_PLANS.flatMap(buildWeek);
