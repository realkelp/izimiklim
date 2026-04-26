/**
 * harita.js — Interactive World Climate Map
 * İzim Climate Change Website
 *
 * Uses D3.js + TopoJSON for map rendering
 * Chart.js for temperature, precipitation, CO2 charts
 * Climate data: realistic static values (World Bank, Our World in Data)
 */

// ================================================================
// 1. CLIMATE DATA — ~50 Countries
//    tempTrend: avg annual temp (°C) per decade 1970,1980,1990,2000,2010,2015,2020,2023
//    precip:    avg monthly precipitation mm (Jan–Dec)
//    co2:       CO2 per capita (tons), recent value
//    zone:      climate zone
//    flag:      emoji flag
// ================================================================
const climateDB = {
  // ISO 3166-1 numeric codes as strings
  "792": { // Turkey
    name: "Türkiye", flag: "🇹🇷",
    zone: "Ilıman / Akdeniz",
    co2: 5.9,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[11.8,12.1,12.5,12.9,13.4,13.7,14.0,14.7] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[75,67,62,52,38,20,10,8,22,48,68,82] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[3.1,3.7,4.2,4.9,5.6,5.9] }
  },
  "276": { // Germany
    name: "Almanya", flag: "🇩🇪",
    zone: "Ilıman / Okyanusal",
    co2: 8.1,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[8.2,8.5,8.9,9.3,9.7,10.1,10.5,10.9] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[55,42,48,45,55,68,65,62,48,50,55,58] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[10.5,9.8,9.6,8.9,7.7,8.1] }
  },
  "840": { // USA
    name: "Amerika Birleşik Devletleri", flag: "🇺🇸",
    zone: "Karma (Kıtasal / Tropikal)",
    co2: 14.9,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[12.2,12.4,12.7,13.0,13.4,13.8,14.0,14.4] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[62,58,68,72,78,80,72,70,68,65,62,60] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[20.2,19.4,17.4,16.4,15.5,14.9] }
  },
  "356": { // India
    name: "Hindistan", flag: "🇮🇳",
    zone: "Tropikal / Muson",
    co2: 1.9,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[24.0,24.3,24.6,25.0,25.5,25.9,26.2,26.7] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[12,14,14,18,35,150,250,230,160,50,18,10] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[1.0,1.1,1.4,1.6,1.8,1.9] }
  },
  "156": { // China
    name: "Çin", flag: "🇨🇳",
    zone: "Karma (Kıtasal / Subtropikal)",
    co2: 8.1,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[9.0,9.2,9.5,9.9,10.4,10.8,11.1,11.6] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[12,14,22,38,60,95,130,110,70,38,20,12] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[2.7,4.0,6.1,7.0,7.7,8.1] }
  },
  "076": { // Brazil
    name: "Brezilya", flag: "🇧🇷",
    zone: "Tropikal",
    co2: 2.2,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[24.5,24.7,24.9,25.2,25.6,25.9,26.1,26.4] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[218,190,200,140,95,60,48,55,95,140,180,210] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[2.0,1.9,2.1,2.5,2.3,2.2] }
  },
  "643": { // Russia
    name: "Rusya", flag: "🇷🇺",
    zone: "Kıtasal / Subarktik",
    co2: 11.4,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[-5.8,-5.4,-5.0,-4.5,-4.0,-3.5,-3.2,-2.7] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[28,20,24,30,42,60,68,62,44,38,32,28] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[10.2,10.5,10.9,11.0,11.2,11.4] }
  },
  "036": { // Australia
    name: "Avustralya", flag: "🇦🇺",
    zone: "Kurak / Subtropikal",
    co2: 15.1,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[21.5,21.7,22.0,22.3,22.7,23.1,23.4,23.8] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[40,35,28,22,20,18,18,20,24,30,35,38] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[17.0,17.2,16.8,16.5,15.8,15.1] }
  },
  "392": { // Japan
    name: "Japonya", flag: "🇯🇵",
    zone: "Ilıman / Okyanusal",
    co2: 8.5,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[13.2,13.5,13.9,14.3,14.7,15.1,15.4,15.8] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[48,60,110,130,148,168,155,145,205,165,90,52] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[9.6,9.6,9.1,9.5,8.7,8.5] }
  },
  "826": { // UK
    name: "Birleşik Krallık", flag: "🇬🇧",
    zone: "Ilıman / Okyanusal",
    co2: 5.1,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[9.0,9.2,9.6,10.0,10.3,10.7,10.9,11.2] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[88,62,52,42,48,52,58,65,60,72,80,88] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[9.1,8.7,7.8,6.4,5.5,5.1] }
  },
  "250": { // France
    name: "Fransa", flag: "🇫🇷",
    zone: "Ilıman / Okyanusal",
    co2: 4.6,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[11.2,11.5,11.9,12.3,12.7,13.1,13.4,13.8] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[62,52,52,48,52,50,42,45,52,60,62,68] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[6.4,6.2,5.6,4.9,4.5,4.6] }
  },
  "380": { // Italy
    name: "İtalya", flag: "🇮🇹",
    zone: "Akdeniz",
    co2: 5.5,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[13.0,13.3,13.7,14.2,14.6,15.0,15.4,15.8] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[55,50,45,48,50,28,18,22,38,68,72,62] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[8.0,8.1,6.8,5.5,5.3,5.5] }
  },
  "724": { // Spain
    name: "İspanya", flag: "🇪🇸",
    zone: "Akdeniz / Yarı Kurak",
    co2: 5.2,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[13.8,14.1,14.5,14.9,15.3,15.8,16.2,16.7] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[38,32,28,35,32,15,8,10,22,42,48,40] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[7.5,8.0,6.2,5.4,5.0,5.2] }
  },
  "124": { // Canada
    name: "Kanada", flag: "🇨🇦",
    zone: "Kıtasal / Subarktik",
    co2: 15.3,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[-3.5,-3.2,-2.8,-2.4,-1.9,-1.5,-1.0,-0.4] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[30,25,30,35,50,70,68,60,55,45,38,32] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[17.1,17.3,15.6,15.0,14.8,15.3] }
  },
  "410": { // South Korea
    name: "Güney Kore", flag: "🇰🇷",
    zone: "Ilıman / Karasal",
    co2: 11.6,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[11.0,11.4,11.9,12.5,13.0,13.4,13.8,14.2] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[22,32,48,78,92,130,280,260,130,38,52,18] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[9.0,9.8,11.3,11.6,11.8,11.6] }
  },
  "710": { // South Africa
    name: "Güney Afrika", flag: "🇿🇦",
    zone: "Yarı Kurak / Akdeniz",
    co2: 6.8,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[17.0,17.2,17.5,17.8,18.2,18.5,18.8,19.2] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[88,72,60,42,20,10,8,8,12,32,58,80] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[7.5,8.0,8.2,7.9,7.2,6.8] }
  },
  "818": { // Egypt
    name: "Mısır", flag: "🇪🇬",
    zone: "Kurak / Çöl",
    co2: 2.3,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[21.8,22.1,22.5,22.9,23.4,23.8,24.2,24.8] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[5,3,2,1,0,0,0,0,0,1,2,4] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[1.8,2.0,2.2,2.3,2.4,2.3] }
  },
  "566": { // Nigeria
    name: "Nijerya", flag: "🇳🇬",
    zone: "Tropikal / Savana",
    co2: 0.6,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[26.5,26.7,27.0,27.3,27.7,28.0,28.3,28.7] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[8,14,40,100,148,160,108,90,180,148,28,10] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[0.7,0.6,0.7,0.7,0.6,0.6] }
  },
  "484": { // Mexico
    name: "Meksika", flag: "🇲🇽",
    zone: "Subtropikal / Karma",
    co2: 3.7,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[21.2,21.5,21.8,22.2,22.6,23.0,23.4,23.8] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[12,8,10,18,32,120,148,128,115,55,18,12] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[3.5,3.7,3.9,3.8,3.9,3.7] }
  },
  "682": { // Saudi Arabia
    name: "Suudi Arabistan", flag: "🇸🇦",
    zone: "Kurak / Çöl",
    co2: 18.3,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[25.0,25.5,26.0,26.5,27.2,27.8,28.3,28.9] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[8,6,5,3,1,0,0,0,0,1,3,6] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[12.5,14.0,16.0,17.1,18.0,18.3] }
  },
  "360": { // Indonesia
    name: "Endonezya", flag: "🇮🇩",
    zone: "Tropikal",
    co2: 2.3,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[25.8,25.9,26.0,26.2,26.4,26.6,26.8,27.1] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[290,260,260,220,170,105,82,88,120,170,220,270] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[1.3,1.5,1.8,2.0,2.2,2.3] }
  },
  "528": { // Netherlands
    name: "Hollanda", flag: "🇳🇱",
    zone: "Ilıman / Okyanusal",
    co2: 9.2,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[9.5,9.8,10.2,10.7,11.0,11.4,11.8,12.2] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[70,48,50,42,48,62,70,68,62,68,72,72] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[11.5,11.3,10.5,9.8,9.0,9.2] }
  },
  "752": { // Sweden
    name: "İsveç", flag: "🇸🇪",
    zone: "Kıtasal / Subarktik",
    co2: 3.5,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[3.5,3.8,4.2,4.7,5.2,5.6,6.0,6.5] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[38,28,28,32,38,50,62,62,55,48,48,44] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[5.5,5.3,5.2,4.3,3.8,3.5] }
  },
  "578": { // Norway
    name: "Norveç", flag: "🇳🇴",
    zone: "Subarktik / Okyanusal",
    co2: 6.9,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[1.5,1.8,2.2,2.8,3.3,3.8,4.2,4.8] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[62,48,45,40,45,68,80,80,90,90,80,72] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[8.0,8.2,7.5,7.8,7.0,6.9] }
  },
  "076": { // Brazil already added above
  },
  "032": { // Argentina
    name: "Arjantin", flag: "🇦🇷",
    zone: "Subtropikal / Ilıman",
    co2: 4.2,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[17.0,17.2,17.4,17.7,18.0,18.3,18.5,18.9] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[100,90,90,70,50,30,25,30,50,75,90,95] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[3.8,3.9,4.2,4.5,4.4,4.2] }
  },
  "764": { // Thailand
    name: "Tayland", flag: "🇹🇭",
    zone: "Tropikal / Muson",
    co2: 3.8,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[26.8,27.0,27.2,27.5,27.8,28.1,28.4,28.8] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[8,22,30,60,140,150,155,170,250,200,60,10] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[2.9,3.2,3.5,3.7,3.8,3.8] }
  },
  "586": { // Pakistan
    name: "Pakistan", flag: "🇵🇰",
    zone: "Yarı Kurak / Muson",
    co2: 0.9,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[20.5,20.8,21.2,21.7,22.2,22.7,23.1,23.6] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[22,25,30,18,12,8,50,60,14,4,6,12] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[0.7,0.8,0.9,0.9,0.9,0.9] }
  },
  "050": { // Bangladesh
    name: "Bangladeş", flag: "🇧🇩",
    zone: "Tropikal / Muson",
    co2: 0.5,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[25.8,26.0,26.3,26.6,27.0,27.3,27.6,28.0] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[8,18,32,80,210,290,330,290,220,100,18,5] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[0.3,0.3,0.4,0.5,0.5,0.5] }
  },
  "818": { // Egypt already added
  },
  "504": { // Morocco
    name: "Fas", flag: "🇲🇦",
    zone: "Akdeniz / Yarı Kurak",
    co2: 1.7,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[18.5,18.8,19.2,19.6,20.0,20.4,20.8,21.3] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[52,48,40,32,18,5,1,2,12,32,48,52] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[1.2,1.3,1.5,1.6,1.7,1.7] }
  },
  "012": { // Algeria
    name: "Cezayir", flag: "🇩🇿",
    zone: "Kurak / Akdeniz",
    co2: 3.9,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[20.0,20.3,20.7,21.1,21.5,22.0,22.4,22.9] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[30,22,18,15,10,3,1,1,8,18,25,28] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[3.0,3.2,3.5,3.7,3.9,3.9] }
  },
  "600": { // Paraguay - simplified approach, use Poland instead
  },
  "616": { // Poland
    name: "Polonya", flag: "🇵🇱",
    zone: "Ilıman / Kıtasal",
    co2: 8.6,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[7.5,7.8,8.2,8.7,9.2,9.7,10.1,10.6] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[30,25,28,32,48,60,68,62,45,38,35,32] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[9.5,9.2,9.3,9.0,8.8,8.6] }
  },
  "040": { // Austria
    name: "Avusturya", flag: "🇦🇹",
    zone: "Ilıman / Kıtasal",
    co2: 7.0,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[7.0,7.4,7.8,8.3,8.8,9.2,9.7,10.2] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[42,40,48,52,65,80,88,82,60,55,50,45] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[8.5,8.4,7.8,7.1,6.8,7.0] }
  },
  "056": { // Belgium
    name: "Belçika", flag: "🇧🇪",
    zone: "Ilıman / Okyanusal",
    co2: 8.2,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[9.8,10.1,10.5,10.9,11.3,11.7,12.1,12.5] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[62,50,52,45,52,62,70,68,62,68,72,72] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[11.5,11.2,9.9,8.8,8.0,8.2] }
  },
  "752": { // Sweden already added
  },
  "246": { // Finland
    name: "Finlandiya", flag: "🇫🇮",
    zone: "Subarktik / Kıtasal",
    co2: 6.3,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[2.5,2.9,3.4,4.0,4.5,5.0,5.5,6.1] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[40,28,28,28,38,50,62,72,55,50,50,42] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[10.0,10.5,9.5,8.4,7.0,6.3] }
  },
  "703": { // Slovakia
    name: "Slovakya", flag: "🇸🇰",
    zone: "Ilıman / Kıtasal",
    co2: 5.8,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[8.5,8.8,9.2,9.7,10.2,10.6,11.0,11.5] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[35,30,32,38,55,70,72,62,45,40,40,38] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[7.5,7.2,6.5,6.0,5.8,5.8] }
  },
  "620": { // Portugal
    name: "Portekiz", flag: "🇵🇹",
    zone: "Akdeniz",
    co2: 4.0,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[15.2,15.5,15.9,16.4,16.8,17.3,17.7,18.2] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[115,85,68,48,35,12,4,4,20,58,90,110] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[6.8,7.0,5.5,4.5,4.2,4.0] }
  },
  "076": { // duplicate, skip
  },
  "710": { // South Africa already added
  },
  "144": { // Sri Lanka
    name: "Sri Lanka", flag: "🇱🇰",
    zone: "Tropikal",
    co2: 1.0,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[26.8,27.0,27.2,27.4,27.7,28.0,28.2,28.5] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[90,70,120,250,290,150,120,110,160,280,210,130] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[0.5,0.6,0.7,0.8,0.9,1.0] }
  },
  "404": { // Kenya
    name: "Kenya", flag: "🇰🇪",
    zone: "Tropikal / Savana",
    co2: 0.4,
    tempTrend: { years:[1970,1980,1990,2000,2010,2015,2020,2023], vals:[20.5,20.8,21.1,21.4,21.8,22.2,22.5,22.9] },
    precip: { months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"], vals:[30,22,45,130,120,30,15,18,25,60,90,40] },
    co2History: { years:[2000,2005,2010,2015,2019,2022], vals:[0.3,0.3,0.4,0.4,0.4,0.4] }
  },
  // Additional countries
  "300": { name:"Yunanistan",flag:"🇬🇷",zone:"Akdeniz",co2:6.8,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[14.0,14.3,14.7,15.1,15.5,15.9,16.3,16.7]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[55,48,42,30,18,5,2,3,15,40,62,65]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[8.5,8.8,7.0,6.5,6.5,6.8]}},
  "756": { name:"İsviçre",flag:"🇨🇭",zone:"Ilıman / Dağlık",co2:4.1,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[4.5,4.9,5.3,5.8,6.3,6.7,7.1,7.5]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[55,50,55,60,72,90,90,85,68,62,60,58]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[5.5,5.3,5.0,4.5,4.2,4.1]}},
  "208": { name:"Danimarka",flag:"🇩🇰",zone:"Ilıman / Okyanusal",co2:5.1,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[7.8,8.1,8.5,8.9,9.3,9.7,10.1,10.5]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[50,40,38,38,40,52,62,65,58,60,60,55]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[8.5,8.4,8.0,6.8,5.5,5.1]}},
  "203": { name:"Çekya",flag:"🇨🇿",zone:"Ilıman / Kıtasal",co2:9.0,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[8.0,8.3,8.8,9.2,9.7,10.1,10.5,10.9]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[25,22,25,38,55,65,68,60,38,32,30,28]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[11.5,11.0,10.5,9.5,9.0,9.0]}},
  "348": { name:"Macaristan",flag:"🇭🇺",zone:"Ilıman / Kıtasal",co2:5.8,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[9.5,9.8,10.2,10.7,11.2,11.6,12.0,12.4]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[35,30,32,40,55,60,50,45,38,40,40,35]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[7.5,6.8,5.9,5.5,5.6,5.8]}},
  "642": { name:"Romanya",flag:"🇷🇴",zone:"Ilıman / Kıtasal",co2:4.0,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[8.5,8.8,9.2,9.7,10.1,10.5,10.9,11.3]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[32,28,30,40,55,68,55,45,38,35,38,32]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[5.5,4.2,3.8,3.5,3.8,4.0]}},
  "804": { name:"Ukrayna",flag:"🇺🇦",zone:"Kıtasal / Ilıman",co2:5.0,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[7.0,7.3,7.8,8.2,8.8,9.2,9.6,10.0]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[35,30,30,38,50,60,60,50,40,35,38,35]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[6.5,7.0,5.5,5.5,5.0,5.0]}},
  "364": { name:"İran",flag:"🇮🇷",zone:"Kurak / Yarı Kurak",co2:8.0,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[17.0,17.4,17.8,18.3,18.8,19.2,19.7,20.2]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[22,18,18,12,10,2,1,1,2,8,15,20]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[5.0,6.0,7.5,8.0,7.5,8.0]}},
  "376": { name:"İsrail",flag:"🇮🇱",zone:"Akdeniz / Yarı Kurak",co2:7.2,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[18.5,18.9,19.3,19.8,20.2,20.7,21.1,21.6]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[80,55,35,10,2,0,0,0,1,15,42,75]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[9.5,9.8,9.0,8.5,8.0,7.2]}},
  "784": { name:"Birleşik Arap Emirlikleri",flag:"🇦🇪",zone:"Kurak / Çöl",co2:22.0,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[26.5,27.0,27.5,28.0,28.6,29.1,29.6,30.2]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[12,10,8,3,1,0,0,0,0,0,3,8]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[30,28,22,23,22,22]}},
  "634": { name:"Katar",flag:"🇶🇦",zone:"Kurak / Çöl",co2:35.6,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[26.8,27.2,27.6,28.1,28.7,29.2,29.8,30.4]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[10,8,5,2,0,0,0,0,0,0,2,8]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[40,42,45,38,36,35.6]}},
  "608": { name:"Filipinler",flag:"🇵🇭",zone:"Tropikal / Muson",co2:1.5,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[26.5,26.7,26.9,27.1,27.3,27.5,27.8,28.1]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[20,15,20,38,130,215,245,230,195,180,115,55]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[0.9,1.0,1.1,1.3,1.4,1.5]}},
  "704": { name:"Vietnam",flag:"🇻🇳",zone:"Tropikal / Muson",co2:3.5,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[23.5,23.7,24.0,24.3,24.7,25.0,25.3,25.7]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[18,25,32,50,110,165,195,200,330,290,120,40]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[0.9,1.2,1.8,2.5,3.0,3.5]}},
  "170": { name:"Kolombiya",flag:"🇨🇴",zone:"Tropikal / Dağlık",co2:1.9,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[21.0,21.2,21.4,21.7,22.0,22.3,22.5,22.9]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[80,80,110,170,175,80,55,75,150,180,145,90]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[1.5,1.6,1.8,1.9,1.9,1.9]}},
  "604": { name:"Peru",flag:"🇵🇪",zone:"Tropikal / Dağlık",co2:1.6,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[18.5,18.7,19.0,19.3,19.6,20.0,20.3,20.7]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[9,10,9,5,3,2,2,2,3,5,5,8]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[1.1,1.2,1.4,1.5,1.5,1.6]}},
  "152": { name:"Şili",flag:"🇨🇱",zone:"Akdeniz / Kurak",co2:4.7,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[12.5,12.7,13.0,13.3,13.6,14.0,14.3,14.7]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[2,2,5,18,52,85,90,68,28,10,4,2]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[3.5,3.9,4.2,4.5,4.7,4.7]}},
  "554": { name:"Yeni Zelanda",flag:"🇳🇿",zone:"Ilıman / Okyanusal",co2:6.7,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[12.0,12.2,12.5,12.8,13.1,13.4,13.7,14.0]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[65,55,72,90,100,110,120,108,90,78,70,65]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[7.5,7.8,7.5,7.5,7.0,6.7]}},
  "398": { name:"Kazakistan",flag:"🇰🇿",zone:"Kurak / Kıtasal",co2:16.8,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[4.5,4.8,5.2,5.6,6.1,6.5,7.0,7.5]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[20,18,18,22,28,22,15,12,14,20,22,22]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[9.0,13.0,16.0,17.0,17.5,16.8]}},
  "231": { name:"Etiyopya",flag:"🇪🇹",zone:"Tropikal / Savana",co2:0.2,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[17.5,17.8,18.1,18.5,18.9,19.3,19.7,20.1]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[15,25,55,80,55,55,140,155,55,10,8,10]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[0.1,0.1,0.1,0.2,0.2,0.2]}},
  "288": { name:"Gana",flag:"🇬🇭",zone:"Tropikal / Savana",co2:0.6,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[26.0,26.2,26.5,26.8,27.2,27.5,27.8,28.2]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[14,30,65,95,128,140,50,25,60,100,42,15]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[0.3,0.4,0.5,0.5,0.6,0.6]}},
  "834": { name:"Tanzanya",flag:"🇹🇿",zone:"Tropikal / Savana",co2:0.2,tempTrend:{years:[1970,1980,1990,2000,2010,2015,2020,2023],vals:[21.5,21.8,22.1,22.4,22.8,23.1,23.4,23.8]},precip:{months:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],vals:[80,60,120,175,60,20,15,18,28,55,100,110]},co2History:{years:[2000,2005,2010,2015,2019,2022],vals:[0.1,0.1,0.2,0.2,0.2,0.2]}}
};

