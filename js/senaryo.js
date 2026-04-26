/**
 * senaryo.js — 2050 Scenario Game Logic
 * İzim Climate Change Website
 *
 * 7 rounds of climate decisions, tracking:
 *   - totalCarbonScore (kg CO2/year additions)
 *   - sustainabilityScore (0–100 points)
 * Final result: +1.5°C / +2°C / +3°C scenario
 */

// ================================================================
// 1. GAME ROUNDS DATA
// ================================================================
const rounds = [
  // ------ Round 1: Energy ------
  {
    id: 'energy',
    category: '⚡ Enerji Kullanımı',
    icon: '⚡',
    title: 'Eviniz için enerji kaynağı seçiyorsunuz',
    context: `2030 yılı. Hükümet, hanelerin enerji kaynağını seçmesine olanak tanıyan yeni bir politika hayata geçiriyor. 
    Elektrik faturanız sabit kalacak, ancak kaynağı siz seçiyorsunuz. Bu kararın küresel iklim üzerindeki etkisi bireysel 
    görünse de, milyonlarca bireyin aynı seçimi yapması enerji talebini köklü biçimde değiştirebilir.`,
    choices: [
      {
        icon: '☀️',
        label: 'Güneş ve Rüzgar',
        desc: '%100 yenilenebilir enerji tarifesi seç',
        carbonDelta: -200,
        sustainDelta: 18,
        impact: 'low',
        impactLabel: '🟢 Düşük',
        co2Text: '-200 kg CO₂',
        tip: 'Yenilenebilir enerji seçimi mükemmel! Fosil yakıt santrallerinden gelen elektriğe kıyasla yılda ~200 kg CO₂ daha az salınım. Ülke genelinde bu tercih yaygınlaşsaydı karbonsuzlaşma hızlanırdı.'
      },
      {
        icon: '🔌',
        label: 'Karma Şebeke',
        desc: 'Standart elektrik tarifesi (kısmen yenilenebilir)',
        carbonDelta: 500,
        sustainDelta: 8,
        impact: 'med',
        impactLabel: '🟡 Orta',
        co2Text: '+500 kg CO₂',
        tip: 'Karma şebeke makul ama yetersiz. Türkiye\'nin enerji karışımı ~%35 yenilenebilir içeriyor. Tamamen yeşil tarifeye geçmek bu değeri sıfıra yaklaştırır.'
      },
      {
        icon: '🏭',
        label: 'Ucuz Fosil Yakıt',
        desc: 'Kömür/doğal gaz bazlı en ucuz tarife',
        carbonDelta: 1800,
        sustainDelta: -5,
        impact: 'high',
        impactLabel: '🔴 Yüksek',
        co2Text: '+1800 kg CO₂',
        tip: 'Kömür ve doğal gaz, elektrik üretimindeki en yüksek karbon kaynaklarıdır. Bu tercih yılda ~1.8 ton CO₂ ekler ve küresel ısınmayı hızlandıran enerji sistemini destekler.'
      }
    ]
  },

  // ------ Round 2: Transportation ------
  {
    id: 'transport',
    category: '🚗 Ulaşım',
    icon: '🚗',
    title: 'Yeni bir şehre taşınıyorsunuz. Ulaşım sisteminizi kuruyorsunuz.',
    context: `2033 yılı. Şehrinizin metro sistemi yeni hatlar ekledi ve bisiklet altyapısı gelişti. 
    Aynı zamanda elektrikli araç fiyatları düştü. Bu dönüm noktasında kendi ulaşım alışkanlığını belirleyeceksin. 
    Ulaşım, küresel CO₂ salınımının yaklaşık %16'sını oluşturuyor.`,
    choices: [
      {
        icon: '🚌',
        label: 'Toplu Taşıma + Bisiklet',
        desc: 'Metro, otobüs ve bisiklet kombinasyonu',
        carbonDelta: 300,
        sustainDelta: 20,
        impact: 'low',
        impactLabel: '🟢 Düşük',
        co2Text: '+300 kg CO₂',
        tip: 'Mükemmel seçim! Toplu taşıma kişi başı salınımı özel araçlara kıyasla %75 azaltır. Bisiklet entegrasyonu sağlık faydası da sağlar. Yılda ~300 kg CO₂.'
      },
      {
        icon: '⚡',
        label: 'Elektrikli Araç',
        desc: 'Kişisel EV ile şarj istasyonu kullanımı',
        carbonDelta: 700,
        sustainDelta: 12,
        impact: 'med',
        impactLabel: '🟡 Orta',
        co2Text: '+700 kg CO₂',
        tip: 'Elektrikli araç doğru yön, ancak üretim süreci ve elektriğin kaynağına bağlı karbon maliyeti var. Yenilenebilir enerji ile şarj edilirse etki çok daha az.'
      },
      {
        icon: '🚗',
        label: 'Dizel/Benzin Araç',
        desc: 'Konvansiyonel özel araç kullanımı',
        carbonDelta: 2100,
        sustainDelta: -8,
        impact: 'high',
        impactLabel: '🔴 Yüksek',
        co2Text: '+2100 kg CO₂',
        tip: 'Ortalama benzin/dizel araç yılda 2.1 ton CO₂ üretir. Şehir içi yolculuklar için bu en yüksek etkili seçenektir. Arabadan vazgeçmek zor olsa da toplu taşımayı tercih etmek büyük fark yaratır.'
      }
    ]
  },

  // ------ Round 3: Diet ------
  {
    id: 'diet',
    category: '🥬 Beslenme',
    icon: '🍽️',
    title: 'Yeni bir beslenme düzeni benimsiyorsunuz',
    context: `2036 yılı. Gıda sistemleri dünyanın en büyük sera gazı kaynaklarından biri haline geldi — küresel salınımların 
    yaklaşık %30'undan sorumlu. Özellikle hayvancılık, toprak kullanımı ve tarımsal süreçler büyük pay taşıyor. 
    Kişisel beslenme tercihin hem sağlığını hem de gezegeni etkiliyor.`,
    choices: [
      {
        icon: '🌱',
        label: 'Bitki Bazlı Beslenme',
        desc: 'Vejetaryen veya vegan diyet',
        carbonDelta: 700,
        sustainDelta: 18,
        impact: 'low',
        impactLabel: '🟢 Düşük',
        co2Text: '+700 kg CO₂',
        tip: 'Bitki bazlı beslenmek, gıda kaynaklı karbon ayak izini %50–70 oranında azaltabilir. Haftada bir gün et yememek bile yılda ~330 kg CO₂ tasarrufu demek.'
      },
      {
        icon: '🍗',
        label: 'Az Et, Çoğu Sebze',
        desc: 'Haftada 2-3 kez tavuk ve balık',
        carbonDelta: 1400,
        sustainDelta: 10,
        impact: 'med',
        impactLabel: '🟡 Orta',
        co2Text: '+1400 kg CO₂',
        tip: 'Dengeli bir diyet: beyaz et ve balık kırmızı ete göre çok daha az emisyon üretir. İyi bir ara çözüm — bitkisel protein kaynaklarını artırmak daha iyi.'
      },
      {
        icon: '🥩',
        label: 'Et Ağırlıklı Beslenme',
        desc: 'Her gün kırmızı et tüketimi',
        carbonDelta: 3300,
        sustainDelta: -10,
        impact: 'high',
        impactLabel: '🔴 Yüksek',
        co2Text: '+3300 kg CO₂',
        tip: '1 kg sığır eti üretmek ortalama 60 kg CO₂ eşdeğeri salınıma neden olur. Günlük kırmızı et tüketimi gıda kaynaklı karbon bütçenin büyük bölümünü oluşturur.'
      }
    ]
  },

  // ------ Round 4: Consumption ------
  {
    id: 'consumption',
    category: '🛍️ Tüketim',
    icon: '🛍️',
    title: 'Giyim ve tüketim alışkanlıklarını gözden geçiriyorsunuz',
    context: `2038 yılı. Fast fashion endüstrisi dünya genelinde her yıl 92 milyon ton tekstil atığı üretiyor. 
    Sosyal medya etkisiyle tüketim baskısı giderek artıyor. Ancak alternatif bir hareket de büyüyor: 
    ikinci el, takas ve sürdürülebilir marka ekonomisi. Bu dönüm noktasında hangi yolu seçeceksin?`,
    choices: [
      {
        icon: '♻️',
        label: 'İkinci El + Minimal',
        desc: 'Takas, ikinci el alışveriş, az tüketim',
        carbonDelta: 150,
        sustainDelta: 16,
        impact: 'low',
        impactLabel: '🟢 Düşük',
        co2Text: '+150 kg CO₂',
        tip: 'İkinci el bir gömlek satın almak, yeni bir gömleğin %3\'ü kadar karbon yüküne sahip. Minimal tüketim ve takas kültürü hem çevresel hem ekonomik fayda sağlıyor.'
      },
      {
        icon: '🌿',
        label: 'Sürdürülebilir Markalar',
        desc: 'Etik üretim, uzun ömürlü ürünler',
        carbonDelta: 600,
        sustainDelta: 10,
        impact: 'med',
        impactLabel: '🟡 Orta',
        co2Text: '+600 kg CO₂',
        tip: 'Sürdürülebilir markalar doğru adım. Az sayıda, kaliteli ürün almak hem karbon hem de atık üretimini azaltır. Fast fashion\'a kıyasla ~%60 daha az emisyon.'
      },
      {
        icon: '👗',
        label: 'Fast Fashion',
        desc: 'Sık sık yeni kıyafet, trend takibi',
        carbonDelta: 2500,
        sustainDelta: -12,
        impact: 'high',
        impactLabel: '🔴 Yüksek',
        co2Text: '+2500 kg CO₂',
        tip: 'Fast fashion hem su tüketimi hem karbon hem de atık üretimi açısından en yıkıcı tüketim biçimlerinden biri. Bir jeans üretmek ~7,000 litre su ve ~33 kg CO₂ gerektirir.'
      }
    ]
  },

  // ------ Round 5: Daily Habits ------
  {
    id: 'habits',
    category: '🏠 Günlük Alışkanlıklar',
    icon: '🏠',
    title: 'Evdeki enerji tasarrufu alışkanlıklarını belirliyorsunuz',
    context: `2040 yılı. Akıllı ev teknolojileri artık yaygın. Enerji yönetim sistemleri, LED aydınlatmalar 
    ve ısı pompaları mali açıdan erişilebilir hale geldi. Geri dönüşüm altyapısı iyileşti. 
    Evdeki küçük alışkanlıklar toplamda büyük fark yaratıyor.`,
    choices: [
      {
        icon: '💡',
        label: 'Aktif Enerji Tasarrufu',
        desc: 'LED, akıllı termostat, geri dönüşüm, kompost',
        carbonDelta: 100,
        sustainDelta: 15,
        impact: 'low',
        impactLabel: '🟢 Düşük',
        co2Text: '+100 kg CO₂',
        tip: 'Aktif enerji tasarrufu alışkanlıkları kümülatif büyük etki yaratır. Geri dönüşüm tek başına yılda ~200 kg CO₂ tasarrufu sağlayabilir. Akıllı termostat %10–15 enerji azaltımı sunar.'
      },
      {
        icon: '🔆',
        label: 'Orta Düzey Dikkat',
        desc: 'Bazı tasarruf önlemleri var ama tutarsız',
        carbonDelta: 500,
        sustainDelta: 5,
        impact: 'med',
        impactLabel: '🟡 Orta',
        co2Text: '+500 kg CO₂',
        tip: 'Orta düzey ama tutarsız davranış. Alışkanlık haline getirmek kritik: bekleme modunda bırakılan cihazlar yılda evlerin %5–10\'u kadar enerji çeker.'
      },
      {
        icon: '💸',
        label: 'Yüksek Tüketim, Tasarruf Yok',
        desc: 'Geri dönüşüm yok, enerji israfı var',
        carbonDelta: 1200,
        sustainDelta: -8,
        impact: 'high',
        impactLabel: '🔴 Yüksek',
        co2Text: '+1200 kg CO₂',
        tip: 'Hiç tasarruf yapmamak, gereksiz enerji tüketimi ve sıfır geri dönüşüm, yılda ~1.2 ton ekstra CO₂ demek olabilir. Küçük adımlar bile büyük fark yaratır.'
      }
    ]
  },

  // ------ Round 6: Civic Engagement ------
  {
    id: 'civic',
    category: '🗳️ Sivil Katılım',
    icon: '🗳️',
    title: 'İklim politikalarında sesini kullanıyorsunuz',
    context: `2043 yılı. Karbonsuzlaşma hedefleri uluslararası gündemi domine ediyor. Yerel seçimler kapıda. 
    İklim politikasını ön plana alan bir aday, fosil yakıt sektörünü destekleyen bir adayla yarışıyor. 
    Aynı zamanda bir iklim STK'sı gönüllü desteğe çağırıyor. Kolektif siyasi irade bireysel kararların 
    çok ötesinde etki yaratabilir.`,
    choices: [
      {
        icon: '📢',
        label: 'Aktif Destek ve Oy',
        desc: 'İklim politikası destekle, STK\'ya katıl, kampanya paylaş',
        carbonDelta: -300,
        sustainDelta: 22,
        impact: 'low',
        impactLabel: '🟢 Büyük Etki',
        co2Text: '-300 kg CO₂',
        tip: 'Sivil katılım en büyük kaldıraç noktası! Tek oy bireysel değişimin ötesinde sistem düzeyinde dönüşüm tetikleyebilir. Kolektif siyasi baskı enerji politikalarını değiştirdi.'
      },
      {
        icon: '🤝',
        label: 'Bilinçli Seçmen',
        desc: 'İklim dostu adaya oy ver, ama aktif kampanyaya katılma',
        carbonDelta: -100,
        sustainDelta: 10,
        impact: 'med',
        impactLabel: '🟡 Olumlu',
        co2Text: '-100 kg CO₂',
        tip: 'Bilinçli oy bile büyük fark yaratabilir. Aktif katılım olmasa da doğru siyasi tercihlerin birikmesi politika değişikliği getirir.'
      },
      {
        icon: '😐',
        label: 'Kayıtsızlık',
        desc: 'Siyasete ilgi yok, oy kullanmıyorum',
        carbonDelta: 800,
        sustainDelta: -15,
        impact: 'high',
        impactLabel: '🔴 Pasif Zarar',
        co2Text: '+800 kg CO₂',
        tip: 'Siyasi kayıtsızlık dolaylı olarak mevcut sistemi destekler. İklim eylemsizliğini besleyen politikaların sürmesine izin verir. Oy kullanmamak da bir tercihtir — ancak bedeli ağırdır.'
      }
    ]
  },

  // ------ Round 7: Housing ------
  {
    id: 'housing',
    category: '🏡 Konut & Isınma',
    icon: '🏡',
    title: 'Yeni bir ev seçiyorsunuz. Isıtma sisteminize karar vereceksiniz.',
    context: `2047 yılı. 2050 sıfır emisyon hedefine yalnızca 3 yıl kaldı. Konut ısıtması, bireysel 
    karbon bütçelerinin büyük kalemi olmaya devam ediyor. Isı pompası teknolojisi artık doğal gaz 
    sistemlerinden daha ekonomik. Binalardaki yalıtım kalitesi de enerji tüketimini doğrudan etkiliyor.`,
    choices: [
      {
        icon: '🌡️',
        label: 'Isı Pompası + İyi Yalıtım',
        desc: 'Elektrikli ısı pompası, enerji verimli bina',
        carbonDelta: 200,
        sustainDelta: 18,
        impact: 'low',
        impactLabel: '🟢 Düşük',
        co2Text: '+200 kg CO₂',
        tip: 'Isı pompası en verimli ısıtma sistemidir — elektrik başına 3–4 kat daha fazla ısı üretir. Yenilenebilir enerji ile kombine edildiğinde neredeyse karbon nötr.'
      },
      {
        icon: '🔥',
        label: 'Doğal Gaz Kombisi',
        desc: 'Modern verimli gaz kombi sistemi',
        carbonDelta: 900,
        sustainDelta: 3,
        impact: 'med',
        impactLabel: '🟡 Orta',
        co2Text: '+900 kg CO₂',
        tip: 'Modern gaz kombi verimli olsa da fosil yakıta bağlı kalır. 2050 hedeflerine ulaşmak için gaz sistemlerinin de elektrifikte edilmesi gerekiyor.'
      },
      {
        icon: '🪵',
        label: 'Eski Kalorifer / Kömür',
        desc: 'Eski teknoloji ısıtma sistemi',
        carbonDelta: 2500,
        sustainDelta: -12,
        impact: 'high',
        impactLabel: '🔴 Yüksek',
        co2Text: '+2500 kg CO₂',
        tip: 'Kömür ve eski kalorifer sistemleri, ısıtma sektörünün en büyük karbon kalemini oluşturur. Türkiye\'deki kömür ısıtması hava kalitesi sorununu da artırmaktadır.'
      }
    ]
  }
];

