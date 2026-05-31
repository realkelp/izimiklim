/**
 * karbon.js — Carbon Footprint Calculator Logic
 * İzim Climate Change Website
 *
 * Methodology based on CoolClimate Network (Berkeley)
 * Scores in kg CO2/year
 */

// ----------------------------------------------------------------
// 1. Question Bank
// ----------------------------------------------------------------
const questions = [
  {
    id: 'transport',
    category: '🚗 Ulaşım',
    text: 'Günlük ulaşımda en çok hangi yöntemi kullanıyorsun?',
    sub: 'Okul, iş veya günlük hayat için kullandığın temel ulaşım aracını seç.',
    answers: [
      {
        icon: '🚶',
        label: 'Yürüyüş / Bisiklet',
        desc: 'Motorlu taşıt kullanmıyorum',
        score: 0,
        impact: 'low',
        impactVal: 0,
        feedback: 'Harika! Motorlu taşıt kullanmamak, ulaşımdan kaynaklanan karbon salınımını sıfır yapar. Bu seçim yılda yaklaşık 2 ton CO₂ katkısından kaçınmanı sağlıyor.'
      },
      {
        icon: '🚌',
        label: 'Toplu Taşıma',
        desc: 'Otobüs, metro, tramvay',
        score: 200,
        impact: 'low',
        impactVal: 200,
        feedback: 'İyi tercih! Toplu taşıma, özel araçlara kıyasla kişi başı emisyonu %75\'e kadar azaltabilir. Yılda yaklaşık 200 kg CO₂.'
      },
      {
        icon: '🚗',
        label: 'Özel Araç (Dizel/Benzin)',
        desc: 'Her gün araç kullanıyorum',
        score: 600,
        impact: 'high',
        impactVal: 600,
        feedback: 'Ortalama benzinli araç, yılda yaklaşık 600 kg CO₂ üretir. Toplu taşıma veya elektrikli araçlara geçmek bu değeri dramatik biçimde düşürür.'
      },
      {
        icon: '⚡',
        label: 'Elektrikli Araç',
        desc: 'Elektrikli veya hibrit araç',
        score: 250,
        impact: 'med',
        impactVal: 250,
        feedback: 'Elektrikli araçlar, petrol araçlara kıyasla salınımı büyük ölçüde azaltır. Ancak elektriğin kaynağına bağlı olarak ~250 kg CO₂/yıl oluşabilir.'
      }
    ]
  },
  {
    id: 'flight',
    category: '✈️ Hava Yolculuğu',
    text: 'Yılda kaç kez uçak yolculuğu yapıyorsun?',
    sub: 'Gidiş-dönüş seyahatlerin toplamını düşün.',
    answers: [
      {
        icon: '🚫',
        label: 'Hiç uçmuyorum',
        desc: 'Yılda 0 uçuş',
        score: 0,
        impact: 'low',
        impactVal: 0,
        feedback: 'Uçmamak, bireysel olarak yapılabilen en etkili iklim aksiyonlarından biri. Ortalama bir İstanbul-Londra uçuşu ~0.5 ton CO₂ üretir.'
      },
      {
        icon: '✈️',
        label: '1–2 kısa yolculuk',
        desc: 'Yurt içi veya komşu ülkeler',
        score: 200,
        impact: 'med',
        impactVal: 200,
        feedback: 'İki kısa mesafe uçuşu yılda yaklaşık 200 kg CO₂ ekler. Tren alternatifini düşünmek bu değeri %80 azaltabilir.'
      },
      {
        icon: '🌍',
        label: '3–5 uçuş (karma)',
        desc: 'Yurt içi + uluslararası',
        score: 750,
        impact: 'high',
        impactVal: 750,
        feedback: 'Yılda 3–5 uçuş, ulaşım karbon bütçenin büyük bölümünü oluşturur. Toplam ~750 kg CO₂ — bu tek başına karbon ayak izine önemli bir etki yapar.'
      },
      {
        icon: '🌏',
        label: '5\'ten fazla uçuş',
        desc: 'Sık seyahat ediyorum',
        score: 2000,
        impact: 'high',
        impactVal: 2000,
        feedback: 'Sık uçuş, bireysel karbon ayak izinin en büyük kalemlerinden biri. Yılda 2 ton CO₂ sadece uçuşlardan gelebilir.'
      }
    ]
  },
  {
    id: 'diet',
    category: '🥬 Beslenme',
    text: 'Beslenme düzenin nasıl?',
    sub: 'Gıda üretimi küresel sera gazı salınımının ~%30\'unu oluşturur.',
    answers: [
      {
        icon: '🌱',
        label: 'Vegan',
        desc: 'Et, süt, yumurta tüketmiyorum',
        score: 500,
        impact: 'low',
        impactVal: 500,
        feedback: 'Vegan beslenme, her diyet arasında en düşük karbon ayak izine sahip. Gıdadan yıllık yaklaşık 500 kg CO₂.'
      },
      {
        icon: '🥦',
        label: 'Vejetaryen',
        desc: 'Et yemiyorum',
        score: 900,
        impact: 'low',
        impactVal: 900,
        feedback: 'Vejetaryen beslenme, et tüketimine kıyasla gıda kaynaklı salınımı ~%50 azaltır. Yılda ~900 kg CO₂.'
      },
      {
        icon: '🍗',
        label: 'Az et (ağırlıklı tavuk/balık)',
        desc: 'Haftada 2–3 kez et',
        score: 1500,
        impact: 'med',
        impactVal: 1500,
        feedback: 'Beyaz et ve balık, kırmızı ete göre çok daha düşük emisyona sahip. Dengeli bir diyet için iyi bir seçenek. ~1.5 ton CO₂/yıl.'
      },
      {
        icon: '🥩',
        label: 'Et ağırlıklı beslenme',
        desc: 'Her gün kırmızı et tüketiyorum',
        score: 3300,
        impact: 'high',
        impactVal: 3300,
        feedback: 'Günlük kırmızı et tüketimi en yüksek gıda kaynaklı karbon ayak izini yaratır. Yılda ~3.3 ton CO₂ — özellikle sığır eti büyük pay taşır.'
      }
    ]
  },
  {
    id: 'energy',
    category: '⚡ Enerji',
    text: 'Evinde kullandığın enerji kaynağı nedir?',
    sub: 'Elektrik faturanı kim öderhe de olsa, gerçek kullanımını düşün.',
    answers: [
      {
        icon: '☀️',
        label: '%100 Yenilenebilir',
        desc: 'Güneş, rüzgar, hidroelektrik',
        score: 100,
        impact: 'low',
        impactVal: 100,
        feedback: 'Mükemmel! Yenilenebilir enerji neredeyse sıfır operasyonel karbon üretir. Türkiye\'deki ortalama yeşil tarifeler ~100 kg CO₂/yıl.'
      },
      {
        icon: '🔌',
        label: 'Şebeke elektrikleri (karma)',
        desc: 'Normal elektrik tarife',
        score: 800,
        impact: 'med',
        impactVal: 800,
        feedback: 'Türkiye\'nin enerji karışımı ~%35 yenilenebilir içerir. Ortalama bir hanenin elektrikten yıllık ~800 kg CO₂ salınımı var.'
      },
      {
        icon: '🔥',
        label: 'Doğal gaz ağırlıklı',
        desc: 'Isıtma + elektrik için gaz',
        score: 1800,
        impact: 'high',
        impactVal: 1800,
        feedback: 'Doğal gaz ısıtma sistemleri önemli miktarda CO₂ salınımına neden olur. Yılda yaklaşık 1.8 ton CO₂.'
      },
      {
        icon: '🏭',
        label: 'Kömür/Doğal gaz yoğun',
        desc: 'Yüksek enerji tüketimi',
        score: 3000,
        impact: 'high',
        impactVal: 3000,
        feedback: 'Fosil yakıt ağırlıklı enerji kullanımı en yüksek salınım kategorisine girer. Enerji tasarrufu ve yenilenebilir geçiş büyük fark yaratır.'
      }
    ]
  },
  {
    id: 'shopping',
    category: '🛍️ Tüketim',
    text: 'Kıyafet ve ürün alışverişini nasıl tanımlarsın?',
    sub: 'Tekstil sektörü küresel karbon salınımının %10\'undan fazlasını oluşturuyor.',
    answers: [
      {
        icon: '♻️',
        label: 'Minimal / İkinci el',
        desc: 'Nadiren alıyorum, çoğu ikinci el',
        score: 200,
        impact: 'low',
        impactVal: 200,
        feedback: 'İkinci el alışveriş ve minimal tüketim mükemmel bir tercih. Yeni bir gömlek üretmek ortalama 3 kg CO₂ oluşturur — ikinci el sıfıra yakındır.'
      },
      {
        icon: '🌿',
        label: 'Sürdürülebilir markalar',
        desc: 'Kaliteli, uzun ömürlü ürünler',
        score: 600,
        impact: 'low',
        impactVal: 600,
        feedback: 'Sürdürülebilir tercihler doğru yönde bir adım. Az sayıda, kaliteli ürün almak fast fashion\'a kıyasla ~%60 daha az emisyon üretir.'
      },
      {
        icon: '🛒',
        label: 'Ortalama tüketici',
        desc: 'Ayda birkaç yeni ürün',
        score: 1200,
        impact: 'med',
        impactVal: 1200,
        feedback: 'Ortalama bir tüketicinin yıllık alışveriş kaynaklı karbon ayak izi yaklaşık 1.2 ton CO₂. Daha az ve daha uzun ömürlü almak fark yaratır.'
      },
      {
        icon: '👗',
        label: 'Fast fashion / Çok alışveriş',
        desc: 'Sık sık yeni kıyafet ve ürün',
        score: 2500,
        impact: 'high',
        impactVal: 2500,
        feedback: 'Fast fashion, hem karbon hem su kullanımı açısından en yüksek etkili tüketim biçimlerinden biri. Yılda ~2.5 ton CO₂.'
      }
    ]
  },
  {
    id: 'food_waste',
    category: '🗑️ Gıda İsrafı',
    text: 'Satın aldığın gıdaların ne kadarını çöpe atıyorsun?',
    sub: 'Gıda israfı, küresel sera gazı salınımının %8–10\'undan sorumludur.',
    answers: [
      {
        icon: '✅',
        label: 'Neredeyse hiç',
        desc: 'Planlamalı alışveriş, israf yok',
        score: 50,
        impact: 'low',
        impactVal: 50,
        feedback: 'Harika! Gıdanı akıllıca planlamak ve israfı minimuma indirmek ciddi fark yaratıyor. Neredeyse sıfır ek salınım.'
      },
      {
        icon: '🥗',
        label: 'Az (%10–20)',
        desc: 'Bazen bozuluyor',
        score: 200,
        impact: 'low',
        impactVal: 200,
        feedback: 'Düşük gıda israfı iyi bir seviye. Meal prep ve alışveriş listesi kullanmak bu oranı daha da düşürebilir.'
      },
      {
        icon: '🍽️',
        label: 'Orta (%30–40)',
        desc: 'Zaman zaman çok alıyorum',
        score: 450,
        impact: 'med',
        impactVal: 450,
        feedback: 'Ortalama hane gıdasının ~%30\'unu çöpe atar. Her çöpe atılan 1 kg gıda, yaklaşık 4.5 kg CO₂ eşdeğeri salınım yaratır.'
      },
      {
        icon: '🚮',
        label: 'Yüksek (%50+)',
        desc: 'Çok fazla bozulan / çöpen gıda',
        score: 900,
        impact: 'high',
        impactVal: 900,
        feedback: 'Yüksek gıda israfı hem kaynak hem emisyon açısından büyük bir kayıp. Yılda ~900 kg CO₂ sadece israf edilen gıdadan geliyor olabilir.'
      }
    ]
  },
  {
    id: 'recycling',
    category: '♻️ Geri Dönüşüm',
    text: 'Geri dönüşüm alışkanlıkların nasıl?',
    answers: [
      {
        icon: '🏆',
        label: 'Her şeyi ayırıyorum',
        desc: 'Kağıt, cam, plastik, organik',
        score: -200,
        impact: 'low',
        impactVal: -200,
        feedback: 'Tam geri dönüşüm hem emisyon tasarrufu hem kaynak verimliliği açısından en iyi seçenek. Yaklaşık 200 kg CO₂ tasarrufu sağlıyor.'
      },
      {
        icon: '✔️',
        label: 'Çoğunlukla yapıyorum',
        desc: 'Büyük kısmını ayırıyorum',
        score: -80,
        impact: 'low',
        impactVal: -80,
        feedback: 'İyi alışkanlık! Geri dönüştürdükçe tasarruf büyür. Organik atıkları da kompost olarak değerlendirmek bonus etki yaratır.'
      },
      {
        icon: '🤷',
        label: 'Nadiren',
        desc: 'Genelde hepsini aynı çöpe',
        score: 0,
        impact: 'med',
        impactVal: 0,
        feedback: 'Geri dönüşüm, çöp depolama alanlarındaki metan salınımını azaltır. Küçük adımlarla başlamak büyük fark yaratabilir.'
      },
      {
        icon: '🚯',
        label: 'Hiç yapmıyorum',
        desc: 'Geri dönüşüm kutularına koymuyorum',
        score: 200,
        impact: 'high',
        impactVal: 200,
        feedback: 'Geri dönüşüm yapmamak, düzenli çöp depolama alanlarında bozunan organik maddelerden metan salınımına katkıda bulunur.'
      }
    ]
  },
  {
    id: 'home_size',
    category: '🏠 Konut',
    text: 'Evinde kaç kişi yaşıyor?',
    sub: 'Aynı evi paylaşmak, kişi başı ev kaynaklı emisyonu azaltır.',
    answers: [
      {
        icon: '👪',
        label: '4 veya daha fazla',
        desc: 'Kalabalık aile',
        score: 300,
        impact: 'low',
        impactVal: 300,
        feedback: 'Büyük bir aile ile yaşamak, enerji ve kaynak kullanımını paylaştırır. Kişi başı konut salınımı nispeten düşük: ~300 kg CO₂.'
      },
      {
        icon: '👨‍👩‍👦',
        label: '2–3 kişi',
        desc: 'Çekirdek aile veya ev arkadaşı',
        score: 500,
        impact: 'low',
        impactVal: 500,
        feedback: 'Paylaşımı konut, kişi başı salınımı azaltır. Ortalama 2–3 kişilik hane için ~500 kg CO₂/kişi.'
      },
      {
        icon: '👤',
        label: 'Tek başıma',
        desc: 'Solo yaşıyorum',
        score: 1100,
        impact: 'med',
        impactVal: 1100,
        feedback: 'Tek kişilik haneler, enerji ve kaynak tüketimini tek kişiye yüklediğinden kişi başı salınım daha yüksek olabilir: ~1.1 ton CO₂.'
      }
    ]
  }
];