// Remove empty entries
Object.keys(climateDB).forEach(k => {
  if (!climateDB[k] || !climateDB[k].name) delete climateDB[k];
});

// ISO numeric → ISO 2-letter lookup (for flagcdn.com)
const iso2Map = {
  "792":"tr","276":"de","840":"us","356":"in","156":"cn","076":"br","643":"ru",
  "036":"au","392":"jp","826":"gb","250":"fr","380":"it","724":"es","124":"ca",
  "410":"kr","710":"za","818":"eg","566":"ng","484":"mx","682":"sa","360":"id",
  "528":"nl","752":"se","578":"no","032":"ar","764":"th","586":"pk","050":"bd",
  "504":"ma","012":"dz","616":"pl","040":"at","056":"be","246":"fi","620":"pt",
  "144":"lk","404":"ke","703":"sk","300":"gr","756":"ch","208":"dk","203":"cz",
  "348":"hu","642":"ro","804":"ua","364":"ir","376":"il","784":"ae","634":"qa",
  "608":"ph","704":"vn","170":"co","604":"pe","152":"cl","554":"nz","398":"kz",
  "231":"et","288":"gh","834":"tz"
};

function getFlagImg(numericId, size) {
  const code = iso2Map[String(numericId).padStart(3,'0')];
  if (!code) return '';
  return `<img src="https://flagcdn.com/${size}/${code}.png" alt="${code.toUpperCase()}" style="border-radius:2px;flex-shrink:0;">` ;
}