// ================================================================
// 2. STATE
// ================================================================
let currentRound    = 0;
let totalCarbon     = 0;   // kg CO2/year
let sustainScore    = 50;  // 0–100
let gameHistory     = [];
let selectedChoice  = null;
let birthYear       = null;

// ================================================================
// 3. DOM REFS
// ================================================================
const screenStart  = document.getElementById('screen-start');
const screenGame   = document.getElementById('screen-game');
const screenResult = document.getElementById('screen-result');

// ================================================================
// 4. START SCREEN
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Show personalized message when birth year is entered
  const byInput = document.getElementById('birth-year');
  const cityInput = document.getElementById('player-city');
  const msgBox  = document.getElementById('personal-message');
  const msgText = document.getElementById('personal-msg-text');

  function updatePersonalMsg() {
    const by = parseInt(byInput.value);
    if (!by || by < 1950 || by > 2015) { msgBox.style.display = 'none'; return; }

    const ageIn2050 = 2050 - by;
    const city      = cityInput.value.trim() || 'bölgende';
    // Warming estimate based on birth year (younger = see more warming)
    const warming   = by >= 1995 ? '2.5–3°C' : by >= 1970 ? '2–2.5°C' : '1.5–2°C';

    msgText.innerHTML = `Sen <strong>${by}</strong> doğumlusun. 2050 yılında <strong>${ageIn2050} yaşında</strong> olacaksın. 
      Bilim insanları, mevcut eğilimler devam ederse <strong>${city}</strong> bölgesindeki sıcaklığın 
      sanayi öncesine kıyasla <strong>${warming}</strong> artabileceğini öngörüyor. 
      Bugünkü kararların bu geleceği şekillendiriyor.`;
    msgBox.style.display = 'block';
  }

  byInput?.addEventListener('input', updatePersonalMsg);
  cityInput?.addEventListener('input', updatePersonalMsg);

  document.getElementById('start-game-btn')?.addEventListener('click', () => {
    birthYear = parseInt(byInput.value) || null;
    startGame();
  });

  document.getElementById('next-round-btn')?.addEventListener('click', nextRound);
  document.getElementById('restart-game-btn')?.addEventListener('click', restartGame);

  // Perspective survey
  document.getElementById('perspective-yes')?.addEventListener('click', () => {
    savePerspective('yes');
    document.getElementById('perspective-result').style.display = 'block';
    document.getElementById('perspective-result').textContent = '💚 Harika! Farkındalık değişimin ilk adımıdır. Bu simülasyonu arkadaşlarınla da paylaş.';
    document.getElementById('perspective-yes').disabled = true;
    document.getElementById('perspective-no').disabled = true;
  });

  document.getElementById('perspective-no')?.addEventListener('click', () => {
    savePerspective('no');
    document.getElementById('perspective-result').style.display = 'block';
    document.getElementById('perspective-result').textContent = '🤔 Anlıyoruz. İklim değişikliği karmaşık bir konu. Harita sayfasındaki gerçek verilere göz atmayı deneyin.';
    document.getElementById('perspective-yes').disabled = true;
    document.getElementById('perspective-no').disabled = true;
  });
});

