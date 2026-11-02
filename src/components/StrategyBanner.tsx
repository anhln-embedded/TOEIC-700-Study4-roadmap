'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  BookOpenCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Headphones,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

interface QuestionTypeGuide {
  name: string;
  signal: string;
  method: string;
}

interface PartGuide {
  part: string;
  title: string;
  meta: string;
  tips: string[];
  types: QuestionTypeGuide[];
  trap: string;
}

const LISTENING_GUIDES: PartGuide[] = [
  {
    part: 'Part 1', title: 'Mô tả tranh', meta: '6 câu · nghe một lần',
    tips: [
      'Trong 5 giây quan sát: xác định người/vật chính, hành động, vị trí và các chi tiết dễ bị đánh tráo.',
      'Chỉ chọn điều nhìn thấy trực tiếp; không suy đoán nghề nghiệp, cảm xúc hay hành động sắp xảy ra.',
    ],
    types: [
      { name: 'Tranh một người', signal: 'Một nhân vật nổi bật, thường hỏi hành động hoặc trang phục.', method: 'Tập trung S + be + V-ing và vật người đó đang cầm/dùng. Kiểm tra đúng chủ thể, đúng động tác, đúng trạng thái.' },
      { name: 'Tranh nhiều người', signal: 'Hai người trở lên đang tương tác hoặc làm các việc khác nhau.', method: 'Phân biệt one of the people, both, they và vị trí từng người. Đừng chọn câu chỉ đúng với một người nhưng dùng chủ ngữ số nhiều.' },
      { name: 'Tranh đồ vật/quang cảnh', signal: 'Không có người hoặc con người không phải trọng tâm.', method: 'Nghe câu bị động be + V3, trạng thái is/are placed và there is/are. Đối chiếu số ít/số nhiều và vị trí thật của vật.' },
      { name: 'Vị trí & phương hướng', signal: 'Đáp án chứa beside, across from, beneath, along, against, in a row.', method: 'Dùng một vật làm mốc rồi kiểm tra quan hệ không gian. Loại ngay câu đảo trái/phải, trong/ngoài hoặc trước/sau.' },
    ],
    trap: 'Bẫy chính: từ phát âm gần giống, đúng danh từ nhưng sai động tác, hoặc câu hợp lý ngoài đời nhưng chi tiết đó không có trong ảnh.',
  },
  {
    part: 'Part 2', title: 'Hỏi – đáp', meta: '25 câu · không in câu hỏi',
    tips: [
      'Bắt từ đầu tiên, chủ thể và thì của câu hỏi; dự đoán loại thông tin cần trả lời trước khi nghe ba lựa chọn.',
      'Đáp án đúng thường diễn đạt gián tiếp. Hợp ngữ cảnh quan trọng hơn việc lặp lại từ khóa.',
    ],
    types: [
      { name: 'WH: Who / Where / When', signal: 'Câu hỏi cần người, nơi chốn hoặc thời điểm.', method: 'Chốt đúng nhóm thông tin. “When” có thể được đáp bằng before/after/until; “Who” có thể là phòng ban hoặc người được nhắc gián tiếp.' },
      { name: 'Why / How / What', signal: 'Hỏi lý do, phương thức, số lượng, ý kiến hoặc vật/sự việc.', method: 'Phân biệt Why với Why don’t we (đề nghị), How long (khoảng thời gian) với When (mốc thời gian), How often với How many.' },
      { name: 'Yes/No & trợ động từ', signal: 'Mở đầu bằng Do/Does/Did, Is/Are, Have/Has, Can/Will…', method: 'Chấp nhận đáp án gián tiếp như “I haven’t decided” hoặc “The manager has it”. Kiểm tra thì và chủ thể thay vì chờ Yes/No.' },
      { name: 'Đề nghị / yêu cầu / lời mời', signal: 'Could you, Would you like, Shall we, Why don’t we…', method: 'Tìm phản hồi chấp nhận, từ chối có lý do hoặc phương án thay thế. Đừng trả lời như một câu hỏi thông tin thông thường.' },
      { name: 'Câu hỏi lựa chọn', signal: 'Có “or” nối hai phương án.', method: 'Đáp án có thể chọn A, B, cả hai, không phương án nào hoặc “không quan trọng”. Không mặc định phương án cuối là đúng.' },
      { name: 'Câu trần thuật / tag question', signal: 'Một nhận xét hoặc câu có đuôi isn’t it, haven’t they…', method: 'Phản hồi vào ý nghĩa thực tế: đồng tình, sửa thông tin, giải thích hoặc đưa hành động tiếp theo; không máy móc đảo trợ động từ.' },
    ],
    trap: 'Bẫy chính: lặp nguyên từ trong câu hỏi, từ đồng âm, đúng chủ đề nhưng sai ý hỏi, hoặc phủ định kép khiến người nghe chọn theo phản xạ.',
  },
  {
    part: 'Part 3', title: 'Hội thoại', meta: '39 câu · 13 đoạn',
    tips: [
      'Đọc trước ba câu hỏi, gạch chân từ để hỏi và điểm khác nhau giữa các đáp án; câu trả lời thường đi theo thứ tự audio.',
      'Ghi vai trò hai người bằng từ khóa ngắn: khách–nhân viên, quản lý–nhân viên, nhà cung cấp–người mua…',
    ],
    types: [
      { name: 'Chủ đề / mục đích', signal: 'What are the speakers mainly discussing? Why is the man calling?', method: 'Nghe 1–2 lượt lời đầu và ý lặp lại. Chọn đáp án bao quát toàn đoạn, không chọn một chi tiết đúng nhưng quá hẹp.' },
      { name: 'Người nói / địa điểm', signal: 'Who most likely…? Where does the conversation take place?', method: 'Suy từ cụm nghề nghiệp, dịch vụ và vật dụng; cần ít nhất hai clue đồng nhất thay vì bám một từ đơn lẻ.' },
      { name: 'Chi tiết', signal: 'What, when, where, how much, which…', method: 'Bám đúng danh từ trong câu hỏi rồi nghe paraphrase quanh nó. Kiểm tra chi tiết thuộc người nào và thời điểm nào.' },
      { name: 'Vấn đề & giải pháp', signal: 'Problem, concern, difficulty, suggest, recommend.', method: 'Tách hai cột trong đầu: vấn đề là gì và ai đề xuất cách xử lý nào. Đề thường hỏi một trong hai nhưng nhắc cả hai.' },
      { name: 'Hành động tiếp theo', signal: 'What will/probably do next?', method: 'Ưu tiên câu cuối và các tín hiệu I’ll, let me, plan to, need to. Chỉ chọn hành động đã được cam kết hoặc suy ra trực tiếp.' },
      { name: 'Ý ngụ ý của câu nói', signal: 'What does the speaker mean when he/she says “…”?', method: 'Đặt câu trích dẫn vào lượt nói trước–sau; xác định chức năng như từ chối khéo, ngạc nhiên, nhắc nhở hay đề xuất, không dịch từng chữ.' },
      { name: 'Bảng / lịch / sơ đồ', signal: 'Có graphic kèm câu hỏi “Look at the graphic”.', method: 'Đọc tiêu đề, đơn vị và hàng/cột trước. Ghép một clue trong audio với dữ liệu trên hình; đừng cố ghi nhớ toàn bảng.' },
    ],
    trap: 'Bẫy chính: cả bốn lựa chọn đều được nhắc nhưng khác người, khác thời điểm hoặc khác quan hệ nguyên nhân–kết quả.',
  },
  {
    part: 'Part 4', title: 'Bài nói ngắn', meta: '30 câu · 10 bài nói',
    tips: [
      'Đọc trước ba câu hỏi, sau đó nhận diện thể loại ngay câu mở đầu; thể loại giúp dự đoán cấu trúc thông tin sắp nghe.',
      'Theo dõi từ chuyển ý but, however, due to, instead, finally; thông tin sau chuyển ý thường là điểm ra câu hỏi.',
    ],
    types: [
      { name: 'Tin nhắn thoại / cuộc gọi', signal: 'This is…, I’m calling about…, please call me back.', method: 'Chốt người gọi, lý do gọi và hành động người nhận cần làm. Phân biệt thông tin hiện tại với lịch hẹn được thay đổi.' },
      { name: 'Thông báo công cộng', signal: 'Attention, passengers/customers/employees; địa điểm công cộng.', method: 'Nghe đối tượng, thay đổi/sự cố và hướng dẫn mới. Với số giờ/cổng/phòng, ghép con số với đúng danh từ.' },
      { name: 'Quảng cáo / giới thiệu sản phẩm', signal: 'Tên sản phẩm, ưu đãi, benefit, available, visit/call.', method: 'Tách sản phẩm–lợi ích–đối tượng–cách mua. Cẩn thận giá gốc, mức giảm và ngày hết hạn được nhắc gần nhau.' },
      { name: 'Bản tin / báo cáo', signal: 'Weather, traffic, business update, news report.', method: 'Ghi chủ đề, nguyên nhân và tác động. Những con số chỉ có nghĩa khi ghép đúng chỉ số và giai đoạn.' },
      { name: 'Hướng dẫn / tour / phát biểu', signal: 'First, next, on your left, welcome, today I’ll explain…', method: 'Theo trình tự và vị trí; dự đoán bước tiếp theo từ từ nối. Với tour, gắn địa điểm với hoạt động diễn ra tại đó.' },
      { name: 'Suy luận, ý ngụ ý & graphic', signal: 'Most likely, imply, mean when…, look at the graphic.', method: 'Kết hợp ngữ cảnh toàn bài với câu trích dẫn hoặc dữ liệu hình. Chọn suy luận gần nhất với bằng chứng, không thêm giả định.' },
    ],
    trap: 'Bẫy chính: nghe đúng một con số hoặc danh từ nhưng ghép sai sự kiện, đối tượng hay thời điểm; đáp án thường paraphrase chứ không lặp nguyên văn.',
  },
];