// ================================================================
// 2. D3 World Map
// ================================================================
let selectedCountryId = null;
let chartTemp = null;
let chartPrecip = null;
let chartCO2 = null;

// Chart default config
Chart.defaults.color = '#86a893';
Chart.defaults.borderColor = 'rgba(74, 222, 128, 0.08)';
Chart.defaults.font.family = "'DM Sans', sans-serif";

async function initMap() {
  const container = document.getElementById('world-map');
  if (!container) return;

  const width  = container.clientWidth || 800;
  const height = container.clientHeight || 500;

  const svg = d3.select('#world-map')
    .attr('width', width)
    .attr('height', height);

  // Map group (for zoom/pan)
  const g = svg.append('g').attr('class', 'map-group');

  // Projection
  const projection = d3.geoNaturalEarth1()
    .scale(width / 6.5)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);

  // Zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([0.6, 8])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  svg.call(zoom);

  // Color scale: green → amber → red based on CO2
  function getCountryColor(numericId) {
    const data = climateDB[String(numericId).padStart(3, '0')];
    if (!data || !data.co2) return '#1a3528';
    const co2 = data.co2;
    if (co2 <= 3)  return '#22c55e';   // Low: green
    if (co2 <= 6)  return '#84cc16';   // Low-mid: lime
    if (co2 <= 10) return '#f59e0b';   // Mid: amber
    if (co2 <= 14) return '#f97316';   // High: orange
    return '#ef4444';                   // Very high: red
  }

  // Load world topology
  try {
    const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    const countries = topojson.feature(world, world.objects.countries);

    // Draw countries
    g.selectAll('.country-path')
      .data(countries.features)
      .join('path')
      .attr('class', 'country-path')
      .attr('d', path)
      .attr('id', d => 'country-' + d.id)
      .attr('fill', d => getCountryColor(d.id))
      .on('mouseover', handleMouseOver)
      .on('mousemove', handleMouseMove)
      .on('mouseout', handleMouseOut)
      .on('click', handleCountryClick);

    // Draw graticule (grid lines)
    const graticule = d3.geoGraticule();
    g.append('path')
      .datum(graticule())
      .attr('class', 'graticule')
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(74, 222, 128, 0.04)')
      .attr('stroke-width', 0.5);

    // Map controls
    document.getElementById('zoom-in-btn')?.addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1.5);
    });
    document.getElementById('zoom-out-btn')?.addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.scaleBy, 0.67);
    });
    document.getElementById('reset-btn')?.addEventListener('click', () => {
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    });

    // Handle resize
    window.addEventListener('resize', () => {
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      svg.attr('width', newW).attr('height', newH);
      projection.scale(newW / 6.5).translate([newW / 2, newH / 2]);
      g.selectAll('.country-path').attr('d', path);
      g.select('.graticule').attr('d', path(graticule()));
    });

  } catch (err) {
    console.error('Harita yüklenirken hata:', err);
    // Fallback message
    document.getElementById('world-map').innerHTML = `
      <text x="50%" y="50%" text-anchor="middle" fill="#86a893" font-size="14">
        Harita yüklenemedi. İnternet bağlantınızı kontrol edin.
      </text>`;
  }
}