// ================================================================
// 5. GAME FLOW
// ================================================================
function startGame() {
  currentRound  = 0;
  totalCarbon   = 0;
  sustainScore  = 50;
  gameHistory   = [];
  selectedChoice = null;

  screenStart.style.display = 'none';
  screenGame.style.display  = 'block';

  buildProgressSteps();
  renderRound();
}

function buildProgressSteps() {
  const container = document.getElementById('progress-steps');
  container.innerHTML = rounds.map((_, i) =>
    `<div class="gps-step" id="ps-${i}"></div>`
  ).join('');
  updateProgressSteps();
}

function updateProgressSteps() {
  rounds.forEach((_, i) => {
    const el = document.getElementById(`ps-${i}`);
    if (!el) return;
    if (i < currentRound)  { el.className = 'gps-step done'; }
    else if (i === currentRound) { el.className = 'gps-step current'; }
    else { el.className = 'gps-step'; }
  });
}

function renderRound() {
  const round = rounds[currentRound];
  selectedChoice = null;

  // Header
  document.getElementById('round-badge').textContent = `Tur ${currentRound + 1} / ${rounds.length}`;
  document.getElementById('round-category').textContent = round.category;

  // Scenario card
  document.getElementById('scenario-icon').textContent  = round.icon;
  document.getElementById('scenario-title').textContent = round.title;
  document.getElementById('scenario-context').textContent = round.context;

  // Hide feedback/next
  document.getElementById('choice-feedback').style.display = 'none';
  document.getElementById('next-round-row').style.display  = 'none';

  // Choices
  const container = document.getElementById('choices-container');
  container.innerHTML = round.choices.map((c, i) => `
    <button class="choice-btn" data-index="${i}" id="choice-${i}">
      <span class="choice-icon">${c.icon}</span>
      <div class="choice-body">
        <strong>${c.label}</strong>
        <span>${c.desc}</span>
      </div>
      <span class="choice-impact-badge ${c.impact}">${c.impactLabel}</span>
    </button>
  `).join('');

  container.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => makeChoice(parseInt(btn.dataset.index)));
  });

  // Animate card
  const card = document.getElementById('scenario-card');
  card.style.animation = 'none';
  requestAnimationFrame(() => {
    card.style.animation = 'scaleIn 0.4s var(--ease-out-expo) forwards';
  });

  updateProgressSteps();
  updateSidebar();
}