const READING_GUIDES: PartGuide[] = [
  {
    part: 'Part 5', title: 'Hoàn thành câu', meta: '30 câu · mục tiêu 10–12 phút',
    tips: [
      'Nhìn bốn đáp án trước: cùng gốc từ → từ loại; cùng dạng động từ → ngữ pháp động từ; khác hẳn nhau → từ vựng/cụm từ.',
      'Câu cấu trúc làm bằng vùng quanh chỗ trống; câu từ vựng mới cần đọc toàn câu. Quá 30 giây thì đánh dấu và đi tiếp.',
    ],
    types: [
      { name: 'Từ loại', signal: 'Các đáp án cùng gốc nhưng khác hậu tố: -tion, -ive, -ly, -ize…', method: 'Xác định thành phần thiếu trước khi xét nghĩa: determiner + (adj) + noun; verb + adverb; be/linking verb + adjective.' },
      { name: 'Động từ: thì & hòa hợp', signal: 'Các đáp án là nhiều dạng của cùng một động từ.', method: 'Tìm chủ ngữ thật, số ít/nhiều và mốc thời gian. Bỏ qua cụm chen giữa; không chọn thì chỉ vì thấy một từ thời gian rời rạc.' },
      { name: 'Chủ động / bị động & dạng động từ', signal: 'V-ing, V3, to V, bare V hoặc be + V3 cạnh tranh nhau.', method: 'Hỏi chủ ngữ “làm” hay “được làm”, rồi kiểm tra động từ trước/sau: modal + V, preposition + V-ing, want/plan + to V.' },
      { name: 'Đại từ / từ hạn định', signal: 'He/him/his, they/them/their, another/other/others, each/every…', method: 'Xác định vai trò chủ ngữ–tân ngữ–sở hữu và danh từ được thay thế. Kiểm tra số ít/số nhiều và danh từ có xuất hiện phía sau không.' },
      { name: 'Giới từ / liên từ', signal: 'because/because of, although/despite, during/while…', method: 'Nhìn thành phần sau chỗ trống: mệnh đề S + V cần liên từ; danh từ/cụm danh từ cần giới từ. Sau đó mới xét quan hệ nghĩa.' },
      { name: 'Mệnh đề quan hệ / liên kết câu', signal: 'Who, whom, whose, which, that, where hoặc từ nối.', method: 'Xác định danh từ tiền ngữ và thành phần còn thiếu trong mệnh đề phụ. “Whose” chỉ sở hữu; “where” cần nghĩa nơi chốn.' },
      { name: 'Từ vựng & collocation', signal: 'Bốn đáp án khác nghĩa nhưng cùng từ loại.', method: 'Đọc toàn câu, xác định sắc thái và cụm đi kèm: meet a deadline, be eligible for, comply with… Ghi cả cụm khi chữa bài.' },
    ],
    trap: 'Bẫy chính: đúng nghĩa nhưng sai từ loại, đúng ngữ pháp nhưng sai collocation, hoặc chọn động từ theo danh từ gần nhất thay vì chủ ngữ thật.',
  },
  {
    part: 'Part 6', title: 'Hoàn thành đoạn văn', meta: '16 câu · mục tiêu 8–10 phút',
    tips: [
      'Đọc nhanh người gửi–nhận, tiêu đề và câu đầu để biết loại văn bản/mục đích; sau đó xử lý bốn chỗ trống theo thứ tự.',
      'Đánh dấu câu nào giải bằng cấu trúc cục bộ và câu nào bắt buộc dùng ngữ cảnh toàn đoạn.',
    ],
    types: [
      { name: 'Ngữ pháp / từ loại', signal: 'Các đáp án cùng gốc hoặc nhiều dạng động từ.', method: 'Giải như Part 5 bằng cụm trước–sau; chỉ mở rộng ngữ cảnh khi thì hoặc đại từ phụ thuộc các câu khác.' },
      { name: 'Từ vựng / collocation', signal: 'Bốn từ cùng loại nhưng khác nghĩa.', method: 'Đọc trọn câu và xác định mục đích văn bản. Loại từ sai sắc thái dù về ngữ pháp vẫn đặt được vào chỗ trống.' },
      { name: 'Từ nối / logic', signal: 'However, therefore, additionally, meanwhile, otherwise…', method: 'Tóm tắt hai vế bằng vài từ, rồi xác định quan hệ tương phản, nguyên nhân–kết quả, bổ sung hay trình tự thời gian.' },
      { name: 'Tham chiếu & tính nhất quán', signal: 'Đại từ, this/these/such, mốc thời gian hoặc thì thay đổi.', method: 'Truy ngược danh từ mà đại từ thay thế; dựng trục thời gian để giữ nhất quán giữa việc đã xảy ra, hiện tại và kế hoạch.' },
      { name: 'Chèn nguyên câu', signal: 'Một chỗ trống có bốn đáp án là câu hoàn chỉnh.', method: 'Đọc ít nhất câu trước và sau. Khớp đại từ, từ lặp/paraphrase, từ nối và mục đích; kiểm tra câu chèn có tạo cầu nối tự nhiên không.' },
    ],
    trap: 'Bẫy chính: câu chèn đứng riêng nghe hợp lý nhưng làm đứt tham chiếu, trình tự thời gian hoặc mục đích của cả văn bản.',
  },
  {
    part: 'Part 7', title: 'Đọc hiểu', meta: '54 câu · dành 53–57 phút',
    tips: [
      'Đọc tiêu đề/nguồn và câu hỏi trước; scan tên riêng, số, ngày và danh từ hiếm. Mỗi đáp án phải có bằng chứng cụ thể.',
      'Ở bài kép/ba, ghi vai trò từng tài liệu và mối liên hệ giữa chúng; câu hỏi thường đi theo thứ tự văn bản nhưng câu liên kết có thể ngoại lệ.',
    ],
    types: [
      { name: 'Ý chính / mục đích / đối tượng', signal: 'Mainly about, purpose, why was… written, intended for.', method: 'Dùng loại văn bản, tiêu đề, mở đầu và lời kêu gọi hành động. Chọn đáp án bao quát, không dùng một chi tiết nhỏ làm ý chính.' },
      { name: 'Chi tiết', signal: 'According to…, what/when/where/how much/which…', method: 'Lấy từ khóa định vị rồi tìm paraphrase. Đọc thêm một câu trước–sau để tránh lấy đúng từ nhưng sai ngữ cảnh.' },
      { name: 'NOT / EXCEPT', signal: 'NOT stated, NOT mentioned, except.', method: 'Khoanh chữ phủ định. Xác minh lần lượt ba phương án có bằng chứng; phương án còn lại là đáp án. Không làm theo trí nhớ tổng quát.' },
      { name: 'Suy luận', signal: 'Most likely, probably, imply, suggest, can be inferred.', method: 'Ghép 2–3 dữ kiện trực tiếp và chọn kết luận tối thiểu. Loại đáp án tuyệt đối hóa hoặc thêm quan hệ nhân quả không có trong bài.' },
      { name: 'Từ vựng trong ngữ cảnh', signal: 'The word “…” is closest in meaning to…', method: 'Thay từng đáp án vào đúng câu, xét từ loại và ngữ cảnh địa phương. Nghĩa quen thuộc nhất của từ chưa chắc là nghĩa trong bài.' },
      { name: 'Chèn câu / vị trí câu', signal: 'In which position [1]–[4] does the sentence best belong?', method: 'Theo dõi danh từ → đại từ, thông tin cũ → mới, từ nối và trình tự thời gian. Kiểm tra cả mối nối trước lẫn sau vị trí.' },
      { name: 'Ý ngụ ý của câu nói', signal: 'What does the writer mean by “…”?', method: 'Xác định người viết đang xin lỗi, từ chối, đề nghị, cảnh báo hay trấn an; diễn giải chức năng giao tiếp thay vì dịch chữ.' },
      { name: 'Bài kép/ba & liên kết dữ kiện', signal: 'Câu hỏi nhắc hai tài liệu hoặc yêu cầu đối chiếu bảng/lịch.', method: 'Lập bản đồ ai–tài liệu–thời gian. Tìm một dữ kiện ở tài liệu A rồi dùng nó tra bảng/lịch/thông tin ở B hoặc C.' },
    ],
    trap: 'Bẫy chính: phương án có thật trong bài nhưng không trả lời điều được hỏi, đổi chủ thể/thời gian, hoặc suy diễn vượt quá bằng chứng.',
  },
];