// ================================================================
// 3. Map Interaction Handlers
// ================================================================
const tooltip = document.getElementById('map-tooltip');

function getNumericId(d) {
  return String(d.id).padStart(3, '0');
}

function handleMouseOver(event, d) {
  const id   = getNumericId(d);
  const data = climateDB[id];
  const flagImg = getFlagImg(d.id, '20x15');
  const name = data ? `${flagImg} ${data.name}` : `Ülke #${d.id}`;
  const co2  = data ? `${data.co2} ton CO₂/kişi` : 'Veri yok';
  tooltip.innerHTML = `<div style="display:flex;align-items:center;gap:6px;"><strong>${name}</strong></div><div style="color:var(--color-primary);margin-top:2px;">${co2}</div>`;
  tooltip.style.display = 'block';
  d3.select(event.currentTarget).attr('opacity', 0.8);
}

function handleMouseMove(event) {
  const rect = document.getElementById('world-map').getBoundingClientRect();
  tooltip.style.left = (event.clientX - rect.left + 14) + 'px';
  tooltip.style.top  = (event.clientY - rect.top  - 40) + 'px';
}

function handleMouseOut(event) {
  tooltip.style.display = 'none';
  d3.select(event.currentTarget).attr('opacity', 1);
}

function handleCountryClick(event, d) {
  const id   = getNumericId(d);
  const data = climateDB[id];

  // Clear previous selection
  d3.selectAll('.country-path').classed('selected', false);
  d3.select(event.currentTarget).classed('selected', true);

  if (data && data.name) {
    document.getElementById('map-prompt').style.display = 'none';
    selectedCountryId = id;
    renderPanel(id, data);
  } else {
    // No data for this country
    document.getElementById('panel-empty').style.display = 'flex';
    document.getElementById('panel-content').style.display = 'none';
    document.getElementById('panel-empty').innerHTML = `
      <span class="empty-icon">📊</span>
      <h3 style="font-size:1rem;">Veri Bulunamadı</h3>
      <p>Bu ülke için iklim verisi mevcut değil. 50 büyük ülke desteklenmektedir.</p>`;
  }
}