// ----------------------------------------------------------------
// 2. All possible recommendations pool
// ----------------------------------------------------------------
const allRecommendations = {
  transport: {
    high: [
      { icon: '🚌', text: 'Günlük yolculuklarında toplu taşımaya geçmeyi dene. Bu tek adım yıllık 1.7 ton CO₂ tasarrufu sağlayabilir.' },
      { icon: '🚲', text: 'Kısa mesafeler için bisiklet veya yürüyüş dene — hem sağlıklı hem de sıfır karbon.' }
    ],
    med: [
      { icon: '⚡', text: 'Elektrikli araç seçeneğini değerlendirmek, karbon ayak izini %65 oranında azaltabilir.' }
    ],
    low: []
  },
  flight: {
    high: [
      { icon: '🚂', text: 'Uçak yerine tren tercih et — aynı mesafe için tren %80 daha az CO₂ üretir.' },
      { icon: '💻', text: 'İş seyahatlerini online toplantılarla değiştirmek pratikte büyük karbon tasarrufu sağlar.' }
    ],
    med: [
      { icon: '🌲', text: 'Uçuşlarını dengelemek için ağaçlandırma projelerine destek verebilirsin — ancak uçmamak asıl hedeftir.' }
    ],
    low: []
  },
  diet: {
    high: [
      { icon: '🥦', text: 'Haftada iki gün et yememeyi dene ("Etsiz Pazartesi"). Bu yılda ~300 kg CO₂ tasarrufu sağlar.' },
      { icon: '🐄', text: 'Sığır etini tavuk veya baklagillerle değiştirmek, gıda kaynaklı salınımı %50 azaltabilir.' }
    ],
    med: [
      { icon: '🌱', text: 'Bitkisel protein kaynaklarını (mercimek, nohut, tofu) daha sık dene.' }
    ],
    low: []
  },
  energy: {
    high: [
      { icon: '☀️', text: 'Elektrik sağlayıcından yeşil enerji tarifesi seçmek veya balkon güneş paneli kurmak büyük fark yaratır.' },
      { icon: '🌡️', text: 'Kış aylarında termostatı 1–2 derece düşürmek yıllık %10 enerji tasarrufu sağlar.' }
    ],
    med: [
      { icon: '💡', text: 'LED aydınlatmaya geçmek ve bekleme modundaki cihazları kapatmak karbon ayak izini düşürür.' }
    ],
    low: []
  },
  shopping: {
    high: [
      { icon: '👗', text: 'Fast fashion yerine sürdürülebilir markalar veya ikinci el mağazaları tercih et.' },
      { icon: '🔄', text: 'İhtiyaç olmayan ürünleri satmak veya bağışlamak döngüsel ekonomiye katkı sağlar.' }
    ],
    med: [
      { icon: '📦', text: 'Satın almadan önce "buna gerçekten ihtiyacım var mı?" sorusunu sor. 24 saat bekle.' }
    ],
    low: []
  },
  food_waste: {
    high: [
      { icon: '📝', text: 'Haftalık menü planla ve buna göre alışveriş yap. Gıda israfını %50 azaltabilir.' },
      { icon: '🧊', text: 'Bozulmak üzere olan gıdaları dondurmak hem para hem karbon tasarrufu sağlar.' }
    ],
    med: [
      { icon: '🌿', text: 'Organik atıkları kompost olarak değerlendirmek, yine de oluşan salınımı azaltır.' }
    ],
    low: []
  }
};