const PartTipCard: React.FC<{ guide: PartGuide; tone: 'listening' | 'reading' }> = ({ guide, tone }) => {
  const isListening = tone === 'listening';
  return (
    <article className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${isListening ? 'bg-sky-100 text-sky-800' : 'bg-violet-100 text-violet-800'}`}>{guide.part}</span>
          <h5 className="mt-1.5 text-sm font-bold text-stone-900">{guide.title}</h5>
        </div>
        <span className="max-w-32 text-right text-[10px] font-semibold leading-4 text-stone-500">{guide.meta}</span>
      </div>
      <ul className="space-y-2 text-xs font-medium leading-relaxed text-stone-700">
        {guide.tips.map((tip) => <li key={tip} className="flex gap-2"><span className="font-black text-emerald-600" aria-hidden="true">✓</span><span>{tip}</span></li>)}
      </ul>
      <details className="group mt-3 rounded-lg border border-stone-200 bg-stone-50/80 open:bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-xs font-bold text-stone-800 marker:hidden">
          <span>{guide.types.length} dạng câu & cách xử lý</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-stone-500 transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-stone-200 px-3 pb-3">
          {guide.types.map((type, index) => (
            <div key={type.name} className="border-b border-stone-100 py-3 last:border-b-0 last:pb-0">
              <div className="mb-1.5 flex items-center gap-2">
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${isListening ? 'bg-sky-100 text-sky-800' : 'bg-violet-100 text-violet-800'}`}>{index + 1}</span>
                <h6 className="text-xs font-bold text-stone-900">{type.name}</h6>
              </div>
              <p className="text-[11px] leading-relaxed text-stone-600"><strong className="text-stone-700">Nhận diện:</strong> {type.signal}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-stone-700"><strong className={isListening ? 'text-sky-800' : 'text-violet-800'}>Cách làm:</strong> {type.method}</p>
            </div>
          ))}
        </div>
      </details>
      <div className="mt-3 flex gap-2 border-t border-stone-200 pt-3 text-[11px] leading-relaxed text-rose-700"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{guide.trap}</span></div>
    </article>
  );
};