// ================================================================
// 4. Side Panel Rendering
// ================================================================
function renderPanel(id, data) {
  document.getElementById('panel-empty').style.display   = 'none';
  document.getElementById('panel-content').style.display = 'block';

  const co2Color = data.co2 <= 4 ? 'var(--color-primary)' :
                   data.co2 <= 9 ? 'var(--color-accent)' : '#f87171';

  document.getElementById('panel-content').innerHTML = `
    <div class="panel-country-header">
      <div class="panel-country-name">
        <span class="flag">${data.flag}</span>
        <h2>${data.name}</h2>
      </div>
      <div class="panel-country-badges">
        <span class="badge badge-green">🌍 ${data.zone}</span>
        <span class="badge" style="background:rgba(245,158,11,0.1);color:var(--color-accent);border:1px solid rgba(245,158,11,0.25);">
          🌡️ ${data.tempTrend.vals[data.tempTrend.vals.length-1].toFixed(1)}°C
        </span>
      </div>
    </div>

    <!-- Chart 1: Temperature Trend -->
    <div class="panel-chart-section">
      <div class="chart-section-title">
        <div class="icon" style="background:rgba(245,158,11,0.1);">🌡️</div>
        <div>
          <h4>Yıllık Ortalama Sıcaklık Trendi</h4>
          <p>1970–2023 (°C)</p>
        </div>
      </div>
      <div class="chart-canvas-wrap">
        <canvas id="chart-temp"></canvas>
      </div>
      <div class="chart-stat-row">
        <div class="chart-stat">
          <div class="val" style="color:var(--color-accent);">${data.tempTrend.vals[0].toFixed(1)}°C</div>
          <div class="lbl">1970 Ort.</div>
        </div>
        <div class="chart-stat">
          <div class="val" style="color:#f87171;">${data.tempTrend.vals[data.tempTrend.vals.length-1].toFixed(1)}°C</div>
          <div class="lbl">2023 Ort.</div>
        </div>
        <div class="chart-stat">
          <div class="val" style="color:var(--color-primary);">+${(data.tempTrend.vals[data.tempTrend.vals.length-1] - data.tempTrend.vals[0]).toFixed(1)}°C</div>
          <div class="lbl">Artış</div>
        </div>
      </div>
    </div>

    <!-- Chart 2: Monthly Precipitation -->
    <div class="panel-chart-section">
      <div class="chart-section-title">
        <div class="icon" style="background:rgba(56,189,248,0.1);">🌧️</div>
        <div>
          <h4>Aylık Yağış Ortalaması</h4>
          <p>mm / ay</p>
        </div>
      </div>
      <div class="chart-canvas-wrap">
        <canvas id="chart-precip"></canvas>
      </div>
      <div class="chart-stat-row">
        <div class="chart-stat">
          <div class="val" style="color:#38bdf8;">${Math.max(...data.precip.vals)} mm</div>
          <div class="lbl">En Yağışlı Ay</div>
        </div>
        <div class="chart-stat">
          <div class="val" style="color:#38bdf8;">${Math.round(data.precip.vals.reduce((a,b)=>a+b,0)/12)} mm</div>
          <div class="lbl">Aylık Ort.</div>
        </div>
        <div class="chart-stat">
          <div class="val" style="color:#38bdf8;">${Math.round(data.precip.vals.reduce((a,b)=>a+b,0))} mm</div>
          <div class="lbl">Yıllık Top.</div>
        </div>
      </div>
    </div>

    <!-- Chart 3: CO2 per capita history -->
    <div class="panel-chart-section">
      <div class="chart-section-title">
        <div class="icon" style="background:rgba(74,222,128,0.1);">🏭</div>
        <div>
          <h4>Kişi Başı CO₂ Salınımı</h4>
          <p>ton / yıl — 2000–2022</p>
        </div>
      </div>
      <div class="chart-canvas-wrap">
        <canvas id="chart-co2"></canvas>
      </div>
      <div class="chart-stat-row">
        <div class="chart-stat">
          <div class="val" style="color:${co2Color};">${data.co2}t</div>
          <div class="lbl">Güncel (2022)</div>
        </div>
        <div class="chart-stat">
          <div class="val" style="color:#86a893;">4.7t</div>
          <div class="lbl">Dünya Ort.</div>
        </div>
        <div class="chart-stat">
          <div class="val" style="color:${co2Color};">${data.co2 <= 4.7 ? '🟢 Altında' : data.co2 <= 9 ? '🟡 Üzerinde' : '🔴 Çok Yüksek'}</div>
          <div class="lbl">Kıyaslama</div>
        </div>
      </div>
    </div>
  `;

  // Destroy previous charts
  [chartTemp, chartPrecip, chartCO2].forEach(c => c && c.destroy());

  // Draw charts
  chartTemp   = drawTempChart(data);
  chartPrecip = drawPrecipChart(data);
  chartCO2    = drawCO2Chart(data);
}