// ----------------------------------------------------------------
// 3. State
// ----------------------------------------------------------------
let currentQuestion = 0;
let totalScore = 0;
let userAnswers = {};
let selectedAnswer = null;

// ----------------------------------------------------------------
// 4. DOM references
// ----------------------------------------------------------------
const screenIntro  = document.getElementById('screen-intro');
const screenQuiz   = document.getElementById('screen-quiz');
const screenResult = document.getElementById('screen-result');
const startBtn     = document.getElementById('start-quiz-btn');
const nextBtn      = document.getElementById('next-btn');
const restartBtn   = document.getElementById('restart-btn');

// ----------------------------------------------------------------
// 5. Event listeners
// ----------------------------------------------------------------
startBtn?.addEventListener('click', startQuiz);
nextBtn?.addEventListener('click', nextQuestion);
restartBtn?.addEventListener('click', restartQuiz);

// ----------------------------------------------------------------
// 6. Quiz functions
// ----------------------------------------------------------------
function startQuiz() {
  screenIntro.style.display = 'none';
  screenQuiz.style.display  = 'block';
  currentQuestion = 0;
  totalScore      = 0;
  userAnswers     = {};
  selectedAnswer  = null;
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentQuestion];
  const progress = ((currentQuestion) / questions.length) * 100;

  // Update progress
  document.getElementById('quiz-progress-fill').style.width = progress + '%';
  document.getElementById('step-label').textContent = `Soru ${currentQuestion + 1} / ${questions.length}`;
  document.getElementById('score-label').textContent = formatScore(totalScore);

  // Update question content
  document.getElementById('q-category').textContent = q.category;
  document.getElementById('q-text').textContent      = q.text;
  document.getElementById('q-sub').textContent       = q.sub || '';

  // Hide feedback + next button
  document.getElementById('feedback-panel').style.display = 'none';
  document.getElementById('next-btn-wrap').style.display  = 'none';
  selectedAnswer = null;

  // Render answers
  const container = document.getElementById('answers-container');
  container.innerHTML = q.answers.map((a, i) => `
    <button class="answer-btn" data-index="${i}" id="answer-${i}" aria-label="${a.label}">
      <span class="answer-icon" aria-hidden="true">${a.icon}</span>
      <div class="answer-text">
        <strong>${a.label}</strong>
        <span>${a.desc}</span>
      </div>
    </button>
  `).join('');

  // Attach click handlers
  container.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.index)));
  });

  // Animate card
  const card = document.getElementById('question-card');
  card.style.animation = 'none';
  requestAnimationFrame(() => {
    card.style.animation = 'scaleIn 0.4s var(--ease-out-expo) forwards';
  });
}