export const StrategyBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const guideId = 'toeic-part-strategy-guide';
  return (
    <section className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div className="grid w-full flex-1 grid-cols-1 gap-3 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white/90 p-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700"><Headphones className="h-5 w-5" /></div><div className="text-xs"><span className="block font-bold text-stone-900">Listening trong phòng thi:</span><span className="font-medium text-stone-600">Đọc trước → nghe theo thứ tự → lỡ câu nào bỏ ngay câu đó</span></div></div>
          <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white/90 p-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><Clock className="h-5 w-5" /></div><div className="text-xs"><span className="block font-bold text-stone-900">Reading 75 phút:</span><span className="font-medium text-stone-600">P5 10–12p · P6 8–10p · P7 53–57p · không bỏ trống</span></div></div>
          <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white/90 p-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Sparkles className="h-5 w-5" /></div><div className="text-xs"><span className="block font-bold text-stone-900">Cẩm nang theo dạng:</span><span className="font-medium text-stone-600">43 dạng câu · nhận diện · cách làm · bẫy cần tránh</span></div></div>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-end lg:self-center">
          <button type="button" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-controls={guideId} className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 shadow-xs transition-colors hover:bg-stone-100"><span>{isOpen ? 'Thu gọn bí kíp' : 'Mở bí kíp từng Part'}</span>{isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}</button>
          <a href="https://study4.com/tests/toeic/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-amber-700"><span>Kho đề Study4</span><ExternalLink className="h-3.5 w-3.5" /></a>
        </div>
      </div>
      {isOpen && (
        <div id={guideId} className="mt-4 border-t border-amber-200/80 pt-4 animate-in fade-in duration-300">
          <div className="mb-4 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5"><Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /><div className="text-xs leading-relaxed text-emerald-950"><strong className="mb-0.5 block text-sm">Cách dùng cẩm nang</strong>Mở Part bạn đang luyện, nhận diện đúng dạng trước rồi mới áp dụng mẹo. Sau mỗi đề, ghi lỗi theo <strong>dạng câu + nguyên nhân sai</strong> thay vì chỉ ghi số câu.</div></div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <section aria-labelledby="listening-guide-title"><div className="mb-3 flex items-center gap-2"><Headphones className="h-4 w-4 text-sky-700" /><div><h4 id="listening-guide-title" className="text-sm font-bold text-stone-900">Listening — nghe theo nhiệm vụ</h4><p className="text-[11px] text-stone-500">45 phút · 100 câu · Part 1–4</p></div></div><div className="grid grid-cols-1 gap-3">{LISTENING_GUIDES.map((guide) => <PartTipCard key={guide.part} guide={guide} tone="listening" />)}</div></section>
            <section aria-labelledby="reading-guide-title"><div className="mb-3 flex items-center gap-2"><BookOpenCheck className="h-4 w-4 text-violet-700" /><div><h4 id="reading-guide-title" className="text-sm font-bold text-stone-900">Reading — bằng chứng trước, suy luận sau</h4><p className="text-[11px] text-stone-500">75 phút · 100 câu · Part 5–7</p></div></div><div className="grid grid-cols-1 gap-3">{READING_GUIDES.map((guide) => <PartTipCard key={guide.part} guide={guide} tone="reading" />)}</div></section>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-xs text-sky-950"><strong className="mb-2 block text-sm">🎧 Quy trình chữa Listening</strong><ol className="list-decimal space-y-1.5 pl-4 leading-relaxed"><li>Nghe lại câu sai 1–2 lần, chưa nhìn transcript.</li><li>Mở transcript, đánh dấu clue, nối âm và paraphrase; tra từ theo cả cụm.</li><li>Nghe–nhại ở 1.0x; chỉ tăng tốc sau khi đã hiểu rõ nội dung.</li><li>Gắn lỗi vào đúng dạng ở trên và làm lại sau 2–3 ngày.</li></ol></div>
            <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-xs text-violet-950"><strong className="mb-2 block text-sm">⏱️ Mốc kiểm tra Reading</strong><div className="grid grid-cols-3 gap-2 text-center"><div className="rounded-lg bg-white/80 p-2"><span className="block font-black">63–65p</span>Xong Part 5</div><div className="rounded-lg bg-white/80 p-2"><span className="block font-black">53–57p</span>Bắt đầu Part 7</div><div className="rounded-lg bg-white/80 p-2"><span className="block font-black">5p cuối</span>Tô đủ & rà câu đánh dấu</div></div></div>
          </div>
          <footer className="mt-4 flex flex-col justify-between gap-2 border-t border-stone-200 pt-3 text-[10px] text-stone-500 sm:flex-row sm:items-center"><span>Tổng hợp theo format ETS và hệ thống dạng bài Study4; mẹo chỉ có giá trị khi được kiểm chứng bằng kết quả luyện đề của chính bạn.</span><div className="flex flex-wrap gap-x-3 gap-y-1 font-semibold"><a href="https://www.ets.org/toeic/test-takers/prepare.html" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">ETS chính thức ↗</a><a href="https://study4.com/posts/2446/cac-dang-cau-hoi-thuong-gap-trong-toeic-listening/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Dạng Listening ↗</a><a href="https://study4.com/posts/2447/cac-dang-cau-hoi-thuong-gap-trong-toeic-reading/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Dạng Reading ↗</a><a href="https://study4.com/posts/893/cac-bay-thuong-gap-trong-toeic-reading-va-cac-meo-lam-toeic-reading-hieu-qua/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Bẫy thường gặp ↗</a></div></footer>
        </div>
      )}
    </section>
  );
};