// ================================================================
// 5. Chart Drawing
// ================================================================
function drawTempChart(data) {
  const ctx = document.getElementById('chart-temp')?.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createLinearGradient(0, 0, 0, 160);
  gradient.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
  gradient.addColorStop(1, 'rgba(245, 158, 11, 0.02)');

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.tempTrend.years,
      datasets: [{
        label: 'Ort. Sıcaklık (°C)',
        data: data.tempTrend.vals,
        borderColor: '#f59e0b',
        backgroundColor: gradient,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#0b1a14',
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(18, 37, 24, 0.95)',
          borderColor: 'rgba(74, 222, 128, 0.2)',
          borderWidth: 1,
          titleColor: '#e8f5e9',
          bodyColor: '#86a893',
          callbacks: {
            label: ctx => `${ctx.parsed.y.toFixed(1)}°C`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(74, 222, 128, 0.06)' },
          ticks: { font: { size: 10 } }
        },
        y: {
          grid: { color: 'rgba(74, 222, 128, 0.06)' },
          ticks: {
            font: { size: 10 },
            callback: v => v.toFixed(0) + '°C'
          }
        }
      }
    }
  });
}

function drawPrecipChart(data) {
  const ctx = document.getElementById('chart-precip')?.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createLinearGradient(0, 0, 0, 160);
  gradient.addColorStop(0, 'rgba(56, 189, 248, 0.7)');
  gradient.addColorStop(1, 'rgba(56, 189, 248, 0.2)');

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.precip.months,
      datasets: [{
        label: 'Yağış (mm)',
        data: data.precip.vals,
        backgroundColor: gradient,
        borderColor: '#38bdf8',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(18, 37, 24, 0.95)',
          borderColor: 'rgba(74, 222, 128, 0.2)',
          borderWidth: 1,
          titleColor: '#e8f5e9',
          bodyColor: '#86a893',
          callbacks: {
            label: ctx => `${ctx.parsed.y} mm`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 10 } }
        },
        y: {
          grid: { color: 'rgba(74, 222, 128, 0.06)' },
          ticks: {
            font: { size: 10 },
            callback: v => v + 'mm'
          }
        }
      }
    }
  });
}