function selectAnswer(index) {
  const q = questions[currentQuestion];
  const a = q.answers[index];
  selectedAnswer = index;

  // Update visual selection
  document.querySelectorAll('.answer-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === index);
  });

  // Store answer
  const prevAnswer = userAnswers[q.id];
  if (prevAnswer) {
    totalScore -= prevAnswer.score;
  }
  userAnswers[q.id] = { index, score: a.score, impact: a.impact };
  totalScore += a.score;

  // Show feedback
  showFeedback(a);
}

function showFeedback(a) {
  const panel      = document.getElementById('feedback-panel');
  const impactEl   = document.getElementById('feedback-impact-val');
  const feedbackEl = document.getElementById('feedback-text');
  const nextWrap   = document.getElementById('next-btn-wrap');

  // Format impact value
  const sign   = a.impactVal >= 0 ? '+' : '';
  impactEl.textContent = `${sign}${formatScore(a.impactVal)}`;

  // Color class
  impactEl.className = 'impact-val ' + (
    a.impact === 'low'  ? 'impact-low' :
    a.impact === 'high' ? 'impact-high' : 'impact-med'
  );

  feedbackEl.textContent = a.feedback;
  panel.style.display    = 'block';

  // Show next or finish
  if (currentQuestion < questions.length - 1) {
    nextBtn.textContent = 'Sonraki Soru →';
  } else {
    nextBtn.textContent = 'Sonuçlarımı Gör 🌿';
  }
  nextWrap.style.display = 'flex';

  // Update running score
  document.getElementById('score-label').textContent = formatScore(totalScore);
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

// ----------------------------------------------------------------
// 7. Results
// ----------------------------------------------------------------
function showResults() {
  screenQuiz.style.display   = 'none';
  screenResult.style.display = 'block';

  const tonsPerYear = totalScore / 1000;

  // Animate co2 number
  const numEl = document.getElementById('result-num');
  animateNumber(numEl, 0, tonsPerYear, 2.0, 1);

  // Verdict
  const verdictEl = document.getElementById('result-verdict');
  const descEl    = document.getElementById('result-desc');

  if (tonsPerYear < 3) {
    verdictEl.textContent = '🟢 Düşük — Dünya Ortalamasının Altında';
    verdictEl.className = 'result-verdict verdict-low';
    descEl.textContent = `Yıllık ${tonsPerYear.toFixed(1)} ton CO₂ ile dünya ortalaması (4.7 ton) oldukça altındasın. Sürdürülebilir yaşam biçimini sürdürmeye devam et!`;
  } else if (tonsPerYear <= 7) {
    verdictEl.textContent = '🟡 Normal — Dünya Ortalaması Civarında';
    verdictEl.className = 'result-verdict verdict-avg';
    descEl.textContent = `Yıllık ${tonsPerYear.toFixed(1)} ton CO₂ ile dünya ortalamasına (4.7 ton) yakınsın. Birkaç değişiklikle bu değeri önemli ölçüde düşürebilirsin.`;
  } else {
    verdictEl.textContent = '🔴 Yüksek — Dünya Ortalamasının Üzerinde';
    verdictEl.className = 'result-verdict verdict-high';
    descEl.textContent = `Yıllık ${tonsPerYear.toFixed(1)} ton CO₂ ile dünya ortalaması (4.7 ton) üzerindesin. Aşağıdaki önerileri hayata geçirmek büyük fark yaratir.`;
  }

  // Comparison bars (max = 16 tons)
  const maxBar = 16;
  const barYou = document.getElementById('bar-you');
  const barYouVal = document.getElementById('bar-you-val');
  barYouVal.textContent = tonsPerYear.toFixed(1) + 't';

  if (tonsPerYear < 3) {
    barYou.style.background = 'var(--color-primary)';
    barYouVal.style.color   = 'var(--color-primary)';
  } else if (tonsPerYear <= 7) {
    barYou.style.background = 'var(--color-accent)';
    barYouVal.style.color   = 'var(--color-accent)';
  } else {
    barYou.style.background = '#f87171';
    barYouVal.style.color   = '#f87171';
  }

  setTimeout(() => {
    barYou.style.width = Math.min((tonsPerYear / maxBar) * 100, 100) + '%';
  }, 300);

  // Recommendations
  buildRecommendations(tonsPerYear);

  // Save to localStorage
  saveResult(tonsPerYear);

  // Trigger reveals
  setTimeout(() => {
    document.querySelectorAll('#screen-result .reveal').forEach(el => {
      el.classList.add('visible');
    });
  }, 200);
}

function buildRecommendations(tonsPerYear) {
  const recsList = document.getElementById('recs-list');
  let recs = [];

  questions.forEach(q => {
    const answer = userAnswers[q.id];
    if (!answer) return;
    const pool = allRecommendations[q.id];
    if (!pool) return;
    const impact = answer.impact;
    const qRecs = pool[impact] || [];
    recs = recs.concat(qRecs);
  });

  // Always add a civic one
  recs.push({ icon: '📢', text: 'İklim politikalarını destekleyen siyasetçileri ve kampanyaları destekle. Kolektif etki bireysel etkinin çok üzerinde.' });

  // Limit to 5 most impactful
  const finalRecs = recs.slice(0, 5);

  recsList.innerHTML = finalRecs.map(r => `
    <li>
      <span class="rec-icon">${r.icon}</span>
      <span>${r.text}</span>
    </li>
  `).join('');
}

function saveResult(tonsPerYear) {
  try {
    localStorage.setItem('izim_karbon_result', JSON.stringify({
      tons: tonsPerYear,
      answers: userAnswers,
      date: new Date().toISOString()
    }));
  } catch (e) { /* localStorage may not be available */ }
}

function restartQuiz() {
  screenResult.style.display = 'none';
  currentQuestion = 0;
  totalScore      = 0;
  userAnswers     = {};
  selectedAnswer  = null;
  screenIntro.style.display = 'block';
}

// ----------------------------------------------------------------
// 8. Utility
// ----------------------------------------------------------------
function formatScore(kgCO2) {
  if (Math.abs(kgCO2) >= 1000) {
    return (kgCO2 / 1000).toFixed(1) + ' ton CO₂';
  }
  return kgCO2 + ' kg CO₂';
}

function animateNumber(el, from, to, durationSecs, decimals) {
  const start = performance.now();
  const duration = durationSecs * 1000;
  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = (from + eased * (to - from)).toFixed(decimals);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