function makeChoice(index) {
  if (selectedChoice !== null) return; // prevent double click
  selectedChoice = index;

  const round  = rounds[currentRound];
  const choice = round.choices[index];

  // Update scores
  totalCarbon  += choice.carbonDelta;
  sustainScore  = Math.max(0, Math.min(100, sustainScore + choice.sustainDelta));

  // Visual selection
  document.querySelectorAll('.choice-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === index);
    btn.style.pointerEvents = 'none';
  });

  // Store in history
  gameHistory.push({
    round: currentRound,
    category: round.category,
    icon: round.icon,
    choiceLabel: choice.label,
    choiceIcon: choice.icon,
    carbonDelta: choice.carbonDelta
  });

  // Show feedback
  showChoiceFeedback(choice);
  updateSidebar();
}

function showChoiceFeedback(choice) {
  const fb  = document.getElementById('choice-feedback');
  const co2 = document.getElementById('fb-co2-val');
  const tip = document.getElementById('fb-tip');
  const nxt = document.getElementById('next-round-row');
  const nxtBtn = document.getElementById('next-round-btn');

  // CO2 value styling
  const val = choice.carbonDelta;
  co2.textContent = (val >= 0 ? '+' : '') + val + ' kg CO₂';
  co2.className = 'feedback-co2 ' + (
    val < 0    ? 'negative' :
    val <= 600 ? 'neutral' : 'positive'
  );

  tip.textContent = choice.tip;
  fb.style.display = 'block';

  // Next button label
  if (currentRound < rounds.length - 1) {
    nxtBtn.textContent = 'Sonraki Tur →';
  } else {
    nxtBtn.textContent = 'Sonuçları Gör 🌍';
  }
  nxt.style.display = 'flex';

  // Update history sidebar
  updateHistoryList();
}