function drawCO2Chart(data) {
  const ctx = document.getElementById('chart-co2')?.getContext('2d');
  if (!ctx) return null;

  // Color gradient based on value
  const gradient = ctx.createLinearGradient(0, 0, 0, 160);
  gradient.addColorStop(0, 'rgba(74, 222, 128, 0.4)');
  gradient.addColorStop(1, 'rgba(74, 222, 128, 0.05)');

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.co2History.years,
      datasets: [
        {
          label: `${data.name} CO₂/kişi`,
          data: data.co2History.vals,
          borderColor: '#4ade80',
          backgroundColor: gradient,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#4ade80',
          pointBorderColor: '#0b1a14',
          pointBorderWidth: 2,
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Dünya Ortalaması',
          data: data.co2History.years.map(() => 4.7),
          borderColor: 'rgba(134, 168, 147, 0.5)',
          borderDash: [6, 3],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { font: { size: 10 }, usePointStyle: true, pointStyleWidth: 10 }
        },
        tooltip: {
          backgroundColor: 'rgba(18, 37, 24, 0.95)',
          borderColor: 'rgba(74, 222, 128, 0.2)',
          borderWidth: 1,
          titleColor: '#e8f5e9',
          bodyColor: '#86a893',
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)} ton`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(74, 222, 128, 0.06)' },
          ticks: { font: { size: 10 } }
        },
        y: {
          grid: { color: 'rgba(74, 222, 128, 0.06)' },
          ticks: {
            font: { size: 10 },
            callback: v => v + 't'
          }
        }
      }
    }
  });
}

// ================================================================
// 6. Country Search
// ================================================================
const searchInput    = document.getElementById('country-search-input');
const searchDropdown = document.getElementById('search-dropdown');

// Build search list from climateDB
const countryList = Object.entries(climateDB)
  .filter(([, d]) => d && d.name)
  .map(([id, d]) => ({ id, name: d.name }))
  .sort((a, b) => a.name.localeCompare(b.name, 'tr'));

searchInput?.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase().trim();
  if (!q) { searchDropdown.classList.remove('open'); return; }

  const matches = countryList.filter(c => c.name.toLowerCase().includes(q));
  if (!matches.length) { searchDropdown.classList.remove('open'); return; }

  searchDropdown.innerHTML = matches.slice(0, 10).map(c => {
    const code = iso2Map[c.id];
    const flagHtml = code
      ? `<img src="https://flagcdn.com/20x15/${code}.png" alt="${code.toUpperCase()}" style="width:20px;height:15px;border-radius:2px;flex-shrink:0;">`
      : '';
    return `<div class="search-dropdown-item" data-id="${c.id}" style="display:flex;align-items:center;gap:10px;">${flagHtml}<span>${c.name}</span></div>`;
  }).join('');
  searchDropdown.classList.add('open');

  searchDropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      const data = climateDB[id];
      if (data) {
        searchInput.value = '';
        searchDropdown.classList.remove('open');
        // Highlight on map
        d3.selectAll('.country-path').classed('selected', false);
        // Find numeric id to match D3 feature
        const numericId = parseInt(id, 10);
        d3.selectAll('.country-path').filter(d => d.id === numericId).classed('selected', true);
        document.getElementById('map-prompt').style.display = 'none';
        renderPanel(id, data);
      }
    });
  });
});

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.country-search')) {
    searchDropdown.classList.remove('open');
  }
});

// ================================================================
// 7. Init
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  initMap();
});