function nextRound() {
  currentRound++;
  if (currentRound < rounds.length) {
    renderRound();
  } else {
    showResult();
  }
}

// ================================================================
// 6. SIDEBAR
// ================================================================
function updateSidebar() {
  const tons = (totalCarbon / 1000).toFixed(1);
  document.getElementById('sidebar-co2').textContent = totalCarbon >= 0
    ? '+' + totalCarbon : totalCarbon;

  // Carbon bar (max ~12000 kg = 12 tons)
  const carbonPct = Math.min(Math.max(totalCarbon / 12000 * 100, 0), 100);
  const carbonBar = document.getElementById('sb-bar-carbon');
  carbonBar.style.width = carbonPct + '%';

  // Color of carbon bar
  if (carbonPct < 30) {
    carbonBar.style.background = 'var(--color-primary)';
    document.getElementById('sb-label-carbon').textContent = 'Düşük';
  } else if (carbonPct < 65) {
    carbonBar.style.background = 'var(--color-accent)';
    document.getElementById('sb-label-carbon').textContent = 'Orta';
  } else {
    carbonBar.style.background = '#f87171';
    document.getElementById('sb-label-carbon').textContent = 'Yüksek';
  }

  // Sustainability bar
  const sustain = document.getElementById('sb-bar-sustain');
  sustain.style.width = sustainScore + '%';
  document.getElementById('sb-label-sustain').textContent = sustainScore + '%';
}

function updateHistoryList() {
  const list = document.getElementById('history-list');
  if (!gameHistory.length) return;

  list.innerHTML = gameHistory.map(h => {
    const sign  = h.carbonDelta >= 0 ? '+' : '';
    const color = h.carbonDelta < 0 ? 'var(--color-primary)' :
                  h.carbonDelta < 700 ? 'var(--color-accent)' : '#f87171';
    return `
      <li class="history-item">
        <span class="hi-icon">${h.choiceIcon}</span>
        <span style="flex:1; line-height:1.3;">${h.choiceLabel}</span>
        <span class="hi-co2" style="color:${color};">${sign}${h.carbonDelta} kg</span>
      </li>`;
  }).join('');
}

// ================================================================
// 7. RESULTS
// ================================================================
function showResult() {
  screenGame.style.display   = 'none';
  screenResult.style.display = 'block';

  const tonsPerYear = (totalCarbon / 1000).toFixed(1);
  const sustain     = Math.round(sustainScore);

  // Determine scenario
  let scenario, tempLabel, icon, outcomeTitle, outcomeDesc, outcomeClass, tempClass;

  if (totalCarbon < 4000) {
    scenario    = 'good';
    tempLabel   = '+1.5°C';
    icon        = '🌿';
    outcomeTitle = 'Sürdürülebilir Gelecek';
    outcomeDesc  = `Seçimlerin 2050'de daha yaşanabilir bir dünya için doğru yönü işaret ediyor. +1.5°C eşiğini aşmamak, 
      kritik ekosistemlerin ve kıyı şehirlerinin korunması anlamına geliyor. Bu senaryoda aşırı hava olayları artsa da 
      yönetilebilir kalıyor. Tebrikler!`;
    outcomeClass = 'outcome-visual scenario-good';
    tempClass    = 'good';
  } else if (totalCarbon < 8000) {
    scenario    = 'mid';
    tempLabel   = '+2°C';
    icon        = '⚠️';
    outcomeTitle = 'Riskli Ama Yönetilebilir';
    outcomeDesc  = `Seçimlerin karışık bir tablo ortaya koyuyor. +2°C ısınma, bazı açıdan kritik eşikleri aşıyor: 
      mercan resiflerinin büyük kısmı kayboluyor, yaz buzları eriyor, kuraklık riski artıyor. 
      Ama hâlâ uygarlığı temelinden sarsmayan bir senaryo. Daha fazla adım atılabilir.`;
    outcomeClass = 'outcome-visual scenario-mid';
    tempClass    = 'mid';
  } else {
    scenario    = 'bad';
    tempLabel   = '+3°C';
    icon        = '🔥';
    outcomeTitle = 'Yüksek Emisyon Geleceği';
    outcomeDesc  = `Seçimlerin yüksek salınım patikasına işaret ediyor. +3°C ısınmada kıyı şehirleri su altında kalıyor, 
      milyonlarca insan iklim mültecisi olabiliyor, gıda güvensizliği kritik seviyelere ulaşıyor. 
      Bu senaryo hâlâ önlenebilir — ama acil kolektif eylem gerekiyor.`;
    outcomeClass = 'outcome-visual scenario-bad';
    tempClass    = 'bad';
  }

  // Apply to DOM
  document.getElementById('outcome-visual').className = outcomeClass;
  document.getElementById('outcome-icon').textContent = icon;
  document.getElementById('temp-result').textContent = tempLabel;
  document.getElementById('temp-result').className = `temp-result ${tempClass}`;
  document.getElementById('outcome-title').textContent = outcomeTitle;
  document.getElementById('outcome-desc').textContent  = outcomeDesc;
  document.getElementById('res-co2-num').textContent   = tonsPerYear + 't';
  document.getElementById('res-sustain-num').textContent = sustain + '%';

  // Color res-co2 number
  const co2NumEl = document.getElementById('res-co2-num');
  co2NumEl.style.color = totalCarbon < 4000 ? 'var(--color-primary)' :
                          totalCarbon < 8000 ? 'var(--color-accent)' : '#f87171';

  // Timeline
  buildTimeline();

  // Recommendations
  buildRecommendations(scenario);

  // Save to localStorage
  saveGameResult(scenario, tonsPerYear, sustain);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function buildTimeline() {
  const container = document.getElementById('result-timeline');
  container.innerHTML = gameHistory.map(h => {
    const sign = h.carbonDelta >= 0 ? '+' : '';
    const color = h.carbonDelta < 0 ? 'var(--color-primary)' :
                  h.carbonDelta < 700 ? 'var(--color-accent)' : '#f87171';
    return `
      <div class="timeline-item">
        <div class="tl-dot done">${h.icon}</div>
        <div class="tl-content">
          <strong>${h.category.replace(/^[^ ]+ /, '')}: ${h.choiceLabel}</strong>
          <span style="color:${color};">${sign}${h.carbonDelta} kg CO₂/yıl</span>
        </div>
      </div>`;
  }).join('');
}

function buildRecommendations(scenario) {
  const recs = [];

  // Collect worst choices
  const highImpactRounds = gameHistory.filter(h => h.carbonDelta > 800);

  highImpactRounds.forEach(h => {
    if (h.category.includes('Enerji')) {
      recs.push({ icon: '☀️', text: 'Enerji sağlayıcına geçerek %100 yenilenebilir tarife seçmek yılda ~1.6 ton CO₂ tasarrufu sağlar.' });
    }
    if (h.category.includes('Ulaşım')) {
      recs.push({ icon: '🚌', text: 'Toplu taşımaya geçmek, ulaşım kaynaklı karbon ayak izini %75\'e kadar düşürebilir.' });
    }
    if (h.category.includes('Beslenme')) {
      recs.push({ icon: '🥦', text: 'Haftada iki gün "etsiz" deneyin — yılda ~330 kg CO₂ tasarrufu elde edebilirsiniz.' });
    }
    if (h.category.includes('Tüketim')) {
      recs.push({ icon: '♻️', text: 'İkinci el alışveriş ve kıyafet takası, fast fashion\'a kıyasla %90\'a kadar daha az emisyon üretir.' });
    }
    if (h.category.includes('Konut')) {
      recs.push({ icon: '🌡️', text: 'Isı pompası ve iyi yalıtım yatırımı, uzun vadede hem tasarruf hem karbon azaltımı sağlar.' });
    }
  });

  // Always add civic
  recs.push({ icon: '📢', text: 'İklim politikalarını destekleyen adaylara oy vermek ve STK\'lara katılmak, bireysel etkinin en güçlü çarpanıdır.' });

  if (scenario === 'good') {
    recs.push({ icon: '🌟', text: 'Sürdürülebilir yaşam biçimini çevrene yayabilirsin — bir arkadaşını da bu simülasyona davet et!' });
  }

  const list = document.getElementById('result-recs');
  list.innerHTML = recs.slice(0, 5).map(r => `
    <li style="display:flex; align-items:flex-start; gap:12px; font-size:0.9rem; color:var(--color-text-secondary); line-height:1.6;">
      <span style="width:28px;height:28px;background:rgba(74,222,128,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.85rem;flex-shrink:0;margin-top:1px;">${r.icon}</span>
      <span>${r.text}</span>
    </li>
  `).join('');
}

function saveGameResult(scenario, tons, sustain) {
  try {
    localStorage.setItem('izim_game_result', JSON.stringify({
      scenario, tons, sustain,
      history: gameHistory,
      birthYear,
      date: new Date().toISOString()
    }));
  } catch (e) { /* silently fail */ }
}

function savePerspective(answer) {
  try {
    const existing = JSON.parse(localStorage.getItem('izim_game_result') || '{}');
    existing.perspectiveChanged = answer;
    localStorage.setItem('izim_game_result', JSON.stringify(existing));
  } catch (e) { /* silently fail */ }
}

function restartGame() {
  screenResult.style.display = 'none';
  currentRound  = 0;
  totalCarbon   = 0;
  sustainScore  = 50;
  gameHistory   = [];
  selectedChoice = null;
  screenStart.style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
